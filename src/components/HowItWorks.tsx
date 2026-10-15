'use client';

import React from 'react';
import { 
  Clock, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  Truck, 
  Building2, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-16 bg-[#fbfbf8] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider border border-emerald-200">
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-700" />
            <span>The RescueBite Protocol</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            How RescueBite Works Under Strict Time Windows
          </h2>
          <p className="text-stone-600 text-sm leading-relaxed">
            Standard food recovery networks fail because cooked food has a strict 3-to-4-hour safety window. Here is how RescueBite solves the rapid dispatch bottleneck.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-100">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900">
                1-Minute Surplus Listing
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Banquet managers, mess captains, or chefs enter remaining meal volume, container types, and cooked timestamp without tedious paperwork.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Zero-friction intake</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-100">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Smart Proximity Matching
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Instead of broadcasting blindly to entire cities, the algorithm isolates the closest 3 verified NGOs with available vehicle payload capacity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sub-20 min arrival target</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-100">
                03
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Insulated Thermal Pickup
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Volunteer riders or NGO vans equipped with insulated food-grade containers collect the batches directly from service docks or mess gates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              <span>Food hygiene safeguarded</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm border border-emerald-100">
                04
              </div>
              <h3 className="text-base font-bold text-stone-900">
                Dignified Distribution
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Meals are served hot to pre-mapped beneficiaries: children’s shelter homes, night shelters, construction worker camps, and destitute families.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Full chain of custody</span>
            </div>
          </div>

        </div>

        {/* Food Safety & Guidelines Banner */}
        <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h4 className="font-bold text-stone-900 text-sm">
              Food Safety & Hygiene Protocol (Aligned with FSSAI Surplus Food Guidelines)
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600 pt-1">
            <div>
              <strong className="text-stone-800 block mb-0.5">The 4-Hour Rule:</strong>
              Cooked hot food must be collected and consumed within 4 hours of preparation unless maintained above 60°C.
            </div>
            <div>
              <strong className="text-stone-800 block mb-0.5">Container Integrity:</strong>
              Surplus must be stored in stainless steel or clean food-grade, covered vessels away from direct sunlight.
            </div>
            <div>
              <strong className="text-stone-800 block mb-0.5">Sensory Inspection:</strong>
              Volunteer captains conduct a quick aroma, temperature, and visual inspection before loading onto vehicles.
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
