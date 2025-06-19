import type { Exercise, ExerciseStats, FilterOptions } from '../types/exercise';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, parseISO, isWithinInterval } from 'date-fns';

const STORAGE_KEY = 'exercise-tracker-data';
const EXPORT_VERSION = '1.0';

export class ExerciseDataManager {
  private data: Exercise[] = [];

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.data = Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      console.error('Error loading exercise data:', error);
      this.data = [];
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving exercise data:', error);
    }
  }

  addExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Exercise {
    const now = new Date().toISOString();
    const newExercise: Exercise = {
      ...exercise,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };

    this.data.push(newExercise);
    this.saveData();
    return newExercise;
  }

  updateExercise(id: string, updates: Partial<Omit<Exercise, 'id' | 'createdAt'>>): Exercise | null {
    const index = this.data.findIndex(ex => ex.id === id);
    if (index === -1) return null;

    const updatedExercise: Exercise = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.data[index] = updatedExercise;
    this.saveData();
    return updatedExercise;
  }

  deleteExercise(id: string): boolean {
    const index = this.data.findIndex(ex => ex.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    this.saveData();
    return true;
  }

  getExercises(filters?: FilterOptions): Exercise[] {
    let filtered = [...this.data];

    if (filters) {
      if (filters.type && filters.type !== 'all') {
        filtered = filtered.filter(ex => ex.type === filters.type);
      }

      if (filters.intensityLevel && filters.intensityLevel !== 'all') {
        filtered = filtered.filter(ex => ex.intensityLevel === filters.intensityLevel);
      }

      if (filters.dateRange) {
        filtered = filtered.filter(ex => {
          const exerciseDate = parseISO(ex.date);
          return isWithinInterval(exerciseDate, {
            start: filters.dateRange!.start,
            end: filters.dateRange!.end,
          });
        });
      }
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getExerciseById(id: string): Exercise | null {
    return this.data.find(ex => ex.id === id) || null;
  }

  getStats(): ExerciseStats {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const totalWorkouts = this.data.length;
    const totalDuration = this.data.reduce((sum, ex) => sum + ex.duration, 0);
    const totalCalories = this.data.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);

    const intensitySum = this.data.reduce((sum, ex) => {
      const intensityMap = { 'low': 1, 'moderate': 2, 'high': 3, 'very-high': 4 };
      return sum + intensityMap[ex.intensityLevel];
    }, 0);
    const averageIntensity = totalWorkouts > 0 ? intensitySum / totalWorkouts : 0;

    const thisWeekWorkouts = this.data.filter(ex => {
      const exerciseDate = parseISO(ex.date);
      return isWithinInterval(exerciseDate, { start: weekStart, end: weekEnd });
    }).length;

    const thisMonthWorkouts = this.data.filter(ex => {
      const exerciseDate = parseISO(ex.date);
      return isWithinInterval(exerciseDate, { start: monthStart, end: monthEnd });
    }).length;

    // Calculate streaks
    const sortedDates = this.data
      .map(ex => parseISO(ex.date))
      .sort((a, b) => b.getTime() - a.getTime())
      .filter((date, index, arr) => index === 0 || !isSameDay(date, arr[index - 1]));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    if (sortedDates.length > 0) {
      // Check current streak
      let checkDate = new Date();
      for (const date of sortedDates) {
        if (isSameDay(date, checkDate) || isSameDay(date, new Date(checkDate.getTime() - 24 * 60 * 60 * 1000))) {
          currentStreak++;
          checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
        } else {
          break;
        }
      }

      // Calculate longest streak
      for (let i = 0; i < sortedDates.length; i++) {
        if (i === 0) {
          tempStreak = 1;
        } else {
          const diffDays = Math.floor((sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (24 * 60 * 60 * 1000));
          if (diffDays === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    return {
      totalWorkouts,
      totalDuration,
      totalCalories,
      averageIntensity,
      currentStreak,
      longestStreak,
      thisWeekWorkouts,
      thisMonthWorkouts,
    };
  }

  exportData(): string {
    const exportData = {
      version: EXPORT_VERSION,
      exportDate: new Date().toISOString(),
      exercises: this.data,
    };
    return JSON.stringify(exportData, null, 2);
  }

  importData(jsonString: string): { success: boolean; message: string; imported?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      
      if (!parsed.exercises || !Array.isArray(parsed.exercises)) {
        return { success: false, message: 'Invalid data format: exercises array not found' };
      }

      const exercises = parsed.exercises as Exercise[];
      const validExercises = exercises.filter(ex => 
        ex.id && ex.name && ex.type && ex.duration && ex.intensityLevel && ex.date
      );

      if (validExercises.length === 0) {
        return { success: false, message: 'No valid exercises found in import data' };
      }

      // Merge with existing data, avoiding duplicates by ID
      const existingIds = new Set(this.data.map(ex => ex.id));
      const newExercises = validExercises.filter(ex => !existingIds.has(ex.id));

      this.data.push(...newExercises);
      this.saveData();

      return { 
        success: true, 
        message: `Successfully imported ${newExercises.length} exercises`, 
        imported: newExercises.length 
      };
    } catch (error) {
      return { success: false, message: 'Invalid JSON format' };
    }
  }

  clearAllData(): void {
    this.data = [];
    this.saveData();
  }

  getWorkoutsByDate(): Map<string, Exercise[]> {
    const workoutMap = new Map<string, Exercise[]>();
    
    this.data.forEach(exercise => {
      const dateKey = exercise.date.split('T')[0]; // Get just the date part
      if (!workoutMap.has(dateKey)) {
        workoutMap.set(dateKey, []);
      }
      workoutMap.get(dateKey)!.push(exercise);
    });

    return workoutMap;
  }
}

export const exerciseDataManager = new ExerciseDataManager();