import React, { useState, useCallback } from 'react';
import { Calendar, Clock, Users, AlertCircle } from 'lucide-react';

// Mock calendar component since react-big-calendar would need installation
const MockCalendarGrid = ({ 
  view, 
  events, 
  onSelectSlot, 
  onSelectEvent, 
  onEventDrop,
  timezone 
}) => {
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const days = view === 'week' 
    ? ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']
    : Array.from({ length: 30 }, (_, i) => i + 1);

  const handleDragStart = (event, eventData) => {
    setDraggedEvent(eventData);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (event, slot) => {
    event.preventDefault();
    setDragOver(slot);
  };

  const handleDrop = (event, slot) => {
    event.preventDefault();
    if (draggedEvent) {
      onEventDrop?.(draggedEvent, slot);
    }
    setDraggedEvent(null);
    setDragOver(null);
  };

  const handleMouseDown = (slot) => {
    setIsSelecting(true);
    setSelectionStart(slot);
    setSelectionEnd(slot);
    setSelectedSlots([slot]);
  };

  const handleMouseEnter = (slot) => {
    if (isSelecting && selectionStart) {
      setSelectionEnd(slot);
      // Calculate all slots in selection rectangle
      const startDay = Math.min(selectionStart.day, slot.day);
      const endDay = Math.max(selectionStart.day, slot.day);
      const startHour = Math.min(selectionStart.hour, slot.hour);
      const endHour = Math.max(selectionStart.hour, slot.hour);
      
      const newSelectedSlots = [];
      for (let day = startDay; day <= endDay; day++) {
        for (let hour = startHour; hour <= endHour; hour++) {
          newSelectedSlots.push({ day, hour, slotId: `${day}-${hour}` });
        }
      }
      setSelectedSlots(newSelectedSlots);
    }
  };

  const handleMouseUp = () => {
    if (isSelecting && selectedSlots.length > 0) {
      // Create availability slot from selection
      onSelectSlot?.({
        type: 'multi-slot',
        slots: selectedSlots,
        startSlot: selectionStart,
        endSlot: selectionEnd
      });
    }
    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setSelectedSlots([]);
  };

  const isSlotSelected = (slot) => {
    return selectedSlots.some(s => s.day === slot.day && s.hour === slot.hour);
  };

  const getEventStyle = (event) => {
    switch (event.type) {
      case 'appointment':
        return 'bg-deep text-white border-deep';
      case 'availability':
        return 'bg-transparent border-2 border-sage text-sage';
      case 'absence':
        return 'bg-gray-400 text-white border-gray-400';
      default:
        return 'bg-blue-500 text-white border-blue-500';
    }
  };

  const renderWeekView = () => (
    <div className="grid grid-cols-8 gap-1 h-96 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-2 text-xs font-medium text-gray-500">
        Hora
      </div>
      {days.map((day) => (
        <div key={day} className="sticky top-0 bg-white border-b p-2 text-xs font-medium text-center text-gray-700">
          {day}
        </div>
      ))}
      
      {/* Time slots */}
      {hours.map((hour) => (
        <React.Fragment key={hour}>
          <div className="border-r p-2 text-xs text-gray-500 bg-gray-50">
            {hour.toString().padStart(2, '0')}:00
          </div>
          {days.map((day, dayIndex) => {
            const slotId = `${dayIndex}-${hour}`;
            const slotEvents = events.filter(e => 
              e.day === dayIndex && e.hour === hour
            );
            
            const currentSlot = { day: dayIndex, hour, slotId };
            const isSelected = isSlotSelected(currentSlot);
            
            return (
              <div
                key={slotId}
                className={`
                  border border-gray-200 p-1 min-h-[40px] cursor-pointer select-none
                  hover:bg-sage/10 transition-colors duration-150
                  ${dragOver === slotId ? 'bg-sage/20' : ''}
                  ${isSelected ? 'bg-sage/30 border-sage border-2' : ''}
                  ${isSelecting ? 'cursor-crosshair' : 'cursor-pointer'}
                `}
                onClick={() => !isSelecting && onSelectSlot?.({ day: dayIndex, hour, slotId })}
                onMouseDown={() => handleMouseDown(currentSlot)}
                onMouseEnter={() => handleMouseEnter(currentSlot)}
                onMouseUp={handleMouseUp}
                onDragOver={(e) => handleDragOver(e, slotId)}
                onDrop={(e) => handleDrop(e, { day: dayIndex, hour, slotId })}
              >
                {slotEvents.map((event, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectEvent?.(event);
                    }}
                    className={`
                      text-xs p-1 rounded mb-1 cursor-move border
                      ${getEventStyle(event)}
                      hover:shadow-sm transition-shadow duration-150
                    `}
                    title={event.title}
                  >
                    <div className="truncate font-medium">{event.title}</div>
                    {event.subtitle && (
                      <div className="truncate opacity-75">{event.subtitle}</div>
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );

  const renderMonthView = () => (
    <div className="grid grid-cols-7 gap-1">
      {/* Days of week header */}
      {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
        <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 border-b">
          {day}
        </div>
      ))}
      
      {/* Calendar days */}
      {Array.from({ length: 35 }, (_, i) => {
        const dayEvents = events.filter(e => e.day === i % 7);
        const hasAvailability = dayEvents.some(e => e.type === 'availability');
        const hasAppointments = dayEvents.some(e => e.type === 'appointment');
        const hasAbsences = dayEvents.some(e => e.type === 'absence');
        
        return (
          <div
            key={i}
            className={`
              border border-gray-200 p-2 min-h-[80px] cursor-pointer
              hover:bg-gray-50 transition-colors duration-150
              ${hasAbsences ? 'bg-gray-100' : ''}
            `}
            onClick={() => onSelectSlot?.({ day: i % 7, date: i })}
          >
            <div className="text-sm text-gray-700 mb-1">{(i % 30) + 1}</div>
            <div className="space-y-1">
              {hasAvailability && (
                <div className="w-full h-1 bg-sage rounded"></div>
              )}
              {hasAppointments && (
                <div className="w-full h-1 bg-deep rounded"></div>
              )}
              {hasAbsences && (
                <div className="w-full h-1 bg-gray-400 rounded"></div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Add global mouse up event listener
  React.useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isSelecting) {
        handleMouseUp();
      }
    };
    
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, [isSelecting]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {view === 'week' ? renderWeekView() : renderMonthView()}
      
      {/* Selection instructions */}
      {isSelecting && (
        <div className="absolute top-2 left-2 bg-sage text-white px-3 py-1 rounded-md text-sm font-medium shadow-lg z-10">
          Arrastra para seleccionar múltiples bloques
        </div>
      )}
    </div>
  );
};

export const AvailabilityCalendar = ({ 
  view = 'week',
  events = [],
  onSelectSlot,
  onSelectEvent,
  onEventDrop,
  timezone = 'Europe/Madrid',
  loading = false,
  className = '' 
}) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [conflicts, setConflicts] = useState([]);

  const handleSelectSlot = useCallback((slot) => {
    setSelectedSlot(slot);
    onSelectSlot?.(slot);
  }, [onSelectSlot]);

  const handleSelectEvent = useCallback((event) => {
    onSelectEvent?.(event);
  }, [onSelectEvent]);

  const handleEventDrop = useCallback((event, newSlot) => {
    // Check for conflicts
    const conflictingEvents = events.filter(e => 
      e.id !== event.id && 
      e.day === newSlot.day && 
      e.hour === newSlot.hour &&
      e.type === 'appointment'
    );
    
    if (conflictingEvents.length > 0) {
      setConflicts([...conflicts, { event, conflicts: conflictingEvents }]);
      return;
    }
    
    onEventDrop?.(event, newSlot);
  }, [events, conflicts, onEventDrop]);

  if (loading) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-8 ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sage"></div>
          <span className="text-gray-600">Cargando calendario...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-deep rounded border"></div>
          <span className="text-gray-600">Citas</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-sage rounded"></div>
          <span className="text-gray-600">Disponibilidad</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-gray-600">Ausencias</span>
        </div>
      </div>

      {/* Conflicts Alert */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm font-medium">
              Conflicto detectado: No se puede mover el evento porque se solapa con una cita existente.
            </span>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <MockCalendarGrid
        view={view}
        events={events}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onEventDrop={handleEventDrop}
        timezone={timezone}
      />

      {/* Calendar Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <div className="flex items-center space-x-2">
          <Calendar className="h-3 w-3" />
          <span>Haz clic en una celda para crear un bloque de disponibilidad</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-3 w-3" />
          <span>Mantén presionado y arrastra para seleccionar múltiples bloques</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>Arrastra los bloques existentes para reorganizar tu horario</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3" />
          <span>Zona horaria: {timezone}</span>
        </div>
      </div>
    </div>
  );
};