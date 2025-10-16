import type { User as SharedUser, UserRole, Post as SharedPost, Event as SharedEvent, Debate as SharedDebate, Article as SharedArticle, Governorate } from 'shared-schema/types';
import { GOVERNORATES } from 'shared-schema/types';
import type {
  User,
  Governorate as GovernorateModel,
  Post,
  Event,
  Debate,
  DebateParticipant,
  Article,
  Candidate,
  Party,
} from '@prisma/client';

const asGovernorate = (name: string): Governorate => {
  if ((GOVERNORATES as readonly string[]).includes(name)) {
    return name as Governorate;
  }
  throw new Error(`Unknown governorate: ${name}`);
};

export const toSharedUser = (user: User & { governorate: GovernorateModel }): SharedUser => ({
  id: user.id,
  name: user.name,
  avatarUrl: user.avatarUrl,
  role: user.role as UserRole,
  verified: user.verified,
  party: user.party,
  governorate: asGovernorate(user.governorate.name),
  bio: user.bio ?? undefined,
});

export const toSharedPost = (
  post: Post & { author: User & { governorate: GovernorateModel } }
): SharedPost => ({
  id: post.id,
  author: toSharedUser(post.author),
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

export const toSharedEvent = (
  event: Event & { organizer: User & { governorate: GovernorateModel }; governorate: GovernorateModel }
): SharedEvent => ({
  id: event.id,
  title: event.title,
  date: event.date.toISOString(),
  location: event.location,
  organizer: toSharedUser(event.organizer),
  governorate: asGovernorate(event.governorate.name),
});

export const toSharedDebate = (
  debate: Debate & { participants: (DebateParticipant & { user: User & { governorate: GovernorateModel } })[] }
): SharedDebate => ({
  id: debate.id,
  title: debate.title,
  topic: debate.topic,
  scheduledTime: debate.scheduledTime.toISOString(),
  isLive: debate.isLive,
  participants: debate.participants.map(participant => toSharedUser(participant.user)),
});

export const toSharedArticle = (article: Article): SharedArticle => ({
  id: article.id,
  source: article.source,
  timestamp: article.timestamp.toISOString(),
  title: article.title,
  authorName: article.authorName,
  contentSnippet: article.contentSnippet,
  url: article.url,
  governorates: article.governorates.map(asGovernorate),
});

export const toCandidateSummary = (
  candidate: Candidate & {
    user: User & { governorate: GovernorateModel };
    party: Party;
  }
) => ({
  id: Number.parseInt(candidate.id.replace(/[^0-9]/g, ''), 10) || 0,
  name: candidate.user.name,
  party: candidate.party.name,
  imageUrl: candidate.user.avatarUrl,
  verified: candidate.user.verified,
  governorate: asGovernorate(candidate.user.governorate.name),
  platformSummary: candidate.platformSummary ?? undefined,
  votes: candidate.votes ?? undefined,
});
