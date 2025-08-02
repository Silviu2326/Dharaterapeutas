import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  PencilIcon,
  CalendarIcon,
  DocumentArrowUpIcon,
  TrashIcon,
  ChatBubbleLeftIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { ClientTabs } from './ClientTabs';
import { NewBookingModal } from './NewBookingModal';
import { UploadDocModal } from './UploadDocModal';
import { DeleteClientDialog } from './DeleteClientDialog';

// Mock data - en una aplicación real vendría de una API
const mockClientDetails = {
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
  messagesCount: 28,
  sessions: [
    {
      id: 'S001',
      date: '2024-01-15T10:00:00Z',
      duration: 60,
      type: 'Individual',
      status: 'completed',
      notes: 'Sesión muy productiva, trabajamos técnicas de respiración'
    },
    {
      id: 'S002',
      date: '2024-01-08T10:00:00Z',
      duration: 60,
      type: 'Individual',
      status: 'completed',
      notes: 'Revisión de tareas y nuevas estrategias de afrontamiento'
    }
  ],
  payments: [
    {
      id: 'P001',
      date: '2024-01-15T10:00:00Z',
      amount: 60,
      method: 'card',
      status: 'paid',
      description: 'Sesión individual - Enero 2024'
    }
  ],
  reviews: [
    {
      id: 'R001',
      date: '2024-01-15T10:00:00Z',
      rating: 5,
      comment: 'Excelente profesional, me ha ayudado mucho con mi ansiedad'
    }
  ]
};

export const ClientDetailPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isNewBookingModalOpen, setIsNewBookingModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    // Simular carga de datos del cliente
    const loadClient = async () => {
      setIsLoading(true);
      try {
        // En una aplicación real, aquí haríamos una llamada a la API
        await new Promise(resolve => setTimeout(resolve, 500));
        setClient(mockClientDetails);
      } catch (error) {
        console.error('Error loading client:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [clientId]);

  const handleBack = () => {
    navigate('/clients');
  };

  const handleEditClient = () => {
    // Implementar edición del cliente
    console.log('Edit client:', client.id);
  };

  const handleNewBooking = () => {
    setIsNewBookingModalOpen(true);
  };

  const handleUploadDoc = () => {
    setIsUploadDocModalOpen(true);
  };

  const handleDeleteClient = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleStartChat = () => {
    // Implementar chat con el cliente
    console.log('Start chat with client:', client.id);
  };

  const handleCall = () => {
    window.open(`tel:${client.phone}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${client.email}`);
  };

  const handleCreateBooking = async (bookingData) => {
    console.log('Creating booking:', bookingData);
    alert('Cita creada exitosamente');
    setIsNewBookingModalOpen(false);
  };

  const handleUploadDocuments = async (uploadData) => {
    console.log('Uploading documents:', uploadData);
    alert('Documentos subidos exitosamente');
    setIsUploadDocModalOpen(false);
  };

  const handleConfirmDeleteClient = async (clientId) => {
    console.log('Deleting client:', clientId);
    alert('Cliente eliminado exitosamente');
    setIsDeleteDialogOpen(false);
    navigate('/clients');
  };

  const handleDownloadClientData = async (clientId) => {
    console.log('Downloading client data:', clientId);
    // Simular descarga
    const link = document.createElement('a');
    link.href = '#';
    link.download = `cliente_${clientId}_datos.zip`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Cliente no encontrado</h2>
        <p className="text-gray-600 mb-4">El cliente solicitado no existe o no tienes permisos para verlo.</p>
        <Button onClick={handleBack}>Volver a clientes</Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'demo': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'demo': return 'Demo';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-sm text-gray-600">ID: {client.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCall}
            className="flex items-center gap-2"
          >
            <PhoneIcon className="h-4 w-4" />
            Llamar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEmail}
            className="flex items-center gap-2"
          >
            <EnvelopeIcon className="h-4 w-4" />
            Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartChat}
            className="flex items-center gap-2"
          >
            <ChatBubbleLeftIcon className="h-4 w-4" />
            Chat
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleNewBooking}
            className="flex items-center gap-2"
          >
            <CalendarIcon className="h-4 w-4" />
            Nueva cita
          </Button>
        </div>
      </div>

      {/* Client Summary Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {client.avatar ? (
                <img 
                  className="h-20 w-20 rounded-full object-cover" 
                  src={client.avatar} 
                  alt={client.name} 
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-2xl font-medium text-gray-700">
                    {client.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Client Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(client.status)}`}>
                  {getStatusLabel(client.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Email:</span>
                  <p className="font-medium">{client.email}</p>
                </div>
                <div>
                  <span className="text-gray-500">Teléfono:</span>
                  <p className="font-medium">{client.phone}</p>
                </div>
                <div>
                  <span className="text-gray-500">Última sesión:</span>
                  <p className="font-medium">
                    {client.lastSession 
                      ? new Date(client.lastSession).toLocaleDateString('es-ES')
                      : 'Sin sesiones'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Total sesiones:</span>
                  <p className="font-medium">{client.sessionsCount}</p>
                </div>
              </div>

              {/* Tags */}
              {client.tags && client.tags.length > 0 && (
                <div className="mt-3">
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClient}
                className="flex items-center gap-2"
              >
                <PencilIcon className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUploadDoc}
                className="flex items-center gap-2"
              >
                <DocumentArrowUpIcon className="h-4 w-4" />
                Subir doc
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClient}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Client Tabs */}
      <Card>
        <ClientTabs
          client={client}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onEditClient={handleEditClient}
          onNewBooking={handleNewBooking}
          onUploadDocument={handleUploadDoc}
          onDeleteClient={handleDeleteClient}
        />
      </Card>

      {/* Modals */}
      <NewBookingModal
        isOpen={isNewBookingModalOpen}
        onClose={() => setIsNewBookingModalOpen(false)}
        client={client}
        onCreateBooking={handleCreateBooking}
      />

      <UploadDocModal
        isOpen={isUploadDocModalOpen}
        onClose={() => setIsUploadDocModalOpen(false)}
        client={client}
        onUpload={handleUploadDocuments}
      />

      <DeleteClientDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        client={client}
        onDelete={handleConfirmDeleteClient}
        onDownloadData={handleDownloadClientData}
      />
    </div>
  );
};