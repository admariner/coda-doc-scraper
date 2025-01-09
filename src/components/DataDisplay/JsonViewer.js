import React, { useState } from 'react';

const JsonViewer = ({ data, depth = 0 }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set()); // Track expanded keys

  const toggleExpand = (key) => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key); // Collapse
      } else {
        newSet.add(key); // Expand
      }
      return newSet;
    });
  };

  const renderValue = (value, key, path) => {
    const fullPath = path ? `${path}.${key}` : key; // Unique path for each key
    const isExpanded = expandedKeys.has(fullPath);

    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="ml-4">
          <button
            onClick={() => toggleExpand(fullPath)}
            className="text-blue-500 hover:text-blue-600 font-mono"
          >
            {isExpanded ? '▼' : '▶'} <span className="text-purple-600">{key}</span>:
          </button>
          {isExpanded && (
            <div className="ml-4">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="font-mono">
                  <span className="text-blue-600">{k}:</span> {renderValue(v, k, fullPath)}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <span className="text-green-600 font-mono">
        {typeof value === 'string' ? `"${value}"` : JSON.stringify(value)}
      </span>
    );
  };

  return (
    <div className="text-left font-mono text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <span className="text-purple-600">{key}:</span> {renderValue(value, key)}
        </div>
      ))}
    </div>
  );
};

export default JsonViewer;