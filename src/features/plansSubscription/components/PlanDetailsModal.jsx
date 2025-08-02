import React, { useState } from 'react';
import { X, Calendar, Users, Target, Brain, BookOpen, Clock, Check } from 'lucide-react';
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

export const PlanDetailsModal = ({ isOpen, onClose, plan, clients }) => {
  const [completedObjectives, setCompletedObjectives] = useState(new Set());
  const [completedHomework, setCompletedHomework] = useState(new Set());

  if (!isOpen || !plan) return null;

  // Obtener clientes asignados a este plan
  const assignedClients = clients.filter(client => 
    client.assignedPlans.includes(plan.id)
  );

  const toggleObjectiveComplete = (index) => {
    const newCompleted = new Set(completedObjectives);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedObjectives(newCompleted);
  };

  const toggleHomeworkComplete = (index) => {
    const newCompleted = new Set(completedHomework);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedHomework(newCompleted);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{plan.name}</h2>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
              {getStatusLabel(plan.status)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Información general */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Información General</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tipo de Plan</p>
                      <p className="text-gray-900">{getTypeLabel(plan.type)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Fecha de Creación</p>
                      <p className="text-gray-900">{new Date(plan.createdDate).toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Descripción</p>
                    <p className="text-gray-900">{plan.description}</p>
                  </div>
                </div>
              </div>

              {/* Objetivos */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Objetivos del Plan
                  <span className="text-sm text-gray-500 ml-2">
                    ({completedObjectives.size}/{plan.objectives.length} completados)
                  </span>
                </h3>
                <div className="space-y-2">
                  {plan.objectives.map((objective, index) => {
                    const isCompleted = completedObjectives.has(index);
                    return (
                      <div key={index} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                        isCompleted ? 'bg-green-50 border border-green-200' : 'bg-blue-50'
                      }`}>
                        <button
                          onClick={() => toggleObjectiveComplete(index)}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mt-0.5 transition-colors ${
                            isCompleted 
                              ? 'bg-green-600 text-white hover:bg-green-700' 
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {isCompleted ? <Check className="w-3 h-3" /> : index + 1}
                        </button>
                        <p className={`flex-1 transition-all ${
                          isCompleted ? 'text-green-900 line-through' : 'text-gray-900'
                        }`}>{objective}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Técnicas */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  Técnicas Terapéuticas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {plan.techniques.map((technique, index) => (
                    <div key={index} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-gray-900 font-medium">{technique}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tareas para casa */}
              {plan.homework && plan.homework.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-green-600" />
                    Tareas para Casa
                    <span className="text-sm text-gray-500 ml-2">
                      ({completedHomework.size}/{plan.homework.length} completadas)
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {plan.homework.map((hw, index) => {
                      const isCompleted = completedHomework.has(index);
                      return (
                        <div key={index} className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                          isCompleted ? 'bg-green-100 border border-green-200' : 'bg-green-50 hover:bg-green-100'
                        }`} onClick={() => toggleHomeworkComplete(index)}>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isCompleted 
                              ? 'bg-green-600 border-green-600 text-white' 
                              : 'border-green-300 hover:border-green-500'
                          }`}>
                            {isCompleted && <Check className="w-3 h-3" />}
                          </div>
                          <p className={`flex-1 transition-all ${
                            isCompleted ? 'text-green-900 line-through' : 'text-gray-900'
                          }`}>{hw}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Panel lateral */}
            <div className="space-y-6">
              {/* Estadísticas */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4">Estadísticas</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Duración</p>
                      <p className="font-medium">{plan.duration} semanas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Frecuencia</p>
                      <p className="font-medium">{plan.sessionsPerWeek} sesión(es)/semana</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Sesiones</p>
                      <p className="font-medium">{plan.totalSessions} sesiones</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Users className="w-4 h-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Clientes Asignados</p>
                      <p className="font-medium">{plan.assignedClients}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clientes asignados */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Clientes Asignados
                </h3>
                {assignedClients.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay clientes asignados</p>
                ) : (
                  <div className="space-y-3">
                    {assignedClients.map(client => (
                      <div key={client.id} className="bg-white p-3 rounded-lg border">
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Cliente desde: {new Date(client.joinDate).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};