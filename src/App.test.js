test('renders Coda Doc Scraper title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Coda Doc Scraper/i);
  expect(titleElement).toBeInTheDocument();
});