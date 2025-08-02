import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { ClientsFilter } from './components/ClientsFilter';
import { ClientsTable } from './components/ClientsTable';
import { ClientDrawer } from './components/ClientDrawer';
import { NewBookingModal } from './components/NewBookingModal';
import { UploadDocModal } from './components/UploadDocModal';
import { DeleteClientDialog } from './components/DeleteClientDialog';
import { BulkActionsModal } from './components/BulkActionsModal';
import { downloadClientsCSV, downloadClientStatsCSV, EXPORT_PRESETS } from './utils/exportUtils';

// Mock data para demostración
const mockClients = [
  {
    id: 'CL001',
    name: 'Ana García López',
    email: 'ana.garcia@email.com',
    phone: '+34 666 123 456',
    avatar: null,
    status: 'active',
    lastSession: '2024-01-15T10:00:00Z',
    sessionsCount: 12,
    rating: 4.8,
    tags: ['Ansiedad', 'Terapia Individual'],
    createdAt: '2023-06-15T09:00:00Z',
    age: 32,
    address: 'Calle Mayor 123, Madrid',
    emergencyContact: {
      name: 'Carlos García',
      phone: '+34 666 789 012',
      relationship: 'Esposo'
    },
    notes: 'Cliente muy colaborativa, progreso excelente en manejo de ansiedad.',
    paymentsCount: 12,
    documentsCount: 5,
    messagesCount: 28
  },
  {
    id: 'CL002',
    name: 'Miguel Rodríguez',
    email: 'miguel.rodriguez@email.com',
    phone: '+34 677 234 567',
    avatar: null,
    status: 'active',
    lastSession: '2024-01-12T16:30:00Z',
    sessionsCount: 8,
    rating: 4.5,
    tags: ['Depresión', 'Terapia Individual'],
    createdAt: '2023-09-20T14:00:00Z',
    age: 28,
    address: 'Avenida de la Paz 45, Barcelona',
    emergencyContact: {
      name: 'María Rodríguez',
      phone: '+34 677 345 678',
      relationship: 'Madre'
    },
    notes: 'Paciente con episodios depresivos recurrentes. Responde bien a TCC.',
    paymentsCount: 8,
    documentsCount: 3,
    messagesCount: 15
  },
  {
    id: 'CL003',
    name: 'Laura y David Martín',
    email: 'laura.martin@email.com',
    phone: '+34 688 345 678',
    avatar: null,
    status: 'active',
    lastSession: '2024-01-10T18:00:00Z',
    sessionsCount: 6,
    rating: 4.9,
    tags: ['Terapia de Pareja', 'Comunicación'],
    createdAt: '2023-11-05T11:00:00Z',
    age: 35,
    address: 'Plaza del Sol 8, Valencia',
    emergencyContact: {
      name: 'Carmen Martín',
      phone: '+34 688 456 789',
      relationship: 'Hermana'
    },
    notes: 'Pareja trabajando en mejorar comunicación. Muy comprometidos.',
    paymentsCount: 6,
    documentsCount: 2,
    messagesCount: 22
  },
  {
    id: 'CL004',
    name: 'Carmen Jiménez',
    email: 'carmen.jimenez@email.com',
    phone: '+34 699 456 789',
    avatar: null,
    status: 'inactive',
    lastSession: '2023-12-20T12:00:00Z',
    sessionsCount: 15,
    rating: 4.7,
    tags: ['Trauma', 'EMDR'],
    createdAt: '2023-03-10T10:00:00Z',
    age: 41,
    address: 'Calle de la Luna 67, Sevilla',
    emergencyContact: {
      name: 'José Jiménez',
      phone: '+34 699 567 890',
      relationship: 'Hermano'
    },
    notes: 'Completó tratamiento para trauma. Alta terapéutica exitosa.',
    paymentsCount: 15,
    documentsCount: 8,
    messagesCount: 45
  },
  {
    id: 'CL005',
    name: 'Roberto Silva',
    email: 'roberto.silva@email.com',
    phone: '+34 610 567 890',
    avatar: null,
    status: 'demo',
    lastSession: null,
    sessionsCount: 0,
    rating: null,
    tags: ['Consulta Inicial'],
    createdAt: '2024-01-08T15:30:00Z',
    age: 26,
    address: 'Paseo de Gracia 123, Barcelona',
    emergencyContact: {
      name: 'Ana Silva',
      phone: '+34 610 678 901',
      relationship: 'Madre'
    },
    notes: 'Cliente potencial. Pendiente de primera sesión.',
    paymentsCount: 0,
    documentsCount: 1,
    messagesCount: 3
  }
];

