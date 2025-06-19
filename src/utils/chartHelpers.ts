import type { Exercise } from '../types/exercise';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, eachWeekOfInterval, parseISO, isWithinInterval } from 'date-fns';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
  }[];
}

export class ChartDataGenerator {
  static generateWeeklyDurationChart(exercises: Exercise[]): ChartData {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
    const labels = days.map(day => format(day, 'EEE'));
    const data = days.map(day => {
      const dayExercises = exercises.filter(ex => {
        const exerciseDate = parseISO(ex.date);
        return format(exerciseDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
      });
      return dayExercises.reduce((sum, ex) => sum + ex.duration, 0);
    });

    return {
      labels,
      datasets: [{
        label: 'Duration (minutes)',
        data,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        tension: 0.4,
      }],
    };
  }

  static generateMonthlyWorkoutChart(exercises: Exercise[]): ChartData {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const labels = weeks.map((_, index) => `Week ${index + 1}`);
    const data = weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const weekExercises = exercises.filter(ex => {
        const exerciseDate = parseISO(ex.date);
        return isWithinInterval(exerciseDate, { start: weekStart, end: weekEnd });
      });
      return weekExercises.length;
    });

    return {
      labels,
      datasets: [{
        label: 'Workouts',
        data,
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
      }],
    };
  }

  static generateExerciseTypeChart(exercises: Exercise[]): ChartData {
    const typeCounts = exercises.reduce((acc, ex) => {
      acc[ex.type] = (acc[ex.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);
    
    const colors = [
      'rgba(59, 130, 246, 0.8)',   // blue
      'rgba(16, 185, 129, 0.8)',   // green
      'rgba(245, 158, 11, 0.8)',   // amber
      'rgba(239, 68, 68, 0.8)',    // red
      'rgba(139, 92, 246, 0.8)',   // violet
      'rgba(236, 72, 153, 0.8)',   // pink
      'rgba(20, 184, 166, 0.8)',   // teal
      'rgba(251, 146, 60, 0.8)',   // orange
      'rgba(34, 197, 94, 0.8)',    // emerald
      'rgba(168, 85, 247, 0.8)',   // purple
      'rgba(14, 165, 233, 0.8)',   // sky
      'rgba(132, 204, 22, 0.8)',   // lime
      'rgba(249, 115, 22, 0.8)',   // orange-600
      'rgba(99, 102, 241, 0.8)',   // indigo
    ];

    return {
      labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1).replace('-', ' ')),
      datasets: [{
        label: 'Exercises',
        data,
        backgroundColor: colors.slice(0, labels.length),
      }],
    };
  }

  static generateIntensityChart(exercises: Exercise[]): ChartData {
    const intensityCounts = exercises.reduce((acc, ex) => {
      acc[ex.intensityLevel] = (acc[ex.intensityLevel] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const intensityOrder = ['low', 'moderate', 'high', 'very-high'];
    const labels = intensityOrder.map(level => level.charAt(0).toUpperCase() + level.slice(1).replace('-', ' '));
    const data = intensityOrder.map(level => intensityCounts[level] || 0);

    return {
      labels,
      datasets: [{
        label: 'Workouts by Intensity',
        data,
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // green for low
          'rgba(245, 158, 11, 0.8)',  // amber for moderate
          'rgba(239, 68, 68, 0.8)',   // red for high
          'rgba(127, 29, 29, 0.8)',   // dark red for very high
        ],
      }],
    };
  }

  static generateCaloriesChart(exercises: Exercise[]): ChartData {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    
    const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
    const labels = weeks.map((_, index) => `Week ${index + 1}`);
    const data = weeks.map(weekStart => {
      const weekEnd = endOfWeek(weekStart);
      const weekExercises = exercises.filter(ex => {
        const exerciseDate = parseISO(ex.date);
        return isWithinInterval(exerciseDate, { start: weekStart, end: weekEnd });
      });
      return weekExercises.reduce((sum, ex) => sum + (ex.caloriesBurned || 0), 0);
    });

    return {
      labels,
      datasets: [{
        label: 'Calories Burned',
        data,
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
        tension: 0.4,
      }],
    };
  }
}