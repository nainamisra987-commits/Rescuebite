'use client';

import React from 'react';
import { Utensils, Award, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Rescue<span className="text-emerald-400">Bite</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                ZERO WASTE
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Empowering wedding caterers, hostel messes, restaurants, and canteens to safely redistribute wholesome surplus food to nearby NGOs and shelters before expiry.
            </p>
            <div className="pt-2 flex items-center gap-2 text-stone-400 text-xs">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Dedicated to rapid urban hunger relief and zero food waste</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Platform Modules
            </p>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Impact Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('listings')} className="hover:text-emerald-400 transition-colors">
                  Active Food Marketplace
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate-form')} className="hover:text-emerald-400 transition-colors">
                  Food Surplus Intake Form
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('recommendations')} className="hover:text-emerald-400 transition-colors">
                  Heuristic NGO Matcher
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracker')} className="hover:text-emerald-400 transition-colors">
                  Chain of Custody Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Tech */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-stone-200">
              Prototype Specifications
            </p>
            <ul className="space-y-1 text-stone-400 text-[11px] leading-relaxed">
              <li>• Built with Next.js 16 (App Router)</li>
              <li>• TypeScript & Tailwind CSS</li>
              <li>• Heuristic Proximity Routing</li>
              <li>• AI Vision Food Analysis</li>
              <li>• FSSAI-aligned Safe Time Tracking</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500">
          <p className="text-[11px]">
            © 2026 RescueBite. Surplus Food Redistribution Platform.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 text-stone-400 hover:text-white transition-colors text-xs font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
