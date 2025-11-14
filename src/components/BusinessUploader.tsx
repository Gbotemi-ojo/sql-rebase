import { useState } from 'react';
import type { Business, Category, ApiResponse } from '../services/api';
import { postBusinesses } from '../services/api';

interface BusinessUploaderProps {
  categories: Category[];
}

export function BusinessUploader({ categories }: BusinessUploaderProps) {
  const [jsonInput, setJsonInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedCategory) {
      setError('Please select a category first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    let businesses: Business[];
    try {
      businesses = JSON.parse(jsonInput);
      if (!Array.isArray(businesses)) {
        throw new Error('Input is not a valid JSON array.');
      }
    } catch (err) {
      setError('Invalid JSON format. Please paste a valid JSON array.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await postBusinesses(businesses, parseInt(selectedCategory, 10));
      setApiResponse(response);
    } catch (err) {
      setError('Failed to connect to the API. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Upload Businesses</h2>
      <p>Select a category, then paste the JSON from your scraper.</p>
      <form onSubmit={handleSubmit}>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
          <option value="" disabled>
            -- Select a Category --
          </option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='[{"name": "Business 1", "phone": "123-456", ...}]'
          rows={10}
        />
        <button type="submit" disabled={isLoading || !selectedCategory}>
          {isLoading ? <span className="spinner"></span> : 'Submit to API'}
        </button>
      </form>

      {error && <div className="card error">{error}</div>}
      
      {apiResponse && (
        <div className="card results">
          <h3>Processing Complete</h3>
          <ul>
            <li><strong>Added:</strong> {apiResponse.added}</li>
            <li><strong>Skipped (Duplicates):</strong> {apiResponse.skipped}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
