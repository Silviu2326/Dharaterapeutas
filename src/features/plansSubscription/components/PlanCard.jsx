import React from 'react';
import { Check, X, Star, Zap } from 'lucide-react';

const formatPrice = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const getPlanIcon = (planType) => {
  switch (planType) {
    case 'premium':
    case 'pro':
      return Star;
    case 'unlimited':
    case 'enterprise':
      return Zap;
    default:
      return null;
  }
};

export const PlanCard = ({ 
  plan,
  isCurrentPlan = false,
  isPopular = false,
  onSelect,
  disabled = false,
  className = '' 
}) => {
  const PlanIcon = getPlanIcon(plan.type);
  const isBasicPlan = plan.type === 'basic' || plan.price === 0;
  
  const handleSelect = () => {
    if (!disabled && onSelect && !isCurrentPlan) {
      onSelect(plan);
    }
  };

  return (
    <div className={`
      relative bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-lg
      ${isCurrentPlan ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
      ${isPopular ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      ${className}
    `}>
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Más popular
          </span>
        </div>
      )}

      {/* Current plan badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Plan actual
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {PlanIcon && (
              <PlanIcon className={`h-6 w-6 ${
                isCurrentPlan ? 'text-blue-600' : 
                isPopular ? 'text-purple-600' : 'text-gray-600'
              }`} aria-hidden="true" />
            )}
            <h3 className="text-xl font-bold text-gray-900">
              {plan.name}
            </h3>
          </div>
          
          <p className="text-gray-600 text-sm mb-4">
            {plan.description}
          </p>

          {/* Pricing */}
          <div className="mb-4">
            {plan.price === 0 ? (
              <div className="text-3xl font-bold text-gray-900">
                Gratis
              </div>
            ) : (
              <div className="flex items-baseline justify-center space-x-1">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-gray-600">
                  /{plan.interval === 'month' ? 'mes' : 'año'}
                </span>
              </div>
            )}
            
            {plan.originalPrice && plan.originalPrice > plan.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatPrice(plan.originalPrice)}
              </div>
            )}
            
            {plan.savings && (
              <div className="text-sm text-green-600 font-medium">
                Ahorra {plan.savings}%
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              {feature.included ? (
                <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
              ) : (
                <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
              )}
              <span className={`text-sm ${
                feature.included ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {feature.name}
                {feature.limit && (
                  <span className="text-gray-500 ml-1">
                    ({feature.limit})
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>

        {/* Limits/Usage */}
        {plan.limits && (
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Límites incluidos:
            </h4>
            <div className="space-y-1">
              {Object.entries(plan.limits).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="font-medium text-gray-900">
                    {value === -1 ? 'Ilimitado' : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action button */}
        <button
          onClick={handleSelect}
          disabled={disabled || isCurrentPlan}
          className={`
            w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${
              isCurrentPlan
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : isPopular
                ? 'bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-pressed={isCurrentPlan}
          aria-label={`Seleccionar plan ${plan.name}`}
        >
          {isCurrentPlan ? 'Plan Actual' : 'Seleccionar Plan'}
        </button>

        {/* Trial info */}
        {plan.trialDays && !isCurrentPlan && (
          <p className="text-center text-sm text-gray-600 mt-3">
            Incluye {plan.trialDays} días de prueba gratis
          </p>
        )}
      </div>
    </div>
  );
};