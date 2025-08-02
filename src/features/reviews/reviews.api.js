// Mock data para desarrollo
const mockReviews = [
  {
    id: '1',
    clientName: 'María García',
    clientAvatar: null,
    rating: 5,
    comment: 'Excelente sesión, muy profesional y empática. Me ayudó mucho a entender mis emociones.',
    sessionDate: '2024-01-15',
    createdAt: '2024-01-16',
    response: {
      text: 'Muchas gracias María por tu confianza. Me alegra saber que la sesión te fue útil.',
      createdAt: '2024-01-16',
      canEdit: true
    }
  },
  {
    id: '2',
    clientName: 'Carlos Rodríguez',
    clientAvatar: null,
    rating: 4,
    comment: 'Muy buena experiencia, aunque me hubiera gustado más tiempo para profundizar en algunos temas.',
    sessionDate: '2024-01-14',
    createdAt: '2024-01-15',
    response: null
  },
  {
    id: '3',
    clientName: 'Ana López',
    clientAvatar: null,
    rating: 2,
    comment: 'La sesión no cumplió mis expectativas. Sentí que no hubo suficiente conexión.',
    sessionDate: '2024-01-13',
    createdAt: '2024-01-14',
    response: null
  },
  {
    id: '4',
    clientName: 'Pedro Martínez',
    clientAvatar: null,
    rating: 5,
    comment: 'Increíble profesional. Me siento mucho mejor después de nuestras sesiones.',
    sessionDate: '2024-01-12',
    createdAt: '2024-01-13',
    response: {
      text: 'Pedro, es un placer acompañarte en este proceso. Sigue así.',
      createdAt: '2024-01-13',
      canEdit: false
    }
  }
];

const mockTrendData = [
  { date: '2024-01-01', rating: 4.2 },
  { date: '2024-01-02', rating: 4.3 },
  { date: '2024-01-03', rating: 4.1 },
  { date: '2024-01-04', rating: 4.4 },
  { date: '2024-01-05', rating: 4.5 },
  { date: '2024-01-06', rating: 4.3 },
  { date: '2024-01-07', rating: 4.6 },
  { date: '2024-01-08', rating: 4.4 },
  { date: '2024-01-09', rating: 4.7 },
  { date: '2024-01-10', rating: 4.5 },
  { date: '2024-01-11', rating: 4.8 },
  { date: '2024-01-12', rating: 4.6 },
  { date: '2024-01-13', rating: 4.2 },
  { date: '2024-01-14', rating: 4.3 },
  { date: '2024-01-15', rating: 4.5 }
];

export const getReviews = async (filters = {}) => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredReviews = [...mockReviews];
  
  // Aplicar filtros
  if (filters.ratings && filters.ratings.length > 0) {
    filteredReviews = filteredReviews.filter(review => 
      filters.ratings.includes(review.rating)
    );
  }
  
  if (filters.responded === 'responded') {
    filteredReviews = filteredReviews.filter(review => review.response);
  } else if (filters.responded === 'pending') {
    filteredReviews = filteredReviews.filter(review => !review.response);
  }
  
  // Aplicar ordenación
  if (filters.sortBy === 'oldest') {
    filteredReviews.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (filters.sortBy === 'lowest_rating') {
    filteredReviews.sort((a, b) => a.rating - b.rating);
  } else if (filters.sortBy === 'highest_rating') {
    filteredReviews.sort((a, b) => b.rating - a.rating);
  } else {
    // newest (default)
    filteredReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  
  const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = mockReviews.length > 0 ? totalRating / mockReviews.length : 0;
  
  return {
    reviews: filteredReviews,
    total: filteredReviews.length,
    averageRating
  };
};

export const respondToReview = async (reviewId, responseText) => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // En una implementación real, aquí se haría la llamada al backend
  const review = mockReviews.find(r => r.id === reviewId);
  if (review) {
    review.response = {
      text: responseText,
      createdAt: new Date().toISOString().split('T')[0],
      canEdit: true
    };
  }
  
  return { success: true };
};

export const getReviewsStats = async () => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const totalReviews = mockReviews.length;
  const totalRating = mockReviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;
  
  // Calcular promedio de últimos 90 días (simulado)
  const last90DaysAverage = averageRating + (Math.random() - 0.5) * 0.5;
  
  const ratingDistribution = mockReviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});
  
  return {
    averageRating,
    totalReviews,
    last90DaysAverage: Math.max(1, Math.min(5, last90DaysAverage)),
    ratingDistribution,
    trend: {
      rating: { type: 'positive', value: '+0.2', label: 'vs mes anterior' },
      total: { type: 'positive', value: '+12%', label: 'vs mes anterior' },
      recent: { type: 'neutral', value: '0%', label: 'vs promedio general' }
    }
  };
};

export const getRatingTrend = async () => {
  // Simular delay de API
  await new Promise(resolve => setTimeout(resolve, 400));
  
  return mockTrendData;
};