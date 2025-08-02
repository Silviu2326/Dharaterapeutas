import React, { useState } from 'react';
import { Pause, Play, XCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const PlanActions = ({ 
  currentPlan,
  onPause,
  onResume,
  onCancel,
  onReactivate,
  loading = false,
  className = '' 
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const handleAction = async (action, planId) => {
    setActionLoading(action);
    try {
      switch (action) {
        case 'pause':
          await onPause?.(planId);
          break;
        case 'resume':
          await onResume?.(planId);
          break;
        case 'cancel':
          await onCancel?.(planId);
          break;
        case 'reactivate':
          await onReactivate?.(planId);
          break;
      }
      setShowConfirmModal(null);
    } catch (error) {
      console.error(`Error ${action}ing plan:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getActionConfig = (action) => {
    const configs = {
      pause: {
        title: 'Pausar suscripción',
        description: '¿Estás seguro de que quieres pausar tu suscripción?',
        details: 'Tu suscripción se pausará inmediatamente. Podrás reactivarla en cualquier momento sin perder tus datos.',
        buttonText: 'Pausar suscripción',
        buttonClass: 'bg-yellow-600 hover:bg-yellow-700 text-white',
        icon: Pause,
        iconClass: 'text-yellow-600'
      },
      resume: {
        title: 'Reactivar suscripción',
        description: '¿Quieres reactivar tu suscripción pausada?',
        details: 'Tu suscripción se reactivará inmediatamente y se reanudará la facturación según tu plan actual.',
        buttonText: 'Reactivar suscripción',
        buttonClass: 'bg-green-600 hover:bg-green-700 text-white',
        icon: Play,
        iconClass: 'text-green-600'
      },
      cancel: {
        title: 'Cancelar suscripción',
        description: '¿Estás seguro de que quieres cancelar tu suscripción?',
        details: `Tu suscripción se cancelará al final del período actual (${formatDate(currentPlan?.nextBillingDate)}). Mantendrás acceso hasta esa fecha.`,
        buttonText: 'Cancelar al final del período',
        buttonClass: 'bg-red-600 hover:bg-red-700 text-white',
        icon: XCircle,
        iconClass: 'text-red-600'
      },
      reactivate: {
        title: 'Reactivar suscripción',
        description: '¿Quieres reactivar tu suscripción cancelada?',
        details: 'Tu suscripción se reactivará y continuará con la facturación normal según tu plan actual.',
        buttonText: 'Reactivar suscripción',
        buttonClass: 'bg-blue-600 hover:bg-blue-700 text-white',
        icon: CheckCircle,
        iconClass: 'text-blue-600'
      }
    };
    return configs[action];
  };

  const renderConfirmModal = () => {
    if (!showConfirmModal) return null;
    
    const config = getActionConfig(showConfirmModal);
    const ActionIcon = config.icon;
    const isDestructive = showConfirmModal === 'cancel';

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
            aria-hidden="true"
            onClick={() => setShowConfirmModal(null)}
          ></div>

          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                isDestructive ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <ActionIcon className={`h-6 w-6 ${config.iconClass}`} aria-hidden="true" />
              </div>
              
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {config.title}
                </h3>
                
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {config.description}
                  </p>
                  
                  <div className="mt-3 p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-600">
                      {config.details}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                onClick={() => handleAction(showConfirmModal, currentPlan?.id)}
                disabled={actionLoading === showConfirmModal}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                  config.buttonClass
                } focus:ring-${isDestructive ? 'red' : 'blue'}-500`}
              >
                {actionLoading === showConfirmModal ? 'Procesando...' : config.buttonText}
              </button>
              
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                disabled={actionLoading === showConfirmModal}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentPlan) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <p className="text-gray-500">No hay plan activo para gestionar</p>
      </div>
    );
  }

  const canPause = currentPlan.status === 'active';
  const canResume = currentPlan.status === 'paused';
  const canCancel = currentPlan.status === 'active' && !currentPlan.cancelAtPeriodEnd;
  const canReactivate = currentPlan.cancelAtPeriodEnd;

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900">
        Acciones del plan
      </h3>

      {/* Current status */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          {currentPlan.status === 'active' && (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-900">Suscripción activa</span>
            </>
          )}
          {currentPlan.status === 'paused' && (
            <>
              <Pause className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Suscripción pausada</span>
            </>
          )}
          {currentPlan.cancelAtPeriodEnd && (
            <>
              <Clock className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Cancelada al final del período</span>
            </>
          )}
        </div>
        
        <p className="text-xs text-gray-600">
          {currentPlan.status === 'active' && !currentPlan.cancelAtPeriodEnd && 
            `Próxima facturación: ${formatDate(currentPlan.nextBillingDate)}`
          }
          {currentPlan.status === 'paused' && 
            'La facturación está pausada. Puedes reactivar en cualquier momento.'
          }
          {currentPlan.cancelAtPeriodEnd && 
            `Acceso hasta: ${formatDate(currentPlan.nextBillingDate)}`
          }
        </p>
      </div>

      {/* Action buttons */}
      <div className="space-y-3">
        {canPause && (
          <button
            onClick={() => setShowConfirmModal('pause')}
            disabled={loading || actionLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-yellow-300 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Pause className="h-4 w-4 mr-2" />
            Pausar suscripción
          </button>
        )}

        {canResume && (
          <button
            onClick={() => setShowConfirmModal('resume')}
            disabled={loading || actionLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            Reactivar suscripción
          </button>
        )}

        {canReactivate && (
          <button
            onClick={() => setShowConfirmModal('reactivate')}
            disabled={loading || actionLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Reactivar suscripción
          </button>
        )}

        {canCancel && (
          <button
            onClick={() => setShowConfirmModal('cancel')}
            disabled={loading || actionLoading}
            className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancelar al final del período
          </button>
        )}
      </div>

      {/* Warning notes */}
      <div className="space-y-2">
        {currentPlan.status === 'paused' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-yellow-900">
                  Suscripción pausada
                </p>
                <p className="text-xs text-yellow-700">
                  Algunas funciones pueden estar limitadas mientras tu suscripción esté pausada.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {currentPlan.cancelAtPeriodEnd && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-orange-900">
                  Suscripción programada para cancelación
                </p>
                <p className="text-xs text-orange-700">
                  Tu suscripción se cancelará el {formatDate(currentPlan.nextBillingDate)}. 
                  Puedes reactivarla antes de esa fecha.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {renderConfirmModal()}
    </div>
  );
};