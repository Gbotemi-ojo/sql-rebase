import { useState, useEffect, useMemo } from 'react';
import { getBusinesses, updateBusinessStatus } from '../services/api';
import type { BusinessWithCategory, Category } from '../services/api';
import { getMessageTemplate } from '../message-templates';

interface BusinessTableProps {
  categories: Category[];
}

export function BusinessTable({ categories }: BusinessTableProps) {
  const [businesses, setBusinesses] = useState<BusinessWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = () => {
    setLoading(true);
    getBusinesses()
      .then((data) => setBusinesses(data))
      .catch(() => setError('Failed to load businesses.'))
      .finally(() => setLoading(false));
  };

  const handleCopyMessage = (business: BusinessWithCategory) => {
    const message = getMessageTemplate(business.category.name, business.name);
    navigator.clipboard.writeText(message);
    setCopiedId(business.id);
    setTimeout(() => setCopiedId(null), 2000);
  };
  
  const handleWhatsAppClick = async (business: BusinessWithCategory) => {
    if (!business.phone) return;

    let cleanedPhone = business.phone.replace(/[^0-9]/g, '');
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = '234' + cleanedPhone.substring(1);
    }
    
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanedPhone}`;
    window.open(whatsappUrl, '_blank');

    try {
      await updateBusinessStatus(business.id, 'Messaged');
      fetchBusinesses();
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Opened WhatsApp, but failed to update the business status in the dashboard.");
    }
  };

  // --- NEW FUNCTION ---
  // Opens a new Google search tab for the business name
  const handleGoogleSearch = (businessName: string) => {
    const query = encodeURIComponent(businessName);
    const googleSearchUrl = `https://www.google.com/search?q=${query}`;
    window.open(googleSearchUrl, '_blank');
  };

  const filteredBusinesses = useMemo(() => {
    if (categoryFilter === 'all') {
      return businesses;
    }
    return businesses.filter(b => b.categoryId === parseInt(categoryFilter, 10));
  }, [businesses, categoryFilter]);

  if (loading) return <div className="card"><p>Loading businesses...</p></div>;
  if (error) return <div className="card error"><p>{error}</p></div>;

  return (
    <div className="card table-container">
      <div className="table-header">
        <h2>Saved Businesses ({filteredBusinesses.length})</h2>
        <div className="filter-container">
          <label htmlFor="category-filter">Filter by Category:</label>
          <select id="category-filter" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBusinesses.map((business) => (
            <tr key={business.id}>
              <td>{business.name}</td>
              <td><span className="category-tag">{business.category.name}</span></td>
              <td>{business.phone || 'N/A'}</td>
              <td><span className={`status-tag status-${business.status.toLowerCase()}`}>{business.status}</span></td>
              <td>
                <div className="actions-cell">
                  {/* --- NEW GOOGLE BUTTON --- */}
                  <button
                    className="google-btn"
                    onClick={() => handleGoogleSearch(business.name)}
                    title="Search on Google"
                  >
                    Google
                  </button>
                  <button
                    className="copy-btn"
                    onClick={() => handleCopyMessage(business)}
                    title="Copy outreach message"
                  >
                    {copiedId === business.id ? 'Copied!' : 'Copy Msg'}
                  </button>
                  <button
                    className="whatsapp-btn"
                    onClick={() => handleWhatsAppClick(business)}
                    disabled={!business.phone || business.phone === 'N/A'}
                    title="Open WhatsApp chat"
                  >
                    WhatsApp
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
