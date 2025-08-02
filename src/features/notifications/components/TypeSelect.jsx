import React, { useState } from 'react';

const notificationTypes = [
  { value: 'all', label: 'Todo', icon: '📋' },
  { value: 'unread', label: 'No leídas', icon: '🔴' },
  { value: 'important', label: 'Importante', icon: '⭐' },
  { value: 'system', label: 'Sistema', icon: '⚙️' },
  { value: 'appointment', label: 'Citas', icon: '📆' },
  { value: 'message', label: 'Mensajes', icon: '💬' },
  { value: 'document', label: 'Documentos', icon: '📄' },
  { value: 'payment', label: 'Pagos', icon: '💳' }
];

export const TypeSelect = ({ value, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedType = notificationTypes.find(type => type.value === value) || notificationTypes[0];

  const handleSelect = (typeValue) => {
    onChange(typeValue);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span>{selectedType.icon}</span>
          <span className="text-gray-900">{selectedType.label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            <ul role="listbox" className="py-1">
              {notificationTypes.map((type) => (
                <li key={type.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(type.value)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 ${
                      value === type.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                    role="option"
                    aria-selected={value === type.value}
                  >
                    <span>{type.icon}</span>
                    <span>{type.label}</span>
                    {value === type.value && (
                      <svg className="w-4 h-4 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};