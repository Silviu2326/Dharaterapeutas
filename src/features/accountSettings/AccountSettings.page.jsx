import React from 'react';
import { Card } from '../../components/Card';

export const AccountSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep">Configuración de Cuenta</h1>
        <p className="text-gray-600">Gestiona tu cuenta y preferencias</p>
      </div>
      
      <Card>
        <h2 className="text-xl font-semibold text-deep mb-4">Configuración General</h2>
        <p className="text-gray-600">Actualiza tu información personal y preferencias de la cuenta.</p>
      </Card>
    </div>
  );
};