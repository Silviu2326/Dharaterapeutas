import React, { useState } from 'react';
import { Download, FileText, CheckCircle, RotateCcw, AlertCircle, Clock } from 'lucide-react';

const formatPrice = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getStatusConfig = (status) => {
  const configs = {
    paid: {
      label: 'Pagada',
      icon: CheckCircle,
      className: 'text-green-700 bg-green-100',
      iconClassName: 'text-green-600'
    },
    refunded: {
      label: 'Reembolsada',
      icon: RotateCcw,
      className: 'text-blue-700 bg-blue-100',
      iconClassName: 'text-blue-600'
    },
    pending: {
      label: 'Pendiente',
      icon: Clock,
      className: 'text-yellow-700 bg-yellow-100',
      iconClassName: 'text-yellow-600'
    },
    failed: {
      label: 'Fallida',
      icon: AlertCircle,
      className: 'text-red-700 bg-red-100',
      iconClassName: 'text-red-600'
    }
  };
  return configs[status] || configs.pending;
};

export const InvoiceRow = ({ 
  invoice,
  onDownload,
  loading = false,
  className = '' 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const statusConfig = getStatusConfig(invoice.status);
  const StatusIcon = statusConfig.icon;

  const handleDownload = async () => {
    if (isDownloading || !onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload(invoice.id);
    } catch (error) {
      console.error('Error downloading invoice:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const canDownload = invoice.status === 'paid' || invoice.status === 'refunded';

  return (
    <>
      {/* Desktop row */}
      <tr className={`hidden md:table-row hover:bg-gray-50 transition-colors ${className}`}>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                {formatDate(invoice.date)}
              </div>
              <div className="text-xs text-gray-500">
                {invoice.period && `Período: ${invoice.period}`}
              </div>
            </div>
          </div>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900 font-mono">
            {invoice.number}
          </div>
        </td>
        
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900">
            {invoice.description}
          </div>
          {invoice.planName && (
            <div className="text-xs text-gray-500">
              Plan: {invoice.planName}
            </div>
          )}
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {formatPrice(invoice.amount, invoice.currency)}
          </div>
          {invoice.tax && (
            <div className="text-xs text-gray-500">
              IVA: {formatPrice(invoice.tax, invoice.currency)}
            </div>
          )}
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            statusConfig.className
          }`}>
            <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconClassName}`} />
            {statusConfig.label}
          </span>
        </td>
        
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {canDownload ? (
            <button
              onClick={handleDownload}
              disabled={isDownloading || loading}
              className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label={`Descargar factura ${invoice.number}`}
            >
              {isDownloading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Download className="h-4 w-4" />
              )}
            </button>
          ) : (
            <span className="text-gray-400">
              <Download className="h-4 w-4" />
            </span>
          )}
        </td>
      </tr>

      {/* Mobile card */}
      <tr className="md:hidden">
        <td colSpan="6" className="px-4 py-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(invoice.date)}
                </span>
              </div>
              
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                statusConfig.className
              }`}>
                <StatusIcon className={`h-3 w-3 mr-1 ${statusConfig.iconClassName}`} />
                {statusConfig.label}
              </span>
            </div>
            
            {/* Invoice details */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Nº Factura:</span>
                <span className="text-xs font-mono text-gray-900">{invoice.number}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Concepto:</span>
                <span className="text-xs text-gray-900 text-right">{invoice.description}</span>
              </div>
              
              {invoice.planName && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Plan:</span>
                  <span className="text-xs text-gray-900">{invoice.planName}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Importe:</span>
                <span className="text-xs font-medium text-gray-900">
                  {formatPrice(invoice.amount, invoice.currency)}
                </span>
              </div>
              
              {invoice.tax && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">IVA:</span>
                  <span className="text-xs text-gray-900">
                    {formatPrice(invoice.tax, invoice.currency)}
                  </span>
                </div>
              )}
              
              {invoice.period && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Período:</span>
                  <span className="text-xs text-gray-900">{invoice.period}</span>
                </div>
              )}
            </div>
            
            {/* Actions */}
            {canDownload && (
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || loading}
                  className="w-full flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Descargando...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};