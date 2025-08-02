import React from 'react';
import { Crown, Calendar, CreditCard, AlertCircle, CheckCircle, Pause, XCircle } from 'lucide-react';

const STATUS_CONFIG = {
  active: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    text: 'Activo',
    description: 'Tu plan está activo y funcionando correctamente'
  },
  paused: {
    icon: Pause,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    text: 'Pausado',
    description: 'Tu suscripción está pausada temporalmente'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    text: 'Cancelado al final',
    description: 'Tu plan se cancelará al final del período actual'
  },
  expired: {
    icon: AlertCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    text: 'Expirado',
    description: 'Tu plan ha expirado'
  }
};

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

export const CurrentPlanBanner = ({ 
  plan,
  className = '' 
}) => {
  if (!plan) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 ${className}`}>
        <div className="text-center">
          <Crown className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Sin plan activo
          </h3>
          <p className="text-gray-600">
            Selecciona un plan para comenzar a usar nuestros servicios
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[plan.status] || STATUS_CONFIG.active;
  const StatusIcon = statusConfig.icon;
  const isActive = plan.status === 'active';

  return (
    <div className={`bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white ${className}`}>
      <div className="flex items-start justify-between">
        {/* Plan Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-300" aria-hidden="true" />
            <div>
              <h2 className="text-2xl font-bold">
                Plan {plan.name}
              </h2>
              <p className="text-blue-100">
                {plan.description}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-blue-100">
                  /{plan.interval === 'month' ? 'mes' : 'año'}
                </span>
              </div>
              <p className="text-blue-100 text-sm">
                Precio actual
              </p>
            </div>

            {/* Next billing date */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-200" aria-hidden="true" />
              <div>
                <p className="font-medium">
                  {formatDate(plan.nextBillingDate)}
                </p>
                <p className="text-blue-100 text-sm">
                  {plan.status === 'cancelled' ? 'Fecha de cancelación' : 'Próxima renovación'}
                </p>
              </div>
            </div>

            {/* Payment method */}
            {plan.paymentMethod && (
              <div className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-blue-200" aria-hidden="true" />
                <div>
                  <p className="font-medium">
                    •••• {plan.paymentMethod.last4}
                  </p>
                  <p className="text-blue-100 text-sm">
                    {plan.paymentMethod.brand.toUpperCase()} {plan.paymentMethod.expMonth}/{plan.paymentMethod.expYear}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`
          px-4 py-2 rounded-full border-2 flex items-center space-x-2
          ${statusConfig.bgColor} ${statusConfig.borderColor}
        `}>
          <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} aria-hidden="true" />
          <span className={`font-medium ${statusConfig.color}`}>
            {statusConfig.text}
          </span>
        </div>
      </div>

      {/* Status description */}
      <div className="mt-4 p-3 bg-white/10 rounded-lg">
        <p className="text-blue-100 text-sm">
          {statusConfig.description}
        </p>
        
        {/* Additional info based on status */}
        {plan.status === 'cancelled' && plan.cancelledAt && (
          <p className="text-blue-100 text-xs mt-1">
            Cancelado el {formatDate(plan.cancelledAt)}
          </p>
        )}
        
        {plan.status === 'paused' && plan.pausedAt && (
          <p className="text-blue-100 text-xs mt-1">
            Pausado el {formatDate(plan.pausedAt)}
          </p>
        )}
      </div>

      {/* Usage stats (if available) */}
      {plan.usage && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(plan.usage).map(([key, value]) => (
            <div key={key} className="bg-white/10 rounded-lg p-3">
              <p className="text-blue-100 text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </p>
              <p className="text-white font-semibold">
                {typeof value === 'object' ? `${value.used}/${value.limit}` : value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};