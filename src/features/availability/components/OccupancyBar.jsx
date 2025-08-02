import React from 'react';
import { Calendar, Clock, Users, TrendingUp, TrendingDown } from 'lucide-react';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Lun', fullLabel: 'Lunes' },
  { key: 'tuesday', label: 'Mar', fullLabel: 'Martes' },
  { key: 'wednesday', label: 'Mié', fullLabel: 'Miércoles' },
  { key: 'thursday', label: 'Jue', fullLabel: 'Jueves' },
  { key: 'friday', label: 'Vie', fullLabel: 'Viernes' },
  { key: 'saturday', label: 'Sáb', fullLabel: 'Sábado' },
  { key: 'sunday', label: 'Dom', fullLabel: 'Domingo' }
];

const getOccupancyColor = (percentage) => {
  if (percentage >= 90) return 'bg-red-500';
  if (percentage >= 75) return 'bg-orange-500';
  if (percentage >= 50) return 'bg-yellow-500';
  if (percentage >= 25) return 'bg-green-500';
  return 'bg-gray-300';
};

// Patrones para mejorar accesibilidad (color-blind friendly)
const getOccupancyPattern = (percentage) => {
  if (percentage >= 90) return 'bg-gradient-to-t from-red-600 to-red-400';
  if (percentage >= 75) return 'bg-gradient-to-t from-orange-600 to-orange-400';
  if (percentage >= 50) return 'bg-gradient-to-t from-yellow-600 to-yellow-400';
  if (percentage >= 25) return 'bg-gradient-to-t from-green-600 to-green-400';
  return 'bg-gray-300';
};

const getOccupancySymbol = (percentage) => {
  if (percentage >= 90) return '▓▓▓'; // Muy ocupado
  if (percentage >= 75) return '▓▓░'; // Ocupado
  if (percentage >= 50) return '▓░░'; // Moderado
  if (percentage >= 25) return '░░░'; // Disponible
  return '   '; // Libre
};

const getOccupancyTextColor = (percentage) => {
  if (percentage >= 90) return 'text-red-700';
  if (percentage >= 75) return 'text-orange-700';
  if (percentage >= 50) return 'text-yellow-700';
  if (percentage >= 25) return 'text-green-700';
  return 'text-gray-600';
};

const getOccupancyStatus = (percentage) => {
  if (percentage >= 90) return { label: 'Muy ocupado', icon: TrendingUp, color: 'text-red-600' };
  if (percentage >= 75) return { label: 'Ocupado', icon: TrendingUp, color: 'text-orange-600' };
  if (percentage >= 50) return { label: 'Moderado', icon: Clock, color: 'text-yellow-600' };
  if (percentage >= 25) return { label: 'Disponible', icon: TrendingDown, color: 'text-green-600' };
  return { label: 'Libre', icon: TrendingDown, color: 'text-gray-600' };
};

const DayOccupancyBar = ({ day, data, isToday = false }) => {
  const availableHours = data?.availableHours || 0;
  const bookedHours = data?.bookedHours || 0;
  const totalHours = availableHours + bookedHours;
  // Calcular ocupación basada en horas reales
  const occupancyPercentage = totalHours > 0 ? Math.round((bookedHours / totalHours) * 100) : 0;
  
  const status = getOccupancyStatus(occupancyPercentage);
  const StatusIcon = status.icon;
  const occupancySymbol = getOccupancySymbol(occupancyPercentage);

  return (
    <div className={`
      flex flex-col items-center space-y-2 p-3 rounded-lg transition-all duration-200
      ${isToday ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'}
    `}>
      {/* Day label */}
      <div className="text-center">
        <div className={`
          text-sm font-medium
          ${isToday ? 'text-blue-700' : 'text-gray-700'}
        `}>
          {day.label}
        </div>
        {isToday && (
          <div className="text-xs text-blue-600 font-medium">Hoy</div>
        )}
      </div>

      {/* Occupancy bar */}
      <div className="w-full max-w-16">
        <div className="h-20 bg-gray-200 rounded-md overflow-hidden relative">
          {/* Available hours background */}
          <div className="absolute inset-0 bg-gray-200"></div>
          
          {/* Booked hours with pattern */}
          <div 
            className={`
              absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out
              ${getOccupancyPattern(occupancyPercentage)}
            `}
            style={{ height: `${occupancyPercentage}%` }}
          ></div>
          
          {/* Accessibility symbols overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`
              text-xs font-mono leading-none
              ${occupancyPercentage > 50 ? 'text-white' : 'text-gray-700'}
            `}>
              {occupancySymbol}
            </span>
            <span className={`
              text-xs font-bold mt-1
              ${occupancyPercentage > 50 ? 'text-white' : 'text-gray-700'}
            `}>
              {occupancyPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Hours info */}
      <div className="text-center space-y-1">
        <div className={`text-xs font-medium ${getOccupancyTextColor(occupancyPercentage)}`}>
          {bookedHours}h / {totalHours}h
        </div>
        
        {/* Status indicator */}
        <div className={`flex items-center justify-center space-x-1 ${status.color}`}>
          <StatusIcon className="h-3 w-3" />
          <span className="text-xs font-medium">{status.label}</span>
        </div>
      </div>
    </div>
  );
};

