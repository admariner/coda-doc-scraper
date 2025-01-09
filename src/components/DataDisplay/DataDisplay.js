import React from 'react';
import JsonViewer from './JsonViewer';
import ActionButtons from './ActionButtons';

const DataDisplay = ({ rows, columns }) => {
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Fetched Data</h2>

      {/* Action buttons (Copy, Export JSON, Export CSV) */}
      <ActionButtons rows={rows} columns={columns} />

      {/* JSON viewer */}
      <div className="border rounded-lg p-4 bg-gray-50 text-left">
        <JsonViewer data={{ columns, rows }} />
      </div>
    </div>
  );
};

export default DataDisplay;