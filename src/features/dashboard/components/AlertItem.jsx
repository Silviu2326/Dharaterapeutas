import React from 'react';
import { Clock, FileText, CreditCard, AlertTriangle } from 'lucide-react';

const getAlertIcon = (type) => {
  switch (type) {
    case 'appointment':
      return Clock;
    case 'document':
      return FileText;
    case 'subscription':
      return CreditCard;
    default:
      return AlertTriangle;
  }
};

const getAlertColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'low':
    default:
      return 'text-blue-600 bg-blue-50 border-blue-200';
  }
};

export const AlertItem = ({ alert, onClick }) => {
  const Icon = getAlertIcon(alert.type);
  const colorClasses = getAlertColor(alert.priority);

  return (
    <div 
      className={`flex items-center p-3 border rounded-lg cursor-pointer hover:shadow-sm transition-shadow ${colorClasses}`}
      onClick={() => onClick && onClick(alert)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(alert);
        }
      }}
      aria-label={`Alerta: ${alert.message}`}
    >
      <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-medium">{alert.message}</p>
        {alert.time && (
          <p className="text-xs opacity-75 mt-1">{alert.time}</p>
        )}
      </div>
    </div>
  );
};