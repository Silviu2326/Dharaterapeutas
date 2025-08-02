import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Check, AlertCircle } from 'lucide-react';

const getCardIcon = (brand) => {
  const icons = {
    visa: '💳',
    mastercard: '💳',
    amex: '💳',
    discover: '💳',
    default: '💳'
  };
  return icons[brand?.toLowerCase()] || icons.default;
};

const getCardColor = (brand) => {
  const colors = {
    visa: 'bg-blue-100 text-blue-800',
    mastercard: 'bg-red-100 text-red-800',
    amex: 'bg-green-100 text-green-800',
    discover: 'bg-orange-100 text-orange-800',
    default: 'bg-gray-100 text-gray-800'
  };
  return colors[brand?.toLowerCase()] || colors.default;
};

export const PaymentMethods = ({ 
  paymentMethods = [],
  defaultPaymentMethod,
  onSetDefault,
  onRemove,
  onAddCard,
  loading = false,
  className = '' 
}) => {
  const [removingId, setRemovingId] = useState(null);
  const [settingDefaultId, setSettingDefaultId] = useState(null);

  const handleSetDefault = async (paymentMethodId) => {
    if (settingDefaultId || paymentMethodId === defaultPaymentMethod) return;
    
    setSettingDefaultId(paymentMethodId);
    try {
      await onSetDefault?.(paymentMethodId);
    } catch (error) {
      console.error('Error setting default payment method:', error);
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleRemove = async (paymentMethodId) => {
    if (removingId || paymentMethodId === defaultPaymentMethod) return;
    
    setRemovingId(paymentMethodId);
    try {
      await onRemove?.(paymentMethodId);
    } catch (error) {
      console.error('Error removing payment method:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddCard = () => {
    onAddCard?.();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Métodos de pago
        </h3>
        <button
          onClick={handleAddCard}
          disabled={loading}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Añadir nueva tarjeta"
        >
          <Plus className="h-4 w-4 mr-1" />
          Añadir tarjeta
        </button>
      </div>

      {/* Payment methods list */}
      {paymentMethods.length === 0 ? (
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No hay métodos de pago
          </h4>
          <p className="text-gray-600 mb-4">
            Añade una tarjeta para gestionar tu suscripción
          </p>
          <button
            onClick={handleAddCard}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Añadir primera tarjeta
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((method) => {
            const isDefault = method.id === defaultPaymentMethod;
            const isRemoving = removingId === method.id;
            const isSettingDefault = settingDefaultId === method.id;
            const canRemove = !isDefault && paymentMethods.length > 1;

            return (
              <div
                key={method.id}
                className={`relative p-4 border rounded-lg transition-all ${
                  isDefault 
                    ? 'border-blue-200 bg-blue-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  {/* Card info */}
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-6 rounded flex items-center justify-center text-xs font-medium ${
                        getCardColor(method.brand)
                      }`}>
                        {method.brand?.toUpperCase() || 'CARD'}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">
                          •••• •••• •••• {method.last4}
                        </span>
                        {isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <Check className="h-3 w-3 mr-1" />
                            Predeterminada
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">
                          Expira {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                        </span>
                        
                        {method.holderName && (
                          <span className="text-xs text-gray-500">
                            {method.holderName}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {!isDefault && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={isSettingDefault || loading}
                        className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label={`Establecer como predeterminada`}
                      >
                        {isSettingDefault ? 'Estableciendo...' : 'Predeterminada'}
                      </button>
                    )}
                    
                    {canRemove && (
                      <button
                        onClick={() => handleRemove(method.id)}
                        disabled={isRemoving || loading}
                        className="p-1 text-gray-400 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        aria-label={`Eliminar tarjeta terminada en ${method.last4}`}
                      >
                        {isRemoving ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expiration warning */}
                {method.isExpiringSoon && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-yellow-900">
                          Tarjeta próxima a expirar
                        </p>
                        <p className="text-xs text-yellow-700">
                          Actualiza la información para evitar interrupciones en tu suscripción.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Info note */}
      {paymentMethods.length > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Nota:</strong> La tarjeta predeterminada se utilizará para renovaciones automáticas y cambios de plan. 
            Puedes cambiar o eliminar tarjetas en cualquier momento, excepto la predeterminada si es la única disponible.
          </p>
        </div>
      )}
    </div>
  );
};