const WeekSummary = ({ weekData, currentWeek }) => {
  const totalAvailable = weekData.reduce((sum, day) => sum + (day?.availableHours || 0), 0);
  const totalBooked = weekData.reduce((sum, day) => sum + (day?.bookedHours || 0), 0);
  const totalHours = totalAvailable + totalBooked;
  const averageOccupancy = totalHours > 0 ? Math.round((totalBooked / totalHours) * 100) : 0;
  
  const status = getOccupancyStatus(averageOccupancy);
  const StatusIcon = status.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          Resumen semanal
        </h3>
        <div className={`flex items-center space-x-1 ${status.color}`}>
          <StatusIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-gray-900">{averageOccupancy}%</div>
          <div className="text-xs text-gray-600">Ocupación media</div>
        </div>
        <div>
          <div className="text-lg font-bold text-blue-600">{totalBooked}h</div>
          <div className="text-xs text-gray-600">Horas reservadas</div>
        </div>
        <div>
          <div className="text-lg font-bold text-green-600">{totalAvailable}h</div>
          <div className="text-xs text-gray-600">Horas disponibles</div>
        </div>
      </div>
    </div>
  );
};

export const OccupancyBar = ({ 
  weekData = [],
  currentWeek = null,
  loading = false,
  showSummary = true,
  className = ''
}) => {
  // Mock data if not provided - datos consistentes
  const mockWeekData = [
    { availableHours: 2, bookedHours: 6 }, // Monday - 75% ocupación
    { availableHours: 5, bookedHours: 8 }, // Tuesday - 62% ocupación
    { availableHours: 1, bookedHours: 9 }, // Wednesday - 90% ocupación
    { availableHours: 7, bookedHours: 4 }, // Thursday - 36% ocupación
    { availableHours: 3, bookedHours: 9 }, // Friday - 75% ocupación
    { availableHours: 5, bookedHours: 2 }, // Saturday - 29% ocupación
    { availableHours: 6, bookedHours: 1 }  // Sunday - 14% ocupación
  ];

  const displayData = weekData.length > 0 ? weekData : mockWeekData;
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to our Monday-first array

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex justify-between items-center space-x-2">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day.key} className="flex flex-col items-center space-y-2 p-3">
              <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-20 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        {showSummary && (
          <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Week occupancy bars */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Ocupación semanal
          </h3>
          <div className="text-xs text-gray-500">
            {currentWeek || 'Semana actual'}
          </div>
        </div>
        
        <div className="flex justify-between items-end space-x-1 sm:space-x-2">
          {DAYS_OF_WEEK.map((day, index) => (
            <DayOccupancyBar
              key={day.key}
              day={day}
              data={displayData[index]}
              isToday={index === todayIndex}
            />
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-[6px] font-mono">   </span>
              </div>
              <span>Libre (0-24%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-t from-green-600 to-green-400 rounded flex items-center justify-center">
                <span className="text-[6px] font-mono text-white">░░░</span>
              </div>
              <span>Disponible (25-49%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded flex items-center justify-center">
                <span className="text-[6px] font-mono text-white">▓░░</span>
              </div>
              <span>Moderado (50-74%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-t from-orange-600 to-orange-400 rounded flex items-center justify-center">
                <span className="text-[6px] font-mono text-white">▓▓░</span>
              </div>
              <span>Ocupado (75-89%)</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-t from-red-600 to-red-400 rounded flex items-center justify-center">
                <span className="text-[6px] font-mono text-white">▓▓▓</span>
              </div>
              <span>Muy ocupado (90%+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Week summary */}
      {showSummary && (
        <WeekSummary weekData={displayData} currentWeek={currentWeek} />
      )}
    </div>
  );
};