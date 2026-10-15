'use client';

import React from 'react';
import { Utensils, HeartHandshake, ShieldAlert, Sparkles, PlusCircle } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#fbfbf8]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      {/* Top Platform Announcement Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-emerald-700/80 text-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide uppercase">
              Live Network
            </span>
            <span>RescueBite • Surplus Food Rescue & Rapid NGO Distribution Platform</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-emerald-200 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>AI Vision Food Analysis & Heuristic Dispatch Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition-colors">
              <Utensils className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-stone-900">
                  Rescue<span className="text-emerald-700">Bite</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Surplus Food Rescue Network</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-600">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'dashboard'
                  ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              Impact Stats
            </button>
            <button
              onClick={() => onNavigate('listings')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'listings'
                  ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              Active Listings
            </button>
            <button
              onClick={() => onNavigate('recommendations')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'recommendations'
                  ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              NGO Matcher
            </button>
            <button
              onClick={() => onNavigate('tracker')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'tracker'
                  ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              Live Tracker
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'how-it-works'
                  ? 'text-emerald-800 bg-emerald-50/80 font-semibold'
                  : 'hover:text-stone-900 hover:bg-stone-100/70'
              }`}
            >
              How It Works
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('donate-form')}
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm hover:shadow transition-all active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4 text-emerald-200" />
              <span>List Food Surplus</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
