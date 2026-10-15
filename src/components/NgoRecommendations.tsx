'use client';

import React from 'react';
import { DonationListing, NgoProfile } from '@/types';
import { getRecommendedNgosForDonation } from '@/data/mockData';
import { 
  Sparkles, 
  MapPin, 
  Clock, 
  Scale, 
  Truck, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  User, 
  Info,
  ArrowRight,
  Send
} from 'lucide-react';

interface NgoRecommendationsProps {
  donations: DonationListing[];
  selectedDonation: DonationListing | undefined;
  onSelectDonation: (id: string) => void;
  onAssignNgo: (donationId: string, ngo: NgoProfile) => void;
  onNavigateToTracker: () => void;
}

export const NgoRecommendations: React.FC<NgoRecommendationsProps> = ({
  donations,
  selectedDonation,
  onSelectDonation,
  onAssignNgo,
  onNavigateToTracker,
}) => {
  if (!selectedDonation) {
    return (
      <section id="recommendations" className="py-14 bg-[#fbfbf8] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <p className="text-stone-500 text-sm">Please select a food donation from the listings to view matching NGOs.</p>
        </div>
      </section>
    );
  }

  const recommendedNgos = getRecommendedNgosForDonation(selectedDonation);

  return (
    <section id="recommendations" className="py-14 bg-[#fbfbf8] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100/80 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>Heuristic Matching Engine (Simulation)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Top 3 Recommended Rescue NGOs
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Ranked dynamically by proximity, vehicle payload capacity, and pickup deadline feasibility.
            </p>
          </div>

          {/* Donation Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-stone-500">Matching for:</span>
            <select
              value={selectedDonation.id}
              onChange={(e) => onSelectDonation(e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 shadow-2xs focus:outline-none max-w-xs truncate"
            >
              {donations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} • {d.foodTitle.slice(0, 32)}... ({d.quantityKg}kg)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Donation Context Card */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-stone-900">{selectedDonation.foodTitle}</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                {selectedDonation.quantityKg} kg (~{selectedDonation.estimatedMeals} meals)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
              <span><strong>Donor:</strong> {selectedDonation.donorName}</span>
              <span>•</span>
              <span><strong>Location:</strong> {selectedDonation.donorLocation}</span>
              <span>•</span>
              <span><strong>Safe Window:</strong> {selectedDonation.pickupDeadline} ({selectedDonation.hoursRemaining}h left)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Current Status: <strong className="text-stone-800 uppercase">{selectedDonation.status.replace('_', ' ')}</strong></span>
          </div>
        </div>

        {/* Top 3 NGOs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedNgos.map((ngo, index) => {
            const isAssigned = selectedDonation.assignedNgoId === ngo.id;

            return (
              <div
                key={ngo.id}
                className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between relative shadow-sm hover:shadow-md ${
                  isAssigned
                    ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/20'
                    : 'border-stone-200/90 hover:border-stone-300'
                }`}
              >
                {/* Ranking Ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {ngo.matchScore}% Compatibility
                    </span>
                  </div>

                  {ngo.verified && (
                    <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Verified NGO
                    </span>
                  )}
                </div>

                {/* NGO Title & Focus */}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 leading-snug">
                    {ngo.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5 font-medium">{ngo.chapter}</p>

                  {/* Quantitative Stats Row */}
                  <div className="grid grid-cols-3 gap-2 my-4 text-center">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mx-auto mb-1" />
                      <span className="block font-bold text-stone-900 text-xs">{ngo.distanceKm} km</span>
                      <span className="text-[10px] text-stone-500">Distance</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <Clock className="w-3.5 h-3.5 text-stone-400 mx-auto mb-1" />
                      <span className="block font-bold text-stone-900 text-xs">~{ngo.estimatedMinutes} min</span>
                      <span className="text-[10px] text-stone-500">Est. Pickup</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <Scale className="w-3.5 h-3.5 text-stone-400 mx-auto mb-1" />
                      <span className="block font-bold text-stone-900 text-xs">{ngo.capacityKg} kg</span>
                      <span className="text-[10px] text-stone-500">Max Capacity</span>
                    </div>
                  </div>

                  {/* Why Recommended Callout */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 mb-4 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                      <Info className="w-3 h-3 text-emerald-700" />
                      Why Recommended:
                    </span>
                    <p className="text-stone-700 leading-relaxed font-medium">
                      {ngo.recommendationReason}
                    </p>
                  </div>

                  {/* Transit & Contact Details */}
                  <div className="space-y-1.5 text-xs text-stone-600 mb-5">
                    <div className="flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span><strong>Transit Mode:</strong> {ngo.transitType}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-400" />
                      <span><strong>Coordinator:</strong> {ngo.contactPerson}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      <span><strong>Dispatch Hotline:</strong> {ngo.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Dispatch / Claim Button */}
                <div className="pt-2">
                  {isAssigned ? (
                    <button
                      onClick={onNavigateToTracker}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center justify-center gap-2 hover:bg-emerald-200 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span>Assigned • Open Live Tracker</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAssignNgo(selectedDonation.id, ngo)}
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Simulate Claim & Dispatch</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Algorithm Disclaimer / Notice */}
        <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-500 flex items-center justify-between flex-wrap gap-2">
          <span>
            <strong>Smart Dispatch:</strong> Recommendations combine proximity routing with vehicle thermal payload capacity for immediate dispatch.
          </span>
          <span className="font-semibold text-stone-700">RescueBite Dispatch Engine</span>
        </div>

      </div>
    </section>
  );
};
