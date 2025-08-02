import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const VIEW_OPTIONS = [
  { id: 'week', label: 'Semana', icon: Calendar },
  { id: 'month', label: 'Mes', icon: Calendar }
];

const TIMEZONE_OPTIONS = [
  { value: 'Europe/Madrid', label: 'Madrid (CET/CEST)' },
  { value: 'Europe/London', label: 'Londres (GMT/BST)' },
  { value: 'America/New_York', label: 'Nueva York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (PST/PDT)' },
  { value: 'Asia/Tokyo', label: 'Tokio (JST)' }
];

export const ViewTabs = ({ 
  currentView = 'week',
  onViewChange,
  timezone = 'Europe/Madrid',
  onTimezoneChange,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      {/* View Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {VIEW_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentView === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onViewChange?.(option.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-white text-sage shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
              `}
              aria-pressed={isActive}
              aria-label={`Vista ${option.label}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timezone Selector */}
      <div className="flex items-center space-x-2">
        <Clock className="h-4 w-4 text-gray-500" aria-hidden="true" />
        <select
          value={timezone}
          onChange={(e) => onTimezoneChange?.(e.target.value)}
          className="
            px-3 py-2 border border-gray-300 rounded-md text-sm
            focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage
            bg-white text-gray-900
          "
          aria-label="Seleccionar zona horaria"
        >
          {TIMEZONE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};