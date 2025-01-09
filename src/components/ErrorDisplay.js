import React from 'react';

const ErrorDisplay = ({ error }) => {
  return (
    <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
      Error: {error}
    </div>
  );
};

export default ErrorDisplay;