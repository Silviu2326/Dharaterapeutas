import React, { useState } from 'react';
import { Eye, Edit, Trash2, Users, Calendar, Clock, Target, MoreVertical, Play } from 'lucide-react';
import { Button } from '../../../components/Button';

const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800';
    case 'archived':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'draft':
      return 'Borrador';
    case 'archived':
      return 'Archivado';
    default:
      return status;
  }
};

const getTypeColor = (type) => {
  const colors = {
    ansiedad: 'bg-blue-100 text-blue-800',
    depresion: 'bg-purple-100 text-purple-800',
    pareja: 'bg-pink-100 text-pink-800',
    trauma: 'bg-red-100 text-red-800',
    adicciones: 'bg-orange-100 text-orange-800',
    infantil: 'bg-green-100 text-green-800',
    familiar: 'bg-indigo-100 text-indigo-800'
  };
  return colors[type] || 'bg-gray-100 text-gray-800';
};

const getTypeLabel = (type) => {
  const types = {
    ansiedad: 'Ansiedad',
    depresion: 'Depresión',
    pareja: 'Terapia de Pareja',
    trauma: 'Trauma',
    adicciones: 'Adicciones',
    infantil: 'Terapia Infantil',
    familiar: 'Terapia Familiar'
  };
  return types[type] || type;
};

export const PlanCard = ({ 
  plan,
  onView,
  onEdit,
  onDelete,
  onAssign,
  onActivate,
  className = '' 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  
  return (
    <div className={`
      relative bg-white rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-lg hover:border-gray-300
      ${className}
    `}>
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{plan.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                {getStatusLabel(plan.status)}
              </span>
            </div>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(plan.type)}`}>
              {getTypeLabel(plan.type)}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    onView();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </button>
                <button
                  onClick={() => {
                    onAssign();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Asignar clientes
                </button>
                {plan.status === 'draft' && (
                  <button
                    onClick={() => {
                      onActivate();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Activar plan
                  </button>
                )}
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{plan.description}</p>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded">
              <Clock className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Duración</p>
              <p className="text-sm font-medium">{plan.duration} semanas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded">
              <Calendar className="w-3 h-3 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Frecuencia</p>
              <p className="text-sm font-medium">{plan.sessionsPerWeek}/semana</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded">
              <Target className="w-3 h-3 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Sesiones</p>
              <p className="text-sm font-medium">{plan.totalSessions} total</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-100 rounded">
              <Users className="w-3 h-3 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Clientes</p>
              <p className="text-sm font-medium">{plan.assignedClients}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Objectives Preview */}
      <div className="px-6 pb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Objetivos principales:</h4>
        <div className="space-y-1">
          {plan.objectives.slice(0, 2).map((objective, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs text-gray-600 line-clamp-1">{objective}</p>
            </div>
          ))}
          {plan.objectives.length > 2 && (
            <p className="text-xs text-gray-500 ml-3.5">+{plan.objectives.length - 2} más...</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Creado: {new Date(plan.createdDate).toLocaleDateString('es-ES')}
          </div>
          <Button
            size="sm"
            onClick={onView}
            className="text-xs"
          >
            Ver detalles
          </Button>
        </div>
      </div>
      
      {/* Click overlay to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};