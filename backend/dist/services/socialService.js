"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likePost = exports.followCandidate = exports.getArticles = exports.getDebates = exports.createEvent = exports.getEvents = exports.createPost = exports.getPosts = exports.getUsers = void 0;
const prisma_1 = require("../lib/prisma");
const mappers_1 = require("./mappers");
const getUsers = async (role, governorate) => {
    const users = await prisma_1.prisma.user.findMany({
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
    return users.map(mappers_1.toSharedUser);
};
exports.getUsers = getUsers;
const getPosts = async (filters) => {
    const posts = await prisma_1.prisma.post.findMany({
        where: {
            ...(filters.type ? { type: filters.type } : {}),
            ...(filters.authorId ? { authorId: filters.authorId } : {}),
            ...(filters.governorate && filters.governorate !== 'All'
                ? { governorates: { has: filters.governorate } }
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
    return posts.map(mappers_1.toSharedPost);
};
exports.getPosts = getPosts;
const createPost = async (params) => {
    const { content, authorId, governorate, type, mediaUrl } = params;
    const author = await prisma_1.prisma.user.findUnique({
        where: { id: authorId },
        include: { governorate: true },
    });
    if (!author) {
        throw new Error('Author not found');
    }
    const post = await prisma_1.prisma.post.create({
        data: {
            id: `post-${Date.now()}`,
            authorId,
            content,
            mediaUrl,
            type,
            governorates: governorate ? [governorate] : [author.governorate.name],
        },
        include: {
            author: {
                include: {
                    governorate: true,
                },
            },
        },
    });
    return (0, mappers_1.toSharedPost)(post);
};
exports.createPost = createPost;
const getEvents = async (governorate) => {
    const events = await prisma_1.prisma.event.findMany({
        where: governorate && governorate !== 'All' ? { governorate: { name: governorate } } : {},
        orderBy: { date: 'asc' },
        include: {
            organizer: {
                include: { governorate: true },
            },
            governorate: true,
        },
    });
    return events.map(event => (0, mappers_1.toSharedEvent)(event));
};
exports.getEvents = getEvents;
const createEvent = async (params) => {
    const { title, date, location, organizerId, governorate } = params;
    const organizer = await prisma_1.prisma.user.findUnique({
        where: { id: organizerId },
        include: { governorate: true },
    });
    if (!organizer) {
        throw new Error('Organizer not found');
    }
    const targetGovernorate = governorate ?? organizer.governorate.name;
    const governorateRecord = await prisma_1.prisma.governorate.findFirst({ where: { name: targetGovernorate } });
    if (!governorateRecord) {
        throw new Error('Governorate not found');
    }
    const event = await prisma_1.prisma.event.create({
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
    return (0, mappers_1.toSharedEvent)(event);
};
exports.createEvent = createEvent;
const getDebates = async (filters) => {
    const debates = await prisma_1.prisma.debate.findMany({
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
    const mapped = debates.map(mappers_1.toSharedDebate);
    if (filters.governorate && filters.governorate !== 'All') {
        return mapped.filter(debate => debate.participants.some(p => p.governorate === filters.governorate));
    }
    return mapped;
};
exports.getDebates = getDebates;
const getArticles = async (governorate) => {
    const articles = await prisma_1.prisma.article.findMany({
        where: governorate && governorate !== 'All' ? { governorates: { has: governorate } } : {},
        orderBy: { timestamp: 'desc' },
    });
    return articles.map(mappers_1.toSharedArticle);
};
exports.getArticles = getArticles;
const followCandidate = async (candidateId) => {
    // TODO: implement persistence (e.g., followers table). For now, acknowledge request.
    return { success: true, candidateId };
};
exports.followCandidate = followCandidate;
const likePost = async (postId) => {
    await prisma_1.prisma.post.update({
        where: { id: postId },
        data: { likes: { increment: 1 } },
    }).catch(() => undefined);
    return { success: true, postId };
};
exports.likePost = likePost;
