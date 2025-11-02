import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Noto_Sans, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSansArabic = Noto_Sans_Arabic({
  subsets: ['arabic'],
  variable: '--font-noto-sans-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Iraq Compass',
  description:
    'Discover events, businesses, and community stories across Iraq with a fully bilingual experience.',
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${notoSans.variable} ${notoSansArabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
