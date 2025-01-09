import React from 'react';
import InputField from './InputField';

const InputForm = ({ apiToken, setApiToken, docId, setDocId }) => {
  return (
    <div className="space-y-4">
      <InputField
        label="API Token"
        value={apiToken}
        onChange={(e) => setApiToken(e.target.value)}
        placeholder="Enter your Coda API token"
        helpText="Find this in your Coda account settings under 'API Tokens.'"
      />
      <InputField
        label="Document ID"
        value={docId}
        onChange={(e) => setDocId(e.target.value)}
        placeholder="Enter your Coda Document ID"
        helpText="Found in the URL of your Coda doc (e.g., yVH9XLegj_)."
      />
    </div>
  );
};

export default InputForm;