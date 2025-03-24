import React from 'react';
import { CopyIcon, LoadingSpinner } from '../DataDisplay/Icons';

const TableSelector = ({
  tables,
  selectedTables,
  setSelectedTables,
  onCopyTable,
  onSelectRowsOption,
  rowOptions,
  selectedRowCounts,
  isCopying
}) => {
  const handleSelectTable = (tableId) => {
    const newSelectedTables = new Set(selectedTables);
    
    if (newSelectedTables.has(tableId)) {
      newSelectedTables.delete(tableId);
    } else {
      newSelectedTables.add(tableId);
    }
    
    setSelectedTables(newSelectedTables);
  };

  const handleSelectAll = () => {
    if (selectedTables.size === tables.length) {
      // Deselect all if all are already selected
      setSelectedTables(new Set());
    } else {
      // Select all tables
      setSelectedTables(new Set(tables.map(table => table.id)));
    }
  };

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Available Tables</h2>
        <button
          onClick={handleSelectAll}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          {selectedTables.size === tables.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <div 
            key={table.id} 
            className={`border rounded-md p-3 ${
              selectedTables.has(table.id) ? 'border-blue-400 bg-blue-50' : 'border-gray-200'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`table-${table.id}`}
                  checked={selectedTables.has(table.id)}
                  onChange={() => handleSelectTable(table.id)}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                <label htmlFor={`table-${table.id}`} className="font-medium">
                  {table.name}
                </label>
              </div>
              
              <button
                onClick={() => onCopyTable(table.id)}
                disabled={!selectedTables.has(table.id) || isCopying[table.id]}
                className={`p-1 rounded-md ${!selectedTables.has(table.id) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                title="Copy Table JSON"
              >
                {isCopying[table.id] ? (
                  <LoadingSpinner className="h-4 w-4 text-blue-500" />
                ) : (
                  <CopyIcon className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="text-sm text-gray-500 mb-2">
              {table.rowCount} rows • Last modified: <span>{new Date(table.updatedAt || Date.now()).toLocaleDateString()}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {rowOptions.map((option) => (
                <button
                  key={`${table.id}-${option.value}`}
                  onClick={() => onSelectRowsOption(table.id, option.value)}
                  disabled={!selectedTables.has(table.id)}
                  className={`px-2 py-1 rounded-md text-xs font-medium ${
                    selectedTables.has(table.id) && selectedRowCounts[table.id] === option.value
                      ? 'bg-gray-700 text-white'
                      : !selectedTables.has(table.id)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {tables.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No tables found. Enter your API Token and Document ID to load tables.
        </div>
      )}
    </div>
  );
};

export default TableSelector;