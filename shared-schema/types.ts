// Shared type definitions consumed by both frontends.
export type Language = 'en' | 'ku' | 'ar';

export enum UserRole {
    Voter = 'Voter',
    Candidate = 'Candidate',
}

export const GOVERNORATES = [
    'Al Anbar', 'Al-Qādisiyyah', 'Babil', 'Baghdad', 'Basra',
    'Dhi Qar', 'Diyala', 'Dohuk', 'Erbil', 'Karbala', 'Kirkuk',
    'Maysan', 'Muthanna', 'Najaf', 'Nineveh', 'Saladin',
    'Sulaymaniyah', 'Wasit',
] as const;

export type Governorate = typeof GOVERNORATES[number];

export interface User {
    id: string;
    name: string;
    avatarUrl: string;
    role: UserRole;
    verified: boolean;
    party: string;
    governorate: Governorate;
    bio?: string;
}

export enum AppTab {
    Home = 'Home',
    Posts = 'Posts',
    Reels = 'Reels',
    Candidates = 'Candidates',
    Debates = 'Debates',
    Events = 'Events',
    DebateRoom = 'Debate Room',
    Dashboard = 'Dashboard',
    Settings = 'Settings',
    CandidateProfile = 'Candidate Profile',
}

export type MainContentTab =
    | AppTab.Posts
    | AppTab.Reels
    | AppTab.Candidates
    | AppTab.Debates
    | AppTab.Events;

export type PostType = 'Post' | 'Reel' | 'Story';

export interface Post {
    id: string;
    author: User;
    timestamp: string;
    content: string;
    mediaUrl?: string;
    likes: number;
    comments: number;
    shares: number;
    isSponsored: boolean;
    type: PostType;
    governorates: Governorate[];
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    organizer: User;
    governorate: Governorate;
}

export interface Debate {
    id: string;
    title: string;
    topic: string;
    scheduledTime: string;
    isLive: boolean;
    participants: User[];
}

export interface Article {
    id: string;
    source: string;
    timestamp: string;
    title: string;
    authorName: string;
    contentSnippet: string;
    url: string;
    governorates: Governorate[];
}
