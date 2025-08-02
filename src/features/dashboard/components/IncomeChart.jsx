import React from 'react';
import { Card } from '../../../components/Card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export const IncomeChart = ({ data }) => {
  // Datos de ejemplo para los últimos 6 meses
  const defaultData = [
    { month: 'Ago', income: 1800 },
    { month: 'Sep', income: 2100 },
    { month: 'Oct', income: 2400 },
    { month: 'Nov', income: 2200 },
    { month: 'Dic', income: 2800 },
    { month: 'Ene', income: 2340 }
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-deep">{`${label}`}</p>
          <p className="text-sm text-sage">
            {`Ingresos: €${payload[0].value.toLocaleString()}`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-deep">Ingresos Mensuales</h2>
        <span className="text-sm text-gray-500">Últimos 6 meses</span>
      </div>
      
      <div className="h-64" role="img" aria-label="Gráfico de barras mostrando ingresos mensuales de los últimos 6 meses">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#6B7280' }}
              tickFormatter={(value) => `€${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="income" 
              fill="#819983" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Descripción oculta para accesibilidad */}
      <div className="sr-only">
        Gráfico de barras que muestra los ingresos mensuales de los últimos 6 meses. 
        {chartData.map((item, index) => 
          `${item.month}: €${item.income}${index < chartData.length - 1 ? ', ' : '.'}`
        ).join('')}
      </div>
    </Card>
  );
};