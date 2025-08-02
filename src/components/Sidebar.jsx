import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Shield, 
  CreditCard, 
  Calendar, 
  BookOpen, 
  Users, 
  MessageCircle, 
  FileText, 
  Star, 
  DollarSign, 
  Bell, 
  Puzzle, 
  HelpCircle, 
  Settings 
} from 'lucide-react';
import { useAppStore } from '../app/store';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Perfil Profesional', path: '/perfil-profesional', icon: User },
  { name: 'Verificación', path: '/verificacion', icon: Shield },
  { name: 'Planes y Suscripción', path: '/planes-suscripcion', icon: CreditCard },
  { name: 'Disponibilidad', path: '/disponibilidad', icon: Calendar },
  { name: 'Reservas', path: '/reservas', icon: BookOpen },
  { name: 'Clientes', path: '/clientes', icon: Users },
  { name: 'Chat', path: '/chat', icon: MessageCircle },
  { name: 'Documentos y Materiales', path: '/documentos-materiales', icon: FileText },
  { name: 'Reseñas', path: '/reseñas', icon: Star },
  { name: 'Pagos', path: '/pagos', icon: DollarSign },
  { name: 'Notificaciones', path: '/notificaciones', icon: Bell },
  { name: 'Integraciones', path: '/integraciones', icon: Puzzle },
  { name: 'Centro de Ayuda', path: '/centro-ayuda', icon: HelpCircle },
  { name: 'Configuración de Cuenta', path: '/configuracion-cuenta', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { sidebarOpen } = useAppStore();

  return (
    <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} overflow-y-auto`}>
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive 
                    ? 'bg-sage text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};