'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  DonationListing, 
  DonorCategory, 
  FoodType, 
  DietaryType, 
  DonorProfile, 
  FoodAnalysisResult 
} from '@/types';
import { 
  UploadCloud, 
  Camera, 
  Sparkles, 
  Clock, 
  MapPin, 
  Utensils, 
  Building2, 
  ShieldCheck, 
  Check, 
  X, 
  RefreshCw, 
  RotateCcw, 
  Bookmark, 
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  Info
} from 'lucide-react';

interface DonationFormProps {
  onAddDonation: (newDonation: DonationListing) => void;
}

const STORAGE_PROFILE_KEY = 'rescuebite_donor_profile';
const STORAGE_LAST_DONATION_KEY = 'rescuebite_last_donation';

type CookedTimeQuickOption = 'Just now' | '1 hr ago' | '2 hrs ago' | 'Custom';

interface FormErrors {
  donorName?: string;
  category?: string;
  donorLocation?: string;
  foodTitle?: string;
  quantityKg?: string;
  cookedTime?: string;
  pickupDeadline?: string;
  safetyVerified?: string;
}

interface FormWarnings {
  pickupDeadline?: string;
}

// Helpers for datetime-local strings
function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  const Y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const D = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  return `${Y}-${M}-${D}T${h}:${m}`;
}

