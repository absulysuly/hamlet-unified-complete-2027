import React, { useState } from 'react';
import type { Story } from '../types';
import { stories } from '../constants';
import { Briefcase, Users, ShieldCheck, Plus } from './icons';
import { StoryViewer } from './StoryViewer';
import { useTranslations } from '../hooks/useTranslations';

export const CommunityStories: React.FC = () => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const { t } = useTranslations();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {t('stories.communityTitle')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stories.map((story) => (
            <div key={story.id} onClick={() => setActiveStory(story)} className="cursor-pointer group">
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-transparent group-hover:border-primary transition-colors">
                <img src={story.thumbnail} alt={story.userName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-3 start-3 end-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white">
                      <img src={story.avatar} alt={story.userName} className="w-full h-full rounded-full" />
                    </div>
                    <span className="text-white text-sm font-medium truncate">{story.userName}</span>
                  </div>
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${story.type === 'business' ? 'bg-primary/80' : 'bg-secondary/80'}`}>
                    {story.type === 'business' ? <Briefcase className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                    <span>{t(`stories.${story.type}`)}</span>
                  </div>
                </div>
                {story.aiVerified && (
                  <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-dark-bg" />
                  </div>
                )}
                {story.isLive && (
                  <div className="absolute top-3 start-3 px-2 py-1 rounded-full bg-red-500 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span className="text-white text-xs font-bold">LIVE</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="aspect-[9/16] rounded-2xl backdrop-blur-xl bg-white/5 border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-3 hover:bg-white/10 hover:border-primary/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <span className="text-white/80 text-sm font-medium">{t('stories.addYours')}</span>
          </div>
        </div>
      </div>
      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </section>
  );
};