import React, { useState } from 'react';
import { FileText, Download, Filter, Search, ChevronDown } from 'lucide-react';
import { InvoiceRow } from './InvoiceRow';

const formatPrice = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const InvoicesTable = ({ 
  invoices = [],
  onDownload,
  onDownloadAll,
  loading = false,
  className = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  // Filter and sort invoices
  const filteredInvoices = invoices
    .filter(invoice => {
      const matchesSearch = searchTerm === '' || 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (invoice.planName && invoice.planName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'number':
          aValue = a.number;
          bValue = b.number;
          break;
        default:
          aValue = a.date;
          bValue = b.date;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDownloadAll = async () => {
    if (isDownloadingAll || !onDownloadAll) return;
    
    setIsDownloadingAll(true);
    try {
      await onDownloadAll(filteredInvoices.filter(inv => inv.status === 'paid' || inv.status === 'refunded'));
    } catch (error) {
      console.error('Error downloading all invoices:', error);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  // Calculate summary stats
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    refunded: invoices.filter(inv => inv.status === 'refunded').length,
    pending: invoices.filter(inv => inv.status === 'pending').length,
    totalAmount: invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0)
  };

  const downloadableInvoices = filteredInvoices.filter(inv => inv.status === 'paid' || inv.status === 'refunded');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Historial de facturas
          </h3>
          <p className="text-sm text-gray-600">
            {stats.total} facturas • Total pagado: {formatPrice(stats.totalAmount)}
          </p>
        </div>
        
        {downloadableInvoices.length > 0 && (
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingAll || loading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDownloadingAll ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                Descargando...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Descargar todas
              </>
            )}
          </button>
        )}
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por número, concepto o plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="paid">Pagadas ({stats.paid})</option>
            <option value="refunded">Reembolsadas ({stats.refunded})</option>
            <option value="pending">Pendientes ({stats.pending})</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      {filteredInvoices.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No se encontraron facturas' : 'No hay facturas'}
          </h4>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Las facturas aparecerán aquí cuando tengas suscripciones activas'
            }
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Desktop header */}
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Fecha</span>
                    {sortBy === 'date' && (
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${
                        sortOrder === 'asc' ? 'rotate-180' : ''
                      }`} />
                    )}
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('number')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nº Factura</span>
                    {sortBy === 'number' && (
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${
                        sortOrder === 'asc' ? 'rotate-180' : ''
                      }`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concepto
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Importe</span>
                    {sortBy === 'amount' && (
                      <ChevronDown className={`h-4 w-4 transform transition-transform ${
                        sortOrder === 'asc' ? 'rotate-180' : ''
                      }`} />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            
            {/* Table body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <InvoiceRow
                  key={invoice.id}
                  invoice={invoice}
                  onDownload={onDownload}
                  loading={loading}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {filteredInvoices.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-gray-900">{filteredInvoices.length}</p>
              <p className="text-xs text-gray-600">Facturas mostradas</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-green-600">
                {filteredInvoices.filter(inv => inv.status === 'paid').length}
              </p>
              <p className="text-xs text-gray-600">Pagadas</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-blue-600">
                {filteredInvoices.filter(inv => inv.status === 'refunded').length}
              </p>
              <p className="text-xs text-gray-600">Reembolsadas</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(
                  filteredInvoices
                    .filter(inv => inv.status === 'paid')
                    .reduce((sum, inv) => sum + inv.amount, 0)
                )}
              </p>
              <p className="text-xs text-gray-600">Total pagado</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};