export const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState(mockClients);
  const [filteredClients, setFilteredClients] = useState(mockClients);
  const [selectedClients, setSelectedClients] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [isLoading, setIsLoading] = useState(false);
  
  // Modal states
  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientDrawerOpen, setIsClientDrawerOpen] = useState(false);
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isBulkActionsModalOpen, setIsBulkActionsModalOpen] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    tags: [],
    status: 'all',
    sort: 'name-asc',
    therapyType: 'all',
    satisfaction: 'all',
    frequency: 'all'
  });
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...clients];
    
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.email.toLowerCase().includes(searchLower) ||
        client.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(client => 
        filters.tags.some(tag => client.tags.includes(tag))
      );
    }
    
    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(client => client.status === filters.status);
    }

    // Therapy type filter
    if (filters.therapyType !== 'all') {
      const therapyTypeMap = {
        'individual': ['Terapia Individual', 'Ansiedad', 'Depresión'],
        'couple': ['Terapia de Pareja', 'Comunicación'],
        'family': ['Terapia Familiar'],
        'group': ['Terapia Grupal'],
        'emdr': ['EMDR', 'Trauma'],
        'cbt': ['TCC', 'Cognitivo-Conductual']
      };
      
      const relevantTags = therapyTypeMap[filters.therapyType] || [];
      filtered = filtered.filter(client => 
        client.tags && client.tags.some(tag => 
          relevantTags.some(relevantTag => 
            tag.toLowerCase().includes(relevantTag.toLowerCase())
          )
        )
      );
    }

    // Satisfaction filter
    if (filters.satisfaction !== 'all') {
      const satisfactionRanges = {
        'excellent': { min: 4.5, max: 5.0 },
        'good': { min: 3.5, max: 4.4 },
        'average': { min: 2.5, max: 3.4 },
        'poor': { min: 1.0, max: 2.4 },
        'no_rating': { min: null, max: null }
      };
      
      const range = satisfactionRanges[filters.satisfaction];
      if (range.min === null) {
        filtered = filtered.filter(client => !client.rating || client.rating === 0);
      } else {
        filtered = filtered.filter(client => 
          client.rating && client.rating >= range.min && client.rating <= range.max
        );
      }
    }

    // Frequency filter
    if (filters.frequency !== 'all') {
      const frequencyRanges = {
        'high': { min: 16 },
        'medium': { min: 6, max: 15 },
        'low': { min: 1, max: 5 },
        'none': { min: 0, max: 0 }
      };
      
      const range = frequencyRanges[filters.frequency];
      filtered = filtered.filter(client => {
        const sessions = client.sessionsCount || 0;
        if (range.max !== undefined) {
          return sessions >= range.min && sessions <= range.max;
        } else {
          return sessions >= range.min;
        }
      });
    }
    
    // Sorting
    const [sortKey, sortDirection] = filters.sort.split('-');
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortKey) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'lastSession':
          aValue = a.lastSession ? new Date(a.lastSession) : new Date(0);
          bValue = b.lastSession ? new Date(b.lastSession) : new Date(0);
          break;
        case 'sessions':
          aValue = a.sessionsCount;
          bValue = b.sessionsCount;
          break;
        case 'created':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = a[sortKey];
          bValue = b[sortKey];
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredClients(filtered);
  }, [clients, filters]);
  
  // Handlers
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      status: 'all',
      sort: 'name-asc',
      therapyType: 'all',
      satisfaction: 'all',
      frequency: 'all'
    });
    setSelectedClients([]);
  };
  
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };
  
  const handleSelectClient = (clientId) => {
    setSelectedClients(prev => 
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };
  
  const handleSelectAllClients = () => {
    setSelectedClients(
      selectedClients.length === filteredClients.length
        ? []
        : filteredClients.map(client => client.id)
    );
  };
  
  const handleViewClient = (client) => {
    // Navegar a la página de detalle del cliente
    navigate(`/clients/${client.id}`);
  };

  const handleViewClientDrawer = (client) => {
    setSelectedClient(client);
    setIsClientDrawerOpen(true);
  };
  
  const handleNewBooking = (client) => {
    setSelectedClient(client);
    setIsNewBookingModalOpen(true);
  };
  
  const handleUploadDoc = (client) => {
    setSelectedClient(client);
    setIsUploadDocModalOpen(true);
  };
  
  const handleDeleteClient = (client) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };
  
  const handleCreateBooking = async (bookingData) => {
    console.log('Creating booking:', bookingData);
    // Aquí se implementaría la lógica para crear la cita
    // Por ahora solo simulamos el éxito
    alert('Cita creada exitosamente');
  };
  
  const handleUploadDocuments = async (uploadData) => {
    console.log('Uploading documents:', uploadData);
    // Aquí se implementaría la lógica para subir documentos
    alert('Documentos subidos exitosamente');
  };
  
  const handleDownloadClientData = async (clientId) => {
    console.log('Downloading client data:', clientId);
    // Aquí se implementaría la lógica para generar y descargar el ZIP
    // Simulamos la descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = `cliente_${clientId}_datos.zip`;
    link.click();
  };
  
  const handleConfirmDeleteClient = async (clientId) => {
    console.log('Deleting client:', clientId);
    // Aquí se implementaría la lógica para eliminar el cliente
    setClients(prev => prev.filter(client => client.id !== clientId));
    alert('Cliente eliminado exitosamente');
  };

  // Nuevos handlers para filtros avanzados
  const handleTherapyTypeChange = (therapyType) => {
    setFilters(prev => ({ ...prev, therapyType }));
  };

  const handleSatisfactionChange = (satisfaction) => {
    setFilters(prev => ({ ...prev, satisfaction }));
  };

  const handleFrequencyChange = (frequency) => {
    setFilters(prev => ({ ...prev, frequency }));
  };

  // Handler para exportar CSV
  const handleExportCSV = () => {
    try {
      downloadClientsCSV(filteredClients, 'clientes_filtrados', EXPORT_PRESETS.complete);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Error al exportar los datos. Por favor, inténtalo de nuevo.');
    }
  };

  // Handler para acciones masivas
  const handleBulkActions = () => {
    if (selectedClients.length === 0) {
      alert('Por favor, selecciona al menos un cliente.');
      return;
    }
    setIsBulkActionsModalOpen(true);
  };

  const handleExecuteBulkAction = async (actionData) => {
    console.log('Executing bulk action:', actionData);
    
    try {
      switch (actionData.action) {
        case 'send_message':
          alert(`Mensaje enviado a ${actionData.clientIds.length} clientes`);
          break;
        case 'send_email':
          alert(`Email enviado a ${actionData.clientIds.length} clientes`);
          break;
        case 'assign_plan':
          alert(`Plan asignado a ${actionData.clientIds.length} clientes`);
          break;
        case 'schedule_session':
          alert(`Sesiones programadas para ${actionData.clientIds.length} clientes`);
          break;
        case 'add_notes':
          alert(`Notas añadidas a ${actionData.clientIds.length} clientes`);
          break;
        default:
          alert('Acción ejecutada correctamente');
      }
      
      // Limpiar selección después de ejecutar la acción
      setSelectedClients([]);
    } catch (error) {
      console.error('Error executing bulk action:', error);
      alert('Error al ejecutar la acción. Por favor, inténtalo de nuevo.');
    }
  };

  // Obtener objetos de clientes seleccionados para las acciones masivas
  const getSelectedClientObjects = () => {
    return filteredClients.filter(client => selectedClients.includes(client.id));
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <p className="mt-1 text-sm text-gray-600">
          Gestiona la información de tus clientes y su historial de sesiones.
        </p>
      </div>
      
      {/* Filtros */}
      <ClientsFilter
        onSearchChange={(search) => handleFilterChange({ search })}
        onTagsChange={(tags) => handleFilterChange({ tags })}
        onStatusChange={(status) => handleFilterChange({ status })}
        onSortChange={(sort) => handleFilterChange({ sort })}
        onTherapyTypeChange={handleTherapyTypeChange}
        onSatisfactionChange={handleSatisfactionChange}
        onFrequencyChange={handleFrequencyChange}
        onExportCSV={handleExportCSV}
        onClearFilters={handleClearFilters}
        searchValue={filters.search}
        selectedTags={filters.tags}
        selectedStatus={filters.status}
        selectedSort={filters.sort}
        selectedTherapyType={filters.therapyType}
        selectedSatisfaction={filters.satisfaction}
        selectedFrequency={filters.frequency}
      />

      {/* Acciones masivas */}
      {selectedClients.length > 0 && (
        <Card>
          <div className="p-4 bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-blue-900">
                  {selectedClients.length} cliente{selectedClients.length !== 1 ? 's' : ''} seleccionado{selectedClients.length !== 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleBulkActions}
                  >
                    Acciones masivas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedClients([])}
                  >
                    Cancelar selección
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
      
      {/* Tabla de clientes */}
      <Card>
        <ClientsTable
          clients={filteredClients}
          selectedClients={selectedClients}
          sortConfig={sortConfig}
          isLoading={isLoading}
          onSort={handleSort}
          onSelectClient={handleSelectClient}
          onSelectAll={handleSelectAllClients}
          onViewClient={handleViewClient}
          onViewClientDrawer={handleViewClientDrawer}
          onNewBooking={handleNewBooking}
          onUploadDoc={handleUploadDoc}
          onDeleteClient={handleDeleteClient}
        />
      </Card>
      
      {/* Client Drawer */}
      <ClientDrawer
        isOpen={isClientDrawerOpen}
        onClose={() => {
          setIsClientDrawerOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
      />
      
      {/* New Booking Modal */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => {
          setIsNewBookingModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onCreateBooking={handleCreateBooking}
      />
      
      {/* Upload Document Modal */}
      <UploadDocModal
        isOpen={isUploadDocModalOpen}
        onClose={() => {
          setIsUploadDocModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onUpload={handleUploadDocuments}
      />
      
      {/* Delete Client Dialog */}
      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setClientToDelete(null);
        }}
        client={clientToDelete}
        onDelete={handleConfirmDeleteClient}
        onDownloadData={handleDownloadClientData}
      />

      {/* Bulk Actions Modal */}
      <BulkActionsModal
        isOpen={isBulkActionsModalOpen}
        onClose={() => setIsBulkActionsModalOpen(false)}
        selectedClients={getSelectedClientObjects()}
        onExecuteAction={handleExecuteBulkAction}
      />
    </div>
  );
};