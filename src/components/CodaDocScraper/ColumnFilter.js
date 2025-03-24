import React, { useState } from 'react';

const ColumnFilter = ({ 
  tableId, 
  tableName, 
  columns = [], 
  selectedColumns, 
  onColumnToggle,
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearch) {
      onSearch(term);
    }
  };
  
  const handleSelectAll = () => {
    // Check if all visible columns are selected
    const filteredColumns = columns.filter(column => 
      column.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const allSelected = filteredColumns.every(column => 
      selectedColumns.includes(column.id)
    );
    
    if (allSelected) {
      // Deselect all filtered columns
      const newSelected = selectedColumns.filter(id => 
        !filteredColumns.some(col => col.id === id)
      );
      onColumnToggle(tableId, newSelected);
    } else {
      // Select all filtered columns
      const newSelected = [
        ...selectedColumns,
        ...filteredColumns.map(col => col.id).filter(id => !selectedColumns.includes(id))
      ];
      onColumnToggle(tableId, newSelected);
    }
  };

  const filteredColumns = columns.filter(column => 
    column.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded-lg shadow-sm p-4 mt-4">
      <h3 className="font-medium mb-3">Filter Columns for {tableName}</h3>
      
      <div className="flex mb-3">
        <input
          type="text"
          placeholder="Search columns..."
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded-md px-3 py-1.5 flex-grow text-sm"
        />
        <button 
          className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm"
          onClick={handleSelectAll}
        >
          {filteredColumns.every(column => selectedColumns.includes(column.id)) 
            ? 'Deselect All' 
            : 'Select All'}
        </button>
      </div>
      
      <div className="max-h-60 overflow-y-auto border rounded-md">
        {filteredColumns.length > 0 ? (
          <ul className="divide-y">
            {filteredColumns.map((column) => (
              <li key={column.id} className="p-2 hover:bg-gray-50">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column.id)}
                    onChange={() => {
                      const newSelected = selectedColumns.includes(column.id)
                        ? selectedColumns.filter(id => id !== column.id)
                        : [...selectedColumns, column.id];
                      
                      onColumnToggle(tableId, newSelected);
                    }}
                    className="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm">{column.name}</span>
                  {column.description && (
                    <span className="ml-2 text-xs text-gray-500 italic">{column.description}</span>
                  )}
                </label>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No columns match your search.
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 mt-2">
        {selectedColumns.length} of {columns.length} columns selected
      </div>
    </div>
  );
};

export default ColumnFilter;