import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
      Error: {error}
    </div>
  );
};

export const Toast = ({ message, type = 'success', onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  
  return (
    <div className={`fixed bottom-4 left-4 ${bgColor} text-white px-4 py-2 rounded-md shadow-md flex items-center z-50`}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-2 text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default ErrorDisplay;