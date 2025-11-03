'use client';

import React from 'react';

export default function BeautifulDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C2BD9] via-[#1e1b4b] to-[#00D9FF]">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl font-bold text-white mb-6">
            🎨 Beautiful UI
          </h1>
          <p className="text-3xl text-teal-200 mb-4">
            Glassmorphism Design Integrated
          </p>
          <p className="text-xl text-white/80">
            Digital Democracy Iraq - Phase 1 Complete
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card p-8 rounded-3xl text-center transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-white mb-2">Glassmorphism</h3>
            <p className="text-teal-200">Beautiful frosted glass effects</p>
          </div>

          <div className="glass-card p-8 rounded-3xl text-center transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🌈</div>
            <h3 className="text-2xl font-bold text-white mb-2">48+ Components</h3>
            <p className="text-teal-200">Fully integrated UI library</p>
          </div>

          <div className="glass-card p-8 rounded-3xl text-center transform hover:scale-105 transition-transform">
            <div className="text-5xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-white mb-2">3 Languages</h3>
            <p className="text-teal-200">EN • AR • KU support</p>
          </div>
        </div>

        {/* Features List */}
        <div className="glass-card max-w-4xl mx-auto p-12 rounded-3xl">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            ✅ Integration Complete
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <h4 className="text-xl font-bold text-white">CSS Merged</h4>
                  <p className="text-teal-200">Glassmorphism styles active</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <h4 className="text-xl font-bold text-white">Responsive</h4>
                  <p className="text-teal-200">Mobile, tablet, desktop ready</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🎭</span>
                <div>
                  <h4 className="text-xl font-bold text-white">Animations</h4>
                  <p className="text-teal-200">Smooth transitions everywhere</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📱</span>
                <div>
                  <h4 className="text-xl font-bold text-white">Social Features</h4>
                  <p className="text-teal-200">Posts, reels, stories UI</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🗳️</span>
                <div>
                  <h4 className="text-xl font-bold text-white">Elections</h4>
                  <p className="text-teal-200">Countdown, candidates, voting</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <div>
                  <h4 className="text-xl font-bold text-white">Safe Backups</h4>
                  <p className="text-teal-200">3 complete copies stored</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20 text-center">
            <p className="text-2xl font-bold text-white mb-4">
              🚀 Phase 1: Frontend Complete
            </p>
            <p className="text-lg text-teal-200">
              Next: Connect to backend API
            </p>
          </div>
        </div>

        {/* Component Showcase */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">📦 Components</h3>
            <div className="space-y-2 text-teal-200">
              <div className="flex justify-between">
                <span>• Header & Navigation</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between">
                <span>• Feed & Posts</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between">
                <span>• Reels Player</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between">
                <span>• Stories UI</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between">
                <span>• Election Countdown</span>
                <span>✓</span>
              </div>
              <div className="flex justify-between">
                <span>• Candidate Cards</span>
                <span>✓</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">🛠️ Tech Stack</h3>
            <div className="space-y-2 text-teal-200">
              <div>• Next.js 15.0.4</div>
              <div>• React 19</div>
              <div>• Tailwind CSS 4 Alpha</div>
              <div>• TypeScript 5</div>
              <div>• Framer Motion</div>
              <div>• Lucide Icons</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <div className="glass-card inline-block px-8 py-4 rounded-full">
            <p className="text-white/80">
              Built with ❤️ for Iraq's Digital Democracy
            </p>
          </div>
          <p className="text-white/40 mt-4 text-sm">
            Next.js 15 • React 19 • Tailwind CSS 4
          </p>
        </div>
      </div>
    </div>
  );
}
