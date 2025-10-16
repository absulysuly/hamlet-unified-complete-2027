"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class FacebookService {
    accessToken;
    appId;
    appSecret;
    baseUrl = 'https://graph.facebook.com/v19.0';
    constructor() {
        this.accessToken = process.env.FACEBOOK_ACCESS_TOKEN || '';
        this.appId = process.env.FACEBOOK_APP_ID || '';
        this.appSecret = process.env.FACEBOOK_APP_SECRET || '';
        if (!this.accessToken || !this.appId || !this.appSecret) {
            throw new Error('Facebook credentials are not properly configured');
        }
    }
    async debugToken() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/debug_token`, {
                params: {
                    input_token: this.accessToken,
                    access_token: `${this.appId}|${this.appSecret}`,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Error debugging token:', error);
            throw error;
        }
    }
    async getPageInfo(pageIdOrUsername) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/${pageIdOrUsername}`, {
                params: {
                    fields: 'id,name,username,about,fan_count',
                    access_token: this.accessToken,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching page info for ${pageIdOrUsername}:`, error);
            throw error;
        }
    }
    async getPagePosts(pageId, limit = 25, fields = [
        'id',
        'message',
        'created_time',
        'permalink_url',
        'attachments{media_type,media,subattachments}',
        'comments.summary(true).limit(50){id,message,created_time,from}',
        'reactions.summary(true)',
    ]) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/${pageId}`, {
                params: {
                    fields: `name,username,about,fan_count,posts.limit(${limit}){${fields.join(',')}}`,
                    access_token: this.accessToken,
                },
            });
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching posts for page ${pageId}:`, error);
            throw error;
        }
    }
    async getMultiplePagesPosts(pageIds, limit = 25) {
        const results = {};
        for (const pageId of pageIds) {
            try {
                results[pageId] = await this.getPagePosts(pageId, limit);
            }
            catch (error) {
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
    transformPostsToStandardFormat(pageData) {
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
    extractMediaFromPost(post) {
        const media = [];
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
    async getManagedPages() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/me/accounts`, {
                params: {
                    access_token: this.accessToken,
                    fields: 'id,name,username,category,fan_count,access_token',
                },
            });
            return response.data.data;
        }
        catch (error) {
            console.error('Error fetching managed pages:', error);
            throw error;
        }
    }
    async getDefaultPageIds() {
        const envPageIds = Object.entries(process.env)
            .filter(([key]) => key.startsWith('FACEBOOK_PAGE_'))
            .map(([, value]) => value)
            .filter(Boolean);
        if (envPageIds.length > 0) {
            return envPageIds;
        }
        try {
            const managedPages = await this.getManagedPages();
            return managedPages.map(page => page.id);
        }
        catch (error) {
            console.error('Error getting default page IDs:', error);
            return [];
        }
    }
    async getDefaultPagesPosts(limit = 25) {
        const pageIds = await this.getDefaultPageIds();
        if (pageIds.length === 0) {
            return {};
        }
        return this.getMultiplePagesPosts(pageIds, limit);
    }
    async getPoliticalPosts(pageId, keywords = [], limit = 50) {
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
        }
        catch (error) {
            console.error(`Error fetching political posts for ${pageId}:`, error);
            throw error;
        }
    }
    async batchProcessCandidates(candidates, postsPerCandidate = 10) {
        const BATCH_SIZE = 50;
        const results = {};
        for (let index = 0; index < candidates.length; index += BATCH_SIZE) {
            const batch = candidates.slice(index, index + BATCH_SIZE);
            const batchResults = await Promise.all(batch.map(async (candidate) => {
                if (!candidate.facebookPageId) {
                    return { candidateId: candidate.id, error: 'missing_facebook_page' };
                }
                try {
                    const posts = await this.getPoliticalPosts(candidate.facebookPageId, [], postsPerCandidate);
                    return {
                        candidateId: candidate.id,
                        data: posts,
                    };
                }
                catch (error) {
                    console.error(`Failed to fetch posts for ${candidate.name}:`, error);
                    return {
                        candidateId: candidate.id,
                        error: error instanceof Error ? error.message : 'unknown_error',
                    };
                }
            }));
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
    analyzeEngagementMetrics(posts) {
        const metrics = {
            totalPosts: posts.length,
            totalReactions: 0,
            totalComments: 0,
            avgEngagementRate: 0,
            mostEngagedPost: null,
            postingFrequency: {},
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
                post.attachments.data.forEach((attachment) => {
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
exports.default = FacebookService;
