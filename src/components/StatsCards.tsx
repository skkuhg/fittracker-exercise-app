import React from 'react';
import { Activity, Clock, Flame, TrendingUp, Calendar, Target, Zap } from 'lucide-react';
import type { ExerciseStats } from '../types/exercise';

interface StatsCardsProps {
  stats: ExerciseStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getIntensityLabel = (intensity: number): string => {
    if (intensity <= 1.5) return 'Low';
    if (intensity <= 2.5) return 'Moderate';
    if (intensity <= 3.5) return 'High';
    return 'Very High';
  };

  const getIntensityColor = (intensity: number): string => {
    if (intensity <= 1.5) return 'text-green-600';
    if (intensity <= 2.5) return 'text-yellow-600';
    if (intensity <= 3.5) return 'text-orange-600';
    return 'text-red-600';
  };
  const statCards = [
    {
      title: 'Total Workouts',
      value: stats.totalWorkouts.toString(),
      icon: Activity,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      textColor: 'text-blue-700',
      iconBg: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Duration',
      value: formatDuration(stats.totalDuration),
      icon: Clock,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-50 to-emerald-100/50',
      textColor: 'text-emerald-700',
      iconBg: 'from-emerald-500 to-emerald-600',
    },
    {
      title: 'Total Calories',
      value: stats.totalCalories.toLocaleString(),
      icon: Flame,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-100/50',
      textColor: 'text-red-700',
      iconBg: 'from-orange-500 to-red-500',
    },
    {
      title: 'Avg. Intensity',
      value: getIntensityLabel(stats.averageIntensity),
      icon: Zap,
      gradient: 'from-yellow-500 to-amber-500',
      bgGradient: 'from-yellow-50 to-amber-100/50',
      textColor: getIntensityColor(stats.averageIntensity),
      iconBg: 'from-yellow-500 to-amber-500',
    },
    {
      title: 'Current Streak',
      value: `${stats.currentStreak} days`,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      textColor: 'text-purple-700',
      iconBg: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Longest Streak',
      value: `${stats.longestStreak} days`,
      icon: Target,
      gradient: 'from-indigo-500 to-indigo-600',
      bgGradient: 'from-indigo-50 to-indigo-100/50',
      textColor: 'text-indigo-700',
      iconBg: 'from-indigo-500 to-indigo-600',
    },
    {
      title: 'This Week',
      value: `${stats.thisWeekWorkouts} workouts`,
      icon: Calendar,
      gradient: 'from-teal-500 to-cyan-500',
      bgGradient: 'from-teal-50 to-cyan-100/50',
      textColor: 'text-teal-700',
      iconBg: 'from-teal-500 to-cyan-500',
    },
    {
      title: 'This Month',
      value: `${stats.thisMonthWorkouts} workouts`,
      icon: Calendar,
      gradient: 'from-pink-500 to-rose-500',
      bgGradient: 'from-pink-50 to-rose-100/50',
      textColor: 'text-pink-700',
      iconBg: 'from-pink-500 to-rose-500',
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {statCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`relative group animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
            
            {/* Card container */}
            <div className={`relative bg-gradient-to-br ${card.bgGradient} backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300 transform hover:scale-105 hover:-translate-y-1`}>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                    {card.title}
                  </p>
                  <p className={`text-3xl font-bold ${card.textColor} mb-1`}>
                    {card.value}
                  </p>
                  <div className="h-1 w-12 bg-gradient-to-r from-current to-transparent opacity-60 rounded-full"></div>
                </div>
                
                {/* Icon with gradient background */}
                <div className="relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.iconBg} rounded-xl blur opacity-50 animate-pulse-slow`}></div>
                  <div className={`relative bg-gradient-to-r ${card.iconBg} rounded-xl p-3 shadow-glow-sm`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
