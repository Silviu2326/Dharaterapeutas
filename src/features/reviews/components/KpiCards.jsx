import React from 'react';
import { KpiCard } from './KpiCard';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';

export const KpiCards = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const {
    averageRating = 0,
    totalReviews = 0,
    last90DaysAverage = 0,
    trend = null
  } = stats || {};

  const kpiData = [
    {
      title: 'Valoración Media',
      value: averageRating.toFixed(1),
      subtitle: `⭐ de 5.0`,
      icon: Star,
      trend: trend?.rating
    },
    {
      title: 'Total Reseñas',
      value: totalReviews.toLocaleString(),
      subtitle: 'reseñas recibidas',
      icon: MessageSquare,
      trend: trend?.total
    },
    {
      title: 'Últimos 90 días',
      value: last90DaysAverage.toFixed(1),
      subtitle: 'promedio reciente',
      icon: TrendingUp,
      trend: trend?.recent
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpiData.map((kpi, index) => (
        <KpiCard key={index} {...kpi} />
      ))}
    </div>
  );
};