import type { Governorate, Post, Event, Debate, Article, User } from 'shared-schema/types';

export type { Governorate, Post, Event, Debate, Article, User };

export interface Candidate {
    id: number;
    name: string;
    party: string;
    imageUrl: string;
    verified: boolean;
    governorate: string;
    platformSummary?: string;
    votes?: number;
}

export interface DashboardStats {
    totalRegisteredVoters: number;
    expectedTurnoutPercentage: number;
    turnoutChangeLastWeek: number;
    approvedCandidatesCount: number;
    verifiedViolationsCount: number;
    newViolationsChangeLastWeek: number;
    greenCampaignImpact: {
        treesSaved: number;
        paperPostersSaved: number;
        co2EmissionsReducedKg: number;
    };
    candidateDistribution: {
        men: { count: number; percentage: number };
        women: { count: number; percentage: number };
    };
}

export interface GovernorateParticipation {
    governorateId: string;
    governorateName: string;
    estimatedTurnout: number;
}

export interface GovernorateData {
    governorate: Governorate;
    candidates: Candidate[];
    news: Array<{
        id: number;
        title: string;
        summary: string;
        date: string;
        source?: string;
    }>;
    localStats: {
        registeredVoters: number;
        pollingStations: number;
    };
}

export interface Party {
    id: string;
    name: string;
    logoUrl: string;
    leader: string;
    founded: number;
    description: string;
}
