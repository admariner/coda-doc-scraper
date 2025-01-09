import React, { useState } from 'react';

const JsonViewer = ({ data }) => {
  if (!data) {
    return <div>No data available.</div>;
  }

  return (
    <div className="text-left font-mono text-sm">
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <span className="text-purple-600">{key}:</span> {JSON.stringify(value, null, 2)}
        </div>
      ))}
    </div>
  );
};

export default JsonViewer;