import React from 'react';
import { deals } from '../constants';
import { Clock, Tag } from './icons';
import { useTranslations } from '../hooks/useTranslations';

export const DealsMarketplace: React.FC = () => {
  const { t } = useTranslations();

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse animation-delay-3000" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('deals.title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <div key={deal.id} className="relative group backdrop-blur-xl bg-gradient-to-br from-accent/10 to-primary/10 border border-white/10 rounded-2xl p-6 hover:border-accent/50 hover:shadow-glow-accent transition-all duration-300 overflow-hidden text-start">
              <div className="absolute top-0 end-0 w-24 h-24">
                <div className="absolute top-0 end-0 w-full h-full bg-gradient-to-br from-accent to-primary transform rtl:-rotate-45 ltr:rotate-45 rtl:-translate-x-8 ltr:translate-x-8 -translate-y-8"></div>
                <div className="absolute top-4 end-4 text-white font-bold text-lg transform rtl:-rotate-12 ltr:rotate-12">-{deal.discount}%</div>
              </div>
              <div className="w-16 h-16 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center mb-4">
                <img src={deal.businessLogo} alt="Business Logo" className="w-12 h-12 rounded-full" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{deal.title}</h3>
              <p className="text-white/70 text-sm mb-4">{deal.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-medium">{t('deals.expires')}: {deal.expiresIn}</span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/60 mb-2">
                  <span>{t('deals.claimed')}</span>
                  <span>{deal.claimed}/{deal.total}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500" style={{ width: `${(deal.claimed / deal.total) * 100}%` }} />
                </div>
              </div>
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-accent to-primary text-white font-semibold hover:shadow-glow-accent transition-all duration-200 flex items-center justify-center gap-2">
                <Tag className="w-4 h-4" />
                {t('deals.claimNow')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};