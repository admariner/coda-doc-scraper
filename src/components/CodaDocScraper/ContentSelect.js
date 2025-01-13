import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ContentSelect = ({ tables = [], selectedTables, rowSettings, onSelectTable, onRowSettingsChange }) => {
  const [expandedTables, setExpandedTables] = useState(new Set());

  const toggleTable = (tableId) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {tables.map((table) => (
        <div key={table.id} className="bg-white p-4 border rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selectedTables.has(table.id)}
                onChange={() => onSelectTable(table.id)}
              />
              <span className="ml-2 font-semibold">{table.name}</span>
            </div>
            <button onClick={() => toggleTable(table.id)}>
              {expandedTables.has(table.id) ? <ChevronDown /> : <ChevronRight />}
            </button>
          </div>
          {expandedTables.has(table.id) && (
            <div className="mt-4 ml-4">
              <h4>Settings</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`rows-${table.id}`}
                    value="0"
                    checked={rowSettings[table.id]?.rowsToFetch === '0'}
                    onChange={() => onRowSettingsChange(table.id, '0')}
                  />
                  <span className="ml-2">0 rows (Columns only)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`rows-${table.id}`}
                    value="1"
                    checked={rowSettings[table.id]?.rowsToFetch === '1'}
                    onChange={() => onRowSettingsChange(table.id, '1')}
                  />
                  <span className="ml-2">1 row</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`rows-${table.id}`}
                    value="10"
                    checked={rowSettings[table.id]?.rowsToFetch === '10'}
                    onChange={() => onRowSettingsChange(table.id, '10')}
                  />
                  <span className="ml-2">10 rows</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={`rows-${table.id}`}
                    value="All"
                    checked={rowSettings[table.id]?.rowsToFetch === 'All'}
                    onChange={() => onRowSettingsChange(table.id, 'All')}
                  />
                  <span className="ml-2">All rows</span>
                </label>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ContentSelect;