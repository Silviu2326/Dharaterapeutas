import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { ViewTabs } from './components/ViewTabs';
import { AvailabilityCalendar } from './components/AvailabilityCalendar';
import { SidebarActions } from './components/SidebarActions';
import { SlotModal } from './components/SlotModal';
import { AbsenceModal } from './components/AbsenceModal';
import { OccupancyBar } from './components/OccupancyBar';
import { AlertTriangle, Loader } from 'lucide-react';

// Mock data for demonstration
const mockAvailabilitySlots = [
  {
    id: 'slot_1',
    title: 'Horario de mañana',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    startTime: '09:00',
    endTime: '13:00',
    repeat: 'weekly',
    color: 'sage',
    type: 'availability'
  },
  {
    id: 'slot_2',
    title: 'Horario de tarde',
    startDate: '2024-01-15',
    endDate: '2024-01-19',
    startTime: '15:00',
    endTime: '18:00',
    repeat: 'weekly',
    color: 'blue',
    type: 'availability'
  }
];

const mockAppointments = [
  {
    id: 'apt_1',
    title: 'Consulta con Juan Pérez',
    date: '2024-01-16',
    startTime: '10:00',
    endTime: '11:00',
    type: 'appointment',
    client: 'Juan Pérez'
  },
  {
    id: 'apt_2',
    title: 'Reunión con María García',
    date: '2024-01-17',
    startTime: '16:00',
    endTime: '17:00',
    type: 'appointment',
    client: 'María García'
  }
];

const mockAbsences = [
  {
    id: 'abs_1',
    title: 'Vacaciones',
    startDate: '2024-01-22',
    endDate: '2024-01-26',
    allDay: true,
    type: 'absence',
    absenceType: 'vacation'
  }
];

const mockWeekOccupancy = [
  { occupancy: 75, availableHours: 6, bookedHours: 6 }, // Monday
  { occupancy: 60, availableHours: 8, bookedHours: 5 }, // Tuesday
  { occupancy: 90, availableHours: 2, bookedHours: 8 }, // Wednesday
  { occupancy: 45, availableHours: 7, bookedHours: 4 }, // Thursday
  { occupancy: 80, availableHours: 4, bookedHours: 7 }, // Friday
  { occupancy: 30, availableHours: 5, bookedHours: 2 }, // Saturday
  { occupancy: 15, availableHours: 6, bookedHours: 1 }  // Sunday
];

