'use client';

import React from 'react';
import { 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Building2, 
  HeartHandshake, 
  AlertCircle,
  Truck,
  Sparkles
} from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
  onQuickDonate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, onQuickDonate }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-stone-200/80 bg-gradient-to-b from-[#fbfbf8] via-[#f7f6f0] to-[#fbfbf8]">
      {/* Subtle organic background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Verified Food Rescue Network</span>
              <span className="text-stone-400">•</span>
              <span className="text-stone-600">Zero Food Waste Initiative</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
              Connecting <span className="text-emerald-700 underline decoration-emerald-300 decoration-wavy decoration-2">Surplus Food</span> With Those in Need Before It Spoils.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl">
              Every day, wedding banquets, campus hostel messes, and restaurants prepare surplus food that is perfectly wholesome but discarded due to lack of immediate logistics. RescueBite bridges the critical 2-4 hour window by matching donors with nearby verified NGOs and volunteer riders in minutes.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('donate-form')}
                className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-3 rounded-xl font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                <span>Post Food Donation</span>
                <ArrowRight className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                onClick={() => onNavigate('listings')}
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-5 py-3 rounded-xl font-medium text-sm transition-all hover:border-stone-400"
              >
                <span>View Active Donations</span>
              </button>

              <button
                onClick={() => onNavigate('recommendations')}
                className="inline-flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 px-4 py-3 rounded-xl font-medium text-sm transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Test NGO Matcher</span>
              </button>
            </div>

            {/* Target Donor Groups */}
            <div className="pt-4 border-t border-stone-200/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">
                Tailored for High-Volume Surplus Generators
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-stone-200/70 text-xs font-medium text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Wedding Caterers</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-stone-200/70 text-xs font-medium text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Hostel Messes</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-stone-200/70 text-xs font-medium text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Corporate Canteens</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-white/70 border border-stone-200/70 text-xs font-medium text-stone-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Restaurants & Buffets</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xl shadow-stone-200/40 p-6 space-y-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Live Rescue In Progress (Demo)
                  </span>
                </div>
                <span className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                  Urgent: 1.2 hrs remaining
                </span>
              </div>

              {/* Sample Listing Snippet */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      Hostel Mess Lunch: Dal Tadka, Seasonal Sabzi & Rice
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      University Campus Boys Hostel Mess #3 • North Block Kitchen
                    </p>
                  </div>
                  <span className="shrink-0 bg-emerald-50 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-lg border border-emerald-200">
                    22 kg (55 meals)
                  </span>
                </div>

                {/* Progress Visual */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/70 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      NGO Matched: Robin Hood Army
                    </span>
                    <span className="text-emerald-700 font-bold">Volunteer Dispatched</span>
                  </div>
                  
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full w-2/3 rounded-full transition-all duration-500"></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Pickup: 14 mins away</span>
                    <span>Destination: Navjeevan Slum Centre</span>
                  </div>
                </div>

                {/* Micro Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50/80 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Storage Verification</span>
                    <span className="text-stone-700 font-medium">Covered sanitary containers</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-stone-50/80 border border-stone-200/60">
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Transit Vehicle</span>
                    <span className="text-stone-700 font-medium">EV Cargo Bike (Thermal Box)</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Callout */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Temperature & freshness checked
                </span>
                <button
                  onClick={() => onNavigate('tracker')}
                  className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open Full Tracker</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
