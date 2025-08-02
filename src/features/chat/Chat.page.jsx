import React, { useState, useEffect } from 'react';
import { ConversationsList } from './components/ConversationsList';
import { ConversationsSearch } from './components/ConversationsSearch';
import { ConversationsFilter } from './components/ConversationsFilter';
import { ChatHeader } from './components/ChatHeader';
import { MessagesPane } from './components/MessagesPane';
import { MessageInput } from './components/MessageInput';
import { TypingIndicatorContainer } from './components/TypingIndicator';

export const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Manejar selección de conversación
  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Manejar envío de mensaje
  const handleSendMessage = (messageData) => {
    console.log('Sending message:', messageData);
    // Aquí se integraría con la API real
  };

  // Manejar eventos de escritura
  const handleTypingStart = () => {
    console.log('User started typing');
    // Aquí se notificaría al servidor
  };

  const handleTypingStop = () => {
    console.log('User stopped typing');
    // Aquí se notificaría al servidor
  };

  // Manejar adjuntos
  const handleAttachFile = (file) => {
    console.log('Attaching file:', file);
    // Aquí se subiría el archivo
  };

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar de conversaciones */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        ${isSidebarOpen ? 'w-80' : 'w-0'}
        transition-all duration-300 ease-in-out
        bg-white border-r border-gray-200 flex flex-col
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
      `}>
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">Chat</h1>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Cerrar sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Buscador */}
          <ConversationsSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="mb-3"
          />
          
          {/* Filtros */}
          <ConversationsFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
        
        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-hidden">
          <ConversationsList
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            selectedConversation={selectedConversation}
            onConversationSelect={handleConversationSelect}
          />
        </div>
      </div>

      {/* Overlay para móvil */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Área principal del chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <>
            {/* Header del chat */}
            <ChatHeader
              client={selectedConversation.client}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
              showSidebarToggle={isMobile || !isSidebarOpen}
            />
            
            {/* Área de mensajes */}
            <div className="flex-1 flex flex-col min-h-0">
              <MessagesPane
                conversationId={selectedConversation.id}
                className="flex-1"
              />
              
              {/* Indicador de escritura */}
              <TypingIndicatorContainer
                conversationId={selectedConversation.id}
                className="px-4 py-2"
              />
              
              {/* Input de mensaje */}
              <MessageInput
                onSendMessage={handleSendMessage}
                onAttachFile={handleAttachFile}
                onTypingStart={handleTypingStart}
                onTypingStop={handleTypingStop}
              />
            </div>
          </>
        ) : (
          /* Estado vacío */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto px-4">
              {/* Botón para abrir sidebar en móvil */}
              {isMobile && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mb-6 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 transition-colors duration-200"
                >
                  Ver conversaciones
                </button>
              )}
              
              {/* Icono y mensaje */}
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Selecciona una conversación
              </h2>
              
              <p className="text-gray-600 mb-6">
                Elige una conversación de la lista para comenzar a chatear con tu cliente.
              </p>
              
              {/* Estadísticas rápidas */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-sage-600 mb-1">12</div>
                  <div className="text-gray-600">Conversaciones activas</div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">3</div>
                  <div className="text-gray-600">Mensajes sin leer</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};