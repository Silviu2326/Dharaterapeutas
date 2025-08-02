// Mock data for payments
const mockPayments = [
  {
    id: 'PAY-2024-001',
    date: '2024-01-15T10:30:00Z',
    clientName: 'María García López',
    clientEmail: 'maria.garcia@email.com',
    clientPhone: '+34 666 123 456',
    concept: 'Sesión de terapia individual - Enero 2024',
    amount: 80.00,
    fee: 2.40,
    method: 'stripe',
    status: 'paid',
    transactionId: 'txn_1234567890',
    taxRate: 0.21,
    notes: 'Pago realizado correctamente'
  },
  {
    id: 'PAY-2024-002',
    date: '2024-01-14T16:45:00Z',
    clientName: 'Carlos Rodríguez',
    clientEmail: 'carlos.rodriguez@email.com',
    concept: 'Terapia de pareja - Sesión 3',
    amount: 120.00,
    fee: 3.60,
    method: 'bizum',
    status: 'paid',
    transactionId: 'bzm_9876543210',
    taxRate: 0.21
  },
  {
    id: 'PAY-2024-003',
    date: '2024-01-13T09:15:00Z',
    clientName: 'Ana Martínez',
    clientEmail: 'ana.martinez@email.com',
    concept: 'Consulta psicológica inicial',
    amount: 90.00,
    fee: 2.70,
    method: 'paypal',
    status: 'refunded',
    transactionId: 'pp_1122334455',
    taxRate: 0.21,
    refunded: true,
    refundDate: '2024-01-14T12:00:00Z',
    refundReason: 'Cancelación por parte del cliente'
  },
  {
    id: 'PAY-2024-004',
    date: '2024-01-12T14:20:00Z',
    clientName: 'Pedro Sánchez',
    clientEmail: 'pedro.sanchez@email.com',
    concept: 'Terapia grupal - Enero',
    amount: 60.00,
    fee: 1.80,
    method: 'stripe',
    status: 'pending',
    transactionId: 'txn_pending123',
    taxRate: 0.21
  },
  {
    id: 'PAY-2024-005',
    date: '2024-01-11T11:30:00Z',
    clientName: 'Laura Fernández',
    clientEmail: 'laura.fernandez@email.com',
    concept: 'Sesión de mindfulness',
    amount: 45.00,
    fee: 1.35,
    method: 'bizum',
    status: 'failed',
    transactionId: 'bzm_failed456',
    taxRate: 0.21,
    failureReason: 'Fondos insuficientes'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getPayments = async (filters = {}) => {
  await delay(800);
  
  let filteredPayments = [...mockPayments];
  
  // Apply filters
  if (filters.status && filters.status !== 'all') {
    filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
  }
  
  if (filters.method && filters.method !== 'all') {
    filteredPayments = filteredPayments.filter(payment => payment.method === filters.method);
  }
  
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredPayments = filteredPayments.filter(payment => 
      payment.id.toLowerCase().includes(searchTerm) ||
      payment.clientName.toLowerCase().includes(searchTerm) ||
      payment.concept.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.dateRange?.startDate) {
    filteredPayments = filteredPayments.filter(payment => 
      new Date(payment.date) >= new Date(filters.dateRange.startDate)
    );
  }
  
  if (filters.dateRange?.endDate) {
    filteredPayments = filteredPayments.filter(payment => 
      new Date(payment.date) <= new Date(filters.dateRange.endDate)
    );
  }
  
  // Apply sorting
  if (filters.sortBy) {
    filteredPayments.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];
      
      if (filters.sortBy === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      
      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
  
  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    payments: filteredPayments.slice(startIndex, endIndex),
    total: filteredPayments.length,
    page,
    totalPages: Math.ceil(filteredPayments.length / limit)
  };
};

export const getPaymentStats = async (period = 'month') => {
  await delay(500);
  
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate monthly revenue
  const monthlyPayments = mockPayments.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getMonth() === currentMonth && 
           paymentDate.getFullYear() === currentYear &&
           payment.status === 'paid';
  });
  
  // Calculate yearly revenue
  const yearlyPayments = mockPayments.filter(payment => {
    const paymentDate = new Date(payment.date);
    return paymentDate.getFullYear() === currentYear && payment.status === 'paid';
  });
  
  const monthlyRevenue = monthlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const yearlyRevenue = yearlyPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  // Find last payment
  const paidPayments = mockPayments.filter(p => p.status === 'paid');
  const lastPayment = paidPayments.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  
  // Calculate pending payouts
  const pendingPayouts = paidPayments.reduce((sum, payment) => {
    return sum + (payment.amount - (payment.fee || 0));
  }, 0);
  
  return {
    monthlyRevenue,
    yearlyRevenue,
    lastPayment: lastPayment ? {
      amount: lastPayment.amount,
      date: lastPayment.date
    } : null,
    pendingPayouts,
    trends: {
      monthly: { type: 'positive', value: '+12.5%', label: 'vs mes anterior' },
      yearly: { type: 'positive', value: '+8.3%', label: 'vs año anterior' }
    }
  };
};

export const getPayoutData = async () => {
  await delay(600);
  
  return {
    availableBalance: 450.75,
    nextPayoutDate: '2024-01-20T00:00:00Z',
    canRequestImmediate: true,
    minimumPayout: 10,
    processingDays: 2,
    payoutHistory: [
      {
        date: '2024-01-10T00:00:00Z',
        amount: 320.50,
        status: 'completed',
        type: 'automatic'
      },
      {
        date: '2024-01-05T00:00:00Z',
        amount: 180.25,
        status: 'completed',
        type: 'immediate'
      },
      {
        date: '2023-12-28T00:00:00Z',
        amount: 275.80,
        status: 'completed',
        type: 'automatic'
      }
    ]
  };
};

export const requestPayout = async () => {
  await delay(1000);
  
  // Simulate success/failure
  const success = Math.random() > 0.1; // 90% success rate
  
  if (success) {
    return {
      success: true,
      message: 'Transferencia solicitada correctamente. Se procesará en las próximas 24 horas.',
      payoutId: 'PO-' + Date.now()
    };
  } else {
    throw new Error('No se pudo procesar la transferencia. Inténtalo más tarde.');
  }
};

export const refundPayment = async (paymentId, reason = '') => {
  await delay(1200);
  
  // Simulate success/failure
  const success = Math.random() > 0.05; // 95% success rate
  
  if (success) {
    return {
      success: true,
      message: 'Reembolso procesado correctamente',
      refundId: 'REF-' + Date.now(),
      estimatedDays: 3
    };
  } else {
    throw new Error('No se pudo procesar el reembolso. Verifica los datos del pago.');
  }
};

export const downloadInvoice = async (paymentId) => {
  await delay(800);
  
  // Simulate PDF generation
  return {
    success: true,
    downloadUrl: `https://example.com/invoices/${paymentId}.pdf`,
    filename: `factura-${paymentId}.pdf`
  };
};

export const exportPayments = async (filters = {}, format = 'csv') => {
  await delay(1500);
  
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `pagos-${timestamp}.${format}`;
  
  return {
    success: true,
    downloadUrl: `https://example.com/exports/${filename}`,
    filename,
    recordCount: mockPayments.length
  };
};

export const updatePaymentMethod = async (paymentMethodData) => {
  await delay(1000);
  
  return {
    success: true,
    message: 'Método de pago actualizado correctamente'
  };
};