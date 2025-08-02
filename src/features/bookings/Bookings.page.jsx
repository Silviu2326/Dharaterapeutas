import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { BookingsFilter } from './components/BookingsFilter';
import { BookingsTable } from './components/BookingsTable';
import { BookingDetailDrawer } from './components/BookingDetailDrawer';
import { RescheduleModal } from './components/RescheduleModal';
import { CancelModal } from './components/CancelModal';
import { StatusBadge } from './components/StatusBadge';
import { 
  Calendar,
  Clock,
  Users,
  TrendingUp,
  Filter,
  Download,
  Plus
} from 'lucide-react';

// Mock data for demonstration
const mockBookings = [
  {
    id: 'BK001',
    date: '2024-01-15',
    startTime: '09:00',
    endTime: '10:00',
    clientId: 'CL001',
    clientName: 'María García',
    clientEmail: 'maria.garcia@email.com',
    clientPhone: '+34 666 123 456',
    clientAvatar: null,
    clientSince: '2023',
    therapyType: 'Terapia Individual',
    therapyDuration: 60,
    status: 'upcoming',
    amount: 80,
    currency: 'EUR',
    paymentStatus: 'paid',
    paymentMethod: 'Tarjeta de crédito',
    location: 'Consulta 1',
    notes: 'Cliente con ansiedad generalizada. Continuar con técnicas de relajación.',
    meetingLink: 'https://meet.google.com/abc-def-ghi',
    createdAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 'BK002',
    date: '2024-01-15',
    startTime: '11:00',
    endTime: '12:00',
    clientId: 'CL002',
    clientName: 'Carlos Rodríguez',
    clientEmail: 'carlos.rodriguez@email.com',
    clientPhone: '+34 666 789 012',
    clientAvatar: null,
    therapyType: 'Terapia de Pareja',
    status: 'pending',
    amount: 120,
    currency: 'EUR',
    paymentStatus: 'unpaid',
    location: 'Consulta 2',
    notes: 'Primera sesión de terapia de pareja. Evaluar dinámicas de comunicación.',
    createdAt: '2024-01-12T14:30:00Z'
  },
  {
    id: 'BK003',
    date: '2024-01-14',
    startTime: '16:00',
    endTime: '17:00',
    clientId: 'CL003',
    clientName: 'Ana López',
    clientEmail: 'ana.lopez@email.com',
    clientPhone: '+34 666 345 678',
    clientAvatar: null,
    therapyType: 'Terapia Familiar',
    status: 'completed',
    amount: 100,
    currency: 'EUR',
    paymentStatus: 'paid',
    paymentMethod: 'Transferencia',
    location: 'Consulta 1',
    notes: 'Sesión completada. Buen progreso en la comunicación familiar.',
    sessionDocument: 'session_003.pdf',
    createdAt: '2024-01-08T09:15:00Z'
  },
  {
    id: 'BK004',
    date: '2024-01-13',
    startTime: '10:00',
    endTime: '11:00',
    clientId: 'CL004',
    clientName: 'Pedro Martín',
    clientEmail: 'pedro.martin@email.com',
    clientPhone: '+34 666 901 234',
    clientAvatar: null,
    therapyType: 'Terapia Individual',
    status: 'cancelled',
    amount: 80,
    currency: 'EUR',
    paymentStatus: 'refunded',
    location: 'Consulta 1',
    notes: 'Cancelado por el cliente por motivos de salud.',
    createdAt: '2024-01-05T16:45:00Z'
  },
  {
    id: 'BK005',
    date: '2024-01-12',
    startTime: '15:00',
    endTime: '16:00',
    clientId: 'CL005',
    clientName: 'Laura Fernández',
    clientEmail: 'laura.fernandez@email.com',
    clientPhone: '+34 666 567 890',
    clientAvatar: null,
    therapyType: 'Terapia Individual',
    status: 'no_show',
    amount: 80,
    currency: 'EUR',
    paymentStatus: 'paid',
    paymentMethod: 'Tarjeta de crédito',
    location: 'Consulta 2',
    notes: 'Cliente no se presentó a la cita sin previo aviso.',
    createdAt: '2024-01-07T11:20:00Z'
  }
];

// Mock available slots for rescheduling
const mockAvailableSlots = {
  '2024-01-16': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  '2024-01-17': ['09:00', '10:30', '12:00', '14:30', '16:00'],
  '2024-01-18': ['08:30', '10:00', '11:30', '15:00', '16:30'],
  '2024-01-19': ['09:00', '10:00', '14:00', '15:00'],
  '2024-01-22': ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'],
  '2024-01-23': ['08:30', '10:00', '11:30', '14:30', '16:00'],
  '2024-01-24': ['09:00', '10:30', '12:00', '15:00', '16:30'],
  '2024-01-25': ['09:00', '11:00', '14:00', '15:00', '16:00'],
  '2024-01-26': ['08:30', '10:00', '11:30', '14:30', '15:30']
};

