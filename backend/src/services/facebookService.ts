import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface FacebookPost {
  id: string;
  message?: string;
  created_time: string;
  permalink_url?: string;
  attachments?: {
    data: Array<{
      media_type?: string;
      media?: {
        image?: {
          src: string;
        };
      };
      subattachments?: {
        data: Array<{
          media_type?: string;
          media?: {
            image?: {
              src: string;
            };
          };
        }>;
      };
    }>;
  };
  comments?: {
    data: Array<{
      id: string;
      message: string;
      created_time: string;
      from?: {
        name: string;
        id: string;
      };
    }>;
    summary: {
      total_count: number;
    };
  };
  reactions?: {
    summary: {
      total_count: number;
    };
  };
}

interface FacebookPage {
  id: string;
  name: string;
  username?: string;
  about?: string;
  fan_count?: number;
  posts: {
    data: FacebookPost[];
    paging?: {
      previous?: string;
      next?: string;
    };
  };
}

interface ManagedPage {
  id: string;
  name: string;
  username?: string;
  category?: string;
  fan_count?: number;
  access_token: string;
}

type CandidateLike = {
  id: string;
  name: string;
  facebookPageId?: string;
};

class FacebookService {
  private accessToken: string;
  private appId: string;
  private appSecret: string;
  private baseUrl = 'https://graph.facebook.com/v19.0';

  constructor() {
    this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || '';
    this.appId = process.env.FACEBOOK_APP_ID || '';
    this.appSecret = process.env.FACEBOOK_APP_SECRET || '';

    if (!this.accessToken || !this.appId || !this.appSecret) {
      throw new Error('Facebook credentials are not properly configured');
    }
  }

