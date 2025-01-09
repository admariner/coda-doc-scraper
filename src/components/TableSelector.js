import React, { useState, useEffect, useRef } from 'react';

const TableSelector = ({ tables, selectedTables, setSelectedTables }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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

  // Filter tables based on search query
  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle checkbox change
  const handleCheckboxChange = (tableId) => {
    if (selectedTables.includes(tableId)) {
      setSelectedTables(selectedTables.filter((id) => id !== tableId));
    } else {
      setSelectedTables([...selectedTables, tableId]);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    setSelectedTables(tables.map((table) => table.id));
  };

  // Handle select none
  const handleSelectNone = () => {
    setSelectedTables([]);
  };

  return (
    <div className="relative mt-4" ref={dropdownRef}>
      {/* Dropdown trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 bg-white border rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between"
      >
        <span>
          {selectedTables.length > 0
            ? tables
                .filter((table) => selectedTables.includes(table.id))
                .map((table) => table.name)
                .join(', ')
            : 'Select tables...'}
        </span>
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

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 mb-2 border rounded-md shadow-sm text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Select All
            </button>
            <button
              onClick={handleSelectNone}
              className="text-sm text-blue-500 hover:text-blue-600 ml-4"
            >
              Select None
            </button>
          </div>
          {filteredTables.map((table) => (
            <label
              key={table.id}
              className="flex items-center p-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedTables.includes(table.id)}
                onChange={() => handleCheckboxChange(table.id)}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">{table.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TableSelector;