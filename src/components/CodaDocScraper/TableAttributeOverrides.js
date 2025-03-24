import React, { useState } from 'react';

const TableAttributeOverrides = ({ 
  tables,
  globalColumnAttributes,
  globalRowAttributes,
  tableColumnOverrides,
  tableRowOverrides,
  onUpdateColumnOverride,
  onUpdateRowOverride,
  onResetOverride
}) => {
  const [expandedTable, setExpandedTable] = useState(null);
  
  return (
    <div className="bg-white p-4 border rounded-lg shadow-md">
      <h3 className="font-medium text-gray-800 mb-3">Table-Specific Attribute Overrides</h3>
      <p className="text-xs text-gray-500 mb-4">
        Override which attributes to include for specific tables. If no override is set, the global attributes will be used.
      </p>
      
      {tables.length === 0 ? (
        <div className="text-sm text-gray-500 italic">No tables loaded yet</div>
      ) : (
        <div className="space-y-2">
          {tables.map(table => (
            <div key={table.id} className="border rounded-md overflow-hidden">
              <div 
                className="flex justify-between items-center p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => setExpandedTable(expandedTable === table.id ? null : table.id)}
              >
                <div className="font-medium">{table.name}</div>
                <div className="flex items-center">
                  {(tableColumnOverrides[table.id] || tableRowOverrides[table.id]) && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                      Overridden
                    </span>
                  )}
                  <svg 
                    className={`h-5 w-5 transition-transform ${expandedTable === table.id ? 'transform rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              {expandedTable === table.id && (
                <div className="p-3 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Column Attributes */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Column Attributes</h4>
                        <button
                          onClick={() => onResetOverride(table.id, 'columns')}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Reset to Global
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {globalColumnAttributes.map(attr => (
                          <button
                            key={attr}
                            onClick={() => {
                              const current = tableColumnOverrides[table.id] || [...globalColumnAttributes];
                              if (current.includes(attr)) {
                                onUpdateColumnOverride(table.id, current.filter(a => a !== attr));
                              } else {
                                onUpdateColumnOverride(table.id, [...current, attr]);
                              }
                            }}
                            className={`px-2 py-0.5 text-xs rounded ${
                              (tableColumnOverrides[table.id] || globalColumnAttributes).includes(attr)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {attr}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Row Attributes */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">Row Attributes</h4>
                        <button
                          onClick={() => onResetOverride(table.id, 'rows')}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Reset to Global
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {globalRowAttributes.map(attr => (
                          <button
                            key={attr}
                            onClick={() => {
                              const current = tableRowOverrides[table.id] || [...globalRowAttributes];
                              if (current.includes(attr)) {
                                onUpdateRowOverride(table.id, current.filter(a => a !== attr));
                              } else {
                                onUpdateRowOverride(table.id, [...current, attr]);
                              }
                            }}
                            className={`px-2 py-0.5 text-xs rounded ${
                              (tableRowOverrides[table.id] || globalRowAttributes).includes(attr)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {attr}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableAttributeOverrides;