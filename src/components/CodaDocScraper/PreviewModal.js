import React from 'react';
import ReactJson from 'react-json-view';

const PreviewModal = ({ data, onClose }) => {
  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coda-data.json';
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-3/4 max-h-screen overflow-auto">
        <h3 className="font-semibold mb-4">Preview</h3>
        <ReactJson src={data} collapsed={true} />
        <div className="mt-4 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-blue-500 text-white rounded">
            Close
          </button>
          <button onClick={handleDownload} className="px-4 py-2 bg-green-500 text-white rounded">
            Download JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;