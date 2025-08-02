import React from 'react';
import { Card } from '../../../components/Card';
import { AlertItem } from './AlertItem';
import { useNavigate } from 'react-router-dom';

export const AlertsList = ({ alerts }) => {
  const navigate = useNavigate();

  const defaultAlerts = [
    {
      id: 1,
      type: 'appointment',
      priority: 'high',
      message: 'Próxima sesión en 15 minutos',
      time: '14:45 - María González',
      action: () => navigate('/reservas')
    },
    {
      id: 2,
      type: 'document',
      priority: 'medium',
      message: 'Documento pendiente de firmar',
      time: 'Consentimiento informado - Juan Pérez',
      action: () => navigate('/documentos-materiales')
    },
    {
      id: 3,
      type: 'subscription',
      priority: 'medium',
      message: 'Suscripción vence en 3 días',
      time: 'Plan Premium - Renovar antes del 15/01',
      action: () => navigate('/planes-suscripcion')
    }
  ];

  const alertsToShow = alerts || defaultAlerts;

  const handleAlertClick = (alert) => {
    if (alert.action) {
      alert.action();
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-deep">Alertas Rápidas</h2>
        {alertsToShow.length > 0 && (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            {alertsToShow.length}
          </span>
        )}
      </div>
      
      {alertsToShow.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No hay alertas pendientes</p>
      ) : (
        <div className="space-y-3">
          {alertsToShow.map((alert) => (
            <AlertItem 
              key={alert.id} 
              alert={alert} 
              onClick={handleAlertClick}
            />
          ))}
        </div>
      )}
    </Card>
  );
};