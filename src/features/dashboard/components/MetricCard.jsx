import React from 'react';
import { Card } from '../../../components/Card';

export const MetricCard = ({ title, value, icon: Icon, color = 'text-sage', ariaLabel }) => {
  return (
    <Card 
      className="hover:shadow-md transition-shadow duration-200"
      aria-label={ariaLabel || `${title}: ${value}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg bg-gray-50`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
        )}
      </div>
    </Card>
  );
};