import React, { useState } from 'react';
import { TrashIcon } from '../DataDisplay/Icons';

const SavedDocsDropdown = ({ savedDocs, onSelect, onRemove, onAddNew }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (doc) => {
    onSelect(doc);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
      >
        <span>{savedDocs.length > 0 ? 'Select a Document' : 'No Saved Documents'}</span>
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {/* Add New Button */}
          <button
            onClick={() => {
              onAddNew();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-left flex items-center text-blue-600 hover:bg-blue-50 font-medium"
          >
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Document
          </button>
          
          {/* Divider */}
          {savedDocs.length > 0 && (
            <div className="border-t border-gray-200 my-1"></div>
          )}
          
          {/* Saved Documents List */}
          {savedDocs.length > 0 ? (
            savedDocs.map((doc) => (
              <div
                key={doc.docId}
                className="flex justify-between items-center px-4 py-2 hover:bg-gray-100"
              >
                <button
                  onClick={() => handleSelect(doc)}
                  className="text-left w-full"
                >
                  <div className="font-medium">{doc.docName}</div>
                  <div className="text-xs text-gray-500">Last used: {new Date(doc.savedAt).toLocaleDateString()}</div>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(doc.docId);
                  }}
                  className="text-gray-400 hover:text-red-500"
                  title="Remove Document"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 text-sm italic">
              No saved documents. Add one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedDocsDropdown;