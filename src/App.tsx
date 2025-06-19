import { useState, useEffect } from 'react';
import { Activity, BarChart3, Database, Menu, X } from 'lucide-react';
import ExerciseForm from './components/ExerciseForm';
import StatsCards from './components/StatsCards';
import ChartComponent from './components/ChartComponent';
import ExerciseList from './components/ExerciseList';
import DataManager from './components/DataManager';
import { exerciseDataManager } from './utils/dataManager';
import { ChartDataGenerator } from './utils/chartHelpers';
import type { Exercise } from './types/exercise';

type TabType = 'dashboard' | 'add-exercise' | 'history' | 'data';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState(exerciseDataManager.getStats());
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const refreshData = () => {
    setExercises(exerciseDataManager.getExercises());
    setStats(exerciseDataManager.getStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleExerciseAdded = () => {
    refreshData();
    if (!editingExercise) {
      setActiveTab('dashboard');
    } else {
      setEditingExercise(null);
      setActiveTab('history');
    }
  };

  const handleEditExercise = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setActiveTab('add-exercise');
  };

  const handleCancelEdit = () => {
    setEditingExercise(null);
    setActiveTab('history');
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'add-exercise' as TabType, label: 'Add Exercise', icon: Activity },
    { id: 'history' as TabType, label: 'History', icon: Menu },
    { id: 'data' as TabType, label: 'Data', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-md shadow-soft border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl blur opacity-75 animate-glow"></div>
                <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl">
                  <Activity className="w-8 h-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                  FitTracker
                </h1>
                <p className="text-sm text-slate-600 font-medium">Your Personal Fitness Journey</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-3 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 backdrop-blur-sm shadow-soft'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-xl blur animate-glow"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'animate-bounce-gentle' : ''}`} />
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-3 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/60 backdrop-blur-sm shadow-soft transition-all duration-300 hover:scale-105"
            >
              <div className={`transform transition-transform duration-300 ${mobileMenuOpen ? 'rotate-180' : ''}`}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden transition-all duration-300 ease-out ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white/90 backdrop-blur-md border-t border-white/20`}>
          <div className="px-4 py-3 space-y-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 animate-slide-down ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-glow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'dashboard' && (
          <div className="space-y-12">
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent mb-4">
                Your Fitness Dashboard
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Track your progress, celebrate achievements, and stay motivated on your fitness journey
              </p>
            </div>

            <StatsCards stats={stats} />

            {exercises.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                  <ChartComponent
                    title="Weekly Duration Trends"
                    data={ChartDataGenerator.generateWeeklyDurationChart(exercises)}
                    type="line"
                  />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  <ChartComponent
                    title="Monthly Workout Progress"
                    data={ChartDataGenerator.generateMonthlyWorkoutChart(exercises)}
                    type="bar"
                  />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
                  <ChartComponent
                    title="Exercise Types Distribution"
                    data={ChartDataGenerator.generateExerciseTypeChart(exercises)}
                    type="doughnut"
                  />
                </div>
                <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
                  <ChartComponent
                    title="Intensity Level Analysis"
                    data={ChartDataGenerator.generateIntensityChart(exercises)}
                    type="pie"
                  />
                </div>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100/50 to-purple-100/50 rounded-3xl blur-xl"></div>
                <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-hard p-12 text-center animate-scale-in">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full blur opacity-50 animate-pulse-slow"></div>
                    <Activity className="w-20 h-20 text-primary-500 mx-auto mb-6 relative animate-float" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">Begin Your Fitness Journey</h3>
                  <p className="text-xl text-slate-600 mb-8 max-w-lg mx-auto">
                    Start logging your exercises to unlock powerful analytics, progress tracking, and personalized insights!
                  </p>
                  <button
                    onClick={() => setActiveTab('add-exercise')}
                    className="relative inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow hover:shadow-hard transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    <Activity className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Add Your First Exercise</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add-exercise' && (
          <div className="space-y-12">
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-accent-600 via-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                {editingExercise ? 'Update Your Exercise' : 'Log New Exercise'}
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                {editingExercise 
                  ? 'Make changes to your workout details and keep your progress accurate' 
                  : 'Record your workout details and watch your fitness journey unfold'
                }
              </p>
            </div>

            <div className="animate-slide-up">
              <ExerciseForm
                onExerciseAdded={handleExerciseAdded}
                editingExercise={editingExercise}
                onCancel={handleCancelEdit}
              />
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-12">
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-secondary-600 via-accent-600 to-primary-600 bg-clip-text text-transparent mb-4">
                Exercise History
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Review, edit, and manage your complete workout history with powerful filtering tools
              </p>
            </div>

            <div className="animate-slide-up">
              <ExerciseList
                exercises={exercises}
                onExerciseUpdate={refreshData}
                onEditExercise={handleEditExercise}
              />
            </div>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-12">
            <div className="text-center animate-fade-in">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                Data Management
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Export, import, and manage your exercise data with complete privacy and control
              </p>
            </div>

            <div className="animate-slide-up">
              <DataManager onDataChange={refreshData} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
