import React, { useState, useMemo, useEffect } from 'react';
import { businesses, categories } from '../constants';
import type { Business } from '../types';
import { Star, Grid3x3, List, MapPin, CheckCircle, ArrowLeft } from './icons';
import { useTranslations } from '../hooks/useTranslations';
import { GlassCard } from './GlassCard';

interface BusinessCardProps {
  business: Business;
  viewMode: 'grid' | 'list';
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business, viewMode }) => {
  const { t } = useTranslations();
  if (viewMode === 'list') {
    return (
      <GlassCard className="p-4 flex gap-4 text-start rtl:text-right">
        <img src={business.image} alt={business.name} className="w-24 h-24 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-white font-semibold text-lg mb-1">{business.name}</h3>
          <p className="text-white/60 text-sm mb-2">{t(categories.find(c => c.id === business.category)?.nameKey || business.category)}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1"><Star className="w-4 h-4 text-accent fill-accent" /><span className="text-white">{business.rating}</span></div>
            <div className="flex items-center gap-1 text-white/60"><MapPin className="w-4 h-4" />{business.distance} km</div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium text-sm">{t('directory.view')}</button>
          <button className="px-4 py-2 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white font-medium text-sm">{t('directory.contact')}</button>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="overflow-hidden group text-start p-0">
      <div className="relative h-48 overflow-hidden">
        <img src={business.image} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        {business.verified && <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center"><CheckCircle className="w-5 h-5 text-dark-bg" /></div>}
      </div>
      <div className="p-5">
        <h3 className="text-white font-semibold text-lg mb-2">{business.name}</h3>
        <p className="text-white/60 text-sm mb-3">{t(categories.find(c => c.id === business.category)?.nameKey || business.category)}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1"><Star className="w-4 h-4 text-accent fill-accent" /><span className="text-white font-medium">{business.rating}</span><span className="text-white/60 text-sm">({business.reviews})</span></div>
          <div className="flex items-center gap-1 text-white/60 text-sm"><MapPin className="w-4 h-4" />{business.distance} km</div>
        </div>
        <button className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-glow-primary transition-all">{t('directory.viewProfile')}</button>
      </div>
    </GlassCard>
  );
};

interface BusinessDirectoryProps {
    initialFilter?: { categoryId: string };
    onBack?: () => void;
}

export const BusinessDirectory: React.FC<BusinessDirectoryProps> = ({ initialFilter, onBack }) => {
  const [filters, setFilters] = useState({ category: initialFilter?.categoryId || 'all', rating: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t } = useTranslations();

  useEffect(() => {
    setFilters(prev => ({...prev, category: initialFilter?.categoryId || 'all'}));
  }, [initialFilter]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const categoryMatch = filters.category === 'all' || business.category === filters.category;
      const ratingMatch = business.rating >= filters.rating;
      return categoryMatch && ratingMatch;
    });
  }, [filters]);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center relative mb-8">
            {onBack && (
                <button 
                    onClick={onBack} 
                    className="absolute start-0 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span className="hidden md:inline">{t('header.backToHome')}</span>
                </button>
            )}
            <h2 className="text-3xl font-bold text-white text-center">
                {t('directory.title')}
            </h2>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4 text-start rtl:text-right">
            <GlassCard className="p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center justify-between">{t('directory.filters')}<button onClick={() => setFilters({ category: 'all', rating: 0 })} className="text-xs text-secondary hover:text-secondary/80">{t('directory.reset')}</button></h3>
              <div className="mb-6">
                <label className="block text-white/80 text-sm mb-2">{t('directory.category')}</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="w-full px-4 py-3 rounded-xl backdrop-blur-xl bg-white/10 border border-white/20 text-white outline-none appearance-none bg-no-repeat bg-right-4" style={{backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'left 0.75rem center', backgroundSize: '1.5em 1.5em'}}>
                  <option value="all" className="bg-dark-bg">{t('directory.allCategories')}</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id} className="bg-dark-bg">
                      {t(category.nameKey)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/80 text-sm mb-2 block">{t('directory.minimumRating')}</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button key={rating} onClick={() => setFilters({ ...filters, rating })} className={`flex-1 aspect-square rounded-xl flex items-center justify-center transition-all duration-200 ${filters.rating >= rating ? 'bg-gradient-to-br from-accent to-primary' : 'backdrop-blur-xl bg-white/10 hover:bg-white/20'}`}>
                      <Star className={`w-5 h-5 ${filters.rating >= rating ? 'text-white fill-white' : 'text-white/50'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-white/80">{filteredBusinesses.length} {t('directory.businessesFound')}</p>
              <div className="flex items-center gap-2 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-1">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-primary' : 'hover:bg-white/10'}`}><Grid3x3 className="w-5 h-5 text-white" /></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-primary' : 'hover:bg-white/10'}`}><List className="w-5 h-5 text-white" /></button>
              </div>
            </div>
            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 gap-6' : 'space-y-4'}>
              {filteredBusinesses.map((business) => (<BusinessCard key={business.id} business={business} viewMode={viewMode} />))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};