import React from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import type { ChartData } from '../utils/chartHelpers';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartComponentProps {
  title: string;
  data: ChartData;
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  height?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ 
  title, 
  data, 
  type, 
  height = 300 
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false, // We'll use our own title
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: type === 'pie' || type === 'doughnut' ? undefined : {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
        },
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
        },
        beginAtZero: true,
      },
    },
    elements: {
      point: {
        radius: 4,
        hoverRadius: 6,
      },
      line: {
        borderWidth: 2,
      },
      bar: {
        borderRadius: 4,
        borderSkipped: false,
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart' as const,
    },
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={options} />;
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };
  return (
    <div className="group relative animate-slide-up">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Card container */}
      <div className="relative bg-white/80 backdrop-blur-md rounded-3xl shadow-soft hover:shadow-medium transition-all duration-500 border border-white/20 overflow-hidden">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-slate-50 to-blue-50/50 px-8 py-6 border-b border-white/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-secondary-500/5"></div>
          <h3 className="relative text-xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-2 h-8 bg-gradient-to-b from-primary-500 to-secondary-500 rounded-full"></div>
            {title}
          </h3>
        </div>
        
        {/* Chart container */}
        <div className="relative p-8">
          <div 
            className="relative z-10 transition-transform duration-300 group-hover:scale-[1.02]" 
            style={{ height: `${height}px` }}
          >
            {renderChart()}
          </div>
          
          {/* Decorative gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
        </div>
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
