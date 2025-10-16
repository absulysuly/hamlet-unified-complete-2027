"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCandidateSummary = exports.toSharedArticle = exports.toSharedDebate = exports.toSharedEvent = exports.toSharedPost = exports.toSharedUser = void 0;
const types_1 = require("shared-schema/types");
const asGovernorate = (name) => {
    if (types_1.GOVERNORATES.includes(name)) {
        return name;
    }
    throw new Error(`Unknown governorate: ${name}`);
};
const toSharedUser = (user) => ({
    id: user.id,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    verified: user.verified,
    party: user.party,
    governorate: asGovernorate(user.governorate.name),
    bio: user.bio ?? undefined,
});
exports.toSharedUser = toSharedUser;
const toSharedPost = (post) => ({
    id: post.id,
    author: (0, exports.toSharedUser)(post.author),
    timestamp: post.timestamp.toISOString(),
    content: post.content,
    mediaUrl: post.mediaUrl ?? undefined,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    isSponsored: post.isSponsored,
    type: post.type,
    governorates: post.governorates.map(asGovernorate),
});
exports.toSharedPost = toSharedPost;
const toSharedEvent = (event) => ({
    id: event.id,
    title: event.title,
    date: event.date.toISOString(),
    location: event.location,
    organizer: (0, exports.toSharedUser)(event.organizer),
    governorate: asGovernorate(event.governorate.name),
});
exports.toSharedEvent = toSharedEvent;
const toSharedDebate = (debate) => ({
    id: debate.id,
    title: debate.title,
    topic: debate.topic,
    scheduledTime: debate.scheduledTime.toISOString(),
    isLive: debate.isLive,
    participants: debate.participants.map(participant => (0, exports.toSharedUser)(participant.user)),
});
exports.toSharedDebate = toSharedDebate;
const toSharedArticle = (article) => ({
    id: article.id,
    source: article.source,
    timestamp: article.timestamp.toISOString(),
    title: article.title,
    authorName: article.authorName,
    contentSnippet: article.contentSnippet,
    url: article.url,
    governorates: article.governorates.map(asGovernorate),
});
exports.toSharedArticle = toSharedArticle;
const toCandidateSummary = (candidate) => ({
    id: Number.parseInt(candidate.id.replace(/[^0-9]/g, ''), 10) || 0,
    name: candidate.user.name,
    party: candidate.party.name,
    imageUrl: candidate.user.avatarUrl,
    verified: candidate.user.verified,
    governorate: asGovernorate(candidate.user.governorate.name),
    platformSummary: candidate.platformSummary ?? undefined,
    votes: candidate.votes ?? undefined,
});
exports.toCandidateSummary = toCandidateSummary;
