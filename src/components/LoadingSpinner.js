import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center mt-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Fetching data...</span>
    </div>
  );
};

export default LoadingSpinner;