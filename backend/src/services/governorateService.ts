import { prisma } from '../lib/prisma';
import type { GovernorateData, GovernorateParticipation, DashboardStats } from '../types';

export const getGovernorateParticipation = async (): Promise<GovernorateParticipation[]> => {
    const participation = await prisma.governorateParticipation.findMany();
    return participation.map(item => ({
        governorateId: item.governorateId,
        governorateName: item.governorateName,
        estimatedTurnout: item.estimatedTurnout,
    }));
};

export const getGovernorateData = async (slug: string): Promise<GovernorateData | null> => {
    const governorate = await prisma.governorate.findUnique({
        where: { slug },
        include: {
            stats: true,
            events: {
                include: {
                    organizer: true,
                },
            },
        },
    });

    if (!governorate) {
        return null;
    }

    const candidates = await prisma.candidate.findMany({
        where: { user: { governorateId: governorate.id } },
        include: {
            user: true,
        },
    });

    const news = await prisma.article.findMany({
        where: { governorates: { has: governorate.name } },
        take: 5,
        orderBy: { timestamp: 'desc' },
    });

    return {
        governorate: governorate.name,
        candidates: candidates.map(({ user, platformSummary, votes, partyId }) => ({
            id: Number.parseInt(user.id.replace(/[^0-9]/g, ''), 10) || 0,
            name: user.name,
            party: partyId,
            imageUrl: user.avatarUrl,
            verified: user.verified,
            governorate: governorate.name,
            platformSummary: platformSummary ?? undefined,
            votes: votes ?? undefined,
        })),
        news: news.map(article => ({
            id: Number.parseInt(article.id.replace(/[^0-9]/g, ''), 10) || 0,
            title: article.title,
            summary: article.contentSnippet,
            date: article.timestamp.toISOString(),
            source: article.source,
        })),
        localStats: {
            registeredVoters: governorate.stats?.registeredVoters ?? 0,
            pollingStations: governorate.stats?.pollingStations ?? 0,
        },
    };
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const snapshot = await prisma.dashboardSnapshot.findFirst();
    if (!snapshot) {
        throw new Error('Dashboard snapshot not found');
    }
    return snapshot.metrics as DashboardStats;
};
