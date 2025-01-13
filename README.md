# Coda Doc Scraper

A React-based application for fetching and displaying data from Coda documents using the Coda API. This tool allows you to input your Coda API token and document ID, fetch tables, and retrieve data from selected tables. The fetched data can be viewed in a JSON format and exported as JSON.

## Features

- **Fetch Tables**: Retrieve a list of tables from a Coda document.
- **Select Tables**: Choose specific tables to fetch data from.
- **Fetch Data**: Fetch rows and columns from selected tables based on the selected row count (Columns Only, 1 Row, or All Rows).
- **Data Display**: View fetched data in a collapsible, scrollable JSON viewer.
- **Export Data**: Export fetched data as JSON.
- **Copy Data**: Copy individual table data or concatenated data from all selected tables to the clipboard.
- **Error Handling**: Display error messages for invalid inputs or API errors.
- **Persistent Configuration**: Save API token and document ID in localStorage for convenience.

## Installation

1. Clone the repository:
   git clone https://github.com/your-username/coda-doc-scraper.git
   cd coda-doc-scraper

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Enter API Token and Document ID**:
   - Provide your Coda API token and the document ID from which you want to fetch data.
   - The API token can be found in your Coda account settings under "API Tokens."
   - The document ID is part of the URL of your Coda document.

2. **Fetch Tables**:
   - Click the "Get Tables" button to retrieve a list of tables from the specified document.

3. **Select Tables**:
   - Use the dropdown to select one or more tables from which to fetch data.
   - You can select all tables or clear the selection using the "Select All" and "Select None" buttons.

4. **Fetch Data**:
   - Choose the number of rows to fetch (options include Columns Only, 1 Row, or All Rows).
   - The data will be fetched automatically when a row count option is selected.

5. **View and Export Data**:
   - The fetched data will be displayed in a collapsible, scrollable JSON viewer.
   - Use the copy icon to copy individual table data.
   - Use the "Copy All Tables" button to copy concatenated data from all selected tables.

## Project Structure

- **src/components**: Contains reusable React components such as `TableCard`, `TableDropdown`, `Header`, `WelcomeCard`, etc.
- **src/hooks**: Contains custom hooks like `useCodaApi` for interacting with the Coda API.
- **src/App.js**: The main application component.
- **src/index.js**: The entry point of the application.
- **src/index.css**: Global styles and Tailwind CSS configuration.
- **src/App.css**: Additional styles for the application.
- **src/reportWebVitals.js**: Utility for measuring performance metrics.

## Dependencies

- **React**: A JavaScript library for building user interfaces.
- **Axios**: A promise-based HTTP client for making API requests.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **Heroicons**: A set of free MIT-licensed high-quality SVG icons.
- **React-json-pretty**: A React component for pretty-printing JSON data.
- **Lucide React**: A set of customizable icons for React applications.

## Testing

To run the tests, use the following command:
npm test

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Coda API](https://coda.io/developers/apis/v1) for providing the API to interact with Coda documents.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Heroicons](https://heroicons.com/) for the beautiful icons.
- [Lucide React](https://lucide.dev/) for the customizable icons.

---

Happy scraping! 🚀