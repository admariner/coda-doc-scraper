import React from 'react';

const GlobalAttributeSelector = ({ 
  title,
  attributes, 
  selectedAttributes, 
  onChange,
  description
}) => {
  const handleToggleAttribute = (attribute) => {
    if (selectedAttributes.includes(attribute)) {
      onChange(selectedAttributes.filter(attr => attr !== attribute));
    } else {
      onChange([...selectedAttributes, attribute]);
    }
  };

  const handleSelectAll = () => {
    if (selectedAttributes.length === attributes.length) {
      onChange([]);
    } else {
      onChange([...attributes]);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-medium text-gray-800">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <button
          onClick={handleSelectAll}
          className="text-sm px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          {selectedAttributes.length === attributes.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {attributes.map(attribute => (
          <button
            key={attribute}
            onClick={() => handleToggleAttribute(attribute)}
            className={`px-2 py-1 text-xs rounded-md ${
              selectedAttributes.includes(attribute)
                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
            }`}
            title={selectedAttributes.includes(attribute) ? "Click to remove" : "Click to add"}
          >
            {attribute}
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500">
        {selectedAttributes.length} of {attributes.length} selected
      </div>
    </div>
  );
};

export default GlobalAttributeSelector;