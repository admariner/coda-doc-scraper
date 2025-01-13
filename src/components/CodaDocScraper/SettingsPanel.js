import React, { useState } from 'react';

const SettingsPanel = ({ onUpdateSettings }) => {
  const [defaultRows, setDefaultRows] = useState(1);

  const handleSave = () => {
    onUpdateSettings({ defaultRows });
  };

  return (
    <div className="bg-white p-4 border rounded-lg shadow-md">
      <h3 className="font-semibold mb-4">Settings</h3>
      <div className="space-y-4">
        <div>
          <label>Default Rows:</label>
          <select
            value={defaultRows}
            onChange={(e) => setDefaultRows(Number(e.target.value))}
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={10}>10</option>
            <option value={-1}>All</option>
          </select>
        </div>
        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsPanel;