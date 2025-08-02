import React, { useState } from 'react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Clock, Plus, Send } from 'lucide-react';
import { AddAvailabilityModal } from './AddAvailabilityModal';
import { CreateAppointmentModal } from './CreateAppointmentModal';
import { BroadcastMessageModal } from './BroadcastMessageModal';

export const QuickActions = () => {
  const [modals, setModals] = useState({
    availability: false,
    appointment: false,
    broadcast: false
  });

  const openModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
  };

  const closeModal = (modalType) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  const handleSaveAvailability = (data) => {
    console.log('Guardando disponibilidad:', data);
    // Aquí se implementaría la lógica para guardar en la API
    alert(`Bloque ${data.type === 'available' ? 'de disponibilidad' : 'bloqueado'} añadido para ${data.date} de ${data.startTime} a ${data.endTime}`);
  };

  const handleSaveAppointment = (data) => {
    console.log('Creando cita:', data);
    // Aquí se implementaría la lógica para crear la cita en la API
    alert(`Cita creada para ${data.clientName} el ${data.date} a las ${data.startTime}`);
  };

  const handleSendBroadcast = (data) => {
    console.log('Enviando mensaje masivo:', data);
    // Aquí se implementaría la lógica para enviar el mensaje
    const channels = [];
    if (data.sendEmail) channels.push('email');
    if (data.sendSMS) channels.push('SMS');
    alert(`Mensaje enviado por ${channels.join(' y ')} a ${data.recipients}`);
  };

  const actions = [
    {
      id: 'block-time',
      label: 'Añadir bloqueo horario',
      icon: Clock,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => openModal('availability'),
      ariaLabel: 'Añadir bloqueo de horario en calendario'
    },
    {
      id: 'create-appointment',
      label: 'Crear cita manual',
      icon: Plus,
      color: 'bg-sage hover:bg-sage/90',
      action: () => openModal('appointment'),
      ariaLabel: 'Crear nueva cita manualmente'
    },
    {
      id: 'broadcast-message',
      label: 'Enviar mensaje broadcast',
      icon: Send,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => openModal('broadcast'),
      ariaLabel: 'Enviar mensaje a múltiples clientes'
    }
  ];

  return (
    <Card>
      <h2 className="text-lg font-semibold text-deep mb-4">Acciones Rápidas</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Button
              key={action.id}
              onClick={action.action}
              className={`
                ${action.color} text-white p-4 rounded-xl 
                flex flex-col items-center justify-center space-y-2 
                transition-all duration-200 transform hover:scale-105
                focus:ring-2 focus:ring-offset-2 focus:ring-sage
              `}
              aria-label={action.ariaLabel}
            >
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium text-center leading-tight">
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Accede rápidamente a las funciones más utilizadas
      </div>

      {/* Modales */}
      <AddAvailabilityModal
        isOpen={modals.availability}
        onClose={() => closeModal('availability')}
        onSave={handleSaveAvailability}
      />
      
      <CreateAppointmentModal
        isOpen={modals.appointment}
        onClose={() => closeModal('appointment')}
        onSave={handleSaveAppointment}
      />
      
      <BroadcastMessageModal
        isOpen={modals.broadcast}
        onClose={() => closeModal('broadcast')}
        onSend={handleSendBroadcast}
      />
    </Card>
  );
};