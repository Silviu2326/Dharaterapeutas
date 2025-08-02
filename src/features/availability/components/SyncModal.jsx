import React, { useState } from 'react';
import { X, Calendar, CheckCircle, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

const CALENDAR_PROVIDERS = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '🔗',
    description: 'Sincroniza con tu calendario de Google',
    color: 'bg-blue-500',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'outlook',
    name: 'Microsoft Outlook',
    icon: '📧',
    description: 'Conecta con Outlook y Office 365',
    color: 'bg-blue-600',
    textColor: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: '🍎',
    description: 'Sincroniza con iCloud Calendar',
    color: 'bg-gray-800',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  {
    id: 'caldav',
    name: 'CalDAV',
    icon: '🔗',
    description: 'Conecta cualquier calendario compatible con CalDAV',
    color: 'bg-green-600',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  }
];

const ConnectionStatus = ({ provider, status, onConnect, onDisconnect, loading }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'connecting':
        return <RefreshCw className="h-5 w-5 text-blue-600 animate-spin" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'error':
        return 'Error de conexión';
      case 'connecting':
        return 'Conectando...';
      default:
        return 'No conectado';
    }
  };

  const getActionButton = () => {
    if (status === 'connected') {
      return (
        <button
          onClick={() => onDisconnect(provider.id)}
          disabled={loading}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors duration-200"
        >
          Desconectar
        </button>
      );
    }
    
    return (
      <button
        onClick={() => onConnect(provider.id)}
        disabled={loading || status === 'connecting'}
        className={`
          px-3 py-1 text-sm text-white rounded-md transition-colors duration-200
          ${provider.color} hover:opacity-90 disabled:opacity-50
          flex items-center space-x-1
        `}
      >
        {status === 'connecting' ? (
          <RefreshCw className="h-3 w-3 animate-spin" />
        ) : (
          <ExternalLink className="h-3 w-3" />
        )}
        <span>Conectar</span>
      </button>
    );
  };

  return (
    <div className={`
      border rounded-lg p-4 transition-all duration-200
      ${provider.borderColor} ${provider.bgColor}
    `}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{provider.icon}</div>
          <div>
            <h3 className="font-medium text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-600">{provider.description}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${
              status === 'connected' ? 'text-green-600' :
              status === 'error' ? 'text-red-600' :
              status === 'connecting' ? 'text-blue-600' :
              'text-gray-500'
            }`}>
              {getStatusText()}
            </span>
          </div>
          {getActionButton()}
        </div>
      </div>
      
      {status === 'error' && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            No se pudo conectar con {provider.name}. Verifica tus credenciales e inténtalo de nuevo.
          </p>
        </div>
      )}
    </div>
  );
};

export const SyncModal = ({ 
  isOpen, 
  onClose, 
  connections = {}, 
  onConnect, 
  onDisconnect,
  loading = false 
}) => {
  const [syncSettings, setSyncSettings] = useState({
    syncDirection: 'bidirectional', // 'import', 'export', 'bidirectional'
    conflictResolution: 'manual', // 'manual', 'local', 'remote'
    syncFrequency: 'realtime' // 'realtime', 'hourly', 'daily'
  });

  if (!isOpen) return null;

  const handleConnect = async (providerId) => {
    try {
      await onConnect?.(providerId, syncSettings);
    } catch (error) {
      console.error('Error connecting to provider:', error);
    }
  };

  const handleDisconnect = async (providerId) => {
    try {
      await onDisconnect?.(providerId);
    } catch (error) {
      console.error('Error disconnecting from provider:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-sage" />
                Sincronización de Calendarios
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Conecta tus calendarios externos para mantener sincronizada tu disponibilidad
            </p>
          </div>

          {/* Content */}
          <div className="bg-white px-6 py-4 space-y-6">
            {/* Calendar Providers */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-4">Proveedores de calendario</h4>
              <div className="space-y-3">
                {CALENDAR_PROVIDERS.map((provider) => (
                  <ConnectionStatus
                    key={provider.id}
                    provider={provider}
                    status={connections[provider.id] || 'disconnected'}
                    onConnect={handleConnect}
                    onDisconnect={handleDisconnect}
                    loading={loading}
                  />
                ))}
              </div>
            </div>

            {/* Sync Settings */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Configuración de sincronización</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sync Direction */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección de sincronización
                  </label>
                  <select
                    value={syncSettings.syncDirection}
                    onChange={(e) => setSyncSettings(prev => ({ ...prev, syncDirection: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                  >
                    <option value="bidirectional">Bidireccional</option>
                    <option value="import">Solo importar</option>
                    <option value="export">Solo exportar</option>
                  </select>
                </div>

                {/* Conflict Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolución de conflictos
                  </label>
                  <select
                    value={syncSettings.conflictResolution}
                    onChange={(e) => setSyncSettings(prev => ({ ...prev, conflictResolution: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                  >
                    <option value="manual">Preguntar siempre</option>
                    <option value="local">Priorizar local</option>
                    <option value="remote">Priorizar remoto</option>
                  </select>
                </div>

                {/* Sync Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frecuencia de sincronización
                  </label>
                  <select
                    value={syncSettings.syncFrequency}
                    onChange={(e) => setSyncSettings(prev => ({ ...prev, syncFrequency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage"
                  >
                    <option value="realtime">Tiempo real</option>
                    <option value="hourly">Cada hora</option>
                    <option value="daily">Diariamente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>La sincronización puede tardar unos minutos en completarse</li>
                    <li>Los eventos existentes no se duplicarán</li>
                    <li>Puedes desconectar cualquier calendario en cualquier momento</li>
                    <li>Los cambios se reflejarán según la frecuencia configurada</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-3 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage transition-colors duration-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};