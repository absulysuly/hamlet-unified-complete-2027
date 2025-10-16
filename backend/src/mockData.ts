import { GOVERNORATES, UserRole } from 'shared-schema/types';
import type { User, Post, Event, Debate, Article } from './types';
import type { Candidate, DashboardStats, GovernorateParticipation, GovernorateData, Party } from './types';

export const users: User[] = [];

export const posts: Post[] = [];

export const events: Event[] = [];

export const debates: Debate[] = [];

export const articles: Article[] = [];

export const dashboardStats: DashboardStats = {
    totalRegisteredVoters: 25123456,
    expectedTurnoutPercentage: 65,
    turnoutChangeLastWeek: 2,
    approvedCandidatesCount: 8500,
    verifiedViolationsCount: 1245,
    newViolationsChangeLastWeek: -5,
    greenCampaignImpact: {
        treesSaved: 12,
        paperPostersSaved: 245,
        co2EmissionsReducedKg: 50,
    },
    candidateDistribution: {
        men: { count: 6120, percentage: 72 },
        women: { count: 2380, percentage: 28 },
    },
};

export const slugify = (name: string) =>
    name
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

export const governorateParticipation: GovernorateParticipation[] = GOVERNORATES.map((name, index) => ({
    governorateId: slugify(name) || `gov-${index}`,
    governorateName: name,
    estimatedTurnout: Math.floor(Math.random() * (75 - 45 + 1)) + 45,
}));

const sampleCandidates: Candidate[] = [
    { id: 1, name: 'أحمد علي', party: 'تحالف النصر', imageUrl: 'https://picsum.photos/200/200?random=1', verified: true, governorate: 'Baghdad' },
    { id: 2, name: 'فاطمة حسن', party: 'دولة القانون', imageUrl: 'https://picsum.photos/200/200?random=2', verified: true, governorate: 'Basra' },
    { id: 3, name: 'علي كريم', party: 'التيار الصدري', imageUrl: 'https://picsum.photos/200/200?random=3', verified: false, governorate: 'Baghdad' },
    { id: 4, name: 'مريم جاسم', party: 'الحزب الديمقراطي الكردستاني', imageUrl: 'https://picsum.photos/200/200?random=4', verified: true, governorate: 'Erbil' },
];

export const governorateData = new Map<string, GovernorateData>(
    GOVERNORATES.map(name => {
        const slug = slugify(name);
        return [
            slug,
            {
                governorate: name,
                candidates: sampleCandidates.filter(candidate => candidate.governorate === name || candidate.governorate === 'Baghdad'),
                news: [
                    { id: 1, title: `أخبار ${name}`, summary: 'تطورات انتخابية محلية.', date: '2025-09-15' },
                    { id: 2, title: `استعدادات ${name}`, summary: 'تحضيرات المفوضية للمحافظة.', date: '2025-09-14' },
                ],
                localStats: {
                    registeredVoters: Math.floor(Math.random() * 5_000_000),
                    pollingStations: Math.floor(Math.random() * 1_500),
                },
            },
        ];
    })
);

export const partyData: Record<string, { party: Party; candidates: Candidate[] }> = {
    'tahaleef-al-nasr': {
        party: {
            id: 'tahaleef-al-nasr',
            name: 'تحالف النصر',
            logoUrl: 'https://via.placeholder.com/150/007a3d/FFFFFF?text=Logo',
            leader: 'حيدر العبادي',
            founded: 2018,
            description: 'تحالف سياسي يركز على الأمن، ومحاربة الفساد، وتحسين الخدمات العامة.',
        },
        candidates: sampleCandidates,
    },
};
