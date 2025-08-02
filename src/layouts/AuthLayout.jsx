import React from 'react';
import { Card } from '../components/Card';

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-sage/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">D</span>
          </div>
          <h1 className="text-2xl font-bold text-deep">Dhara Dimensión Humana</h1>
          <p className="text-sage mt-2">Panel Profesional</p>
        </div>
        {children}
      </Card>
    </div>
  );
};