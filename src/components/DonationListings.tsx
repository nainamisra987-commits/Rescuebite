'use client';

import React, { useState } from 'react';
import { DonationListing, DonationStatus } from '@/types';
import { 
  Search, 
  Filter, 
  Clock, 
  MapPin, 
  Utensils, 
  AlertTriangle, 
  CheckCircle, 
  Truck, 
  Building, 
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DonationListingsProps {
  donations: DonationListing[];
  selectedDonationId: string;
  onSelectDonation: (id: string) => void;
  onNavigateToForm: () => void;
}

export const DonationListings: React.FC<DonationListingsProps> = ({
  donations,
  selectedDonationId,
  onSelectDonation,
  onNavigateToForm,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'urgent' | 'posted' | 'claimed' | 'delivered'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredDonations = donations.filter((item) => {
    // Search filter
    const matchesSearch =
      item.foodTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.donorLocation.toLowerCase().includes(searchQuery.toLowerCase());

    // Status / Urgency filter
    let matchesStatus = true;
    if (selectedFilter === 'urgent') {
      matchesStatus = item.urgencyLevel === 'urgent' && item.status !== 'delivered';
    } else if (selectedFilter === 'posted') {
      matchesStatus = item.status === 'posted';
    } else if (selectedFilter === 'claimed') {
      matchesStatus = item.status === 'claimed' || item.status === 'picked_up';
    } else if (selectedFilter === 'delivered') {
      matchesStatus = item.status === 'delivered';
    }

    // Category filter
    let matchesCategory = true;
    if (selectedCategory !== 'all') {
      matchesCategory = item.category === selectedCategory;
    }

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: DonationStatus) => {
    switch (status) {
      case 'posted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            Open for Claim
          </span>
        );
      case 'claimed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-200">
            <Truck className="w-3.5 h-3.5 text-blue-700" />
            Claimed by NGO
          </span>
        );
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
            <Truck className="w-3.5 h-3.5 text-purple-700" />
            In Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
            Delivered
          </span>
        );
    }
  };

  const getUrgencyBadge = (urgency: 'urgent' | 'moderate' | 'flexible', hours: number) => {
    if (urgency === 'urgent') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
          <Clock className="w-3 h-3 text-red-600" />
          <span>{hours}h left (Critical)</span>
        </span>
      );
    }
    if (urgency === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          <span>{hours}h remaining</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-stone-100 text-stone-700 border border-stone-200">
        <Clock className="w-3 h-3 text-stone-500" />
        <span>{hours}h remaining</span>
      </span>
    );
  };

  return (
    <section id="listings" className="py-14 bg-[#fbfbf8] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100/80 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
              <Utensils className="w-3.5 h-3.5 text-emerald-700" />
              <span>Live Rescue Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Active Food Surplus Donations
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              Select any listing to test heuristic NGO recommendation matching or inspect the live logistics timeline.
            </p>
          </div>

          <button
            onClick={onNavigateToForm}
            className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-all"
          >
            <span>+ Post a New Listing</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-3 rounded-2xl border border-stone-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by food item, donor name, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === 'all'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All ({donations.length})
            </button>
            <button
              onClick={() => setSelectedFilter('urgent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === 'urgent'
                  ? 'bg-red-700 text-white font-semibold'
                  : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
              }`}
            >
              Urgent (&lt;2h)
            </button>
            <button
              onClick={() => setSelectedFilter('posted')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === 'posted'
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Open to Claim
            </button>
            <button
              onClick={() => setSelectedFilter('claimed')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === 'claimed'
                  ? 'bg-blue-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              In Transit
            </button>
            <button
              onClick={() => setSelectedFilter('delivered')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                selectedFilter === 'delivered'
                  ? 'bg-emerald-700 text-white font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Delivered
            </button>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1.5 px-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-medium text-stone-700 focus:outline-none"
            >
              <option value="all">All Donor Types</option>
              <option value="Wedding Caterer">Wedding Caterer</option>
              <option value="Hostel Mess">Hostel Mess</option>
              <option value="Corporate Canteen">Corporate Canteen</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Bakery">Bakery</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center space-y-3">
            <Utensils className="w-8 h-8 text-stone-400 mx-auto" />
            <h3 className="font-bold text-stone-700 text-base">No matching food donations found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search query or reset the filters to see all available surplus food listings.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
                setSelectedCategory('all');
              }}
              className="text-xs font-semibold text-emerald-700 underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDonations.map((item) => {
              const isSelected = item.id === selectedDonationId;

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectDonation(item.id)}
                  className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20 shadow-md bg-emerald-50/20'
                      : 'border-stone-200/90 hover:border-stone-400 hover:shadow-sm'
                  }`}
                >
                  {/* Top Status & Urgency */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {getStatusBadge(item.status)}
                      {getUrgencyBadge(item.urgencyLevel, item.hoursRemaining)}
                    </div>

                    {/* Food Title & Optional Photo */}
                    <div className="flex items-start gap-3">
                      {item.photoUrl && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-stone-200 bg-stone-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.photoUrl} alt={item.foodTitle} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {item.foodTitle}
                        </h3>
                      </div>
                    </div>

                    {/* Donor Details */}
                    <div className="mt-2 text-xs text-stone-500 space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-stone-700">
                        <Building className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{item.donorName}</span>
                        <span className="text-stone-300">•</span>
                        <span className="text-[11px] text-stone-500">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-stone-600">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span className="truncate">{item.donorLocation}</span>
                      </div>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                      <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                          Quantity
                        </span>
                        <span className="font-bold text-stone-900">
                          {item.quantityKg} kg
                        </span>
                        <span className="text-stone-500 text-[11px] ml-1">
                          (~{item.estimatedMeals} meals)
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                        <span className="text-[10px] text-stone-400 font-semibold uppercase block">
                          Deadline
                        </span>
                        <span className="font-bold text-stone-900">
                          {item.pickupDeadline}
                        </span>
                      </div>
                    </div>

                    {/* Dietary & Storage Note */}
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                        {item.dietaryType}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-600 font-medium truncate max-w-[180px]">
                        {item.storageNotes}
                      </span>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-stone-400">
                      ID: {item.id}
                    </span>
                    <button
                      className={`inline-flex items-center gap-1 font-semibold text-xs px-2.5 py-1 rounded-lg transition-colors ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      <span>{isSelected ? 'Currently Selected' : 'Match NGOs & Track'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Selection Indicator Ribbon */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 block ring-4 ring-emerald-200"></span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
