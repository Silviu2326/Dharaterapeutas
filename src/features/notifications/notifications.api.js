// Mock data for notifications
const mockNotifications = [
  {
    id: '1',
    title: 'Cita programada para mañana',
    summary: 'Tienes una cita con Dr. García programada para mañana a las 10:00 AM. Recuerda llegar 15 minutos antes.',
    type: 'appointment',
    isRead: false,
    isImportant: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    source: 'Sistema de Citas'
  },
  {
    id: '2',
    title: 'Nuevo mensaje de María López',
    summary: 'Hola, quería confirmar nuestra reunión del viernes. ¿Podríamos cambiarla a las 3:00 PM?',
    type: 'message',
    isRead: false,
    isImportant: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    source: 'Chat Interno'
  },
  {
    id: '3',
    title: 'Documento listo para revisión',
    summary: 'El informe mensual de ventas está listo para tu revisión. Puedes descargarlo desde el panel de documentos.',
    type: 'document',
    isRead: true,
    isImportant: false,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    source: 'Sistema de Documentos'
  },
  {
    id: '4',
    title: 'Pago procesado exitosamente',
    summary: 'El pago de $1,250.00 del cliente Juan Pérez ha sido procesado correctamente.',
    type: 'payment',
    isRead: false,
    isImportant: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    source: 'Sistema de Pagos'
  },
  {
    id: '5',
    title: 'Actualización del sistema',
    summary: 'El sistema se actualizará esta noche a las 2:00 AM. El tiempo estimado de inactividad es de 30 minutos.',
    type: 'system',
    isRead: true,
    isImportant: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    source: 'Administración'
  },
  {
    id: '6',
    title: 'Recordatorio de cita',
    summary: 'Recordatorio: Tienes una cita con Ana Rodríguez hoy a las 4:00 PM.',
    type: 'appointment',
    isRead: true,
    isImportant: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    source: 'Sistema de Citas'
  },
  {
    id: '7',
    title: 'Nuevo documento subido',
    summary: 'Se ha subido un nuevo contrato que requiere tu firma digital.',
    type: 'document',
    isRead: false,
    isImportant: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    source: 'Sistema de Documentos'
  },
  {
    id: '8',
    title: 'Mensaje de Carlos Ruiz',
    summary: 'Gracias por la reunión de ayer. Te envío el resumen de los puntos acordados.',
    type: 'message',
    isRead: true,
    isImportant: false,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    source: 'Chat Interno'
  },
  {
    id: '9',
    title: 'Pago pendiente de aprobación',
    summary: 'Hay un pago de $850.00 pendiente de tu aprobación en el sistema.',
    type: 'payment',
    isRead: false,
    isImportant: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    source: 'Sistema de Pagos'
  },
  {
    id: '10',
    title: 'Mantenimiento programado',
    summary: 'El próximo domingo habrá mantenimiento programado del sistema de 6:00 AM a 8:00 AM.',
    type: 'system',
    isRead: true,
    isImportant: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    source: 'Administración'
  }
];

// Mock notification settings
let mockSettings = {
  categories: {
    appointment: { email: true, push: true },
    message: { email: true, push: true },
    document: { email: true, push: false },
    payment: { email: true, push: true },
    system: { email: false, push: true }
  },
  quietHours: {
    enabled: true,
    startTime: '22:00',
    endTime: '07:00'
  },
  digestTimes: ['08:00', '20:00'],
  playSound: true,
  browserNotifications: true
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getNotifications = async (filters = {}) => {
  await delay(800);
  
  let filteredNotifications = [...mockNotifications];
  
  // Apply type filter
  if (filters.type && filters.type !== 'all') {
    if (filters.type === 'unread') {
      filteredNotifications = filteredNotifications.filter(n => !n.isRead);
    } else if (filters.type === 'important') {
      filteredNotifications = filteredNotifications.filter(n => n.isImportant);
    } else {
      filteredNotifications = filteredNotifications.filter(n => n.type === filters.type);
    }
  }
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredNotifications = filteredNotifications.filter(n => 
      n.title.toLowerCase().includes(searchLower) ||
      n.summary.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply date range filter
  if (filters.startDate) {
    filteredNotifications = filteredNotifications.filter(n => 
      new Date(n.createdAt) >= new Date(filters.startDate)
    );
  }
  if (filters.endDate) {
    filteredNotifications = filteredNotifications.filter(n => 
      new Date(n.createdAt) <= new Date(filters.endDate)
    );
  }
  
  // Apply sorting
  const sortBy = filters.sortBy || 'date_desc';
  switch (sortBy) {
    case 'date_asc':
      filteredNotifications.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'date_desc':
      filteredNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'importance':
      filteredNotifications.sort((a, b) => {
        if (a.isImportant && !b.isImportant) return -1;
        if (!a.isImportant && b.isImportant) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
    case 'type':
      filteredNotifications.sort((a, b) => {
        if (a.type < b.type) return -1;
        if (a.type > b.type) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
    case 'status':
      filteredNotifications.sort((a, b) => {
        if (!a.isRead && b.isRead) return -1;
        if (a.isRead && !b.isRead) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      break;
  }
  
  // Apply pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = filteredNotifications.slice(startIndex, endIndex);
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  
  return {
    notifications: paginatedNotifications,
    total: filteredNotifications.length,
    unreadCount,
    hasMore: endIndex < filteredNotifications.length,
    page,
    totalPages: Math.ceil(filteredNotifications.length / limit)
  };
};

export const getNotificationStats = async () => {
  await delay(500);
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  const weeklyCount = mockNotifications.filter(n => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(n.createdAt) >= weekAgo;
  }).length;
  const importantCount = mockNotifications.filter(n => n.isImportant).length;
  const totalCount = mockNotifications.length;
  
  return {
    unreadCount,
    weeklyCount,
    importantCount,
    totalCount
  };
};

export const markAsRead = async (notificationId) => {
  await delay(300);
  
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.isRead = true;
  }
  
  return { success: true };
};

export const markAllAsRead = async () => {
  await delay(500);
  
  mockNotifications.forEach(notification => {
    notification.isRead = true;
  });
  
  return { success: true };
};

export const deleteNotification = async (notificationId) => {
  await delay(300);
  
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
  }
  
  return { success: true };
};

export const deleteReadNotifications = async () => {
  await delay(500);
  
  const readNotifications = mockNotifications.filter(n => n.isRead);
  readNotifications.forEach(notification => {
    const index = mockNotifications.findIndex(n => n.id === notification.id);
    if (index !== -1) {
      mockNotifications.splice(index, 1);
    }
  });
  
  return { success: true, deletedCount: readNotifications.length };
};

export const sendTestNotification = async () => {
  await delay(1000);
  
  const testNotification = {
    id: `test_${Date.now()}`,
    title: 'Notificación de prueba',
    summary: 'Esta es una notificación de prueba enviada desde el panel de configuración.',
    type: 'system',
    isRead: false,
    isImportant: false,
    createdAt: new Date(),
    source: 'Sistema de Pruebas'
  };
  
  mockNotifications.unshift(testNotification);
  
  return { success: true, notification: testNotification };
};

export const getNotificationSettings = async () => {
  await delay(400);
  return { ...mockSettings };
};

export const updateNotificationSettings = async (settings) => {
  await delay(600);
  
  mockSettings = { ...mockSettings, ...settings };
  
  return { success: true, settings: mockSettings };
};