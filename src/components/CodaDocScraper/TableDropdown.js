import React, { useState, useRef, useEffect } from 'react';

const TableDropdown = ({ tables, selectedTables, setSelectedTables }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate a CSV of selected table names
  const selectedTableNames = Array.from(selectedTables)
    .map((tableId) => tables.find((table) => table.id === tableId)?.name)
    .filter(Boolean)
    .join(', ');

  // Filter tables based on search term
  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle selecting all tables
  const handleSelectAll = () => {
    setSelectedTables(new Set(tables.map((table) => table.id)));
  };

  // Handle deselecting all tables
  const handleSelectNone = () => {
    setSelectedTables(new Set());
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {selectedTableNames || 'Select tables...'}
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {/* Search Bar */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between">
              <button
                onClick={handleSelectAll}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                All
              </button>
              <button
                onClick={handleSelectNone}
                className="text-sm text-blue-500 hover:text-blue-600"
              >
                None
              </button>
            </div>
          </div>

          {/* Table List */}
          {filteredTables.map((table) => (
            <label
              key={table.id}
              className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTables.has(table.id)}
                onChange={() => {
                  const newSelectedTables = new Set(selectedTables);
                  if (newSelectedTables.has(table.id)) {
                    newSelectedTables.delete(table.id);
                  } else {
                    newSelectedTables.add(table.id);
                  }
                  setSelectedTables(newSelectedTables);
                }}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {table.name} ({table.rowCount} rows)
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableDropdown;