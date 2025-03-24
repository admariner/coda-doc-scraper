import React from "react";

const Header = ({ docName }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg w-full">
      <div className="w-full px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white text-2xl font-bold">Coda Doc Scraper</h1>
          {docName && (
            <div className="ml-4 flex items-center">
              <span className="text-white opacity-60 text-lg">|</span>
              <h2 className="text-white ml-4 text-xl">{docName}</h2>
            </div>
          )}
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a
                href="https://github.com/jondallasjr/coda-doc-scraper"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://coda.io/developers/apis/v1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-blue-200 transition-colors"
              >
                Coda API Docs
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;