import React, { useState } from 'react';
import { RefreshIcon, TrashIcon } from '../DataDisplay/Icons';

const SavedDocsDropdown = ({ savedDocs, onSelect, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <span>Saved Documents</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {savedDocs.length > 0 ? (
            savedDocs.map((doc) => (
              <div
                key={doc.docId}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              >
                <button
                  onClick={() => {
                    onSelect(doc);
                    setIsOpen(false);
                  }}
                  className="text-left w-full"
                >
                  <div className="font-medium">{doc.docName}</div>
                  <div className="text-xs text-gray-500">ID: {doc.docId}</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(doc.docId);
                  }}
                  className="text-gray-400 hover:text-red-500"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm">No saved documents</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedDocsDropdown;