import React from 'react';
import { Card } from '../../components/Card';

export const HelpCenter = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-deep">Centro de Ayuda</h1>
        <p className="text-gray-600">Soporte y documentación</p>
      </div>
      
      <Card>
        <h2 className="text-xl font-semibold text-deep mb-4">¿Cómo podemos ayudarte?</h2>
        <p className="text-gray-600">Encuentra respuestas a preguntas frecuentes y contacta con soporte.</p>
      </Card>
    </div>
  );
};