export const Availability = () => {
  // State management
  const [currentView, setCurrentView] = useState('week');
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/Madrid');
  const [availabilitySlots, setAvailabilitySlots] = useState(mockAvailabilitySlots);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [absences, setAbsences] = useState(mockAbsences);
  const [weekOccupancy, setWeekOccupancy] = useState(mockWeekOccupancy);
  
  // Modal states
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [editingAbsence, setEditingAbsence] = useState(null);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState('disconnected');
  
  // Calendar state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Combine all events for calendar display
  useEffect(() => {
    const events = [
      ...availabilitySlots.map(slot => ({ ...slot, type: 'availability' })),
      ...appointments.map(apt => ({ ...apt, type: 'appointment' })),
      ...absences.map(abs => ({ ...abs, type: 'absence' }))
    ];
    setCalendarEvents(events);
  }, [availabilitySlots, appointments, absences]);

  // Handlers
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleTimezoneChange = (timezone) => {
    setSelectedTimezone(timezone);
  };

  const handleCreateSlot = () => {
    setEditingSlot(null);
    setIsSlotModalOpen(true);
  };

  const handleEditSlot = (slot) => {
    setEditingSlot(slot);
    setIsSlotModalOpen(true);
  };

  const handleCreateAbsence = () => {
    setEditingAbsence(null);
    setIsAbsenceModalOpen(true);
  };

  const handleEditAbsence = (absence) => {
    setEditingAbsence(absence);
    setIsAbsenceModalOpen(true);
  };

  const handleSaveSlot = async (slotData) => {
    setLoading(true);
    try {
      if (editingSlot) {
        // Update existing slot
        setAvailabilitySlots(prev => 
          prev.map(slot => slot.id === editingSlot.id ? { ...slot, ...slotData } : slot)
        );
      } else {
        // Create new slot
        setAvailabilitySlots(prev => [...prev, { ...slotData, id: `slot_${Date.now()}` }]);
      }
      setIsSlotModalOpen(false);
      setEditingSlot(null);
    } catch (err) {
      setError('Error al guardar el bloque de disponibilidad');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAbsence = async (absenceData) => {
    setLoading(true);
    try {
      if (editingAbsence) {
        // Update existing absence
        setAbsences(prev => 
          prev.map(absence => absence.id === editingAbsence.id ? { ...absence, ...absenceData } : absence)
        );
      } else {
        // Create new absence
        setAbsences(prev => [...prev, { ...absenceData, id: `absence_${Date.now()}` }]);
      }
      setIsAbsenceModalOpen(false);
      setEditingAbsence(null);
    } catch (err) {
      setError('Error al guardar la ausencia');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLastWeek = async () => {
    setLoading(true);
    try {
      // Mock copying last week's schedule
      const newSlots = availabilitySlots.map(slot => ({
        ...slot,
        id: `slot_copy_${Date.now()}_${Math.random()}`,
        startDate: new Date(new Date(slot.startDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(new Date(slot.endDate).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));
      setAvailabilitySlots(prev => [...prev, ...newSlots]);
    } catch (err) {
      setError('Error al copiar la semana anterior');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncGoogle = async () => {
    setLoading(true);
    setSyncStatus('syncing');
    try {
      // Mock Google Calendar sync
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSyncStatus('connected');
    } catch (err) {
      setSyncStatus('error');
      setError('Error al sincronizar con Google Calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleCalendarEventClick = (event) => {
    if (event.type === 'availability') {
      handleEditSlot(event);
    } else if (event.type === 'absence') {
      handleEditAbsence(event);
    }
  };

  const handleCalendarSlotSelect = (slotInfo) => {
    // Create new availability slot from calendar selection
    const newSlot = {
      startDate: slotInfo.start.toISOString().split('T')[0],
      endDate: slotInfo.end.toISOString().split('T')[0],
      startTime: slotInfo.start.toTimeString().slice(0, 5),
      endTime: slotInfo.end.toTimeString().slice(0, 5),
      timezone: selectedTimezone
    };
    setEditingSlot(newSlot);
    setIsSlotModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Disponibilidad</h1>
            <p className="text-gray-600 mt-1">Configura tu calendario, horarios y ausencias</p>
          </div>
          
          {/* View and timezone controls */}
          <div className="mt-4 sm:mt-0">
            <ViewTabs
              currentView={currentView}
              onViewChange={handleViewChange}
              selectedTimezone={selectedTimezone}
              onTimezoneChange={handleTimezoneChange}
            />
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          <SidebarActions
            onCreateSlot={handleCreateSlot}
            onCreateAbsence={handleCreateAbsence}
            onCopyLastWeek={handleCopyLastWeek}
            onSyncGoogle={handleSyncGoogle}
            syncStatus={syncStatus}
            loading={loading}
            availabilitySlots={availabilitySlots}
            appointments={appointments}
            absences={absences}
          />
        </div>

        {/* Main calendar area */}
        <div className="flex-1 space-y-6">
          {/* Occupancy bars */}
          <OccupancyBar
            weekData={weekOccupancy}
            currentWeek="15-21 Enero 2024"
            loading={loading}
            showSummary={true}
          />

          {/* Calendar */}
          <Card>
            <div className="p-6">
              <AvailabilityCalendar
                view={currentView}
                events={calendarEvents}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onEventClick={handleCalendarEventClick}
                onSlotSelect={handleCalendarSlotSelect}
                timezone={selectedTimezone}
                loading={loading}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <SlotModal
        isOpen={isSlotModalOpen}
        onClose={() => {
          setIsSlotModalOpen(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveSlot}
        slot={editingSlot}
        existingSlots={availabilitySlots}
        existingAppointments={appointments}
        defaultTimezone={selectedTimezone}
        loading={loading}
      />

      <AbsenceModal
        isOpen={isAbsenceModalOpen}
        onClose={() => {
          setIsAbsenceModalOpen(false);
          setEditingAbsence(null);
        }}
        onSave={handleSaveAbsence}
        absence={editingAbsence}
        existingAppointments={appointments}
        defaultTimezone={selectedTimezone}
        loading={loading}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <Loader className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-900">Procesando...</span>
          </div>
        </div>
      )}
    </div>
  );
};