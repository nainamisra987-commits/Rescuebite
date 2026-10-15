'use client';

import React from 'react';
import { ImpactMetrics } from '@/types';
import { 
  Scale, 
  UtensilsCrossed, 
  Activity, 
  CheckCircle2, 
  Leaf, 
  Users2,
  Info
} from 'lucide-react';

interface StatsDashboardProps {
  metrics: ImpactMetrics;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ metrics }) => {
  return (
    <section id="dashboard" className="py-12 bg-[#f4f3ec]/60 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Disclaimer */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100/80 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
              <Activity className="w-3.5 h-3.5 text-emerald-700" />
              <span>Real-Time Network Statistics</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Community Food Rescue Dashboard
            </h2>
            <p className="text-stone-600 text-sm mt-1 max-w-xl">
              Simulated aggregate metrics representing meals prevented from landfill decomposition through rapid redistribution.
            </p>
          </div>

          <div className="text-xs text-stone-500 bg-white/80 backdrop-blur px-3 py-2 rounded-xl border border-stone-200 self-start sm:self-auto">
            <span>Last synchronized: </span>
            <span className="font-semibold text-stone-800">Just now (Simulated Live Feed)</span>
          </div>
        </div>

        {/* 4 Main Core Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Food Rescued */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Total Food Rescued
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {metrics.totalFoodRescuedKg.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-emerald-700">kg</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Equal to ~1.42 metric tons of edible surplus
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Weekly target: 2,000 kg</span>
              <span className="text-emerald-700 font-semibold">71% achieved</span>
            </div>
          </div>

          {/* Meals Served */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Estimated Meals Served
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {metrics.mealsServed.toLocaleString()}
                </span>
                <span className="text-sm font-semibold text-amber-700">plates</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Distributed across 12 partner night shelters & homes
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Avg. ~400g nutritious portion</span>
              <span className="text-emerald-700 font-semibold">+18% this month</span>
            </div>
          </div>

          {/* Active Donations */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Active Donations Now
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {metrics.activeDonationsCount}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Live Open
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                In transit or pending volunteer claim
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Avg. response time</span>
              <span className="text-stone-800 font-semibold">18 minutes</span>
            </div>
          </div>

          {/* Successful Deliveries */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Successful Deliveries
              </span>
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-stone-900">
                  {metrics.successfulDeliveriesCount}
                </span>
                <span className="text-sm font-semibold text-stone-600">runs</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                100% verified food-grade handovers
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>Zero reported spoilage</span>
              <span className="text-emerald-700 font-semibold">99.2% success</span>
            </div>
          </div>

        </div>

        {/* Secondary Impact & Distribution Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Carbon & Environmental Dividend */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Environmental Offset</span>
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                {metrics.co2DivertedKg.toLocaleString()} kg CO₂e Diverted
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                By preventing methane generation from decomposing organic waste in municipal landfills, RescueBite reduces the carbon footprint of institutional dining.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Equivalent to planting</span>
              <span className="font-bold text-stone-800">~128 trees</span>
            </div>
          </div>

          {/* Rescue Source Composition */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Surplus Source Distribution
              </span>
              <span className="text-xs text-stone-400">Verified Platform Analytics</span>
            </div>
            
            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Wedding Banquets & Caterers (High-Volume Batches)</span>
                  <span className="text-emerald-700">42% (596 kg)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-700 h-full rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Hostel & University Messes (Daily Predictable Surplus)</span>
                  <span className="text-emerald-600">28% (398 kg)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Corporate Cafeterias & Tech Parks (Portioned Buffets)</span>
                  <span className="text-emerald-500">18% (255 kg)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Bakeries & Restaurants (Artisan & Fast Surplus)</span>
                  <span className="text-amber-600">12% (171 kg)</span>
                </div>
                <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
