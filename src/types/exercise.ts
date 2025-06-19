export interface Exercise {
  id: string;
  name: string;
  type: ExerciseType;
  duration: number; // in minutes
  intensityLevel: IntensityLevel;
  caloriesBurned?: number;
  date: string; // ISO date string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ExerciseType = 
  | 'cardio'
  | 'strength'
  | 'flexibility'
  | 'balance'
  | 'sports'
  | 'yoga'
  | 'pilates'
  | 'dance'
  | 'martial-arts'
  | 'swimming'
  | 'cycling'
  | 'running'
  | 'walking'
  | 'other';

export type IntensityLevel = 'low' | 'moderate' | 'high' | 'very-high';

export interface ExerciseStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalCalories: number;
  averageIntensity: number;
  currentStreak: number;
  longestStreak: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface FilterOptions {
  type?: ExerciseType | 'all';
  dateRange?: DateRange;
  intensityLevel?: IntensityLevel | 'all';
}

export const EXERCISE_TYPES: { value: ExerciseType; label: string }[] = [
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Strength Training' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'balance', label: 'Balance' },
  { value: 'sports', label: 'Sports' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'dance', label: 'Dance' },
  { value: 'martial-arts', label: 'Martial Arts' },
  { value: 'swimming', label: 'Swimming' },
  { value: 'cycling', label: 'Cycling' },
  { value: 'running', label: 'Running' },
  { value: 'walking', label: 'Walking' },
  { value: 'other', label: 'Other' },
];

export const INTENSITY_LEVELS: { value: IntensityLevel; label: string; description: string }[] = [
  { value: 'low', label: 'Low', description: 'Light activity, can easily hold a conversation' },
  { value: 'moderate', label: 'Moderate', description: 'Some effort, can speak in short sentences' },
  { value: 'high', label: 'High', description: 'Vigorous effort, difficult to speak' },
  { value: 'very-high', label: 'Very High', description: 'Maximum effort, cannot speak comfortably' },
];