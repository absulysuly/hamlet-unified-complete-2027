'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { StoriesRing } from '@/components/StoriesRing';
import { CategoryGrid } from '@/components/CategoryGrid';
import { FeaturedBusinesses } from '@/components/FeaturedBusinesses';
import { PersonalizedEvents } from '@/components/PersonalizedEvents';
import { DealsMarketplace } from '@/components/DealsMarketplace';
import { CommunityStories } from '@/components/CommunityStories';
import { CityGuide } from '@/components/CityGuide';
import { BusinessDirectory } from '@/components/BusinessDirectory';
import { InclusiveFeatures } from '@/components/InclusiveFeatures';
import { AuthModal } from '@/components/AuthModal';
import { Dashboard } from '@/components/Dashboard';
import { SubcategoryModal } from '@/components/SubcategoryModal';
import { GovernorateFilter } from '@/components/GovernorateFilter';
import { SearchPortal } from '@/components/SearchPortal';
import { TopNavBar } from '@/components/TopNavBar';
import { mockUser } from '@/lib/constants';
import type { Category, Subcategory, User } from '@/types';
import { TranslationProvider } from '@/hooks/useTranslations';
import { useTranslations } from '@/hooks/useTranslations';

function MainContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [page, setPage] = useState<'home' | 'dashboard' | 'listing'>('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [listingFilter, setListingFilter] = useState<{ categoryId: string } | null>(null);
  const [selectedGovernorate, setSelectedGovernorate] = useState('all');
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('iraq-compass-high-contrast') === 'true';
    }
    return false;
  });
  const { t } = useTranslations();

  useEffect(() => {
    if (!selectedGovernorate) {
      return;
    }
    console.info(
      `Governorate changed to: ${selectedGovernorate}. Data should be refetched from the API in a real application.`,
    );
  }, [selectedGovernorate]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.setAttribute('data-contrast', 'high');
      localStorage.setItem('iraq-compass-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-contrast');
      localStorage.setItem('iraq-compass-high-contrast', 'false');
    }
  }, [highContrast]);

  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    setCurrentUser(mockUser);
    setShowAuthModal(false);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setPage('home');
  }, []);

  const navigateTo = useCallback(
    (targetPage: 'home' | 'dashboard' | 'listing') => {
      if (targetPage === 'dashboard' && !isLoggedIn) {
        setShowAuthModal(true);
        return;
      }
      setPage(targetPage);
      if (targetPage === 'home') {
        setListingFilter(null);
      }
    },
    [isLoggedIn],
  );

  const handleCategoryClick = useCallback((category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setSelectedCategory(category);
      return;
    }
    setListingFilter({ categoryId: category.id });
    setPage('listing');
  }, []);

  const handleSubcategorySelect = useCallback((category: Category, subcategory: Subcategory) => {
    setListingFilter({ categoryId: category.id });
    setPage('listing');
    setSelectedCategory(null);
  }, []);

  const showListing = page === 'listing';
  const showDashboard = page === 'dashboard' && currentUser;

  const content = useMemo(() => {
    if (page === 'home') {
      return (
        <>
          <HeroSection />
          <StoriesRing />
          <SearchPortal />
          <GovernorateFilter
            selectedGovernorate={selectedGovernorate}
            onGovernorateChange={setSelectedGovernorate}
          />
          <CategoryGrid onCategoryClick={handleCategoryClick} currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <FeaturedBusinesses />
          <PersonalizedEvents />
          <DealsMarketplace />
          <CommunityStories />
          <CityGuide />
          <BusinessDirectory />
          <InclusiveFeatures highContrast={highContrast} setHighContrast={setHighContrast} />
        </>
      );
    }

    if (showListing) {
      return (
        <BusinessDirectory
          initialFilter={listingFilter ?? undefined}
          onBack={() => navigateTo('home')}
        />
      );
    }

    if (showDashboard && currentUser) {
      return <Dashboard user={currentUser} onLogout={handleLogout} />;
    }

    return null;
  }, [
    page,
    selectedGovernorate,
    handleCategoryClick,
    currentPage,
    highContrast,
    listingFilter,
    navigateTo,
    showListing,
    showDashboard,
    currentUser,
    handleLogout,
  ]);

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Header
        isLoggedIn={isLoggedIn}
        user={currentUser}
        onSignIn={() => setShowAuthModal(true)}
        onSignOut={handleLogout}
        onDashboard={() => navigateTo('dashboard')}
        onHome={() => navigateTo('home')}
      />
      <TopNavBar
        tabs={[
          { id: 'home', label: t('nav.discover') },
          { id: 'listing', label: t('nav.directory') },
          { id: 'dashboard', label: t('nav.dashboard') },
        ]}
        activeTab={page === 'listing' ? 'listing' : page}
        onTabChange={(tabId) => {
          if (tabId === 'dashboard') {
            navigateTo('dashboard');
            return;
          }
          if (tabId === 'listing') {
            navigateTo('listing');
            return;
          }
          navigateTo('home');
        }}
      />
      <main>{content}</main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
      <SubcategoryModal
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
        onSubcategorySelect={handleSubcategorySelect}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <TranslationProvider>
      <MainContent />
    </TranslationProvider>
  );
}