  async debugToken(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/debug_token`, {
        params: {
          input_token: this.accessToken,
          access_token: `${this.appId}|${this.appSecret}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error debugging token:', error);
      throw error;
    }
  }

  async getPageInfo(pageIdOrUsername: string): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/${pageIdOrUsername}`, {
        params: {
          fields: 'id,name,username,about,fan_count',
          access_token: this.accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching page info for ${pageIdOrUsername}:`, error);
      throw error;
    }
  }

  async getPagePosts(
    pageId: string,
    limit: number = 25,
    fields: string[] = [
      'id',
      'message',
      'created_time',
      'permalink_url',
      'attachments{media_type,media,subattachments}',
      'comments.summary(true).limit(50){id,message,created_time,from}',
      'reactions.summary(true)',
    ],
  ): Promise<FacebookPage> {
    try {
      const response = await axios.get(`${this.baseUrl}/${pageId}`, {
        params: {
          fields: `name,username,about,fan_count,posts.limit(${limit}){${fields.join(',')}}`,
          access_token: this.accessToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching posts for page ${pageId}:`, error);
      throw error;
    }
  }

  async getMultiplePagesPosts(
    pageIds: string[],
    limit: number = 25,
  ): Promise<{ [pageId: string]: FacebookPage }> {
    const results: { [pageId: string]: FacebookPage } = {};

    for (const pageId of pageIds) {
      try {
        results[pageId] = await this.getPagePosts(pageId, limit);
      } catch (error) {
        console.error(`Failed to fetch posts for page ${pageId}:`, error);
        results[pageId] = {
          id: pageId,
          name: 'Unknown Page',
          posts: { data: [] },
        };
      }
    }

    return results;
  }

  transformPostsToStandardFormat(pageData: FacebookPage): any[] {
    return pageData.posts.data.map(post => ({
      id: post.id,
      platform: 'facebook',
      content: post.message || '',
      createdAt: new Date(post.created_time).toISOString(),
      author: pageData.name,
      authorId: pageData.id,
      url: post.permalink_url || `https://facebook.com/${post.id}`,
      metrics: {
        likes: post.reactions?.summary.total_count || 0,
        comments: post.comments?.summary.total_count || 0,
        shares: 0,
      },
      engagement: {
        comments: post.comments?.data.map(comment => ({
          id: comment.id,
          text: comment.message,
          author: comment.from?.name || 'Unknown',
          createdAt: new Date(comment.created_time).toISOString(),
        })) || [],
      },
      media: this.extractMediaFromPost(post),
    }));
  }

  private extractMediaFromPost(post: FacebookPost): any[] {
    const media: any[] = [];

    if (post.attachments?.data) {
      post.attachments.data.forEach(attachment => {
        if (attachment.media_type === 'photo' && attachment.media?.image?.src) {
          media.push({
            type: 'image',
            url: attachment.media.image.src,
          });
        }

        if (attachment.subattachments?.data) {
          attachment.subattachments.data.forEach(subAttachment => {
            if (subAttachment.media_type === 'photo' && subAttachment.media?.image?.src) {
              media.push({
                type: 'image',
                url: subAttachment.media.image.src,
              });
            }
          });
        }
      });
    }

    return media;
  }

  async getManagedPages(): Promise<ManagedPage[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/me/accounts`, {
        params: {
          access_token: this.accessToken,
          fields: 'id,name,username,category,fan_count,access_token',
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching managed pages:', error);
      throw error;
    }
  }

  async getDefaultPageIds(): Promise<string[]> {
    const envPageIds = Object.entries(process.env)
      .filter(([key]) => key.startsWith('FACEBOOK_PAGE_'))
      .map(([, value]) => value as string)
      .filter(Boolean);

    if (envPageIds.length > 0) {
      return envPageIds;
    }

    try {
      const managedPages = await this.getManagedPages();
      return managedPages.map(page => page.id);
    } catch (error) {
      console.error('Error getting default page IDs:', error);
      return [];
    }
  }

  async getDefaultPagesPosts(limit: number = 25): Promise<{ [pageId: string]: FacebookPage }> {
    const pageIds = await this.getDefaultPageIds();

    if (pageIds.length === 0) {
      return {};
    }

    return this.getMultiplePagesPosts(pageIds, limit);
  }

  async getPoliticalPosts(
    pageId: string,
    keywords: string[] = [],
    limit: number = 50,
  ): Promise<FacebookPage & { metadata: { totalPosts: number; politicalPosts: number; keywordsUsed: string[] } }> {
    const arabicKeywords = [
      'انتخابات',
      'برلمان',
      'نائب',
      'مرشح',
      'دائرة',
      'تصويت',
      'العراق',
      'بغداد',
      'سياسة',
      'حكومة',
      'قانون',
      'تشريع',
    ];

    const englishKeywords = [
      'election',
      'parliament',
      'candidate',
      'vote',
      'district',
      'mp',
      'iraq',
      'baghdad',
      'policy',
      'government',
      'law',
      'legislation',
    ];

    const allKeywords = [...new Set([...keywords, ...arabicKeywords, ...englishKeywords].filter(Boolean))];

    try {
      const pageData = await this.getPagePosts(pageId, limit * 2);

      const filteredPosts = pageData.posts.data
        .filter(post => {
          const text = (post.message || '').toLowerCase();
          return allKeywords.length === 0 || allKeywords.some(keyword => text.includes(keyword.toLowerCase()));
        })
        .slice(0, limit);

      return {
        ...pageData,
        posts: {
          ...pageData.posts,
          data: filteredPosts,
        },
        metadata: {
          totalPosts: pageData.posts.data.length,
          politicalPosts: filteredPosts.length,
          keywordsUsed: allKeywords,
        },
      };
    } catch (error) {
      console.error(`Error fetching political posts for ${pageId}:`, error);
      throw error;
    }
  }

  async batchProcessCandidates(
    candidates: CandidateLike[],
    postsPerCandidate: number = 10,
  ): Promise<{ [candidateId: string]: any }> {
    const BATCH_SIZE = 50;
    const results: { [candidateId: string]: any } = {};

    for (let index = 0; index < candidates.length; index += BATCH_SIZE) {
      const batch = candidates.slice(index, index + BATCH_SIZE);

      const batchResults = await Promise.all(
        batch.map(async candidate => {
          if (!candidate.facebookPageId) {
            return { candidateId: candidate.id, error: 'missing_facebook_page' };
          }

          try {
            const posts = await this.getPoliticalPosts(candidate.facebookPageId, [], postsPerCandidate);
            return {
              candidateId: candidate.id,
              data: posts,
            };
          } catch (error) {
            console.error(`Failed to fetch posts for ${candidate.name}:`, error);
            return {
              candidateId: candidate.id,
              error: error instanceof Error ? error.message : 'unknown_error',
            };
          }
        }),
      );

      batchResults.forEach(result => {
        if (result) {
          results[result.candidateId] = result;
        }
      });

      if (index + BATCH_SIZE < candidates.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }

  analyzeEngagementMetrics(posts: any[]): {
    totalPosts: number;
    totalReactions: number;
    totalComments: number;
    avgEngagementRate: number;
    mostEngagedPost: { post: any; engagement: number } | null;
    postingFrequency: Record<string, number>;
    contentAnalysis: { hasImages: number; hasVideos: number; hasLinks: number };
  } {
    const metrics = {
      totalPosts: posts.length,
      totalReactions: 0,
      totalComments: 0,
      avgEngagementRate: 0,
      mostEngagedPost: null as { post: any; engagement: number } | null,
      postingFrequency: {} as Record<string, number>,
      contentAnalysis: {
        hasImages: 0,
        hasVideos: 0,
        hasLinks: 0,
      },
    };

    posts.forEach(post => {
      const reactions = post.reactions?.summary?.total_count || 0;
      const comments = post.comments?.summary?.total_count || 0;

      metrics.totalReactions += reactions;
      metrics.totalComments += comments;

      const dateKey = new Date(post.created_time).toISOString().split('T')[0];
      metrics.postingFrequency[dateKey] = (metrics.postingFrequency[dateKey] || 0) + 1;

      if (post.attachments?.data) {
        post.attachments.data.forEach((attachment: any) => {
          if (attachment.media_type === 'photo') {
            metrics.contentAnalysis.hasImages += 1;
          }
          if (attachment.media_type === 'video') {
            metrics.contentAnalysis.hasVideos += 1;
          }
          if (attachment.url || attachment.target?.url) {
            metrics.contentAnalysis.hasLinks += 1;
          }
        });
      }

      const engagement = reactions + comments;
      if (!metrics.mostEngagedPost || engagement > metrics.mostEngagedPost.engagement) {
        metrics.mostEngagedPost = {
          post,
          engagement,
        };
      }
    });

    metrics.avgEngagementRate =
      posts.length > 0 ? (metrics.totalReactions + metrics.totalComments) / posts.length : 0;

    return metrics;
  }
}

export default FacebookService;
