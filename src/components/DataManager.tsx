import React, { useState, useRef } from 'react';
import { Download, Upload, FileJson, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { exerciseDataManager } from '../utils/dataManager';

interface DataManagerProps {
  onDataChange: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ onDataChange }) => {
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = exerciseDataManager.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `exercise-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      
      setImportStatus({
        type: 'success',
        message: 'Data exported successfully!'
      });
      
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: 'Failed to export data. Please try again.'
      });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const result = exerciseDataManager.importData(content);
        
        setImportStatus({
          type: result.success ? 'success' : 'error',
          message: result.message
        });
        
        if (result.success) {
          onDataChange();
        }
        
        setTimeout(() => setImportStatus({ type: null, message: '' }), 5000);
      } catch (error) {
        setImportStatus({
          type: 'error',
          message: 'Failed to read file. Please check the file format.'
        });
        setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete ALL exercise data? This action cannot be undone.')) {
      exerciseDataManager.clearAllData();
      onDataChange();
      setImportStatus({
        type: 'success',
        message: 'All data has been cleared.'
      });
      setTimeout(() => setImportStatus({ type: null, message: '' }), 3000);
    }
  };

  return (
    <div className="relative group">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Container */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-hard p-8 border border-white/20">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl blur opacity-75"></div>
            <div className="relative bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-2xl shadow-glow">
              <FileJson className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Data Management
            </h2>
            <p className="text-slate-600 mt-1">Backup, restore, and manage your workout data</p>
          </div>
        </div>

        {/* Status Message */}
        {importStatus.type && (
          <div className={`relative mb-8 animate-fade-in ${
            importStatus.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50' 
              : 'bg-gradient-to-r from-red-50 to-pink-50'
          } rounded-2xl p-6 border border-white/30 shadow-soft backdrop-blur-sm`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${
                importStatus.type === 'success'
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500'
                  : 'bg-gradient-to-br from-red-400 to-pink-500'
              } shadow-sm`}>
                {importStatus.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <span className={`font-semibold ${
                importStatus.type === 'success' ? 'text-emerald-800' : 'text-red-800'
              }`}>
                {importStatus.message}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Export Section */}
          <div className="relative group/card">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50/50 rounded-2xl p-6 border border-white/30 shadow-soft backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-xl shadow-sm">
                  <Download className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Export Data</h3>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Download all your exercise data as a JSON file. This creates a backup that you can import later or transfer to another device.
              </p>
              <button
                onClick={handleExport}
                className="group/btn flex items-center gap-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 w-full"
              >
                <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                Export Data
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="relative group/card">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-green-500/5 rounded-2xl blur-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-emerald-50 to-green-50/50 rounded-2xl p-6 border border-white/30 shadow-soft backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-2 rounded-xl shadow-sm">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Import Data</h3>
              </div>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Import exercise data from a previously exported JSON file. New exercises will be added to your existing data.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="group/btn flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300 w-full"
              >
                <Upload className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                Import Data
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8">
          <div className="relative group/danger">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-2xl blur-xl opacity-0 group-hover/danger:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-red-50 to-pink-50/50 rounded-2xl p-6 border border-red-200/50 shadow-soft backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-red-500 to-pink-600 p-2 rounded-xl shadow-sm">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-red-800">Danger Zone</h3>
              </div>
              <p className="text-red-700 mb-6 leading-relaxed">
                This action will permanently delete all your exercise data. Make sure to export your data first if you want to keep a backup.
              </p>
              <button
                onClick={handleClearData}
                className="group/btn flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-glow hover:shadow-glow-lg transform hover:scale-105 transition-all duration-300"
              >
                <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>

        {/* Data Format Info */}
        <div className="mt-8">
          <div className="relative group/info">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl blur-xl opacity-0 group-hover/info:opacity-100 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-2xl p-6 border border-white/30 shadow-soft backdrop-blur-sm">
              <h4 className="font-bold text-indigo-800 mb-4 text-lg">About Data Export/Import</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  'All data is stored locally on your device for privacy',
                  'Export creates a JSON file with all your exercise data',
                  'Import merges new data with existing data (no duplicates)',
                  'Files are compatible across different devices and browsers'
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"></div>
                    <span className="text-indigo-700 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManager;
