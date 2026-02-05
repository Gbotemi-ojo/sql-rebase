import { useState, useEffect } from 'react';
import './App.css';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import { api } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('list'); 
  const [selectedNiche, setSelectedNiche] = useState(''); // Default empty
  const [niches, setNiches] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Niches on Mount
  useEffect(() => {
    loadNiches();
  }, []);

  const loadNiches = async () => {
    const data = await api.getNiches();
    setNiches(data);
    // Auto-select first niche if available
    if (data.length > 0 && !selectedNiche) {
      setSelectedNiche(data[0].id);
    }
  };

  // 2. Fetch Contacts when Niche or Tab changes
  useEffect(() => {
    if (activeTab === 'list' && selectedNiche) {
      fetchContacts();
    }
  }, [activeTab, selectedNiche]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await api.getContacts(selectedNiche);
      setContacts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Creating a New Niche
  const handleAddNiche = async () => {
    const name = prompt("Enter new Niche Name (e.g., 'Gyms', 'Lawyers'):");
    if (name) {
      try {
        const newNiche = await api.createNiche(name);
        setNiches([...niches, newNiche]); // Update local list
        setSelectedNiche(newNiche.id);    // Select it immediately
        alert(`Niche "${newNiche.name}" created!`);
      } catch (e) {
        alert("Failed to create niche.");
      }
    }
  };

  return (
    <div className="app-container">
      {/* Header with Dynamic Dropdown + Create Button */}
      {activeTab === 'list' && (
        <header className="header">
          <h1>My Leads</h1>
          <div style={{display: 'flex', gap: '8px'}}>
            <select 
              className="niche-select"
              value={selectedNiche} 
              onChange={(e) => setSelectedNiche(Number(e.target.value))}
              disabled={niches.length === 0}
            >
              {niches.length === 0 && <option>No Niches</option>}
              {niches.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
            
            <button 
              onClick={handleAddNiche}
              style={{
                background: '#2563eb', color: 'white', border: 'none', 
                borderRadius: '8px', padding: '0 12px', fontSize: '1.2rem', cursor: 'pointer'
              }}
            >
              +
            </button>
          </div>
        </header>
      )}

      <main>
        {activeTab === 'list' ? (
          <ContactList 
            contacts={contacts} 
            isLoading={loading} 
            onRefresh={fetchContacts} 
          />
        ) : (
          <AddContact 
            onAdd={() => setActiveTab('list')} 
            niches={niches} 
            onNewNiche={handleAddNiche} // Pass create function to form too
          />
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
          <span>📋</span> Leads
        </button>
        <button className={`nav-btn ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>
          <span>➕</span> Add Lead
        </button>
      </nav>
    </div>
  );
}

export default App;
