import React, { useState, useEffect } from 'react';
import { KpiCards } from './components/KpiCards';
import { ReviewsFilter } from './components/ReviewsFilter';
import { ReviewsList } from './components/ReviewsList';
import { RatingTrendChart } from './components/RatingTrendChart';
import { getReviews, getReviewsStats, getRatingTrend, respondToReview } from './reviews.api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// Implementación simple de notificaciones
const useToast = () => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };
  
  return {
    toasts,
    success: (message) => addToast(message, 'success'),
    error: (message) => addToast(message, 'error'),
    info: (message) => addToast(message, 'info')
  };
};

const ToastContainer = ({ toasts }) => {
  if (toasts.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-in ${
            toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

export const Reviews = () => {
  const [filters, setFilters] = useState({
    ratings: [],
    responded: 'all',
    sortBy: 'newest',
    dateRange: { start: '', end: '' }
  });

  const [isMobile, setIsMobile] = useState(false);
  const queryClient = useQueryClient();
  const toast = useToast();

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Queries
  const { data: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['reviews', filters],
    queryFn: () => getReviews(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['reviewsStats'],
    queryFn: getReviewsStats,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const { data: trendData, isLoading: trendLoading } = useQuery({
    queryKey: ['ratingTrend'],
    queryFn: getRatingTrend,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });

  // Mutation para responder reseñas
  const replyMutation = useMutation({
    mutationFn: ({ reviewId, response }) => respondToReview(reviewId, response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviewsStats'] });
      toast.success('Respuesta enviada correctamente');
    },
    onError: (error) => {
      toast.error('Error al enviar la respuesta');
      console.error('Error:', error);
    }
  });

  const handleReply = async (reviewId, response) => {
    await replyMutation.mutateAsync({ reviewId, response });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Simular alertas automáticas para reseñas con rating bajo
  useEffect(() => {
    if (reviewsData?.reviews) {
      const lowRatingUnresponded = reviewsData.reviews.filter(
        review => review.rating <= 3 && !review.response
      );
      
      if (lowRatingUnresponded.length > 0) {
        // En una implementación real, esto vendría del WebSocket
        setTimeout(() => {
          lowRatingUnresponded.forEach(review => {
            toast.error(
              `Nueva reseña ⭐ ${review.rating}: Por favor responde a ${review.clientName}`
            );
          });
        }, 2000);
      }
    }
  }, [reviewsData]);

  return (
    <>
      <ToastContainer toasts={toast.toasts} />
      <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-deep">Reseñas</h1>
          <p className="text-gray-600 mt-1">Gestiona las opiniones de tus clientes</p>
        </div>
        
        {statsData && (
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span className="font-medium">{statsData.totalReviews}</span>
              <span>reseñas totales</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{statsData.averageRating.toFixed(1)}</span>
              <span>⭐ promedio</span>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <KpiCards stats={statsData} loading={statsLoading} />

      {/* Layout responsive: En móvil, gráfico debajo de KPI */}
      <div className={`grid gap-6 ${
        isMobile ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-3'
      }`}>
        {/* Gráfico de tendencia */}
        <div className={isMobile ? 'order-1' : 'lg:col-span-2'}>
          <RatingTrendChart data={trendData} loading={trendLoading} />
        </div>
        
        {/* Espacio para futuras métricas adicionales en desktop */}
        {!isMobile && (
          <div className="space-y-6">
            {/* Aquí se pueden agregar widgets adicionales */}
            <div className="bg-gradient-to-br from-sage/10 to-sage/5 rounded-xl p-6 border border-sage/20">
              <h3 className="font-semibold text-deep mb-2">💡 Consejo</h3>
              <p className="text-sm text-gray-600">
                Responde a las reseñas con rating ≤ 3 dentro de las primeras 24 horas para mostrar profesionalismo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Filtros */}
      <ReviewsFilter
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isMobile={isMobile}
      />

      {/* Lista de reseñas */}
      <ReviewsList
        reviews={reviewsData?.reviews || []}
        loading={reviewsLoading}
        error={reviewsError}
        onReply={handleReply}
      />
      </div>
    </>
  );
};