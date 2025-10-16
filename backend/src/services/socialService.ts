import type {
  PostType,
  Governorate,
  User as SharedUser,
  Post as SharedPost,
  Event as SharedEvent,
  Debate as SharedDebate,
  Article as SharedArticle,
} from 'shared-schema/types';
import { prisma } from '../lib/prisma';
import {
  toSharedUser,
  toSharedPost,
  toSharedEvent,
  toSharedDebate,
  toSharedArticle,
} from './mappers';

export const getUsers = async (role?: string, governorate?: string): Promise<SharedUser[]> => {
  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(governorate && governorate !== 'All'
        ? { governorate: { name: governorate } }
        : {}),
    },
    include: {
      governorate: true,
    },
  });

  return users.map(toSharedUser);
};

export const getPosts = async (
  filters: { type?: PostType; governorate?: string; authorId?: string }
): Promise<SharedPost[]> => {
  const posts = await prisma.post.findMany({
    where: {
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.authorId ? { authorId: filters.authorId } : {}),
      ...(filters.governorate && filters.governorate !== 'All'
        ? { governorates: { has: filters.governorate as Governorate } }
        : {}),
    },
    orderBy: { timestamp: 'desc' },
    include: {
      author: {
        include: {
          governorate: true,
        },
      },
    },
  });

  return posts.map(toSharedPost);
};

export const createPost = async (params: {
  content: string;
  authorId: string;
  governorate?: Governorate;
  type: PostType;
  mediaUrl?: string;
}): Promise<SharedPost> => {
  const { content, authorId, governorate, type, mediaUrl } = params;
  const author = await prisma.user.findUnique({
    where: { id: authorId },
    include: { governorate: true },
  });

  if (!author) {
    throw new Error('Author not found');
  }

  const post = await prisma.post.create({
    data: {
      id: `post-${Date.now()}`,
      authorId,
      content,
      mediaUrl,
      type,
      governorates: governorate ? [governorate] : [author.governorate.name as Governorate],
    },
    include: {
      author: {
        include: {
          governorate: true,
        },
      },
    },
  });

  return toSharedPost(post);
};

export const getEvents = async (governorate?: string): Promise<SharedEvent[]> => {
  const events = await prisma.event.findMany({
    where: governorate && governorate !== 'All' ? { governorate: { name: governorate } } : {},
    orderBy: { date: 'asc' },
    include: {
      organizer: {
        include: { governorate: true },
      },
      governorate: true,
    },
  });

  return events.map(event => toSharedEvent(event));
};

export const createEvent = async (params: {
  title: string;
  date: string;
  location: string;
  organizerId: string;
  governorate?: Governorate;
}): Promise<SharedEvent> => {
  const { title, date, location, organizerId, governorate } = params;

  const organizer = await prisma.user.findUnique({
    where: { id: organizerId },
    include: { governorate: true },
  });
  if (!organizer) {
    throw new Error('Organizer not found');
  }

  const targetGovernorate = governorate ?? (organizer.governorate.name as Governorate);
  const governorateRecord = await prisma.governorate.findFirst({ where: { name: targetGovernorate } });
  if (!governorateRecord) {
    throw new Error('Governorate not found');
  }

  const event = await prisma.event.create({
    data: {
      id: `event-${Date.now()}`,
      title,
      date: new Date(date),
      location,
      organizerId,
      governorateId: governorateRecord.id,
    },
    include: {
      organizer: { include: { governorate: true } },
      governorate: true,
    },
  });

  return toSharedEvent(event);
};

export const getDebates = async (filters: { governorate?: string; participantIds?: string[] }): Promise<SharedDebate[]> => {
  const debates = await prisma.debate.findMany({
    where: {
      ...(filters.participantIds && filters.participantIds.length > 0
        ? {
            participants: {
              some: {
                userId: { in: filters.participantIds },
              },
            },
          }
        : {}),
    },
    include: {
      participants: {
        include: {
          user: {
            include: { governorate: true },
          },
        },
      },
    },
  });

  const mapped = debates.map(toSharedDebate);

  if (filters.governorate && filters.governorate !== 'All') {
    return mapped.filter(debate => debate.participants.some(p => p.governorate === filters.governorate));
  }

  return mapped;
};

export const getArticles = async (governorate?: string): Promise<SharedArticle[]> => {
  const articles = await prisma.article.findMany({
    where: governorate && governorate !== 'All' ? { governorates: { has: governorate } } : {},
    orderBy: { timestamp: 'desc' },
  });

  return articles.map(toSharedArticle);
};

export const followCandidate = async (candidateId: string) => {
  // TODO: implement persistence (e.g., followers table). For now, acknowledge request.
  return { success: true, candidateId } as const;
};

export const likePost = async (postId: string) => {
  await prisma.post.update({
    where: { id: postId },
    data: { likes: { increment: 1 } },
  }).catch(() => undefined);
  return { success: true, postId } as const;
};
