import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { ClientsFilter } from './components/ClientsFilter';
import { ClientsTable } from './components/ClientsTable';
import { ClientDrawer } from './components/ClientDrawer';
import { NewBookingModal } from './components/NewBookingModal';
import { UploadDocModal } from './components/UploadDocModal';
import { DeleteClientDialog } from './components/DeleteClientDialog';

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
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    tags: [],
    status: 'all',
    sort: 'name-asc'
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
      sort: 'name-asc'
    });
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
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        clientsCount={filteredClients.length}
        totalCount={clients.length}
      />
      
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
    </div>
  );
};