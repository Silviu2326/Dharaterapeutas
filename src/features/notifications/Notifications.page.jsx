import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  CounterKpis,
  NotificationsFilter,
  NotificationsList,
  QuickActionsBar,
  SettingsPanel
} from './components';
import {
  getNotifications,
  getNotificationStats,
  getNotificationSettings,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  sendTestNotification,
  updateNotificationSettings
} from './notifications.api';

export const Notifications = () => {
  const queryClient = useQueryClient();
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    startDate: null,
    endDate: null,
    sortBy: 'date_desc',
    page: 1,
    limit: 10
  });

  // Queries
  const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError } = useQuery({
    queryKey: ['notifications', filters],
    queryFn: () => getNotifications(filters),
    keepPreviousData: true,
    staleTime: 30000, // 30 seconds
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['notificationStats'],
    queryFn: getNotificationStats,
    refetchInterval: 60000, // Refetch every minute
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings
  });

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('Notificación marcada como leída');
    },
    onError: () => {
      toast.error('Error al marcar como leída');
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('Todas las notificaciones marcadas como leídas');
    },
    onError: () => {
      toast.error('Error al marcar todas como leídas');
    }
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('Notificación eliminada');
    },
    onError: () => {
      toast.error('Error al eliminar notificación');
    }
  });

  const deleteReadMutation = useMutation({
    mutationFn: deleteReadNotifications,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success(`${data.deletedCount} notificaciones eliminadas`);
    },
    onError: () => {
      toast.error('Error al eliminar notificaciones leídas');
    }
  });

  const sendTestMutation = useMutation({
    mutationFn: sendTestNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notificationStats'] });
      toast.success('Notificación de prueba enviada');
    },
    onError: () => {
      toast.error('Error al enviar notificación de prueba');
    }
  });

  const updateSettingsMutation = useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      toast.success('Configuración actualizada');
    },
    onError: () => {
      toast.error('Error al actualizar configuración');
    }
  });

  // Handlers
  const handleFiltersChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 }); // Reset page when filters change
  };

  const handleMarkAsRead = async (notificationId) => {
    await markAsReadMutation.mutateAsync(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    if (window.confirm('¿Marcar todas las notificaciones como leídas?')) {
      await markAllAsReadMutation.mutateAsync();
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    await deleteNotificationMutation.mutateAsync(notificationId);
  };

  const handleDeleteRead = async () => {
    if (window.confirm('¿Eliminar todas las notificaciones leídas?')) {
      await deleteReadMutation.mutateAsync();
    }
  };

  const handleSendTest = async () => {
    await sendTestMutation.mutateAsync();
  };

  const handleViewNotification = (notification) => {
    setSelectedNotification(notification);
    // Mark as read if not already read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
  };

  const handleLoadMore = () => {
    setFilters(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const handleSettingsChange = async (newSettings) => {
    await updateSettingsMutation.mutateAsync(newSettings);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Alt + M: Mark all as read
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        handleMarkAllAsRead();
      }
      // Escape: Close modals
      if (event.key === 'Escape') {
        setSelectedNotification(null);
        setShowSettings(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Error handling
  if (notificationsError) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-deep">Notificaciones</h1>
          <p className="text-gray-600">Centro de notificaciones</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar notificaciones</h3>
          <p className="text-red-700 mb-4">No se pudieron cargar las notificaciones. Por favor, intenta de nuevo.</p>
          <button
            onClick={() => queryClient.invalidateQueries('notifications')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-deep">Notificaciones</h1>
          <p className="text-gray-600">Centro de notificaciones y configuración</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              showSettings
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Configuración
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <CounterKpis stats={stats} loading={statsLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActionsBar
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteRead={handleDeleteRead}
            onSendTest={handleSendTest}
            markAllLoading={markAllAsReadMutation.isLoading}
            deleteReadLoading={deleteReadMutation.isLoading}
            sendTestLoading={sendTestMutation.isLoading}
            unreadCount={stats?.unreadCount || 0}
          />

          {/* Filters */}
          <NotificationsFilter
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {/* Notifications List */}
          <NotificationsList
            notifications={notificationsData?.notifications || []}
            loading={notificationsLoading}
            onMarkAsRead={handleMarkAsRead}
            onDelete={handleDeleteNotification}
            onView={handleViewNotification}
            onLoadMore={handleLoadMore}
            hasMore={notificationsData?.hasMore || false}
            loadingMore={filters.page > 1 && notificationsLoading}
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="lg:col-span-1">
            <SettingsPanel
              settings={settings}
              loading={settingsLoading}
              onChange={handleSettingsChange}
              className="sticky top-6"
            />
          </div>
        )}
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
              onClick={() => setSelectedNotification(null)}
              aria-hidden="true"
            />
            
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                    {selectedNotification.type === 'appointment' && '📆'}
                    {selectedNotification.type === 'message' && '💬'}
                    {selectedNotification.type === 'document' && '📄'}
                    {selectedNotification.type === 'payment' && '💳'}
                    {selectedNotification.type === 'system' && '⚙️'}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedNotification.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedNotification.source} • {new Date(selectedNotification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700">
                  {selectedNotification.summary}
                </p>
              </div>
              
              <div className="flex justify-end gap-3">
                {!selectedNotification.isRead && (
                  <button
                    onClick={() => {
                      handleMarkAsRead(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Marcar como leída
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDeleteNotification(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard shortcuts info */}
      <div className="fixed bottom-4 right-4 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-75 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-2">
          <kbd className="px-1 py-0.5 bg-gray-700 rounded">Alt</kbd>
          <span>+</span>
          <kbd className="px-1 py-0.5 bg-gray-700 rounded">M</kbd>
          <span>Marcar todo como leído</span>
        </div>
      </div>
    </div>
  );
};