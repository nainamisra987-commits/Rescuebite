'use client';

import React from 'react';
import { DonationListing, DonationStatus } from '@/types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Truck, 
  MapPin, 
  Utensils, 
  UserCheck, 
  Phone, 
  ShieldCheck, 
  ArrowRight,
  RefreshCw,
  Building
} from 'lucide-react';

interface StatusTrackerProps {
  donations: DonationListing[];
  selectedDonation: DonationListing | undefined;
  onSelectDonation: (id: string) => void;
  onAdvanceStatus: (donationId: string) => void;
  onResetStatus?: (donationId: string) => void;
}

export const StatusTracker: React.FC<StatusTrackerProps> = ({
  donations,
  selectedDonation,
  onSelectDonation,
  onAdvanceStatus,
}) => {
  if (!selectedDonation) {
    return (
      <section id="tracker" className="py-14 bg-[#f4f3ec]/50 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <p className="text-stone-500 text-sm">Please select a donation to view its live status tracker.</p>
        </div>
      </section>
    );
  }

  const steps: { key: DonationStatus; title: string; desc: string }[] = [
    {
      key: 'posted',
      title: '1. Posted',
      desc: 'Donor logged surplus food & safe consumption window',
    },
    {
      key: 'claimed',
      title: '2. Claimed',
      desc: 'Partner NGO matched & volunteer rider dispatched',
    },
    {
      key: 'picked_up',
      title: '3. Picked Up',
      desc: 'Food inspected, packed in thermal box & in transit',
    },
    {
      key: 'delivered',
      title: '4. Delivered',
      desc: 'Received at partner shelter; meals distributed',
    },
  ];

  const statusOrder: Record<DonationStatus, number> = {
    posted: 1,
    claimed: 2,
    picked_up: 3,
    delivered: 4,
  };

  const currentStepNumber = statusOrder[selectedDonation.status];

  const getNextStatusLabel = (current: DonationStatus): string | null => {
    switch (current) {
      case 'posted':
        return 'Simulate NGO Claim (Step 2)';
      case 'picked_up':
        return 'Confirm Delivery at Shelter (Step 4)';
      case 'claimed':
        return 'Verify Pickup from Kitchen (Step 3)';
      case 'delivered':
        return null;
    }
  };

  const nextLabel = getNextStatusLabel(selectedDonation.status);

  return (
    <section id="tracker" className="py-14 bg-[#f4f3ec]/50 border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100/80 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-2 border border-emerald-200">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Real-Time Chain of Custody</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Donation Lifecycle & Status Tracker
            </h2>
            <p className="text-stone-600 text-sm mt-1">
              End-to-end audit trail monitoring rapid collection and distribution before food spoilage.
            </p>
          </div>

          {/* Quick Donation Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-stone-500">Tracking:</span>
            <select
              value={selectedDonation.id}
              onChange={(e) => onSelectDonation(e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 shadow-2xs focus:outline-none max-w-xs truncate"
            >
              {donations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.id} • {d.foodTitle.slice(0, 30)}... [{d.status.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Donation Banner */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  Batch #{selectedDonation.id}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {selectedDonation.quantityKg} kg (~{selectedDonation.estimatedMeals} meals)
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 mt-1">
                {selectedDonation.foodTitle}
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                From: {selectedDonation.donorName} • {selectedDonation.donorLocation}
              </p>
            </div>

            {/* Interactive Simulation Button for Judges */}
            <div className="flex items-center gap-3">
              {nextLabel ? (
                <button
                  onClick={() => onAdvanceStatus(selectedDonation.id)}
                  className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm transition-all active:scale-[0.98]"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{nextLabel}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Delivery Complete & Verified</span>
                </div>
              )}
            </div>
          </div>

          {/* 4-Step Stepper Bar */}
          <div className="py-2">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
              {steps.map((step, idx) => {
                const stepNum = idx + 1;
                const isCompleted = currentStepNumber > stepNum;
                const isCurrent = currentStepNumber === stepNum;

                return (
                  <div key={step.key} className="flex flex-col relative space-y-2">
                    {/* Circle & Connection Line */}
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-700 text-white ring-4 ring-emerald-100'
                            : isCurrent
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        ) : (
                          stepNum
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <span className={`text-xs font-bold block ${
                          isCurrent ? 'text-amber-800' : isCompleted ? 'text-emerald-900' : 'text-stone-400'
                        }`}>
                          {step.title}
                        </span>
                        <span className="text-[11px] text-stone-500 line-clamp-1">
                          {isCurrent ? 'In progress' : isCompleted ? 'Completed' : 'Upcoming'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-stone-500 leading-normal pl-12 pr-2">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Verification Ledger */}
          <div className="pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Donor & Safe Window */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                1. Pickup & Food Safety
              </span>
              <div className="space-y-1 text-stone-700">
                <p><strong>Prepared:</strong> {selectedDonation.preparedTime}</p>
                <p><strong>Safe Until:</strong> {selectedDonation.pickupDeadline}</p>
                <p><strong>Storage:</strong> {selectedDonation.storageNotes}</p>
              </div>
            </div>

            {/* NGO & Volunteer Assigned */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                2. Assigned NGO & Volunteer
              </span>
              <div className="space-y-1 text-stone-700">
                <p>
                  <strong>NGO Unit:</strong>{' '}
                  {selectedDonation.assignedNgoName || 'Pending match assignment'}
                </p>
                <p>
                  <strong>Rider:</strong>{' '}
                  {selectedDonation.volunteerName || 'Volunteer on standby'}
                </p>
                <p>
                  <strong>Contact:</strong>{' '}
                  {selectedDonation.volunteerPhone || '+91 98XXX XXXXX (Protected)'}
                </p>
              </div>
            </div>

            {/* Destination & Outcome */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                3. Final Destination Shelter
              </span>
              <div className="space-y-1 text-stone-700">
                <p>
                  <strong>Beneficiary:</strong>{' '}
                  {selectedDonation.deliveryDestination || 'Community Shelter / Night Home'}
                </p>
                <p>
                  <strong>Delivery Verification:</strong>{' '}
                  {selectedDonation.status === 'delivered' ? 'Confirmed by Caretaker' : 'Pending handover'}
                </p>
                <p className="text-emerald-700 font-semibold">
                  Zero Food Waste Mission Target Met
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
