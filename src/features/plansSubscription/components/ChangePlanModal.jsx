import React, { useState, useEffect } from 'react';
import { X, CreditCard, Calendar, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

const formatPrice = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export const ChangePlanModal = ({ 
  isOpen,
  onClose,
  currentPlan,
  newPlan,
  onConfirm,
  loading = false,
  className = '' 
}) => {
  const [prorationDetails, setProrationDetails] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isOpen && currentPlan && newPlan) {
      calculateProration();
    }
  }, [isOpen, currentPlan, newPlan]);

  const calculateProration = async () => {
    setIsCalculating(true);
    try {
      // Simulate API call to calculate proration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const today = new Date();
      const nextBillingDate = new Date(currentPlan.nextBillingDate);
      const daysRemaining = Math.ceil((nextBillingDate - today) / (1000 * 60 * 60 * 24));
      const daysInPeriod = currentPlan.interval === 'month' ? 30 : 365;
      
      const unusedCredit = (currentPlan.price * daysRemaining) / daysInPeriod;
      const proratedAmount = newPlan.price - unusedCredit;
      const isUpgrade = newPlan.price > currentPlan.price;
      const isDowngrade = newPlan.price < currentPlan.price;
      
      setProrationDetails({
        unusedCredit,
        proratedAmount: Math.max(0, proratedAmount),
        daysRemaining,
        isUpgrade,
        isDowngrade,
        nextBillingDate: currentPlan.nextBillingDate,
        immediateCharge: isUpgrade && proratedAmount > 0
      });
    } catch (error) {
      console.error('Error calculating proration:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm({
        newPlan,
        prorationDetails
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900" id="modal-title">
              Confirmar cambio de plan
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Plan comparison */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600">Plan actual</p>
                <p className="font-semibold text-gray-900">{currentPlan?.name}</p>
                <p className="text-sm text-gray-600">
                  {formatPrice(currentPlan?.price)}/{currentPlan?.interval === 'month' ? 'mes' : 'año'}
                </p>
              </div>
              
              <ArrowRight className="h-5 w-5 text-gray-400 mx-4" aria-hidden="true" />
              
              <div className="text-center flex-1">
                <p className="text-sm text-gray-600">Nuevo plan</p>
                <p className="font-semibold text-blue-600">{newPlan?.name}</p>
                <p className="text-sm text-gray-600">
                  {formatPrice(newPlan?.price)}/{newPlan?.interval === 'month' ? 'mes' : 'año'}
                </p>
              </div>
            </div>
          </div>

          {/* Proration details */}
          {isCalculating ? (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="animate-pulse">
                <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-blue-200 rounded w-1/2"></div>
              </div>
              <p className="text-sm text-blue-600 mt-2">Calculando prorrateo...</p>
            </div>
          ) : prorationDetails && (
            <div className="mb-6 space-y-4">
              {/* Billing details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Calendar className="h-5 w-5 text-gray-600 mr-2" />
                  Detalles de facturación
                </h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Días restantes del plan actual:</span>
                    <span className="font-medium">{prorationDetails.daysRemaining} días</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crédito no utilizado:</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(prorationDetails.unusedCredit)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio del nuevo plan:</span>
                    <span className="font-medium">{formatPrice(newPlan.price)}</span>
                  </div>
                  
                  <hr className="my-2" />
                  
                  <div className="flex justify-between font-semibold">
                    <span>Total a {prorationDetails.immediateCharge ? 'pagar hoy' : 'abonar'}:</span>
                    <span className={prorationDetails.immediateCharge ? 'text-blue-600' : 'text-green-600'}>
                      {prorationDetails.immediateCharge 
                        ? formatPrice(prorationDetails.proratedAmount)
                        : formatPrice(prorationDetails.proratedAmount)
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              {currentPlan?.paymentMethod && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-600 mr-2" />
                    Método de pago
                  </h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-5 bg-gray-300 rounded"></div>
                    <span className="text-sm">
                      •••• {currentPlan.paymentMethod.last4}
                    </span>
                    <span className="text-xs text-gray-500">
                      {currentPlan.paymentMethod.brand.toUpperCase()}
                    </span>
                  </div>
                </div>
              )}

              {/* Next billing */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Próxima facturación: {formatDate(prorationDetails.nextBillingDate)}
                    </p>
                    <p className="text-xs text-blue-700">
                      A partir de esa fecha se cobrará {formatPrice(newPlan.price)} cada {newPlan.interval === 'month' ? 'mes' : 'año'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning for downgrades */}
              {prorationDetails.isDowngrade && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900">
                        Cambio a plan inferior
                      </p>
                      <p className="text-xs text-yellow-700">
                        Algunas funciones pueden no estar disponibles inmediatamente después del cambio.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || isCalculating || !prorationDetails}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Procesando...' : 'Confirmar cambio'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};