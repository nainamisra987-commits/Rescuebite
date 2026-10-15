'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { StatsDashboard } from '@/components/StatsDashboard';
import { DonationListings } from '@/components/DonationListings';
import { DonationForm } from '@/components/DonationForm';
import { NgoRecommendations } from '@/components/NgoRecommendations';
import { StatusTracker } from '@/components/StatusTracker';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';
import { INITIAL_DONATIONS, INITIAL_METRICS } from '@/data/mockData';
import { DonationListing, ImpactMetrics, NgoProfile, DonationStatus } from '@/types';

export default function Home() {
  const [donations, setDonations] = useState<DonationListing[]>(INITIAL_DONATIONS);
  const [metrics, setMetrics] = useState<ImpactMetrics>(INITIAL_METRICS);
  const [selectedDonationId, setSelectedDonationId] = useState<string>('DON-101');
  const [activeNavSection, setActiveNavSection] = useState<string>('hero');

  const selectedDonation = donations.find((d) => d.id === selectedDonationId) || donations[0];

  const handleNavigate = (sectionId: string) => {
    setActiveNavSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectDonation = (id: string) => {
    setSelectedDonationId(id);
  };

  const handleAddDonation = (newDonation: DonationListing) => {
    setDonations((prev) => [newDonation, ...prev]);
    setSelectedDonationId(newDonation.id);

    // Dynamically update dashboard demo metrics
    setMetrics((prev) => ({
      ...prev,
      totalFoodRescuedKg: prev.totalFoodRescuedKg + newDonation.quantityKg,
      mealsServed: prev.mealsServed + newDonation.estimatedMeals,
      activeDonationsCount: prev.activeDonationsCount + 1,
      co2DivertedKg: prev.co2DivertedKg + Math.round(newDonation.quantityKg * 2),
    }));

    // Smoothly scroll down to the recommendations engine
    setTimeout(() => {
      const recSection = document.getElementById('recommendations');
      if (recSection) {
        recSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleAssignNgo = (donationId: string, ngo: NgoProfile) => {
    setDonations((prev) =>
      prev.map((item) => {
        if (item.id === donationId) {
          return {
            ...item,
            status: 'claimed' as DonationStatus,
            assignedNgoId: ngo.id,
            assignedNgoName: ngo.name,
            claimedAt: 'Just now',
            volunteerName: `${ngo.contactPerson} (Volunteer Team)`,
            volunteerPhone: ngo.phone,
            deliveryDestination: 'Shelter Hub / Community Kitchen',
          };
        }
        return item;
      })
    );

    // Scroll to tracker
    setTimeout(() => {
      const trackerSection = document.getElementById('tracker');
      if (trackerSection) {
        trackerSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const handleAdvanceStatus = (donationId: string) => {
    setDonations((prev) =>
      prev.map((item) => {
        if (item.id === donationId) {
          let nextStatus: DonationStatus = item.status;
          let pickedUpAt = item.pickedUpAt;
          let deliveredAt = item.deliveredAt;

          if (item.status === 'posted') {
            nextStatus = 'claimed';
          } else if (item.status === 'claimed') {
            nextStatus = 'picked_up';
            pickedUpAt = 'Just now (Thermal Check Passed)';
          } else if (item.status === 'picked_up') {
            nextStatus = 'delivered';
            deliveredAt = 'Just now (Handed to Caretaker)';

            // Update successful delivery metrics
            setMetrics((m) => ({
              ...m,
              successfulDeliveriesCount: m.successfulDeliveriesCount + 1,
              activeDonationsCount: Math.max(0, m.activeDonationsCount - 1),
            }));
          }

          return {
            ...item,
            status: nextStatus,
            pickedUpAt,
            deliveredAt,
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Global Navigation */}
      <Navbar onNavigate={handleNavigate} activeSection={activeNavSection} />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. Landing Page / Hero Section */}
        <div id="hero">
          <HeroSection
            onNavigate={handleNavigate}
            onQuickDonate={() => handleNavigate('donate-form')}
          />
        </div>

        {/* 2. Impact Dashboard */}
        <StatsDashboard metrics={metrics} />

        {/* 3. Food Listings Section */}
        <DonationListings
          donations={donations}
          selectedDonationId={selectedDonationId}
          onSelectDonation={handleSelectDonation}
          onNavigateToForm={() => handleNavigate('donate-form')}
        />

        {/* 4. Donation Listing Intake Form */}
        <DonationForm onAddDonation={handleAddDonation} />

        {/* 5. NGO Recommendations Section */}
        <NgoRecommendations
          donations={donations}
          selectedDonation={selectedDonation}
          onSelectDonation={handleSelectDonation}
          onAssignNgo={handleAssignNgo}
          onNavigateToTracker={() => handleNavigate('tracker')}
        />

        {/* 6. Donation Status Tracker */}
        <StatusTracker
          donations={donations}
          selectedDonation={selectedDonation}
          onSelectDonation={handleSelectDonation}
          onAdvanceStatus={handleAdvanceStatus}
        />

        {/* How It Works & Safety Guidelines */}
        <HowItWorks />
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
