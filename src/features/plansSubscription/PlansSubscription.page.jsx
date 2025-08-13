import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Plus, Search, Filter, Users, Calendar, Target, BookOpen, TrendingUp, UserCheck, Bell } from 'lucide-react';
import { CreatePlanModal } from './components/CreatePlanModal';
import { PlanCard } from './components/PlanCard';
import { AssignPlanModal } from './components/AssignPlanModal';
import { PlanDetailsModal } from './components/PlanDetailsModal';
import { BookingIntegrationModal } from './components/BookingIntegrationModal';
import { TemplateLibrary } from './components/TemplateLibrary';
import { ProgressTracker } from './components/ProgressTracker';
import { BulkAssignment } from './components/BulkAssignment';
import { AutomaticReminders } from './components/AutomaticReminders';

export const PlansSubscription = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [clients, setClients] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [showProgressTracker, setShowProgressTracker] = useState(false);
  const [showBulkAssignment, setShowBulkAssignment] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [editingPlan, setEditingPlan] = useState(null);
  const [selectedPlanForBooking, setSelectedPlanForBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('plans');

  // Mock data - Planes terapéuticos
  const mockPlans = [
    {
      id: 'plan_1',
      name: 'Plan de Ansiedad Generalizada',
      type: 'ansiedad',
      description: 'Plan integral para el tratamiento de trastornos de ansiedad',
      duration: 12, // semanas
      sessionsPerWeek: 2,
      totalSessions: 24,
      status: 'active',
      createdDate: '2025-01-15',
      assignedClients: 5,
      objectives: [
        'Reducir niveles de ansiedad',
        'Desarrollar técnicas de relajación',
        'Mejorar autoestima',
        'Establecer rutinas saludables'
      ],
      techniques: [
        'Terapia Cognitivo-Conductual',
        'Mindfulness',
        'Técnicas de respiración',
        'Exposición gradual'
      ],
      homework: [
        'Diario de pensamientos',
        'Ejercicios de respiración diarios',
        'Práctica de mindfulness'
      ]
    },
    {
      id: 'plan_2',
      name: 'Terapia de Pareja',
      type: 'pareja',
      description: 'Plan especializado para mejorar la comunicación en parejas',
      duration: 16,
      sessionsPerWeek: 1,
      totalSessions: 16,
      status: 'active',
      createdDate: '2025-01-20',
      assignedClients: 3,
      objectives: [
        'Mejorar comunicación',
        'Resolver conflictos',
        'Fortalecer vínculos emocionales',
        'Establecer límites saludables'
      ],
      techniques: [
        'Terapia Sistémica',
        'Comunicación asertiva',
        'Técnicas de negociación',
        'Ejercicios de empatía'
      ],
      homework: [
        'Ejercicios de comunicación',
        'Tiempo de calidad programado',
        'Diario de gratitud compartido'
      ]
    },
    {
      id: 'plan_3',
      name: 'Recuperación de Depresión',
      type: 'depresion',
      description: 'Plan integral para el tratamiento de episodios depresivos',
      duration: 20,
      sessionsPerWeek: 2,
      totalSessions: 40,
      status: 'draft',
      createdDate: '2025-02-01',
      assignedClients: 0,
      objectives: [
        'Mejorar estado de ánimo',
        'Aumentar actividad física',
        'Desarrollar red de apoyo',
        'Establecer metas realistas'
      ],
      techniques: [
        'Terapia Cognitivo-Conductual',
        'Activación conductual',
        'Terapia interpersonal',
        'Técnicas de autocompasión'
      ],
      homework: [
        'Registro de actividades',
        'Ejercicio físico regular',
        'Conexión social programada'
      ]
    }
  ];

  const mockClients = [
    {
      id: 'client_1',
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+34 666 123 456',
      assignedPlans: ['plan_1'],
      status: 'active',
      joinDate: '2025-01-20'
    },
    {
      id: 'client_2',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      phone: '+34 666 789 012',
      assignedPlans: ['plan_1', 'plan_2'],
      status: 'active',
      joinDate: '2025-01-25'
    },
    {
      id: 'client_3',
      name: 'Ana Martín',
      email: 'ana.martin@email.com',
      phone: '+34 666 345 678',
      assignedPlans: ['plan_2'],
      status: 'active',
      joinDate: '2025-02-01'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlans(mockPlans);
      setClients(mockClients);
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar planes según búsqueda y filtros
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || plan.status === filterStatus;
    const matchesType = filterType === 'all' || plan.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCreatePlan = async (planData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newPlan = {
        id: `plan_${Date.now()}`,
        ...planData,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        assignedClients: 0
      };
      
      setPlans(prev => [...prev, newPlan]);
      console.log('Plan creado exitosamente:', newPlan);
    } catch (error) {
      throw new Error('Error al crear el plan');
    }
  };

  const handleClonePlan = async (planToClone) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const clonedPlan = {
        ...planToClone,
        id: `plan_${Date.now()}`,
        name: `${planToClone.name} (Copia)`,
        status: 'draft',
        createdDate: new Date().toISOString().split('T')[0],
        assignedClients: 0
      };
      
      setPlans(prev => [...prev, clonedPlan]);
      console.log('Plan clonado exitosamente:', clonedPlan);
    } catch (error) {
      throw new Error('Error al clonar el plan');
    }
  };

  const handleScheduleSessions = (plan) => {
    setSelectedPlanForBooking(plan);
    setShowBookingModal(true);
  };

  const handleEditPlanOpen = (plan) => {
    setEditingPlan(plan);
    setShowEditModal(true);
  };

  const handleEditPlanSave = async (planData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPlans(prev => prev.map(plan => 
        plan.id === editingPlan.id 
          ? { ...plan, ...planData, totalSessions: planData.duration * planData.sessionsPerWeek }
          : plan
      ));
      
      setShowEditModal(false);
      setEditingPlan(null);
      console.log('Plan actualizado exitosamente');
    } catch (error) {
      throw new Error('Error al actualizar el plan');
    }
  };

  const handleEditPlan = async (planId, planData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, ...planData } : plan
      ));
      
      console.log('Plan actualizado exitosamente');
    } catch (error) {
      throw new Error('Error al actualizar el plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlans(prev => prev.filter(plan => plan.id !== planId));
      console.log('Plan eliminado exitosamente');
    } catch (error) {
      throw new Error('Error al eliminar el plan');
    }
  };

  const handleAssignPlan = async (planId, clientIds) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actualizar clientes con el plan asignado
      setClients(prev => prev.map(client => {
        if (clientIds.includes(client.id)) {
          return {
            ...client,
            assignedPlans: [...new Set([...client.assignedPlans, planId])]
          };
        }
        return client;
      }));
      
      // Actualizar contador de clientes asignados en el plan
      setPlans(prev => prev.map(plan => {
        if (plan.id === planId) {
          return {
            ...plan,
            assignedClients: plan.assignedClients + clientIds.length
          };
        }
        return plan;
      }));
      
      console.log('Plan asignado exitosamente');
    } catch (error) {
      throw new Error('Error al asignar el plan');
    }
  };

  const handleViewPlanDetails = (plan) => {
    setSelectedPlan(plan);
    setShowDetailsModal(true);
  };

  const handleActivatePlan = async (planId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, status: 'active' } : plan
      ));
      
      console.log('Plan activado exitosamente');
    } catch (error) {
      throw new Error('Error al activar el plan');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Planes Terapéuticos</h1>
            <p className="mt-2 text-gray-600">Crea, gestiona y asigna planes de tratamiento para tus clientes</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Plan
          </Button>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'plans'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Mis Planes
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Biblioteca de Plantillas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Seguimiento de Progreso
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bulk')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bulk'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Asignación Masiva
              </div>
            </button>
            <button
              onClick={() => setActiveTab('reminders')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reminders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Recordatorios Automáticos
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'plans' && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Planes</p>
                  <p className="text-2xl font-bold text-gray-900">{plans.length}</p>
                </div>
              </div>
            </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Planes Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(p => p.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes Asignados</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.reduce((total, plan) => total + plan.assignedClients, 0)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Borradores</p>
              <p className="text-2xl font-bold text-gray-900">
                {plans.filter(p => p.status === 'draft').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar planes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="draft">Borradores</option>
              <option value="archived">Archivados</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="ansiedad">Ansiedad</option>
              <option value="depresion">Depresión</option>
              <option value="pareja">Terapia de Pareja</option>
              <option value="trauma">Trauma</option>
              <option value="adicciones">Adicciones</option>
            </select>
          </div>
        </div>
      </Card>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredPlans.map(plan => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onView={() => handleViewPlanDetails(plan)}
                onEdit={() => handleEditPlanOpen(plan)}
                onClone={() => handleClonePlan(plan)}
                onDelete={() => handleDeletePlan(plan.id)}
                onAssign={() => {
                  setSelectedPlan(plan);
                  setShowAssignModal(true);
                }}
                onActivate={() => handleActivatePlan(plan.id)}
                onScheduleSessions={() => handleScheduleSessions(plan)}
              />
            ))}
          </div>

          {filteredPlans.length === 0 && (
            <Card className="p-12 text-center">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron planes</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer plan terapéutico'}
              </p>
              {!searchTerm && filterStatus === 'all' && filterType === 'all' && (
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Plan
                </Button>
              )}
            </Card>
          )}
        </>
      )}

      {activeTab === 'templates' && (
        <TemplateLibrary />
      )}

      {activeTab === 'progress' && (
        <ProgressTracker plans={plans} clients={clients} />
      )}

      {activeTab === 'bulk' && (
        <BulkAssignment plans={plans} clients={clients} onAssign={handleAssignPlan} />
      )}

      {activeTab === 'reminders' && (
        <AutomaticReminders plans={plans} clients={clients} />
      )}

      {/* Modals */}
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreatePlan}
      />

      <CreatePlanModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingPlan(null);
        }}
        onSave={handleEditPlanSave}
        initialData={editingPlan}
        isEditing={true}
      />

      <AssignPlanModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        clients={clients}
        onAssign={handleAssignPlan}
      />

      <PlanDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        clients={clients}
      />

      <BookingIntegrationModal
         isOpen={showBookingModal}
         onClose={() => {
           setShowBookingModal(false);
           setSelectedPlanForBooking(null);
         }}
         plan={selectedPlanForBooking}
         clients={clients}
       />
    </div>
  );
};