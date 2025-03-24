import React, { useState, useEffect } from 'react';
import { TrashIcon, LoadingSpinner } from '../DataDisplay/Icons';
import axios from 'axios';

const SavedDocManager = ({ 
  savedDocs, 
  onSelect, 
  onSave, 
  onRemove, 
  currentToken, 
  currentDocId 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newApiToken, setNewApiToken] = useState('');
  const [newDocId, setNewDocId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // When editing an existing document, pre-fill the form
  useEffect(() => {
    if (showAddForm && currentToken && currentDocId) {
      setNewApiToken(currentToken);
      setNewDocId(currentDocId);
    }
  }, [showAddForm, currentToken, currentDocId]);

  const handleAddNew = () => {
    setNewApiToken('');
    setNewDocId('');
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
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFetchAndSaveDoc = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Fetch the document details to get the name
      const response = await axios.get(
        `https://coda.io/apis/v1/docs/${newDocId}`,
        { headers: { Authorization: `Bearer ${newApiToken}` } }
      );
      
      // Save the document with the fetched name
      onSave({
        apiToken: newApiToken,
        docId: newDocId,
        docName: response.data.name || `Doc ${newDocId}`,
        savedAt: new Date().toISOString()
      });
      
      setShowAddForm(false);
    } catch (error) {
      console.error('Error fetching document details:', error);
      setFormErrors({
        ...formErrors,
        apiToken: error.response?.status === 401 ? 'Invalid API token' : undefined,
        docId: error.response?.status === 404 ? 'Document not found' : undefined,
        general: 'Failed to fetch document details. Please check your inputs and try again.'
      });
    } finally {
      setIsLoading(false);
    }
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
          
          {formErrors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {formErrors.general}
            </div>
          )}
          
          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleFetchAndSaveDoc}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  Fetching...
                </>
              ) : (
                'Add Document'
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Note: The document name will be automatically fetched from Coda.
          </p>
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
                        <div className="text-xs text-gray-500 mt-1">ID: {doc.docId.substring(0, 12)}{doc.docId.length > 12 ? '...' : ''}</div>
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