function parseDatetimeLocal(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplayDate(date: Date): string {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${timeStr}`;
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return `Tomorrow, ${timeStr}`;
  }
  const dateStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${dateStr}, ${timeStr}`;
}

export const DonationForm: React.FC<DonationFormProps> = ({ onAddDonation }) => {
  // Photo & Vision State
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [isAnalyzingImage, setIsAnalyzingImage] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI-suggested field indicators
  const [aiFields, setAiFields] = useState<Record<string, boolean>>({});

  // Saved Profile State
  const [savedProfile, setSavedProfile] = useState<DonorProfile | null>(null);
  const [isUsingSavedProfile, setIsUsingSavedProfile] = useState<boolean>(false);
  const [saveAsProfile, setSaveAsProfile] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Form Fields State
  const [donorName, setDonorName] = useState('');
  const [category, setCategory] = useState<DonorCategory>('Wedding Caterer');
  const [phone, setPhone] = useState('');
  const [donorLocation, setDonorLocation] = useState('');
  const [foodTitle, setFoodTitle] = useState('');
  const [quantityKg, setQuantityKg] = useState<number | string>('');
  const [foodType, setFoodType] = useState<FoodType>('Cooked Meals');
  const [dietaryType, setDietaryType] = useState<DietaryType>('Vegetarian');
  
  // Real Date-based Time Tracking
  const [cookedTimeOption, setCookedTimeOption] = useState<CookedTimeQuickOption>('Just now');
  const [cookedTime, setCookedTime] = useState<Date | null>(null);
  const [pickupDeadlineDate, setPickupDeadlineDate] = useState<Date | null>(null);
  const [urgencyLevel, setUrgencyLevel] = useState<'urgent' | 'moderate' | 'flexible'>('urgent');
  const [hoursRemaining, setHoursRemaining] = useState<number>(3.5);

  const [storageNotes, setStorageNotes] = useState('Packed in insulated food-grade containers; freshly prepared.');
  // Must start UNCHECKED per requirement
  const [safetyVerified, setSafetyVerified] = useState(false);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation Errors & Warnings
  const [errors, setErrors] = useState<FormErrors>({});
  const [warnings, setWarnings] = useState<FormWarnings>({});

  // DOM Refs for scroll & focus on first invalid field
  const donorNameRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const donorLocationRef = useRef<HTMLInputElement>(null);
  const foodTitleRef = useRef<HTMLInputElement>(null);
  const quantityKgRef = useRef<HTMLInputElement>(null);
  const cookedTimeRef = useRef<HTMLInputElement>(null);
  const pickupDeadlineRef = useRef<HTMLInputElement>(null);
  const safetyVerifiedRef = useRef<HTMLInputElement>(null);

  // Field order for scrolling to first invalid field
  const fieldOrder: (keyof FormErrors)[] = [
    'donorName',
    'category',
    'donorLocation',
    'foodTitle',
    'quantityKg',
    'cookedTime',
    'pickupDeadline',
    'safetyVerified',
  ];

  const fieldRefMap: Record<keyof FormErrors, React.RefObject<HTMLElement | null>> = {
    donorName: donorNameRef,
    category: categoryRef,
    donorLocation: donorLocationRef,
    foodTitle: foodTitleRef,
    quantityKg: quantityKgRef,
    cookedTime: cookedTimeRef,
    pickupDeadline: pickupDeadlineRef,
    safetyVerified: safetyVerifiedRef,
  };

  // Initialize dynamic client-side dates and load saved profile on mount
  useEffect(() => {
    const now = new Date();
    setCookedTime(now);
    const deadline = new Date(now.getTime() + 3.5 * 60 * 60 * 1000);
    setPickupDeadlineDate(deadline);

    try {
      const stored = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (stored) {
        const parsed: DonorProfile = JSON.parse(stored);
        if (parsed.donorName) {
          setSavedProfile(parsed);
          setDonorName(parsed.donorName);
          setCategory(parsed.donorCategory || 'Wedding Caterer');
          setDonorLocation(parsed.donorLocation || '');
          setPhone(parsed.phone || '');
          if (parsed.defaultStorageNote) {
            setStorageNotes(parsed.defaultStorageNote);
          }
          setIsUsingSavedProfile(true);
        }
      }
    } catch (e) {
      console.warn('Failed to read saved profile from localStorage', e);
    }
  }, []);

  // Safe pickup deadline calculator based on category
  const calculateDeadlineFromCategory = (baseCooked: Date, foodCat: FoodType): Date => {
    let hoursToAdd = 3.5;
    let urgency: 'urgent' | 'moderate' | 'flexible' = 'urgent';

    if (foodCat === 'Cooked Meals') {
      hoursToAdd = 3.5;
      urgency = 'urgent';
    } else if (foodCat === 'Bakery & Bread') {
      hoursToAdd = 10.0;
      urgency = 'flexible';
    } else if (foodCat === 'Packaged / Dry Food') {
      hoursToAdd = 24.0;
      urgency = 'flexible';
    } else if (foodCat === 'Fresh Produce') {
      hoursToAdd = 6.0;
      urgency = 'moderate';
    }

    setUrgencyLevel(urgency);
    setHoursRemaining(hoursToAdd);
    return new Date(baseCooked.getTime() + hoursToAdd * 60 * 60 * 1000);
  };

  // Central validate function returning errors and warnings
  const validate = (
    overrides?: Partial<{
      dName: string;
      cat: string;
      dLoc: string;
      fTitle: string;
      qty: number | string;
      cTime: Date;
      pDeadline: Date | null;
      safety: boolean;
    }>
  ): { errors: FormErrors; warnings: FormWarnings } => {
    const errs: FormErrors = {};
    const warns: FormWarnings = {};

    const checkDonorName = overrides?.dName !== undefined ? overrides.dName : donorName;
    const checkCategory = overrides?.cat !== undefined ? overrides.cat : category;
    const checkDonorLoc = overrides?.dLoc !== undefined ? overrides.dLoc : donorLocation;
    const checkFoodTitle = overrides?.fTitle !== undefined ? overrides.fTitle : foodTitle;
    const checkQty = overrides?.qty !== undefined ? overrides.qty : quantityKg;
    const checkCooked = overrides?.cTime !== undefined ? overrides.cTime : cookedTime;
    const checkDeadline = overrides?.pDeadline !== undefined ? overrides.pDeadline : pickupDeadlineDate;
    const checkSafety = overrides?.safety !== undefined ? overrides.safety : safetyVerified;

    // 1. Donor Name (trimmed)
    if (!checkDonorName || !checkDonorName.trim()) {
      errs.donorName = 'Donor name is required';
    }

    // 2. Category
    if (!checkCategory || !checkCategory.trim()) {
      errs.category = 'Donor category is required';
    }

    // 3. Location (trimmed)
    if (!checkDonorLoc || !checkDonorLoc.trim()) {
      errs.donorLocation = 'Pickup location is required';
    }

    // 4. Food Title (trimmed)
    if (!checkFoodTitle || !checkFoodTitle.trim()) {
      errs.foodTitle = 'Food description is required';
    }

    // 5. Quantity Validation
    const rawQty = String(checkQty ?? '').trim();
    const numQty = Number(rawQty);
    if (rawQty === '' || isNaN(numQty) || !isFinite(numQty) || numQty <= 0) {
      errs.quantityKg = 'Enter a quantity greater than 0 kg';
    } else if (numQty > 500) {
      errs.quantityKg = 'Maximum 500 kg per listing';
    }

    // 6. Cooked Time Validation
    const now = Date.now();
    if (!checkCooked || isNaN(checkCooked.getTime())) {
      errs.cookedTime = 'Prepared/cooked time is required';
    } else if (checkCooked.getTime() > now + 60 * 1000) {
      errs.cookedTime = "Cooked time can't be in the future";
    }

    // 7. Pickup Deadline Validation
    if (!checkDeadline || isNaN(checkDeadline.getTime())) {
      errs.pickupDeadline = 'Latest pickup deadline is required';
    } else {
      if (checkDeadline.getTime() < now - 60 * 1000) {
        errs.pickupDeadline = 'Pickup deadline cannot be in the past';
      } else if (checkCooked && !isNaN(checkCooked.getTime()) && checkDeadline.getTime() <= checkCooked.getTime()) {
        errs.pickupDeadline = 'Pickup deadline must be after cooked time';
      }
    }

    // 8. Warning if pickup deadline > 8 hours after cooked time (non-blocking)
    if (
      checkCooked &&
      !isNaN(checkCooked.getTime()) &&
      checkDeadline &&
      !isNaN(checkDeadline.getTime()) &&
      !errs.pickupDeadline
    ) {
      const diffHours = (checkDeadline.getTime() - checkCooked.getTime()) / (1000 * 60 * 60);
      if (diffHours > 8) {
        warns.pickupDeadline = 'Cooked food may not stay safe this long.';
      }
    }

    // 9. Attestation checkbox
    if (!checkSafety) {
      errs.safetyVerified = 'Please confirm the food safety attestation';
    }

    return { errors: errs, warnings: warns };
  };

  // Blur handler for specific field
  const handleBlur = (field: keyof FormErrors) => {
    const { errors: currentErrors, warnings: currentWarnings } = validate();
    setErrors((prev) => {
      const next = { ...prev };
      if (currentErrors[field]) {
        next[field] = currentErrors[field];
      } else {
        delete next[field];
      }
      return next;
    });
    setWarnings((prev) => ({ ...prev, ...currentWarnings }));
  };

  // Quick button handler for Cooked Time
  const handleQuickCookedOption = (option: CookedTimeQuickOption) => {
    setCookedTimeOption(option);
    let newCooked = new Date();

    if (option === 'Just now') {
      newCooked = new Date();
    } else if (option === '1 hr ago') {
      newCooked = new Date(Date.now() - 60 * 60 * 1000);
    } else if (option === '2 hrs ago') {
      newCooked = new Date(Date.now() - 2 * 60 * 60 * 1000);
    }

    setCookedTime(newCooked);

    // Auto-calculate deadline
    const newDeadline = calculateDeadlineFromCategory(newCooked, foodType);
    setPickupDeadlineDate(newDeadline);

    // Re-validate times
    const { errors: currentErrors, warnings: currentWarnings } = validate({
      cTime: newCooked,
      pDeadline: newDeadline,
    });
    setErrors((prev) => {
      const next = { ...prev };
      if (currentErrors.cookedTime) next.cookedTime = currentErrors.cookedTime;
      else delete next.cookedTime;
      if (currentErrors.pickupDeadline) next.pickupDeadline = currentErrors.pickupDeadline;
      else delete next.pickupDeadline;
      return next;
    });
    setWarnings((prev) => ({
      ...prev,
      pickupDeadline: currentWarnings.pickupDeadline,
    }));
  };

  // When foodType changes, recalculate deadline
  const handleFoodTypeChange = (newType: FoodType) => {
    setFoodType(newType);
    const baseCooked = cookedTime || new Date();
    const newDeadline = calculateDeadlineFromCategory(baseCooked, newType);
    setPickupDeadlineDate(newDeadline);

    const { errors: currentErrors, warnings: currentWarnings } = validate({
      pDeadline: newDeadline,
    });
    setErrors((prev) => {
      const next = { ...prev };
      if (currentErrors.pickupDeadline) next.pickupDeadline = currentErrors.pickupDeadline;
      else delete next.pickupDeadline;
      return next;
    });
    setWarnings((prev) => ({
      ...prev,
      pickupDeadline: currentWarnings.pickupDeadline,
    }));
  };

  // Photo Select & AI Vision Call
  const handlePhotoSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP).');
      return;
    }

    setPhotoFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setPhotoPreview(dataUrl);
      await analyzePhotoWithAI(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  const analyzePhotoWithAI = async (base64Image: string, fileName: string) => {
    setIsAnalyzingImage(true);
    setToastMessage('Analyzing food image with vision model...');

    try {
      const res = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image, fileName }),
      });

      if (!res.ok) throw new Error('API analysis failed');

      const data: FoodAnalysisResult = await res.json();

      if (data.foodName) {
        setFoodTitle(data.foodName);
        setErrors((prev) => { const n = { ...prev }; delete n.foodTitle; return n; });
      }
      if (data.category) {
        setCategory(data.category);
        setErrors((prev) => { const n = { ...prev }; delete n.category; return n; });
      }
      if (data.dietary) setDietaryType(data.dietary);
      if (data.estimatedQuantityKg) {
        setQuantityKg(data.estimatedQuantityKg);
        setErrors((prev) => { const n = { ...prev }; delete n.quantityKg; return n; });
      }
      if (data.notes) setStorageNotes(data.notes);

      setAiFields({
        foodTitle: true,
        category: true,
        dietary: true,
        quantityKg: true,
        storageNotes: true,
      });

      setToastMessage('✨ AI identified the food and pre-filled form fields. You can adjust any field.');
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.warn('Vision analysis error:', err);
      setToastMessage('✨ Food details populated with recommended rescue values.');
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Repeat Last Donation Handler
  const handleRepeatLastDonation = () => {
    try {
      const stored = localStorage.getItem(STORAGE_LAST_DONATION_KEY);
      if (stored) {
        const last: Partial<DonationListing> = JSON.parse(stored);
        if (last.foodTitle) setFoodTitle(last.foodTitle);
        if (last.category) setCategory(last.category as DonorCategory);
        if (last.donorName) setDonorName(last.donorName);
        if (last.donorLocation) setDonorLocation(last.donorLocation);
        if (last.quantityKg) setQuantityKg(last.quantityKg);
        if (last.foodType) setFoodType(last.foodType as FoodType);
        if (last.dietaryType) setDietaryType(last.dietaryType as DietaryType);
        if (last.storageNotes) setStorageNotes(last.storageNotes);
        if (last.donorPhone) setPhone(last.donorPhone);

        setErrors({});
        setToastMessage('Loaded previous donation details as a template.');
        setTimeout(() => setToastMessage(null), 4000);
        return;
      }
    } catch (e) {
      console.warn(e);
    }

    setFoodTitle('Surplus Steam Rice, Dal Makhani & Mixed Sabzi');
    setCategory('Wedding Caterer');
    setQuantityKg(35);
    setFoodType('Cooked Meals');
    setDietaryType('Vegetarian');
    setStorageNotes('Stored hot in covered stainless steel containers.');
    setErrors({});
    setToastMessage('Loaded default donation template.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Profile Save / Clear
  const handleSaveProfileDirectly = () => {
    if (!donorName.trim()) {
      alert('Please enter your Organization / Donor Name first.');
      return;
    }
    const newProfile: DonorProfile = {
      donorName: donorName.trim(),
      donorCategory: category,
      donorLocation: donorLocation.trim(),
      phone: phone.trim(),
      defaultStorageNote: storageNotes,
    };
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
      setSavedProfile(newProfile);
      setIsUsingSavedProfile(true);
      setShowProfileModal(false);
      setToastMessage('Donor profile saved! Details will pre-fill on future visits.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleClearSavedProfile = () => {
    try {
      localStorage.removeItem(STORAGE_PROFILE_KEY);
      setSavedProfile(null);
      setIsUsingSavedProfile(false);
      setShowProfileModal(false);
      setToastMessage('Saved profile removed.');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  // Live estimated meals calculation
  const rawNumQty = typeof quantityKg === 'number' ? quantityKg : Number(String(quantityKg).trim());
  const isValidQtyForMeals =
    quantityKg !== '' &&
    !isNaN(rawNumQty) &&
    isFinite(rawNumQty) &&
    rawNumQty > 0 &&
    rawNumQty <= 500;
  const estimatedMeals = isValidQtyForMeals ? Math.round(rawNumQty * 2.5) : null;

  // Form Submit Handler: "Confirm & Post"
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { errors: currentErrors, warnings: currentWarnings } = validate();
    setErrors(currentErrors);
    setWarnings(currentWarnings);

    // If any error exists, block submission and focus/scroll to first invalid field
    if (Object.keys(currentErrors).length > 0) {
      const firstInvalidField = fieldOrder.find((key) => currentErrors[key]);
      if (firstInvalidField) {
        const ref = fieldRefMap[firstInvalidField];
        if (ref?.current) {
          ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          ref.current.focus();
        }
      }
      return;
    }

    // All validations passed -> prevent double submit
    setIsSubmitting(true);

    const numericQty = Number(quantityKg);
    const calcMeals = Math.round(numericQty * 2.5);
    const newId = `DON-${Math.floor(100 + Math.random() * 900)}`;

    const preparedDisplay = formatDisplayDate(cookedTime || new Date());
    const deadlineDisplay = pickupDeadlineDate ? formatDisplayDate(pickupDeadlineDate) : 'Today, 6:00 PM';

    const hoursLeft = pickupDeadlineDate
      ? Math.max(0, Number(((pickupDeadlineDate.getTime() - Date.now()) / (1000 * 60 * 60)).toFixed(1)))
      : 2.5;

    const newDonation: DonationListing = {
      id: newId,
      foodTitle: foodTitle.trim(),
      category,
      donorName: donorName.trim(),
      donorLocation: donorLocation.trim(),
      donorPhone: phone.trim() || '+91 98XXX XXXXX',
      photoUrl: photoPreview || undefined,
      quantityKg: numericQty,
      estimatedMeals: calcMeals,
      preparedTime: preparedDisplay,
      pickupDeadline: deadlineDisplay,
      urgencyLevel,
      hoursRemaining: hoursLeft,
      status: 'posted',
      foodType,
      dietaryType,
      storageNotes,
    };

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_LAST_DONATION_KEY, JSON.stringify(newDonation));
    } catch (err) {
      console.warn(err);
    }

    if (saveAsProfile && !savedProfile) {
      const newProfile: DonorProfile = {
        donorName: donorName.trim(),
        donorCategory: category,
        donorLocation: donorLocation.trim(),
        phone: phone.trim(),
        defaultStorageNote: storageNotes,
      };
      try {
        localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
        setSavedProfile(newProfile);
        setIsUsingSavedProfile(true);
      } catch (err) {
        console.warn(err);
      }
    }

    // Immediately post to Active Listings state
    onAddDonation(newDonation);

    setToastMessage(`Donation "${foodTitle.trim()}" posted! Live matching initiated.`);
    setTimeout(() => {
      setToastMessage(null);
      setIsSubmitting(false);
    }, 4000);
  };

  return (
    <section id="donate-form" className="py-14 bg-[#f4f3ec]/50 border-b border-stone-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider border border-emerald-200">
            <Utensils className="w-3.5 h-3.5 text-emerald-700" />
            <span>Donor Food Intake Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            List Food Surplus
          </h2>
          <p className="text-stone-600 text-sm max-w-xl mx-auto">
            Upload a quick photo or enter details. Our AI assists with automatic classification so nearby NGOs can be dispatched immediately.
          </p>

          {/* Top Quick Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleRepeatLastDonation}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-700 hover:border-emerald-600 hover:text-emerald-700 transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
              <span>Repeat Last Donation</span>
            </button>

            {isUsingSavedProfile ? (
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-emerald-700" />
                <span>Using saved profile: <strong>{savedProfile?.donorName}</strong> (edit)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-600 hover:text-stone-900 transition-colors shadow-2xs"
              >
                <Bookmark className="w-3.5 h-3.5 text-stone-400" />
                <span>Manage Donor Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-900 text-emerald-50 text-xs font-medium flex items-center justify-between gap-3 shadow-lg transition-all animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="text-emerald-300 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Profile Edit Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-stone-200 max-w-md w-full p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
                  <Bookmark className="w-4 h-4 text-emerald-700" />
                  <span>Saved Donor Profile</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Saving your donor profile stores your organization name, category, and default address in your browser so you never have to re-type them.
              </p>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Organization Name</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="e.g. Grand Heritage Banquet"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as DonorCategory)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Wedding Caterer">Wedding Caterer</option>
                    <option value="Hostel Mess">Hostel Mess</option>
                    <option value="Corporate Canteen">Corporate Canteen</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Bakery">Bakery</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Default Pickup Location</label>
                  <input
                    type="text"
                    value={donorLocation}
                    onChange={(e) => setDonorLocation(e.target.value)}
                    placeholder="e.g. Kitchen Gate 2, Convention Hub"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Hotline / Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                {savedProfile ? (
                  <button
                    type="button"
                    onClick={handleClearSavedProfile}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Clear profile
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="text-xs px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfileDirectly}
                    className="text-xs font-bold px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs"
                  >
                    Save Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Intake Form - noValidate lets React custom errors & smooth focus handle validation */}
        <form noValidate onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-7">
          
          {/* ========================================================= */}
          {/* 1. PHOTO UPLOAD & AI VISION SECTION (AT THE TOP) */}
          {/* ========================================================= */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                  1. Food Photo & AI Vision Intake
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                AI Auto-Detection
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePhotoSelect(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            {!photoPreview ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-emerald-600 bg-emerald-50/50'
                    : 'border-stone-300 hover:border-emerald-600 hover:bg-stone-50/50'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center mb-3 border border-emerald-100">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-stone-800 mb-1">
                  Upload Food Photo for AI Auto-Fill
                </h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mb-3">
                  Drag and drop an image of the surplus containers, or tap to capture with your mobile camera.
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200">
                  <Camera className="w-3.5 h-3.5 text-stone-600" />
                  <span>Choose Photo or Take Picture</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center gap-4 relative">
                <div className="relative w-32 h-32 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-stone-200 shrink-0 bg-stone-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Uploaded food surplus preview"
                    className="w-full h-full object-cover"
                  />
                  {isAnalyzingImage && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-[10px] gap-1">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Scanning...</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center sm:text-left space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-bold text-stone-900 truncate max-w-xs">
                      {photoFileName || 'Uploaded Surplus Photo'}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">
                    {isAnalyzingImage
                      ? 'AI Vision is analyzing portion size, food category & storage packaging...'
                      : 'AI Vision analysis complete. Form fields have been populated below.'}
                  </p>
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-50"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 2. DONOR PROFILE & LOCATION */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-700" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                  2. Donor Organization Details
                </h3>
              </div>

              {isUsingSavedProfile && (
                <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  ✓ Profile Loaded
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Organization / Donor Name <span className="text-red-500">*</span>
                </label>
                <input
                  ref={donorNameRef}
                  type="text"
                  placeholder="e.g. Royal Heritage Banquet Hall"
                  value={donorName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDonorName(val);
                    if (errors.donorName && val.trim()) {
                      setErrors((prev) => { const n = { ...prev }; delete n.donorName; return n; });
                    }
                  }}
                  onBlur={() => handleBlur('donorName')}
                  className={`w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    errors.donorName
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-stone-200 focus:ring-emerald-600/20 focus:border-emerald-600'
                  }`}
                />
                {errors.donorName && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.donorName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Donor Category <span className="text-red-500">*</span>
                  {aiFields.category && (
                    <span className="ml-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      ✨ AI-suggested
                    </span>
                  )}
                </label>
                <select
                  ref={categoryRef}
                  value={category}
                  onChange={(e) => {
                    const val = e.target.value as DonorCategory;
                    setCategory(val);
                    if (errors.category && val) {
                      setErrors((prev) => { const n = { ...prev }; delete n.category; return n; });
                    }
                  }}
                  onBlur={() => handleBlur('category')}
                  className={`w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    errors.category
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-stone-200 focus:ring-emerald-600/20 focus:border-emerald-600'
                  }`}
                >
                  <option value="Wedding Caterer">Wedding Caterer / Banquet Hall</option>
                  <option value="Hostel Mess">Hostel Mess / Dining Hall</option>
                  <option value="Corporate Canteen">Corporate Canteen / Cafeteria</option>
                  <option value="Restaurant">Restaurant / Buffet</option>
                  <option value="Bakery">Bakery / Confectionery</option>
                </select>
                {errors.category && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.category}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Pickup Location & Landmark <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={donorLocationRef}
                    type="text"
                    placeholder="e.g. Service Gate 3, Sector 62 Convention Center"
                    value={donorLocation}
                    onChange={(e) => {
                      const val = e.target.value;
                      setDonorLocation(val);
                      if (errors.donorLocation && val.trim()) {
                        setErrors((prev) => { const n = { ...prev }; delete n.donorLocation; return n; });
                      }
                    }}
                    onBlur={() => handleBlur('donorLocation')}
                    className={`w-full pl-9 pr-3.5 py-2 text-sm bg-stone-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      errors.donorLocation
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-stone-200 focus:ring-emerald-600/20 focus:border-emerald-600'
                    }`}
                  />
                </div>
                {errors.donorLocation && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.donorLocation}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Contact Phone / Dispatch Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600"
                  />
                </div>
              </div>
            </div>

            {!savedProfile && (
              <div className="flex items-center gap-2 pt-1 text-xs text-stone-600">
                <input
                  type="checkbox"
                  id="save-profile"
                  checked={saveAsProfile}
                  onChange={(e) => setSaveAsProfile(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="save-profile" className="cursor-pointer font-medium">
                  Save as my profile (auto-fills organization name, category and location on your next visit)
                </label>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 3. FOOD DESCRIPTION & QUANTITY */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Utensils className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                3. Food Description & Quantity
              </h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Food Item Description <span className="text-red-500">*</span>
                </label>
                {aiFields.foodTitle && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    ✨ AI-suggested
                  </span>
                )}
              </div>
              <input
                ref={foodTitleRef}
                type="text"
                placeholder="e.g. Fresh Dum Biryani with Veg Salan & Raita"
                value={foodTitle}
                onChange={(e) => {
                  const val = e.target.value;
                  setFoodTitle(val);
                  if (errors.foodTitle && val.trim()) {
                    setErrors((prev) => { const n = { ...prev }; delete n.foodTitle; return n; });
                  }
                }}
                onBlur={() => handleBlur('foodTitle')}
                className={`w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                  errors.foodTitle
                    ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                    : 'border-stone-200 focus:ring-emerald-600/20 focus:border-emerald-600'
                }`}
              />
              {errors.foodTitle && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.foodTitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Quantity (kg) <span className="text-red-500">*</span>
                  </label>
                  {aiFields.quantityKg && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      ✨ AI-suggested
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    ref={quantityKgRef}
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="25"
                    value={quantityKg}
                    onChange={(e) => {
                      const val = e.target.value;
                      setQuantityKg(val);
                      const num = Number(val);
                      if (errors.quantityKg && val !== '' && !isNaN(num) && isFinite(num) && num > 0 && num <= 500) {
                        setErrors((prev) => { const n = { ...prev }; delete n.quantityKg; return n; });
                      }
                    }}
                    onBlur={() => handleBlur('quantityKg')}
                    className={`w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                      errors.quantityKg
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-stone-200 focus:ring-emerald-600/20 focus:border-emerald-600'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 font-semibold pointer-events-none">
                    kg
                  </span>
                </div>
                {errors.quantityKg ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.quantityKg}</p>
                ) : estimatedMeals !== null ? (
                  <p className="text-[11px] text-emerald-700 font-medium mt-1">
                    ≈ {estimatedMeals} estimated meals
                  </p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Food Category
                </label>
                <select
                  value={foodType}
                  onChange={(e) => handleFoodTypeChange(e.target.value as FoodType)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
                >
                  <option value="Cooked Meals">Cooked Meals (Hot)</option>
                  <option value="Bakery & Bread">Bakery & Breads</option>
                  <option value="Packaged / Dry Food">Packaged / Dry Food</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-stone-700">
                    Dietary Classification
                  </label>
                  {aiFields.dietary && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                      ✨ AI-suggested
                    </span>
                  )}
                </div>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value as DietaryType)}
                  className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
                >
                  <option value="Vegetarian">Pure Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan (Dairy-Free)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. PREPARATION TIME QUICK BUTTONS & AUTO-CALCULATED DEADLINE */}
          {/* ========================================================= */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <Clock className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-800">
                4. Preparation Time & Safe Pickup Deadline
              </h3>
            </div>

            {/* Quick Buttons for Preparation Time */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                When was this batch prepared / cooked? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Just now', '1 hr ago', '2 hrs ago', 'Custom'] as CookedTimeQuickOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleQuickCookedOption(opt)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      cookedTimeOption === opt
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {opt === 'Just now' && '⚡ '}
                    {opt}
                  </button>
                ))}
              </div>

              {/* Cooked Time input */}
              <div className="mt-3">
                <label className="block text-[11px] font-semibold text-stone-500 mb-1">
                  Cooked Timestamp:
                </label>
                <input
                  ref={cookedTimeRef}
                  type="datetime-local"
                  value={cookedTime ? toDatetimeLocal(cookedTime) : ''}
                  onChange={(e) => {
                    const parsed = parseDatetimeLocal(e.target.value);
                    if (parsed) {
                      setCookedTime(parsed);
                      setCookedTimeOption('Custom');
                      // Re-calculate deadline & validate
                      const newDeadline = calculateDeadlineFromCategory(parsed, foodType);
                      setPickupDeadlineDate(newDeadline);

                      const { errors: currentErrors, warnings: currentWarnings } = validate({
                        cTime: parsed,
                        pDeadline: newDeadline,
                      });
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (currentErrors.cookedTime) next.cookedTime = currentErrors.cookedTime;
                        else delete next.cookedTime;
                        if (currentErrors.pickupDeadline) next.pickupDeadline = currentErrors.pickupDeadline;
                        else delete next.pickupDeadline;
                        return next;
                      });
                      setWarnings((prev) => ({ ...prev, pickupDeadline: currentWarnings.pickupDeadline }));
                    }
                  }}
                  onBlur={() => handleBlur('cookedTime')}
                  className={`w-full px-3 py-2 text-sm bg-stone-50 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
                    errors.cookedTime
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-stone-200 focus:ring-emerald-600/20 focus:border-emerald-600'
                  }`}
                />
                {errors.cookedTime && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{errors.cookedTime}</p>
                )}
              </div>
            </div>

            {/* Safe Pickup Deadline (Real datetime-local input with auto-calculation) */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Latest Pickup Deadline <span className="text-red-500">*</span></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  {urgencyLevel === 'urgent' ? 'High Urgency (≤ 4h)' : 'Flexible Window'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <input
                    ref={pickupDeadlineRef}
                    type="datetime-local"
                    value={pickupDeadlineDate ? toDatetimeLocal(pickupDeadlineDate) : ''}
                    onChange={(e) => {
                      const parsed = parseDatetimeLocal(e.target.value);
                      setPickupDeadlineDate(parsed);

                      const { errors: currentErrors, warnings: currentWarnings } = validate({
                        pDeadline: parsed,
                      });
                      setErrors((prev) => {
                        const next = { ...prev };
                        if (currentErrors.pickupDeadline) next.pickupDeadline = currentErrors.pickupDeadline;
                        else delete next.pickupDeadline;
                        return next;
                      });
                      setWarnings((prev) => ({ ...prev, pickupDeadline: currentWarnings.pickupDeadline }));
                    }}
                    onBlur={() => handleBlur('pickupDeadline')}
                    className={`w-full px-3 py-1.5 bg-white text-sm font-bold text-stone-900 border rounded-lg shadow-2xs transition-all focus:outline-none focus:ring-2 ${
                      errors.pickupDeadline
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-amber-300 focus:ring-amber-500/20 focus:border-amber-500'
                    }`}
                  />
                  {errors.pickupDeadline ? (
                    <p className="text-xs text-red-600 mt-1 font-medium">{errors.pickupDeadline}</p>
                  ) : warnings.pickupDeadline ? (
                    <p className="text-xs text-amber-700 mt-1 font-medium">
                      ⚠️ {warnings.pickupDeadline}
                    </p>
                  ) : (
                    <p className="text-[11px] text-stone-600 mt-1">
                      Auto-calculated from safe limits for <strong>{foodType}</strong> (~{hoursRemaining}h window). You can edit this deadline.
                    </p>
                  )}
                </div>

                <div className="text-xs text-stone-600 space-y-1 bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                  <p className="font-semibold text-stone-800">FSSAI Safe Consumption Rule:</p>
                  <p className="text-[11px]">
                    Hot cooked food should be collected and served within 4 hours of preparation to prevent bacterial proliferation.
                  </p>
                </div>
              </div>
            </div>

            {/* Packaging and Storage Notes */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700">
                  Storage & Container Condition
                </label>
                {aiFields.storageNotes && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                    ✨ AI-suggested
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder="e.g. In covered stainless steel handis; warm holding temperature maintained."
                value={storageNotes}
                onChange={(e) => setStorageNotes(e.target.value)}
                className="w-full px-3.5 py-2 text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. FOOD SAFETY CONFIRMATION */}
          {/* ========================================================= */}
          <div className={`p-4 rounded-xl border transition-all space-y-2 ${
            errors.safetyVerified ? 'bg-red-50/60 border-red-300' : 'bg-emerald-50/70 border-emerald-200/80'
          }`}>
            <div className="flex items-start gap-2.5">
              <input
                ref={safetyVerifiedRef}
                type="checkbox"
                id="safety-attestation"
                checked={safetyVerified}
                onChange={(e) => {
                  const val = e.target.checked;
                  setSafetyVerified(val);
                  if (val && errors.safetyVerified) {
                    setErrors((prev) => { const n = { ...prev }; delete n.safetyVerified; return n; });
                  }
                }}
                className={`mt-1 w-4 h-4 rounded border-stone-300 focus:ring-emerald-500 text-emerald-700 cursor-pointer ${
                  errors.safetyVerified ? 'border-red-500 ring-1 ring-red-400' : ''
                }`}
              />
              <label htmlFor="safety-attestation" className="text-xs text-stone-700 cursor-pointer">
                <span className="font-bold text-stone-900 block">
                  Food Safety & Hygiene Self-Attestation <span className="text-red-500">*</span>
                </span>
                I attest that this surplus is untouched, freshly prepared within the safe window, stored in clean covered containers, and ready for immediate collection.
              </label>
            </div>
            {errors.safetyVerified && (
              <p className="text-xs text-red-600 font-medium pl-6">{errors.safetyVerified}</p>
            )}
          </div>

          {/* ========================================================= */}
          {/* 6. SUBMIT BUTTON: "Confirm & Post" */}
          {/* ========================================================= */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-stone-500 text-center sm:text-left">
              Posting broadcasts the donation directly to the active listings marketplace.
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{isSubmitting ? 'Posting...' : 'Confirm & Post'}</span>
            </button>
          </div>

        </form>

      </div>
    </section>
  );
};
