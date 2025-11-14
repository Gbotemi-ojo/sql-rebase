import { useState, useEffect } from 'react';
import type { Category } from './services/api';
import { getCategories } from './services/api';
import { CategoryManager } from './components/CategoryManager';
import { BusinessUploader } from './components/BusinessUploader';
import { BusinessTable } from './components/BusinessTable';
import './App.css';

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCtaCopied, setIsCtaCopied] = useState(false); // State for CTA button

  const fetchCategories = () => {
    getCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to fetch categories:', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handler for the new general CTA button
  const handleGeneralCTAClick = () => {
    const message = "Would you be open to a quick chat so I can share the screenshots and link of what i have been building for you?";
    navigator.clipboard.writeText(message);
    setIsCtaCopied(true);
    setTimeout(() => {
      setIsCtaCopied(false);
    }, 2000); // Reset after 2 seconds
  };

  return (
    <div className="container">
      <h1>Business Data Dashboard</h1>
      <div className="layout">
        <div className="column">
          {/* --- NEW CARD FOR THE BUTTON --- */}
          <div className="card">
            <h2>Quick Tools</h2>
            <button
              onClick={handleGeneralCTAClick}
              className="copy-btn-cta"
            >
              {isCtaCopied ? 'Copied!' : 'Copy General CTA'}
            </button>
          </div>
          {/* --- END NEW CARD --- */}

          <CategoryManager categories={categories} onDataChange={fetchCategories} />
        </div>
        <div className="column">
          <BusinessUploader categories={categories} />
        </div>
      </div>
      
      <div className="table-section">
        <BusinessTable categories={categories} />
      </div>
    </div>
  );
}

export default App;
