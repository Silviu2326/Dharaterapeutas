import React, { useState } from 'react';
import { PlanCard } from './PlanCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PlanGrid = ({ 
  plans = [],
  currentPlanId = null,
  onPlanSelect,
  loading = false,
  className = '' 
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-96"></div>
          </div>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay planes disponibles
        </h3>
        <p className="text-gray-600">
          Los planes de suscripción aparecerán aquí cuando estén disponibles.
        </p>
      </div>
    );
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % plans.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + plans.length) % plans.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={className}>
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan, index) => {
          const isCurrentPlan = plan.id === currentPlanId;
          const isPopular = plan.popular || plan.recommended;
          
          return (
            <PlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={isCurrentPlan}
              isPopular={isPopular}
              onSelect={onPlanSelect}
              className="h-full"
            />
          );
        })}
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden">
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {plans.map((plan, index) => {
              const isCurrentPlan = plan.id === currentPlanId;
              const isPopular = plan.popular || plan.recommended;
              
              return (
                <div key={plan.id} className="w-full flex-shrink-0 px-4">
                  <PlanCard
                    plan={plan}
                    isCurrentPlan={isCurrentPlan}
                    isPopular={isPopular}
                    onSelect={onPlanSelect}
                  />
                </div>
              );
            })}
          </div>

          {/* Navigation arrows */}
          {plans.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Plan anterior"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Siguiente plan"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </>
          )}
        </div>

        {/* Dots indicator */}
        {plans.length > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {plans.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                aria-label={`Ir al plan ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Plan counter */}
        <div className="text-center mt-4 text-sm text-gray-600">
          {currentSlide + 1} de {plans.length} planes
        </div>
      </div>

      {/* Plans summary */}
      {plans.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparación rápida
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Planes disponibles:</span>
              <p className="font-medium text-gray-900">{plans.length}</p>
            </div>
            <div>
              <span className="text-gray-600">Desde:</span>
              <p className="font-medium text-gray-900">
                {Math.min(...plans.map(p => p.price)) === 0 
                  ? 'Gratis' 
                  : new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(Math.min(...plans.map(p => p.price)))
                }/mes
              </p>
            </div>
            <div>
              <span className="text-gray-600">Plan más popular:</span>
              <p className="font-medium text-gray-900">
                {plans.find(p => p.popular || p.recommended)?.name || 'N/A'}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Cambios:</span>
              <p className="font-medium text-gray-900">
                Sin compromiso
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};