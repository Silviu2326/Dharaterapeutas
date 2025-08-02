import React, { useState } from 'react';
import { X, CreditCard, Lock, AlertCircle, CheckCircle } from 'lucide-react';

// Mock Stripe Elements components for demonstration
const MockCardElement = ({ onChange, options }) => {
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState(null);
  const [complete, setComplete] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    const isComplete = value.length >= 16;
    const hasError = value.length > 0 && value.length < 16;
    
    setComplete(isComplete);
    setError(hasError ? { message: 'Número de tarjeta incompleto' } : null);
    
    onChange?.({ 
      complete: isComplete, 
      error: hasError ? { message: 'Número de tarjeta incompleto' } : null 
    });
  };

  return (
    <div className={`p-3 border rounded-md transition-colors ${
      focused ? 'border-blue-500 ring-1 ring-blue-500' : 
      error ? 'border-red-300' : 
      complete ? 'border-green-300' : 'border-gray-300'
    }`}>
      <input
        type="text"
        placeholder="1234 1234 1234 1234"
        className="w-full outline-none bg-transparent"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        maxLength={19}
      />
    </div>
  );
};

export const AddCardModal = ({ 
  isOpen,
  onClose,
  onSave,
  loading = false,
  className = '' 
}) => {
  const [cardElement, setCardElement] = useState({ complete: false, error: null });
  const [holderName, setHolderName] = useState('');
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    city: '',
    postal_code: '',
    country: 'ES'
  });
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!holderName.trim()) {
      newErrors.holderName = 'El nombre del titular es requerido';
    }
    
    if (!cardElement.complete) {
      newErrors.card = 'Información de tarjeta incompleta';
    }
    
    if (cardElement.error) {
      newErrors.card = cardElement.error.message;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Simulate Stripe payment method creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentMethod = {
        id: `pm_${Date.now()}`,
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          exp_month: 12,
          exp_year: 2025
        },
        billing_details: {
          name: holderName,
          address: billingAddress
        }
      };
      
      await onSave?.(paymentMethod, saveAsDefault);
      handleClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Error al guardar la tarjeta' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    
    setCardElement({ complete: false, error: null });
    setHolderName('');
    setBillingAddress({ line1: '', city: '', postal_code: '', country: 'ES' });
    setSaveAsDefault(true);
    setErrors({});
    onClose();
  };

  const handleCardChange = (event) => {
    setCardElement(event);
    if (errors.card) {
      setErrors(prev => ({ ...prev, card: null }));
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
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900" id="modal-title">
              Añadir nueva tarjeta
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Card information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <CreditCard className="h-4 w-4 inline mr-1" />
                Información de la tarjeta
              </label>
              <MockCardElement 
                onChange={handleCardChange}
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
              {errors.card && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.card}
                </p>
              )}
            </div>

            {/* Cardholder name */}
            <div>
              <label htmlFor="holderName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                id="holderName"
                value={holderName}
                onChange={(e) => {
                  setHolderName(e.target.value);
                  if (errors.holderName) {
                    setErrors(prev => ({ ...prev, holderName: null }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.holderName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre como aparece en la tarjeta"
                disabled={isSubmitting}
              />
              {errors.holderName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.holderName}
                </p>
              )}
            </div>

            {/* Billing address (optional) */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Dirección de facturación (opcional)</h4>
              
              <input
                type="text"
                value={billingAddress.line1}
                onChange={(e) => setBillingAddress(prev => ({ ...prev, line1: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dirección"
                disabled={isSubmitting}
              />
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ciudad"
                  disabled={isSubmitting}
                />
                
                <input
                  type="text"
                  value={billingAddress.postal_code}
                  onChange={(e) => setBillingAddress(prev => ({ ...prev, postal_code: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Código postal"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Save as default */}
            <div className="flex items-center">
              <input
                id="saveAsDefault"
                type="checkbox"
                checked={saveAsDefault}
                onChange={(e) => setSaveAsDefault(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <label htmlFor="saveAsDefault" className="ml-2 block text-sm text-gray-700">
                Establecer como método de pago predeterminado
              </label>
            </div>

            {/* Security note */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Lock className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-900">
                    Información segura
                  </p>
                  <p className="text-xs text-gray-600">
                    Tu información de pago está protegida con cifrado SSL y procesada de forma segura por Stripe.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                  <p className="text-sm text-red-700">{errors.submit}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !cardElement.complete || !holderName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Guardar tarjeta
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};