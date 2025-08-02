import React from 'react';
import { Plus, Copy, RefreshCw, Calendar, Clock, X } from 'lucide-react';

const ActionButton = ({ 
  icon: Icon, 
  label, 
  description, 
  onClick, 
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '' 
}) => {
  const baseClasses = `
    w-full flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
  
  const variantClasses = {
    primary: `
      bg-sage text-white border-sage hover:bg-sage/90 
      focus:ring-sage shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-white text-gray-700 border-gray-300 hover:bg-gray-50 
      focus:ring-gray-500 hover:border-gray-400
    `,
    outline: `
      bg-transparent text-sage border-sage hover:bg-sage/5 
      focus:ring-sage
    `
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-label={label}
    >
      <div className="flex-shrink-0">
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
        ) : (
          <Icon className="h-5 w-5" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1 text-left">
        <div className="font-medium">{label}</div>
        {description && (
          <div className={`text-sm opacity-75 ${variant === 'primary' ? 'text-white' : 'text-gray-500'}`}>
            {description}
          </div>
        )}
      </div>
    </button>
  );
};

export const SidebarActions = ({ 
  onCreateSlot,
  onCreateAbsence,
  onCopyLastWeek,
  onSyncGoogle,
  onOpenSyncModal,
  syncStatus = 'disconnected',
  loading = false,
  availabilitySlots = [],
  appointments = [],
  absences = [],
  isDrawer = false,
  onClose,
  className = '' 
}) => {
  const actions = [
    {
      id: 'new-availability',
      icon: Plus,
      label: 'Nuevo bloque',
      description: 'Crear disponibilidad',
      onClick: onCreateSlot,
      variant: 'primary'
    },
    {
      id: 'new-absence',
      icon: X,
      label: 'Marcar ausencia',
      description: 'Bloquear tiempo',
      onClick: onCreateAbsence,
      variant: 'outline'
    },
    {
      id: 'copy-week',
      icon: Copy,
      label: 'Copiar semana pasada',
      description: 'Duplicar horarios anteriores',
      onClick: onCopyLastWeek,
      variant: 'secondary',
      loading: loading
    },
    {
      id: 'sync-calendar',
      icon: RefreshCw,
      label: 'Sincronizar calendarios',
      description: 'Conectar calendarios externos',
      onClick: onOpenSyncModal,
      variant: 'secondary'
    }
  ];

  // Calcular estadísticas
  const totalAvailableHours = availabilitySlots.reduce((sum, slot) => {
    const start = new Date(`2024-01-01T${slot.startTime}`);
    const end = new Date(`2024-01-01T${slot.endTime}`);
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);

  const totalBookedHours = appointments.reduce((sum, apt) => {
    const start = new Date(`2024-01-01T${apt.startTime}`);
    const end = new Date(`2024-01-01T${apt.endTime}`);
    return sum + (end - start) / (1000 * 60 * 60);
  }, 0);

  const occupancyPercentage = totalAvailableHours > 0 
    ? Math.round((totalBookedHours / totalAvailableHours) * 100) 
    : 0;

  return (
    <div className={`
      ${isDrawer 
        ? 'fixed inset-0 z-50 lg:relative lg:inset-auto lg:z-auto' 
        : 'sticky top-6'
      } 
      ${className}
    `}>
      {/* Drawer Overlay */}
      {isDrawer && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar Content */}
      <div className={`
        bg-white rounded-lg border border-gray-200 shadow-sm
        ${isDrawer 
          ? 'fixed right-0 top-0 h-full w-80 max-w-[90vw] lg:relative lg:w-full lg:h-auto lg:max-w-none' 
          : 'w-full'
        }
      `}>
        {/* Header (only in drawer mode) */}
        {isDrawer && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
            <h3 className="text-lg font-semibold text-gray-900">Acciones rápidas</h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
              aria-label="Cerrar panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Actions */}
        <div className="p-4 space-y-3">
          <h3 className={`text-sm font-semibold text-gray-900 mb-4 ${isDrawer ? 'hidden lg:block' : ''}`}>
            Acciones rápidas
          </h3>
          
          {actions.map((action) => (
            <ActionButton
              key={action.id}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={action.onClick}
              variant={action.variant}
              loading={action.loading}
            />
          ))}
        </div>
        
        {/* Quick Stats */}
        <div className="border-t border-gray-200 p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Resumen actual</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Bloques disponibles
              </span>
              <span className="font-medium text-sage">{availabilitySlots.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Horas disponibles
              </span>
              <span className="font-medium text-sage">{Math.round(totalAvailableHours)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Horas reservadas
              </span>
              <span className="font-medium text-deep">{Math.round(totalBookedHours)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Ocupación</span>
              <span className={`font-medium ${
                occupancyPercentage >= 75 ? 'text-red-600' :
                occupancyPercentage >= 50 ? 'text-yellow-600' :
                occupancyPercentage >= 25 ? 'text-green-600' :
                'text-gray-600'
              }`}>
                {occupancyPercentage}%
              </span>
            </div>
            {syncStatus === 'connected' && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sincronización
                </span>
                <span className="font-medium text-green-600">Activa</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Tips */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-2">💡 Consejo</h4>
          <p className="text-xs text-gray-600">
            Mantén bloques de disponibilidad regulares para que tus clientes puedan reservar fácilmente.
          </p>
        </div>
      </div>
    </div>
  );
};