import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};