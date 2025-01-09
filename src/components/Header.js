import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-white text-2xl font-bold">Coda Doc Scraper</h1>
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