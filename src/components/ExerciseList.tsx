import React, { useState } from 'react';
import { format } from 'date-fns';
import { Edit2, Trash2, Filter, Search, Calendar, Clock, Flame } from 'lucide-react';
import type { Exercise, FilterOptions, ExerciseType, IntensityLevel } from '../types/exercise';
import { EXERCISE_TYPES, INTENSITY_LEVELS } from '../types/exercise';
import { exerciseDataManager } from '../utils/dataManager';

interface ExerciseListProps {
  exercises: Exercise[];
  onExerciseUpdate: () => void;
  onEditExercise: (exercise: Exercise) => void;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercises, 
  onExerciseUpdate,
  onEditExercise 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    type: 'all',
    intensityLevel: 'all',
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      exerciseDataManager.deleteExercise(id);
      onExerciseUpdate();
    }
  };
  const getAdvancedIntensityColor = (intensity: IntensityLevel): string => {
    switch (intensity) {
      case 'low': return 'bg-gradient-to-r from-emerald-400 to-green-500 text-white';
      case 'moderate': return 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white';
      case 'high': return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
      case 'very-high': return 'bg-gradient-to-r from-red-500 to-pink-600 text-white';
      default: return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white';
    }
  };

  const getAdvancedTypeColor = (type: ExerciseType): string => {
    const colors = {
      'cardio': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      'strength': 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
      'flexibility': 'bg-gradient-to-r from-pink-500 to-rose-500 text-white',
      'balance': 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white',
      'sports': 'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
      'yoga': 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white',
      'pilates': 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
      'dance': 'bg-gradient-to-r from-rose-500 to-pink-600 text-white',
      'martial-arts': 'bg-gradient-to-r from-red-600 to-orange-600 text-white',
      'swimming': 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
      'cycling': 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
      'running': 'bg-gradient-to-r from-orange-500 to-red-500 text-white',
      'walking': 'bg-gradient-to-r from-lime-500 to-green-500 text-white',
      'other': 'bg-gradient-to-r from-slate-500 to-gray-600 text-white',
    };
    return colors[type] || 'bg-gradient-to-r from-slate-500 to-gray-600 text-white';
  };

  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.type === 'all' || exercise.type === filters.type;
    const matchesIntensity = filters.intensityLevel === 'all' || exercise.intensityLevel === filters.intensityLevel;

    return matchesSearch && matchesType && matchesIntensity;
  });
  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Container */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-hard p-8 border border-white/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent">
              Exercise History
            </h2>
            <p className="text-slate-600 mt-1">Manage and review your workout journey</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 w-full sm:w-64"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-6 py-3 border-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                showFilters 
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 border-transparent text-white shadow-glow' 
                  : 'bg-white/60 backdrop-blur-sm border-slate-200 text-slate-700 hover:bg-white/80 hover:border-slate-300'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className={`overflow-hidden transition-all duration-500 ease-out ${
          showFilters ? 'max-h-40 opacity-100 mb-8' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl p-6 border border-white/20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Exercise Type
                </label>
                <select
                  value={filters.type || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as ExerciseType | 'all' }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                >
                  <option value="all">All Types</option>
                  {EXERCISE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Intensity Level
                </label>
                <select
                  value={filters.intensityLevel || 'all'}
                  onChange={(e) => setFilters(prev => ({ ...prev, intensityLevel: e.target.value as IntensityLevel | 'all' }))}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
                >
                  <option value="all">All Intensities</option>
                  {INTENSITY_LEVELS.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>        {/* Exercise List */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-300/20 to-slate-400/20 rounded-full blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-slate-100 to-slate-200 p-8 rounded-3xl shadow-soft border border-white/50">
                <div className="bg-gradient-to-br from-slate-300 to-slate-400 p-4 rounded-2xl w-fit mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  {exercises.length === 0 ? 'No exercises logged yet' : 'No exercises match your filters'}
                </h3>
                <p className="text-slate-500">
                  {exercises.length === 0 
                    ? 'Start your fitness journey by adding your first workout!' 
                    : 'Try adjusting your filters or search terms.'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredExercises.map((exercise, index) => (
              <div
                key={exercise.id}
                className="group relative animate-fade-in hover:scale-[1.02] transition-all duration-500"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-accent-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl border border-white/30 shadow-soft overflow-hidden group-hover:shadow-hard transition-all duration-500">
                  {/* Header gradient bar */}
                  <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500"></div>
                  
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        {/* Title and badges */}
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary-600 transition-colors">
                            {exercise.name}
                          </h3>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getAdvancedTypeColor(exercise.type)} shadow-sm`}>
                              {EXERCISE_TYPES.find(t => t.value === exercise.type)?.label}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${getAdvancedIntensityColor(exercise.intensityLevel)} shadow-sm`}>
                              {INTENSITY_LEVELS.find(l => l.value === exercise.intensityLevel)?.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100/50">
                            <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2 rounded-lg shadow-sm">
                              <Calendar className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Date</p>
                              <p className="text-sm font-bold text-slate-700">
                                {format(new Date(exercise.date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100/50">
                            <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-lg shadow-sm">
                              <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">Duration</p>
                              <p className="text-sm font-bold text-slate-700">{exercise.duration} min</p>
                            </div>
                          </div>
                          
                          {exercise.caloriesBurned && (
                            <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-3 border border-orange-100/50">
                              <div className="bg-gradient-to-br from-orange-400 to-red-500 p-2 rounded-lg shadow-sm">
                                <Flame className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Calories</p>
                                <p className="text-sm font-bold text-slate-700">{exercise.caloriesBurned} cal</p>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Notes */}
                        {exercise.notes && (
                          <div className="bg-gradient-to-r from-slate-50 to-blue-50/30 rounded-xl p-4 border border-slate-200/50">
                            <p className="text-sm italic text-slate-600 leading-relaxed">
                              "{exercise.notes}"
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex lg:flex-col gap-3">
                        <button
                          onClick={() => onEditExercise(exercise)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 group"
                          title="Edit exercise"
                        >
                          <Edit2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(exercise.id)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 group"
                          title="Delete exercise"
                        >
                          <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results summary */}
        {filteredExercises.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-100 to-blue-100/50 rounded-full border border-white/50 shadow-soft">
              <div className="w-2 h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-slate-600">                Showing {filteredExercises.length} of {exercises.length} exercises
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseList;
