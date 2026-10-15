export type DonationStatus = 'posted' | 'claimed' | 'picked_up' | 'delivered';

export type DonorCategory =
  | 'Wedding Caterer'
  | 'Restaurant'
  | 'Hostel Mess'
  | 'Corporate Canteen'
  | 'Bakery';

export type FoodType =
  | 'Cooked Meals'
  | 'Bakery & Bread'
  | 'Packaged / Dry Food'
  | 'Fresh Produce';

export type DietaryType = 'Vegetarian' | 'Non-Vegetarian' | 'Vegan';

export interface DonationListing {
  id: string;
  foodTitle: string;
  category: DonorCategory;
  donorName: string;
  donorLocation: string;
  donorPhone?: string;
  photoUrl?: string;
  quantityKg: number;
  estimatedMeals: number;
  preparedTime: string;
  pickupDeadline: string;
  urgencyLevel: 'urgent' | 'moderate' | 'flexible'; // urgent < 2 hrs, moderate 2-4 hrs, flexible > 4 hrs
  hoursRemaining: number;
  status: DonationStatus;
  foodType: FoodType;
  dietaryType: DietaryType;
  storageNotes: string;
  assignedNgoId?: string;
  assignedNgoName?: string;
  claimedAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  volunteerName?: string;
  volunteerPhone?: string;
  deliveryDestination?: string;
}

export interface DonorProfile {
  donorName: string;
  donorCategory: DonorCategory;
  donorLocation: string;
  phone: string;
  defaultStorageNote: string;
}

export interface FoodAnalysisResult {
  foodName: string;
  category: DonorCategory;
  dietary: DietaryType;
  estimatedQuantityKg: number;
  notes: string;
  confidence?: number;
  aiSuggested?: boolean;
}

export interface NgoProfile {
  id: string;
  name: string;
  chapter: string;
  distanceKm: number;
  estimatedMinutes: number;
  capacityKg: number;
  servingsCapacity: number;
  activeVolunteers: number;
  matchScore: number;
  recommendationReason: string;
  specialization: string;
  contactPerson: string;
  phone: string;
  verified: boolean;
  transitType: 'Insulated Van' | 'EV Cargo Bike' | 'Thermal Backpack Volunteer';
}

export interface ImpactMetrics {
  totalFoodRescuedKg: number;
  mealsServed: number;
  activeDonationsCount: number;
  successfulDeliveriesCount: number;
  co2DivertedKg: number;
  activeNgosCount: number;
}
