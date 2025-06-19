import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar, Clock, Zap, FileText, Dumbbell } from 'lucide-react';
import type { Exercise, ExerciseType, IntensityLevel } from '../types/exercise';
import { EXERCISE_TYPES, INTENSITY_LEVELS } from '../types/exercise';
import { exerciseDataManager } from '../utils/dataManager';

interface ExerciseFormProps {
  onExerciseAdded?: (exercise: Exercise) => void;
  editingExercise?: Exercise | null;
  onCancel?: () => void;
}

const ExerciseForm: React.FC<ExerciseFormProps> = ({ 
  onExerciseAdded, 
  editingExercise, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    name: editingExercise?.name || '',
    type: editingExercise?.type || 'cardio' as ExerciseType,
    duration: editingExercise?.duration || 30,
    intensityLevel: editingExercise?.intensityLevel || 'moderate' as IntensityLevel,
    caloriesBurned: editingExercise?.caloriesBurned || '',
    date: editingExercise?.date ? editingExercise.date.split('T')[0] : format(new Date(), 'yyyy-MM-dd'),
    notes: editingExercise?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Exercise name is required';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'Duration must be greater than 0';
    }

    if (formData.caloriesBurned && Number(formData.caloriesBurned) < 0) {
      newErrors.caloriesBurned = 'Calories must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const exerciseData = {
      name: formData.name.trim(),
      type: formData.type,
      duration: formData.duration,
      intensityLevel: formData.intensityLevel,
      caloriesBurned: formData.caloriesBurned ? Number(formData.caloriesBurned) : undefined,
      date: new Date(formData.date).toISOString(),
      notes: formData.notes.trim() || undefined,
    };

    let result: Exercise;
    if (editingExercise) {
      result = exerciseDataManager.updateExercise(editingExercise.id, exerciseData)!;
    } else {
      result = exerciseDataManager.addExercise(exerciseData);
    }

    if (onExerciseAdded) {
      onExerciseAdded(result);
    }

    // Reset form if not editing
    if (!editingExercise) {
      setFormData({
        name: '',
        type: 'cardio',
        duration: 30,
        intensityLevel: 'moderate',
        caloriesBurned: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        notes: '',
      });
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Form container */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-hard p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-500 to-primary-500 rounded-2xl blur opacity-75 animate-glow"></div>
            <div className="relative bg-gradient-to-r from-accent-500 to-primary-500 p-3 rounded-2xl">
              <Dumbbell className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent">
              {editingExercise ? 'Update Exercise' : 'Log New Exercise'}
            </h2>
            <p className="text-slate-600 mt-1">
              {editingExercise ? 'Make changes to your workout' : 'Track your fitness progress'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Exercise Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Exercise Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 ${
                    errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'
                  }`}
                  placeholder="e.g., Morning Run, Push-ups, Yoga Session"
                />
                {errors.name && (
                  <div className="absolute inset-0 pointer-events-none border-2 border-red-400 rounded-xl animate-pulse"></div>
                )}
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm font-medium animate-slide-down">{errors.name}</p>
              )}
            </div>

            {/* Exercise Type */}
            <div className="space-y-2">
              <label htmlFor="type" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Exercise Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
              >
                {EXERCISE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                <Clock className="w-4 h-4" />
                Duration (minutes) *
              </label>
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange('duration', Number(e.target.value))}
                min="1"
                max="600"
                className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 ${
                  errors.duration ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'
                }`}
              />
              {errors.duration && (
                <p className="text-red-500 text-sm font-medium animate-slide-down">{errors.duration}</p>
              )}
            </div>

            {/* Intensity Level */}
            <div className="space-y-2">
              <label htmlFor="intensity" className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                <Zap className="w-4 h-4" />
                Intensity Level
              </label>
              <select
                id="intensity"
                value={formData.intensityLevel}
                onChange={(e) => handleChange('intensityLevel', e.target.value)}
                className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
              >
                {INTENSITY_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label} - {level.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Calories Burned */}
            <div className="space-y-2">
              <label htmlFor="calories" className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Calories Burned (optional)
              </label>
              <input
                type="number"
                id="calories"
                value={formData.caloriesBurned}
                onChange={(e) => handleChange('caloriesBurned', e.target.value)}
                min="0"
                max="9999"
                className={`w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 transition-all duration-300 ${
                  errors.caloriesBurned ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'
                }`}
                placeholder="Leave empty if unknown"
              />
              {errors.caloriesBurned && (
                <p className="text-red-500 text-sm font-medium animate-slide-down">{errors.caloriesBurned}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label htmlFor="date" className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wide">
              <FileText className="w-4 h-4" />
              Notes (optional)
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-4 bg-white/50 backdrop-blur-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 resize-none"
              placeholder="Any additional notes about your workout..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="relative flex items-center gap-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-xl font-semibold shadow-glow hover:shadow-hard transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                {editingExercise ? 'Update Exercise' : 'Add Exercise'}
              </span>
            </button>
            
            {editingExercise && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-4 focus:ring-slate-500/20 transition-all duration-300 transform hover:scale-105"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;
