import React, { useState } from "react";
import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

const WelcomeCard = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all"
          title="Show Welcome Card"
        >
          <InformationCircleIcon className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-bold flex items-center">
          <span role="img" aria-label="wave" className="mr-2">👋</span>
          Welcome to Coda Doc Scraper!
        </h2>
        <button
          onClick={() => setIsMinimized(true)}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Minimize"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <h3 className="text-md font-semibold mb-2 flex items-center">
        <span role="img" aria-label="clipboard" className="mr-2">📋</span>
        Instructions
      </h3>
      <ol className="text-sm text-gray-700 list-decimal list-inside mb-4 pl-4 text-left">
        <li>Enter your <strong>Coda API Token</strong> and <strong>Document ID</strong>.</li>
        <li>Click <strong>Get Tables</strong> to fetch a list of tables from your Coda document.</li>
        <li>Select the tables you want to fetch data from.</li>
        <li>Choose the number of rows to fetch: <strong>Columns Only</strong>, <strong>1 Row</strong>, or <strong>All Rows</strong>.</li>
        <li>View the fetched data in a collapsible JSON preview.</li>
        <li>Copy the data for a single table or concatenate all selected tables into one JSON object.</li>
      </ol>
      <h3 className="text-md font-semibold mb-2 flex items-center">
        <span role="img" aria-label="gear" className="mr-2">⚙️</span>
        How It Works
      </h3>
      <p className="text-sm text-gray-700 mb-4 text-left">
        This tool uses the <strong>Coda API</strong> to fetch data from your Coda document. It retrieves tables, rows, and columns based on your selections and displays them in an easy-to-read JSON format. You can copy the data for further analysis or integration with other tools.
      </p>
      <h3 className="text-md font-semibold mb-2 flex items-center">
        <span role="img" aria-label="lock" className="mr-2">🔒</span>
        Privacy &amp; Security
      </h3>
      <p className="text-sm text-gray-700 mb-4 text-left">
        Your Coda API Token is stored only in your browser's <code>localStorage</code> and is never sent to any external server. This ensures that your API key remains secure and private.
      </p>
      <h3 className="text-md font-semibold mb-2 flex items-center">
        <span role="img" aria-label="link" className="mr-2">🔗</span>
        Learn More
      </h3>
      <p className="text-sm text-gray-700 mb-4 text-left">
        For more details, visit the <a href="https://github.com/jondallasjr/coda-doc-scraper" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GitHub repository</a>.
      </p>
    </div>
  );
};

export default WelcomeCard;