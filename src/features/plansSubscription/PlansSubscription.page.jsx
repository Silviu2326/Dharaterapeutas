import React, { useState, useEffect } from 'react';
import { Card } from '../../components/Card';
import { CurrentPlanBanner } from './components/CurrentPlanBanner';
import { PlanGrid } from './components/PlanGrid';
import { ChangePlanModal } from './components/ChangePlanModal';
import { PaymentMethods } from './components/PaymentMethods';
import { AddCardModal } from './components/AddCardModal';
import { InvoicesTable } from './components/InvoicesTable';
import { PlanActions } from './components/PlanActions';

export const PlansSubscription = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showChangePlanModal, setShowChangePlanModal] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState(null);

  // Mock data
  const mockCurrentPlan = {
    id: 'plan_current',
    name: 'Plan Profesional',
    price: 29.99,
    interval: 'month',
    status: 'active',
    nextBillingDate: '2024-02-15',
    cancelAtPeriodEnd: false,
    paymentMethod: {
      id: 'pm_1',
      last4: '4242',
      brand: 'visa'
    }
  };

  const mockAvailablePlans = [
    {
      id: 'plan_basic',
      name: 'Básico',
      price: 9.99,
      interval: 'month',
      features: [
        'Hasta 10 clientes',
        'Calendario básico',
        'Soporte por email',
        'Reportes básicos'
      ],
      limitations: [
        'Sin videollamadas',
        'Sin integración con terceros'
      ],
      popular: false,
      trial: null
    },
    {
      id: 'plan_pro',
      name: 'Profesional',
      price: 29.99,
      interval: 'month',
      features: [
        'Clientes ilimitados',
        'Calendario avanzado',
        'Videollamadas incluidas',
        'Soporte prioritario',
        'Reportes avanzados',
        'Integración con terceros'
      ],
      limitations: [],
      popular: true,
      trial: { days: 14, price: 0 }
    },
    {
      id: 'plan_enterprise',
      name: 'Empresarial',
      price: 99.99,
      interval: 'month',
      features: [
        'Todo del plan Profesional',
        'Múltiples terapeutas',
        'API personalizada',
        'Soporte 24/7',
        'Onboarding personalizado',
        'SLA garantizado'
      ],
      limitations: [],
      popular: false,
      trial: null
    }
  ];

  const mockPaymentMethods = [
    {
      id: 'pm_1',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      holderName: 'Juan Pérez',
      isExpiringSoon: false
    },
    {
      id: 'pm_2',
      brand: 'mastercard',
      last4: '8888',
      expMonth: 3,
      expYear: 2024,
      holderName: 'Juan Pérez',
      isExpiringSoon: true
    }
  ];

  const mockInvoices = [
    {
      id: 'inv_1',
      number: 'INV-2024-001',
      date: '2024-01-15',
      description: 'Suscripción Plan Profesional',
      planName: 'Profesional',
      amount: 29.99,
      tax: 6.30,
      currency: 'EUR',
      status: 'paid',
      period: 'Enero 2024'
    },
    {
      id: 'inv_2',
      number: 'INV-2023-012',
      date: '2023-12-15',
      description: 'Suscripción Plan Profesional',
      planName: 'Profesional',
      amount: 29.99,
      tax: 6.30,
      currency: 'EUR',
      status: 'paid',
      period: 'Diciembre 2023'
    },
    {
      id: 'inv_3',
      number: 'INV-2023-011',
      date: '2023-11-15',
      description: 'Reembolso Plan Básico',
      planName: 'Básico',
      amount: -9.99,
      tax: -2.10,
      currency: 'EUR',
      status: 'refunded',
      period: 'Noviembre 2023'
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPlan(mockCurrentPlan);
      setAvailablePlans(mockAvailablePlans);
      setPaymentMethods(mockPaymentMethods);
      setInvoices(mockInvoices);
      setDefaultPaymentMethod('pm_1');
    } catch (err) {
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    if (plan.id === currentPlan?.id) return;
    setSelectedPlan(plan);
    setShowChangePlanModal(true);
  };

  const handleConfirmPlanChange = async (changeData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentPlan({
        ...changeData.newPlan,
        status: 'active',
        nextBillingDate: '2024-03-15',
        paymentMethod: currentPlan.paymentMethod
      });
      
      console.log('Plan changed successfully:', changeData);
    } catch (error) {
      throw new Error('Error al cambiar el plan');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDefaultPaymentMethod(paymentMethodId);
    } catch (error) {
      throw new Error('Error al establecer método de pago predeterminado');
    }
  };

  const handleRemovePaymentMethod = async (paymentMethodId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
    } catch (error) {
      throw new Error('Error al eliminar método de pago');
    }
  };

  const handleAddCard = async (paymentMethod, setAsDefault) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newPaymentMethod = {
        id: `pm_${Date.now()}`,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        holderName: paymentMethod.billing_details.name,
        isExpiringSoon: false
      };
      
      setPaymentMethods(prev => [...prev, newPaymentMethod]);
      
      if (setAsDefault) {
        setDefaultPaymentMethod(newPaymentMethod.id);
      }
    } catch (error) {
      throw new Error('Error al añadir la tarjeta');
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate PDF download
      console.log('Downloading invoice:', invoiceId);
    } catch (error) {
      throw new Error('Error al descargar la factura');
    }
  };

  const handleDownloadAllInvoices = async (invoices) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Downloading all invoices:', invoices.map(inv => inv.id));
    } catch (error) {
      throw new Error('Error al descargar las facturas');
    }
  };

  const handlePausePlan = async (planId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPlan(prev => ({ ...prev, status: 'paused' }));
    } catch (error) {
      throw new Error('Error al pausar la suscripción');
    }
  };

  const handleResumePlan = async (planId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPlan(prev => ({ ...prev, status: 'active' }));
    } catch (error) {
      throw new Error('Error al reactivar la suscripción');
    }
  };

  const handleCancelPlan = async (planId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPlan(prev => ({ ...prev, cancelAtPeriodEnd: true }));
    } catch (error) {
      throw new Error('Error al cancelar la suscripción');
    }
  };

  const handleReactivatePlan = async (planId) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPlan(prev => ({ ...prev, cancelAtPeriodEnd: false }));
    } catch (error) {
      throw new Error('Error al reactivar la suscripción');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Planes y Suscripción</h1>
        <p className="mt-2 text-gray-600">Gestiona tu plan y suscripción</p>
      </div>

      <div className="space-y-8">
        {/* Current Plan Banner */}
        <CurrentPlanBanner 
          currentPlan={currentPlan}
          loading={loading}
        />

        {/* Available Plans */}
        <Card className="p-6">
          <PlanGrid 
            plans={availablePlans}
            currentPlanId={currentPlan?.id}
            onSelectPlan={handleSelectPlan}
            loading={loading}
          />
        </Card>

        {/* Payment Methods and Plan Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <PaymentMethods 
              paymentMethods={paymentMethods}
              defaultPaymentMethod={defaultPaymentMethod}
              onSetDefault={handleSetDefaultPaymentMethod}
              onRemove={handleRemovePaymentMethod}
              onAddCard={() => setShowAddCardModal(true)}
              loading={loading}
            />
          </Card>

          <Card className="p-6">
            <PlanActions 
              currentPlan={currentPlan}
              onPause={handlePausePlan}
              onResume={handleResumePlan}
              onCancel={handleCancelPlan}
              onReactivate={handleReactivatePlan}
              loading={loading}
            />
          </Card>
        </div>

        {/* Invoices */}
        <Card className="p-6">
          <InvoicesTable 
            invoices={invoices}
            onDownload={handleDownloadInvoice}
            onDownloadAll={handleDownloadAllInvoices}
            loading={loading}
          />
        </Card>
      </div>

      {/* Modals */}
      <ChangePlanModal 
        isOpen={showChangePlanModal}
        onClose={() => {
          setShowChangePlanModal(false);
          setSelectedPlan(null);
        }}
        currentPlan={currentPlan}
        newPlan={selectedPlan}
        onConfirm={handleConfirmPlanChange}
        loading={loading}
      />

      <AddCardModal 
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onSave={handleAddCard}
        loading={loading}
      />
    </div>
  );
};