export const Bookings = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState(mockBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToReschedule, setBookingToReschedule] = useState(null);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('desktop'); // desktop | mobile

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    dateRange: { start: null, end: null },
    status: 'all'
  });

  // Sorting state
  const [sortConfig, setSortConfig] = useState({
    key: 'date',
    direction: 'asc'
  });

  // Check screen size for responsive view
  useEffect(() => {
    const checkScreenSize = () => {
      setViewMode(window.innerWidth < 768 ? 'mobile' : 'desktop');
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(booking => 
        booking.clientName.toLowerCase().includes(searchLower) ||
        booking.id.toLowerCase().includes(searchLower) ||
        booking.therapyType.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(booking => booking.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date);
        return bookingDate >= filters.dateRange.start && bookingDate <= filters.dateRange.end;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'date') {
        aValue = new Date(`${a.date}T${a.startTime}`);
        bValue = new Date(`${b.date}T${b.startTime}`);
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredBookings(filtered);
  }, [bookings, filters, sortConfig]);

  // Calculate statistics
  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    revenue: bookings
      .filter(b => b.status === 'completed' && b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + (b.amount || 0), 0)
  };

  // Event handlers
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsDetailDrawerOpen(true);
  };

  const handleReschedule = (booking) => {
    setBookingToReschedule(booking);
    setIsRescheduleModalOpen(true);
    setIsDetailDrawerOpen(false);
  };

  const handleCancel = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
    setIsDetailDrawerOpen(false);
  };

  const handleStartChat = (booking) => {
    // Implement chat functionality
    console.log('Starting chat with:', booking.clientName);
  };

  const handleJoinMeet = (booking) => {
    if (booking.meetingLink) {
      window.open(booking.meetingLink, '_blank');
    }
  };

  const handleMarkCompleted = async (booking) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prev => prev.map(b => 
        b.id === booking.id 
          ? { ...b, status: 'completed' }
          : b
      ));
      
      setIsDetailDrawerOpen(false);
    } catch (error) {
      console.error('Error marking booking as completed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReschedule = async (rescheduleData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setBookings(prev => prev.map(b => 
        b.id === rescheduleData.bookingId 
          ? { 
              ...b, 
              date: rescheduleData.newDate, 
              startTime: rescheduleData.newTime,
              status: 'upcoming'
            }
          : b
      ));
      
      console.log('Booking rescheduled successfully');
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCancel = async (cancelData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prev => prev.map(b => 
        b.id === cancelData.bookingId 
          ? { 
              ...b, 
              status: 'cancelled',
              notes: `${b.notes || ''} | Cancelado: ${cancelData.reason}`
            }
          : b
      ));
      
      console.log('Booking cancelled successfully');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateRange: { start: null, end: null },
      status: 'all'
    });
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting bookings data');
  };

  const handleNewBooking = () => {
    // Implement new booking functionality
    console.log('Creating new booking');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
          <p className="text-gray-600 mt-1">Administra las citas y reservas de tus clientes</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
          <button
            onClick={handleNewBooking}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cita
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Citas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.total}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Próximas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.upcoming}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completadas
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.completed}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Ingresos
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    €{stats.revenue.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="p-6">
          <BookingsFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            totalResults={filteredBookings.length}
          />
        </div>
      </Card>

      {/* Bookings Table */}
      <Card>
        <div className="overflow-hidden">
          <BookingsTable
            bookings={filteredBookings}
            viewMode={viewMode}
            sortConfig={sortConfig}
            onSort={handleSort}
            onBookingClick={handleBookingClick}
            onReschedule={handleReschedule}
            onCancel={handleCancel}
            onStartChat={handleStartChat}
            onJoinMeet={handleJoinMeet}
            isLoading={isLoading}
          />
        </div>
      </Card>

      {/* Detail Drawer */}
      <BookingDetailDrawer
        booking={selectedBooking}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onReschedule={handleReschedule}
        onCancel={handleCancel}
        onStartChat={handleStartChat}
        onJoinMeet={handleJoinMeet}
        onMarkCompleted={handleMarkCompleted}
        onEditNotes={(booking) => console.log('Edit notes for:', booking.id)}
        onViewClient={(clientId) => console.log('View client:', clientId)}
        onViewSession={(sessionDoc) => console.log('View session:', sessionDoc)}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        booking={bookingToReschedule}
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setBookingToReschedule(null);
        }}
        onConfirm={handleConfirmReschedule}
        availableSlots={mockAvailableSlots}
        isLoading={isLoading}
      />

      {/* Cancel Modal */}
      <CancelModal
        booking={bookingToCancel}
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        isLoading={isLoading}
      />
    </div>
  );
};