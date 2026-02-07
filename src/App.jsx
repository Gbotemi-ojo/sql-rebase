import { useState, useEffect } from 'react';
import './App.css';
import ContactList from './components/ContactList';
import AddContact from './components/AddContact';
import { api } from './api';

function App() {
  const [activeTab, setActiveTab] = useState('list'); 
  const [selectedNiche, setSelectedNiche] = useState(''); 
  const [niches, setNiches] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Niches on Mount
  useEffect(() => {
    loadNiches();
  }, []);

  const loadNiches = async () => {
    try {
      const data = await api.getNiches();
      setNiches(data);
      if (data.length > 0 && !selectedNiche) {
        setSelectedNiche(data[0].id);
      }
    } catch (e) {
      console.error("Failed to load niches");
    }
  };

  // 2. Fetch Contacts
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

  const handleAddNiche = async () => {
    const name = prompt("Enter new Niche Name (e.g., 'Real Estate'):");
    if (name) {
      try {
        const newNiche = await api.createNiche(name);
        setNiches([...niches, newNiche]);
        setSelectedNiche(newNiche.id);
        alert(`Category "${newNiche.name}" created!`);
      } catch (e) {
        alert("Failed to create niche.");
      }
    }
  };

  return (
    <div className="app-container">
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
              {niches.length === 0 && <option>Loading...</option>}
              {niches.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
            <button onClick={handleAddNiche} className="add-niche-btn">+</button>
          </div>
        </header>
      )}

      <main>
        {activeTab === 'list' ? (
          <ContactList 
            contacts={contacts} 
            niches={niches}
            isLoading={loading} 
            onRefresh={fetchContacts} 
          />
        ) : (
          <AddContact 
            onAdd={() => setActiveTab('list')} 
            niches={niches} 
            onNewNiche={handleAddNiche} 
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
