import React from 'react';
import { ReviewCard } from './ReviewCard';
import { Loader } from '../../../components/Loader';
import { MessageSquare, Star } from 'lucide-react';

export const ReviewsList = ({ 
  reviews = [], 
  loading = false, 
  error = null, 
  onReply,
  onLoadMore,
  hasMore = false,
  loadingMore = false
}) => {
  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <MessageSquare className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Error al cargar reseñas
          </h3>
          <p className="text-red-600 text-sm mb-4">
            {error.message || 'Ha ocurrido un error inesperado'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <EmptyState />
    );
  }

  return (
    <div className="space-y-6">
      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onReply={onReply}
          />
        ))}
      </div>

      {/* Botón cargar más */}
      {hasMore && (
        <div className="text-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              loadingMore
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-sage text-white hover:bg-sage/90 shadow-sm'
            }`}
          >
            {loadingMore ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Cargando...
              </div>
            ) : (
              'Cargar más reseñas'
            )}
          </button>
        </div>
      )}

      {/* Información de paginación */}
      {reviews.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          Mostrando {reviews.length} reseña{reviews.length !== 1 ? 's' : ''}
          {!hasMore && reviews.length > 5 && ' (todas cargadas)'}
        </div>
      )}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8 max-w-md mx-auto">
        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4">
          <Star className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No hay reseñas aún
        </h3>
        <p className="text-gray-600 text-sm mb-6">
          Cuando tus clientes dejen reseñas después de las sesiones, aparecerán aquí.
        </p>
        <div className="space-y-2 text-xs text-gray-500">
          <p>💡 Las reseñas ayudan a:</p>
          <ul className="list-disc list-inside space-y-1 text-left max-w-xs mx-auto">
            <li>Mejorar tu reputación profesional</li>
            <li>Atraer nuevos clientes</li>
            <li>Recibir feedback valioso</li>
          </ul>
        </div>
      </div>
    </div>
  );
};