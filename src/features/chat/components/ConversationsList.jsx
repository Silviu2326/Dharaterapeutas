import React from 'react';
import { ConversationItem } from './ConversationItem';
import { Loader } from '../../../components/Loader';

export const ConversationsList = ({
  conversations = [],
  selectedConversationId,
  onSelectConversation,
  isLoading = false,
  searchTerm = '',
  filter = 'all'
}) => {
  // Filtrar conversaciones según búsqueda y filtros
  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = !searchTerm || 
      conversation.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conversation.client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = (() => {
      switch (filter) {
        case 'today':
          const today = new Date().toDateString();
          return conversation.lastMessage && 
            new Date(conversation.lastMessage.timestamp).toDateString() === today;
        case 'unread':
          return conversation.unreadCount > 0;
        case 'all':
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesFilter;
  });

  // Ordenar por última actividad
  const sortedConversations = filteredConversations.sort((a, b) => {
    const aTime = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(0);
    const bTime = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(0);
    return bTime - aTime;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <Loader size="sm" />
      </div>
    );
  }

  if (sortedConversations.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.906-1.476L3 21l2.476-5.094A8.959 8.959 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">
          {searchTerm || filter !== 'all' 
            ? 'No se encontraron conversaciones'
            : 'No hay conversaciones activas'
          }
        </p>
        {(searchTerm || filter !== 'all') && (
          <p className="text-gray-400 text-xs mt-1">
            Intenta cambiar los filtros de búsqueda
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sortedConversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={conversation.id === selectedConversationId}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </div>
  );
};

// Hook personalizado para gestionar conversaciones
export const useConversations = () => {
  const [conversations, setConversations] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    // Simular carga de conversaciones
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        // Aquí se haría la llamada a la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Datos mock
        const mockConversations = [
          {
            id: 'conv-1',
            client: {
              id: 'CL001',
              name: 'Ana García López',
              email: 'ana.garcia@email.com',
              avatar: null,
              isOnline: true
            },
            lastMessage: {
              id: 'msg-1',
              content: 'Hola, tengo una consulta sobre mi próxima sesión',
              timestamp: '2024-01-15T14:30:00Z',
              senderId: 'CL001',
              isRead: false
            },
            unreadCount: 2,
            nextSession: '2024-01-16T10:00:00Z'
          },
          {
            id: 'conv-2',
            client: {
              id: 'CL002',
              name: 'Miguel Rodríguez',
              email: 'miguel.rodriguez@email.com',
              avatar: null,
              isOnline: false
            },
            lastMessage: {
              id: 'msg-2',
              content: 'Gracias por la sesión de hoy, me ayudó mucho',
              timestamp: '2024-01-15T12:15:00Z',
              senderId: 'CL002',
              isRead: true
            },
            unreadCount: 0,
            nextSession: '2024-01-18T16:30:00Z'
          },
          {
            id: 'conv-3',
            client: {
              id: 'CL003',
              name: 'Laura Martín',
              email: 'laura.martin@email.com',
              avatar: null,
              isOnline: true
            },
            lastMessage: {
              id: 'msg-3',
              content: '¿Podríamos cambiar la hora de mañana?',
              timestamp: '2024-01-15T09:45:00Z',
              senderId: 'CL003',
              isRead: false
            },
            unreadCount: 1,
            nextSession: '2024-01-16T18:00:00Z'
          }
        ];
        
        setConversations(mockConversations);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  const markAsRead = (conversationId) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
  };

  const updateLastMessage = (conversationId, message) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, lastMessage: message }
          : conv
      )
    );
  };

  return {
    conversations,
    isLoading,
    error,
    markAsRead,
    updateLastMessage
  };
};