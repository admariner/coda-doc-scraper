import React, { useState, useEffect } from 'react';
import { TrashIcon } from '../DataDisplay/Icons';

const SavedDocManager = ({ 
  savedDocs, 
  onSelect, 
  onSave, 
  onRemove, 
  currentToken, 
  currentDocId, 
  currentDocName 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApiToken, setNewApiToken] = useState('');
  const [newDocId, setNewDocId] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // When editing an existing document, pre-fill the form
  useEffect(() => {
    if (showAddForm && currentToken && currentDocId) {
      setNewApiToken(currentToken);
      setNewDocId(currentDocId);
      setNewDocName(currentDocName || '');
    }
  }, [showAddForm, currentToken, currentDocId, currentDocName]);

  const handleAddNew = () => {
    setNewApiToken('');
    setNewDocId('');
    setNewDocName('');
    setFormErrors({});
    setShowAddForm(true);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newApiToken) {
      errors.apiToken = 'API Token is required';
    } else if (newApiToken.length < 20) {
      errors.apiToken = 'API Token appears invalid (too short)';
    }
    
    if (!newDocId) {
      errors.docId = 'Document ID is required';
    } else if (!newDocId.match(/^[a-zA-Z0-9_-]+$/)) {
      errors.docId = 'Document ID contains invalid characters';
    }
    
    if (!newDocName) {
      errors.docName = 'Document name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDoc = () => {
    if (!validateForm()) {
      return;
    }
    
    onSave({
      apiToken: newApiToken,
      docId: newDocId,
      docName: newDocName,
      savedAt: new Date().toISOString()
    });
    
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
  };

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md mb-6">
      <h2 className="text-lg font-bold mb-4">Document Manager</h2>
      
      {showAddForm ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Name
              <input
                type="text"
                value={newDocName}
                onChange={(e) => setNewDocName(e.target.value)}
                className={`w-full p-2 border rounded-md mt-1 ${formErrors.docName ? 'border-red-500' : ''}`}
                placeholder="Enter a name for this document"
              />
            </label>
            {formErrors.docName && (
              <p className="text-red-500 text-xs mt-1">{formErrors.docName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              API Token
              <input
                type="password"
                value={newApiToken}
                onChange={(e) => setNewApiToken(e.target.value)}
                className={`w-full p-2 border rounded-md mt-1 ${formErrors.apiToken ? 'border-red-500' : ''}`}
                placeholder="Enter your Coda API token"
              />
            </label>
            {formErrors.apiToken && (
              <p className="text-red-500 text-xs mt-1">{formErrors.apiToken}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document ID
              <input
                type="text"
                value={newDocId}
                onChange={(e) => setNewDocId(e.target.value)}
                className={`w-full p-2 border rounded-md mt-1 ${formErrors.docId ? 'border-red-500' : ''}`}
                placeholder="Enter your Coda Document ID"
              />
            </label>
            {formErrors.docId && (
              <p className="text-red-500 text-xs mt-1">{formErrors.docId}</p>
            )}
          </div>
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSaveDoc}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Save Document
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {savedDocs.length > 0 ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {savedDocs.map((doc) => (
                  <div
                    key={doc.docId}
                    className="border rounded-md p-3 hover:bg-blue-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start">
                      <button
                        onClick={() => onSelect(doc)}
                        className="text-left flex-grow"
                      >
                        <div className="font-medium text-blue-600">{doc.docName}</div>
                        <div className="text-xs text-gray-500 mt-1">ID: {doc.docId}</div>
                        <div className="text-xs text-gray-500">
                          Last used: {new Date(doc.savedAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        onClick={() => onRemove(doc.docId)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Remove Document"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => onSelect(doc)}
                        className="w-full px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-3 border-t">
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Add New Document
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No saved documents yet. Add your first one!</p>
              <button
                onClick={handleAddNew}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add New Document
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SavedDocManager;