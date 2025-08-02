import React from 'react';
import { MetricsGrid } from './components/MetricsGrid';
import { AlertsList } from './components/AlertsList';
import { MiniCalendar } from './components/MiniCalendar';
import { IncomeChart } from './components/IncomeChart';
import { QuickActions } from './components/QuickActions';
import { Loader } from '../../components/Loader';
import { ErrorBoundary } from '../../components/ErrorBoundary';

export const Dashboard = () => {
  // Estados para manejar loading y errores (simulado)
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Datos de ejemplo - en una app real vendrían de APIs
  const metricsData = {
    monthlyIncome: '€2,340',
    weeklyAppointments: 12,
    unreadMessages: 3,
    averageRating: 4.9
  };

  const alertsData = [
    {
      id: 1,
      type: 'appointment',
      priority: 'high',
      message: 'Próxima sesión en 15 minutos',
      time: '14:45 - María González'
    },
    {
      id: 2,
      type: 'document',
      priority: 'medium',
      message: 'Documento pendiente de firmar',
      time: 'Consentimiento informado - Juan Pérez'
    },
    {
      id: 3,
      type: 'subscription',
      priority: 'medium',
      message: 'Suscripción vence en 3 días',
      time: 'Plan Premium - Renovar antes del 15/01'
    }
  ];

  const appointmentsData = [
    { date: new Date(), count: 3 },
    { date: new Date(Date.now() + 86400000), count: 2 }, // +1 día
    { date: new Date(Date.now() + 259200000), count: 1 }, // +3 días
    { date: new Date(Date.now() + 432000000), count: 4 } // +5 días
  ];

  const incomeData = [
    { month: 'Ago', income: 1800 },
    { month: 'Sep', income: 2100 },
    { month: 'Oct', income: 2400 },
    { month: 'Nov', income: 2200 },
    { month: 'Dic', income: 2800 },
    { month: 'Ene', income: 2340 }
  ];

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error al cargar el dashboard: {error}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-3xl font-bold text-deep">Dashboard</h1>
          <p className="text-gray-600">Bienvenido al panel de control profesional</p>
        </div>
        
        {/* Métricas principales - Grid responsive */}
        <MetricsGrid metrics={metricsData} />
        
        {/* Grid principal - 4 columnas en desktop, 1 en móvil */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Alertas - Ocupa 2 columnas en desktop */}
          <div className="lg:col-span-2">
            <AlertsList alerts={alertsData} />
          </div>
          
          {/* Mini calendario - 1 columna */}
          <div className="lg:col-span-1">
            <MiniCalendar appointments={appointmentsData} />
          </div>
          
          {/* Acciones rápidas - 1 columna */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
        
        {/* Gráfico de ingresos - Ancho completo */}
        <div className="w-full">
          <IncomeChart data={incomeData} />
        </div>
      </div>
    </ErrorBoundary>
  );
};