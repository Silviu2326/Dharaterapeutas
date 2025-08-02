import React from 'react';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';
import { Clock, Plus, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'block-time',
      label: 'Añadir bloqueo horario',
      icon: Clock,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => navigate('/disponibilidad'),
      ariaLabel: 'Añadir bloqueo de horario en calendario'
    },
    {
      id: 'create-appointment',
      label: 'Crear cita manual',
      icon: Plus,
      color: 'bg-sage hover:bg-sage/90',
      action: () => navigate('/reservas?action=create'),
      ariaLabel: 'Crear nueva cita manualmente'
    },
    {
      id: 'broadcast-message',
      label: 'Enviar mensaje broadcast',
      icon: Send,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/chat?action=broadcast'),
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
    </Card>
  );
};