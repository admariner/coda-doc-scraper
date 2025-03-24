import React from 'react';

const FormatToggle = ({ formatMode, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700">Format:</span>
      <div className="relative inline-flex">
        <button
          onClick={() => onToggle('column-centric')}
          className={`px-3 py-1 text-sm font-medium rounded-l-md ${
            formatMode === 'column-centric'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Column-Centric
        </button>
        <button
          onClick={() => onToggle('row-centric')}
          className={`px-3 py-1 text-sm font-medium rounded-r-md ${
            formatMode === 'row-centric'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Row-Centric
        </button>
      </div>
    </div>
  );
};

export default FormatToggle;