import React, { useState, useRef, useEffect } from 'react';

const TableDropdown = ({ tables, selectedTables, setSelectedTables }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  // Generate a string of selected table names
  const selectedTableNames = Array.from(selectedTables)
    .map((tableId) => tables.find((table) => table.id === tableId)?.name)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md" ref={dropdownRef}>
      <h2 className="text-lg font-bold mb-4">Select Tables</h2>
      <div className="relative mt-4">
        {/* Dropdown Trigger */}
        <div
          className="w-full px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedTableNames || 'Select tables...'}</span>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Search Bar */}
            <div className="p-2 border-b">
              <input
                placeholder="Search tables..."
                className="w-full px-4 py-2 mb-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Select All / Select None Buttons */}
              <div className="flex justify-between">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Select All
                </button>
                <button
                  onClick={handleSelectNone}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Select None
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
    </div>
  );
};

export default TableDropdown;