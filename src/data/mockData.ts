import { DonationListing, NgoProfile, ImpactMetrics } from '@/types';

export const INITIAL_METRICS: ImpactMetrics = {
  totalFoodRescuedKg: 1420,
  mealsServed: 3550,
  activeDonationsCount: 6,
  successfulDeliveriesCount: 89,
  co2DivertedKg: 2840,
  activeNgosCount: 14,
};

export const INITIAL_DONATIONS: DonationListing[] = [
  {
    id: 'DON-101',
    foodTitle: 'Surplus Shahi Paneer, Jeera Rice & Tandoori Roti',
    category: 'Wedding Caterer',
    donorName: 'Royal Grand Banquet & Caterers',
    donorLocation: 'Sector 62, Convention Hub (Gate 3)',
    quantityKg: 38,
    estimatedMeals: 95,
    preparedTime: 'Today, 2:30 PM',
    pickupDeadline: 'Today, 6:00 PM',
    urgencyLevel: 'urgent',
    hoursRemaining: 1.5,
    status: 'posted',
    foodType: 'Cooked Meals',
    dietaryType: 'Vegetarian',
    storageNotes: 'Packed in food-grade steel handis, kept covered in temperature-controlled holding area.',
  },
  {
    id: 'DON-102',
    foodTitle: 'Hostel Mess Lunch: Dal Tadka, Seasonal Sabzi & Rice',
    category: 'Hostel Mess',
    donorName: 'University Campus Boys Hostel Mess #3',
    donorLocation: 'University Campus, North Block Kitchen',
    quantityKg: 22,
    estimatedMeals: 55,
    preparedTime: 'Today, 1:15 PM',
    pickupDeadline: 'Today, 5:30 PM',
    urgencyLevel: 'urgent',
    hoursRemaining: 1.2,
    status: 'claimed',
    foodType: 'Cooked Meals',
    dietaryType: 'Vegetarian',
    storageNotes: 'Stored in sanitary aluminum containers; piping hot when packed.',
    assignedNgoId: 'NGO-01',
    assignedNgoName: 'Robin Hood Army (Campus Chapter)',
    claimedAt: '3:45 PM',
    volunteerName: 'Rohan Sharma',
    volunteerPhone: '+91 98765 43210',
    deliveryDestination: 'Navjeevan Slum Community Centre',
  },
  {
    id: 'DON-103',
    foodTitle: 'Executive Buffet Surplus: Pasta, Grilled Paneer & Rolls',
    category: 'Corporate Canteen',
    donorName: 'CyberCity Tech Park Canteen (Tower B)',
    donorLocation: 'Tech Park Floor 2, Cafeteria Bay 4',
    quantityKg: 18,
    estimatedMeals: 42,
    preparedTime: 'Today, 2:00 PM',
    pickupDeadline: 'Today, 7:00 PM',
    urgencyLevel: 'moderate',
    hoursRemaining: 2.8,
    status: 'picked_up',
    foodType: 'Cooked Meals',
    dietaryType: 'Vegetarian',
    storageNotes: 'Individually portioned food boxes with freshness labels applied.',
    assignedNgoId: 'NGO-02',
    assignedNgoName: 'Annapurna Seva Trust',
    claimedAt: '3:10 PM',
    pickedUpAt: '4:15 PM',
    volunteerName: 'Priya Verma',
    volunteerPhone: '+91 91234 56789',
    deliveryDestination: 'Asha Kiran Children Shelter, Sector 45',
  },
  {
    id: 'DON-104',
    foodTitle: 'Artisan Breads, Whole Wheat Buns & Tea Cakes',
    category: 'Bakery',
    donorName: 'The Crust & Crumb Bakehouse',
    donorLocation: 'Galleria Market, Shop #18',
    quantityKg: 14,
    estimatedMeals: 35,
    preparedTime: 'Today, 11:00 AM',
    pickupDeadline: 'Today, 9:30 PM',
    urgencyLevel: 'flexible',
    hoursRemaining: 5.5,
    status: 'delivered',
    foodType: 'Bakery & Bread',
    dietaryType: 'Vegetarian',
    storageNotes: 'Dry bakery goods in moisture-resistant kraft bags, 24h shelf life.',
    assignedNgoId: 'NGO-03',
    assignedNgoName: 'Rotary Community Food Bank',
    claimedAt: '1:00 PM',
    pickedUpAt: '2:15 PM',
    deliveredAt: '3:20 PM',
    volunteerName: 'Vikram Joshi',
    volunteerPhone: '+91 97890 12345',
    deliveryDestination: 'Prabhat Elderly Care Home, Civil Lines',
  },
  {
    id: 'DON-105',
    foodTitle: 'Restaurant Evening Surplus: Vegetable Biryani & Raita',
    category: 'Restaurant',
    donorName: 'Zaika Darbar Multi-Cuisine',
    donorLocation: 'Main Market Road, Near Metro Pillar 142',
    quantityKg: 28,
    estimatedMeals: 70,
    preparedTime: 'Today, 3:30 PM',
    pickupDeadline: 'Today, 7:30 PM',
    urgencyLevel: 'moderate',
    hoursRemaining: 3.2,
    status: 'posted',
    foodType: 'Cooked Meals',
    dietaryType: 'Vegetarian',
    storageNotes: 'Sealed insulated thermoware containers; raita stored in cold chiller container.',
  },
  {
    id: 'DON-106',
    foodTitle: 'Breakfast Excess: Poha, Upma & Boiled Eggs',
    category: 'Hostel Mess',
    donorName: 'Campus Central Girls Hostel Mess #1',
    donorLocation: 'Campus South Residential Complex',
    quantityKg: 16,
    estimatedMeals: 40,
    preparedTime: 'Today, 9:30 AM',
    pickupDeadline: 'Today, 1:30 PM',
    urgencyLevel: 'urgent',
    hoursRemaining: 0.8,
    status: 'delivered',
    foodType: 'Cooked Meals',
    dietaryType: 'Non-Vegetarian',
    storageNotes: 'Eggs packed separately from vegetarian items.',
    assignedNgoId: 'NGO-01',
    assignedNgoName: 'Robin Hood Army (Campus Chapter)',
    claimedAt: '10:00 AM',
    pickedUpAt: '10:45 AM',
    deliveredAt: '11:30 AM',
    volunteerName: 'Ananya Deshmukh',
    volunteerPhone: '+91 96543 21098',
    deliveryDestination: 'Rain Basera Night Shelter #4',
  },
];

export const MOCK_NGOS: NgoProfile[] = [
  {
    id: 'NGO-01',
    name: 'Robin Hood Army',
    chapter: 'Youth & Campus Chapter',
    distanceKm: 2.1,
    estimatedMinutes: 14,
    capacityKg: 50,
    servingsCapacity: 120,
    activeVolunteers: 8,
    matchScore: 98,
    recommendationReason:
      'Closest rescue unit (2.1 km). Equipped with thermal crates and has 3 active bike volunteers on standby ready within 15 minutes.',
    specialization: 'Urgent hot cooked meals & rapid neighborhood distribution',
    contactPerson: 'Siddharth Rao',
    phone: '+91 98111 22334',
    verified: true,
    transitType: 'EV Cargo Bike',
  },
  {
    id: 'NGO-02',
    name: 'Annapurna Seva Trust',
    chapter: 'Central Logistics Wing',
    distanceKm: 3.8,
    estimatedMinutes: 22,
    capacityKg: 100,
    servingsCapacity: 250,
    activeVolunteers: 5,
    matchScore: 92,
    recommendationReason:
      'High-capacity insulated van available. Best suited for bulk banquet batches (>30 kg) with direct ties to two shelter homes.',
    specialization: 'Large catering and banquet surplus collection',
    contactPerson: 'Meenakshi Iyer',
    phone: '+91 98222 33445',
    verified: true,
    transitType: 'Insulated Van',
  },
  {
    id: 'NGO-03',
    name: 'Roti Bank & Food Relief Foundation',
    chapter: 'City East Distribution',
    distanceKm: 4.6,
    estimatedMinutes: 28,
    capacityKg: 65,
    servingsCapacity: 150,
    activeVolunteers: 6,
    matchScore: 86,
    recommendationReason:
      'Experienced in quick quality testing and direct distribution to night shelters and construction worker camps.',
    specialization: 'Night shelters, daily wage clusters, and community kitchens',
    contactPerson: 'Harpreet Singh',
    phone: '+91 98333 44556',
    verified: true,
    transitType: 'Thermal Backpack Volunteer',
  },
  {
    id: 'NGO-04',
    name: 'Akshaya Jan Kalyan Samiti',
    chapter: 'Metro Belt Unit',
    distanceKm: 6.2,
    estimatedMinutes: 35,
    capacityKg: 80,
    servingsCapacity: 190,
    activeVolunteers: 4,
    matchScore: 78,
    recommendationReason:
      'Secondary backup unit with cold storage capability for perishable dairy or dessert items.',
    specialization: 'Bakery surplus & balanced dietary redistribution',
    contactPerson: 'Devendra Patel',
    phone: '+91 98444 55667',
    verified: true,
    transitType: 'Insulated Van',
  },
];

/**
 * Heuristic NGO recommendation engine
 * Calculates dynamic match scores based on:
 * - Distance & estimated pickup travel time vs pickup deadline
 * - Vehicle capacity vs food quantity
 * - Volunteer availability
 */
export function getRecommendedNgosForDonation(donation: DonationListing): NgoProfile[] {
  return MOCK_NGOS.map((ngo) => {
    let score = ngo.matchScore;

    // Capacity penalty if too small
    if (ngo.capacityKg < donation.quantityKg) {
      score -= 25;
    } else if (ngo.capacityKg >= donation.quantityKg * 1.5) {
      score += 3;
    }

    // Urgency penalty if distance is high for urgent listings
    if (donation.urgencyLevel === 'urgent' && ngo.distanceKm > 4) {
      score -= 12;
    } else if (donation.urgencyLevel === 'urgent' && ngo.distanceKm <= 3) {
      score += 5;
    }

    const clampedScore = Math.min(99, Math.max(65, Math.round(score)));

    let reason = ngo.recommendationReason;
    if (donation.quantityKg > 30) {
      reason = `${ngo.name} has sufficient capacity (${ngo.capacityKg} kg) for this large ${donation.quantityKg} kg batch, located only ${ngo.distanceKm} km away.`;
    } else if (donation.urgencyLevel === 'urgent') {
      reason = `High urgency match: Estimated arrival in ${ngo.estimatedMinutes} mins via ${ngo.transitType}. Can collect before deadline.`;
    }

    return {
      ...ngo,
      matchScore: clampedScore,
      recommendationReason: reason,
    };
  })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
}
