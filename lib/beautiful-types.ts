export type Language = 'en' | 'ar' | 'ku';
export type UserRole = 'voter' | 'candidate' | 'admin';
export type AppTab = 'home' | 'discover' | 'elections' | 'profile';
export type HomeViewMode = 'forYou' | 'following' | 'trending';
export type ThemeName = 'sunset' | 'ocean' | 'forest' | 'midnight';

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  role: UserRole;
  verified?: boolean;
  followers?: number;
  following?: number;
  createdAt: Date;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images?: string[];
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: Date;
  liked?: boolean;
}

export interface Candidate extends User {
  party?: string;
  platform?: string;
  votes?: number;
  color?: string;
}

export interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  candidates: Candidate[];
  totalVotes?: number;
}

export interface Theme {
  name: ThemeName;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
}
