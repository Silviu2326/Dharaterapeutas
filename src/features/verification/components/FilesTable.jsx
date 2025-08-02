import React from 'react';
import { FileRow } from './FileRow';
import { FileText } from 'lucide-react';

export const FilesTable = ({ 
  files = [], 
  onDownload,
  className = '' 
}) => {
  if (files.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay archivos enviados
        </h3>
        <p className="text-gray-600">
          Los archivos que subas aparecerán aquí una vez enviados para verificación.
        </p>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Nombre del archivo
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tipo
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Tamaño
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Fecha de envío
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Estado
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {files.map((file, index) => (
            <FileRow
              key={file.id || index}
              file={file}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
      
      {/* Summary */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Total: {files.length} archivo{files.length !== 1 ? 's' : ''}
          {files.length > 0 && (
            <span className="ml-4">
              Recibidos: {files.filter(f => f.status === 'received').length} • 
              Rechazados: {files.filter(f => f.status === 'rejected').length} • 
              Pendientes: {files.filter(f => f.status === 'pending').length}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};