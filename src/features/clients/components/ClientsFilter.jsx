import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { TagSelect } from './TagSelect';
import { StatusSelect } from './StatusSelect';
import { SortSelect } from './SortSelect';
import { Button } from '../../../components/Button';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const ClientsFilter = ({ 
  onSearchChange, 
  onTagsChange, 
  onStatusChange, 
  onSortChange,
  onClearFilters,
  searchValue = '',
  selectedTags = [],
  selectedStatus = 'all',
  selectedSort = 'name_asc'
}) => {
  const hasActiveFilters = searchValue || selectedTags.length > 0 || selectedStatus !== 'all' || selectedSort !== 'name_asc';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Búsqueda */}
        <div className="flex-1">
          <SearchBar 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Buscar por nombre, email o ID..."
          />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
          <div className="min-w-[180px]">
            <TagSelect 
              selectedTags={selectedTags}
              onChange={onTagsChange}
            />
          </div>
          
          <div className="min-w-[140px]">
            <StatusSelect 
              value={selectedStatus}
              onChange={onStatusChange}
            />
          </div>
          
          <div className="min-w-[160px]">
            <SortSelect 
              value={selectedSort}
              onChange={onSortChange}
            />
          </div>
          
          {/* Limpiar filtros */}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <XMarkIcon className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>
      
      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-2 text-sm text-gray-600">
            {searchValue && (
              <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md">
                Búsqueda: "{searchValue}"
              </span>
            )}
            {selectedTags.length > 0 && (
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md">
                Tags: {selectedTags.length} seleccionados
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded-md">
                Estado: {selectedStatus}
              </span>
            )}
            {selectedSort !== 'name_asc' && (
              <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-md">
                Orden: {selectedSort}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};