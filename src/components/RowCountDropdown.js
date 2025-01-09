import React from 'react';

const RowCountDropdown = ({ rowCount, handleRowCountChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Number of Rows
        <select
          value={rowCount}
          onChange={handleRowCountChange}
          className="w-full p-2 border rounded-md mt-1"
        >
          <option value="0">0 (Just metadata)</option>
          <option value="1">1</option>
          <option value="10">10</option>
          <option value="All">All</option>
        </select>
      </label>
    </div>
  );
};

export default RowCountDropdown;