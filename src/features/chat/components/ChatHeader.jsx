import React, { useState } from 'react';

export const ChatHeader = ({
  client,
  nextSession,
  onViewProfile,
  onStartVideoCall,
  onMoreOptions,
  isOnline = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!client) {
    return (
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  const formatNextSession = (timestamp) => {
    if (!timestamp) return null;
    
    const sessionDate = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((sessionDate - now) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInHours < 1) return 'En menos de 1 hora';
    if (diffInHours < 24) return `En ${diffInHours} horas`;
    if (diffInDays === 1) return 'Mañana';
    if (diffInDays < 7) return `En ${diffInDays} días`;
    
    return sessionDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSessionUrgency = (timestamp) => {
    if (!timestamp) return null;
    
    const sessionDate = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((sessionDate - now) / (1000 * 60 * 60));
    
    if (diffInHours < 2) return 'urgent';
    if (diffInHours < 24) return 'soon';
    return 'normal';
  };

  const sessionUrgency = getSessionUrgency(nextSession);
  const sessionText = formatNextSession(nextSession);

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 relative">
      <div className="flex items-center justify-between">
        {/* Información del cliente */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {client.avatar ? (
                <img 
                  src={client.avatar} 
                  alt={client.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
              )}
            </div>
            
            {/* Indicador de estado online */}
            <div className={`
              absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white
              ${isOnline ? 'bg-green-500' : 'bg-gray-400'}
            `} />
          </div>

          {/* Información */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-gray-900 truncate">
                {client.name}
              </h2>
              {isOnline && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  En línea
                </span>
              )}
            </div>
            
            {/* Próxima sesión */}
            {sessionText && (
              <div className={`
                flex items-center space-x-1 text-sm
                ${sessionUrgency === 'urgent' 
                  ? 'text-red-600' 
                  : sessionUrgency === 'soon' 
                    ? 'text-orange-600' 
                    : 'text-gray-600'
                }
              `}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Próxima sesión: {sessionText}</span>
                {sessionUrgency === 'urgent' && (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center space-x-2">
          {/* Botón videollamada */}
          {sessionUrgency === 'urgent' && (
            <button
              onClick={onStartVideoCall}
              className="
                inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
                bg-blue-600 text-white hover:bg-blue-700
                transition-colors duration-200
              "
              title="Iniciar videollamada"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="hidden sm:inline">Video</span>
            </button>
          )}

          {/* Botón ver perfil */}
          <button
            onClick={onViewProfile}
            className="
              inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium
              bg-sage-600 text-white hover:bg-sage-700
              transition-colors duration-200
            "
            title="Ver ficha del cliente"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="hidden sm:inline">Ver ficha</span>
          </button>

          {/* Menú de opciones */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="
                p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100
                transition-colors duration-200
              "
              title="Más opciones"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Dropdown de opciones */}
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowDropdown(false)}
                  aria-hidden="true"
                />
                <div className="
                  absolute right-0 top-full mt-1 w-48 z-20
                  bg-white border border-gray-200 rounded-lg shadow-lg
                  py-1
                ">
                  <button
                    onClick={() => {
                      onViewProfile();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Ver perfil completo
                  </button>
                  
                  <button
                    onClick={() => {
                      // Lógica para crear nueva cita
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Programar cita
                  </button>
                  
                  <button
                    onClick={() => {
                      // Lógica para ver historial
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ver historial
                  </button>
                  
                  <div className="border-t border-gray-100 my-1" />
                  
                  <button
                    onClick={() => {
                      // Lógica para silenciar
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                    Silenciar notificaciones
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente compacto para móvil
export const ChatHeaderMobile = ({ client, nextSession, onViewProfile, onBack }) => {
  if (!client) return null;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center space-x-3">
        {/* Botón volver */}
        <button
          onClick={onBack}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          aria-label="Volver a conversaciones"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {client.avatar ? (
            <img 
              src={client.avatar} 
              alt={client.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            client.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          )}
        </div>

        {/* Información */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">
            {client.name}
          </h2>
          {nextSession && (
            <p className="text-xs text-gray-500 truncate">
              Próxima: {new Date(nextSession).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short' 
              })}
            </p>
          )}
        </div>

        {/* Botón ver perfil */}
        <button
          onClick={onViewProfile}
          className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          aria-label="Ver perfil del cliente"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};