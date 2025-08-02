import React, { useState } from 'react';
import { Button } from '../../../components/Button';

export const SyncNowButton = ({ integrationId }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // TODO: Implementar API de sincronización
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulación
      console.log(`Sincronizando ${integrationId}`);
      // TODO: Mostrar notificación de éxito
    } catch (error) {
      console.error('Error syncing:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant="outline"
      size="sm"
      className="flex-1"
      aria-label={`Sincronizar ahora ${integrationId}`}
    >
      {isSyncing ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Sincronizando</span>
        </span>
      ) : (
        <span className="flex items-center space-x-2">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Sincronizar</span>
        </span>
      )}
    </Button>
  );
};