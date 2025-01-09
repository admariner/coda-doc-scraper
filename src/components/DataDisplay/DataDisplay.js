import React from 'react';
import ReactJson from 'react-json-view';
import ActionButtons from './ActionButtons';

const DataDisplay = ({ tableData, selectedTables, tables }) => {
  if (!tableData || Object.keys(tableData).length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      {/* Action buttons (Copy, Export JSON) */}
      <ActionButtons tableData={tableData} selectedTables={selectedTables} />

      {/* Display data for each selected table */}
      {selectedTables.map((tableId) => {
        const data = tableData[tableId];
        const tableName = tables.find((table) => table.id === tableId)?.name || tableId;

        if (!data || !data.rows || !data.columns) return null;

        return (
          <div key={tableId} className="mb-6">
            <h3 className="text-md font-semibold mb-2">{tableName}</h3>
            <div className="border rounded-lg p-4 bg-gray-50 text-left">
              <ReactJson
                src={data}
                name={null}
                collapsed={true}
                displayDataTypes={false}
                enableClipboard={false}
                displayObjectSize={false}
                iconStyle="triangle"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DataDisplay;