import React, { useState } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { DateRangePicker } from './DateRangePicker';
import { StatusSelect } from './StatusSelect';
import { SearchBar } from './SearchBar';

const BOOKING_STATUSES = [
  { value: 'all', label: 'Todas las reservas', count: null },
  { value: 'upcoming', label: 'Próximas', count: 12 },
  { value: 'completed', label: 'Completadas', count: 45 },
  { value: 'cancelled', label: 'Canceladas', count: 3 },
  { value: 'pending', label: 'Pendientes', count: 2 },
  { value: 'no_show', label: 'No asistió', count: 1 }
];

export const BookingsFilter = ({
  filters = {},
  onFiltersChange,
  totalBookings = 0,
  loading = false,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    dateRange: { start: '', end: '' },
    status: 'all',
    search: '',
    ...filters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleDateRangeChange = (range) => {
    handleFilterChange('dateRange', range);
  };

  const handleStatusChange = (status) => {
    handleFilterChange('status', status);
  };

  const handleSearchChange = (search) => {
    handleFilterChange('search', search);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateRange: { start: '', end: '' },
      status: 'all',
      search: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = 
    localFilters.status !== 'all' ||
    localFilters.search.trim() !== '' ||
    localFilters.dateRange.start !== '' ||
    localFilters.dateRange.end !== '';

  const activeFiltersCount = [
    localFilters.status !== 'all',
    localFilters.search.trim() !== '',
    localFilters.dateRange.start !== '' || localFilters.dateRange.end !== ''
  ].filter(Boolean).length;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header with summary and toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Reservas
              {!loading && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({totalBookings} total)
                </span>
              )}
            </h2>
            
            {hasActiveFilters && (
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Limpiar filtros"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>{isExpanded ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
          </button>
        </div>
      </div>

      {/* Quick status filters - always visible */}
      <div className="p-4">
        <StatusSelect
          statuses={BOOKING_STATUSES}
          selectedStatus={localFilters.status}
          onStatusChange={handleStatusChange}
          loading={loading}
        />
      </div>

      {/* Expanded filters */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          <div className="pt-4 space-y-4">
            {/* Search bar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar reserva
              </label>
              <SearchBar
                value={localFilters.search}
                onChange={handleSearchChange}
                placeholder="Buscar por cliente, ID de reserva, terapia..."
                loading={loading}
              />
            </div>

            {/* Date range picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rango de fechas
              </label>
              <DateRangePicker
                value={localFilters.dateRange}
                onChange={handleDateRangeChange}
                loading={loading}
              />
            </div>

            {/* Filter actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                {hasActiveFilters ? (
                  `Mostrando resultados filtrados`
                ) : (
                  'Mostrando todas las reservas'
                )}
              </div>
              
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm">Aplicando filtros...</span>
          </div>
        </div>
      )}
    </div>
  );
};