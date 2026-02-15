import React, { useState, useEffect } from 'react';
import { api } from '../api';

const AddContact = ({ onAdd, niches, onNewNiche }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('manual'); 
  const [jsonInput, setJsonInput] = useState('');
  const [formData, setFormData] = useState({
    name: '', phone: '', nicheId: '', socialLink: '', notes: ''
  });

  useEffect(() => {
    if (niches.length > 0 && !formData.nicheId) {
      setFormData(prev => ({ ...prev, nicheId: niches[0].id }));
    }
  }, [niches]);

  const handleSubmitManual = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createContact({ ...formData, nicheId: Number(formData.nicheId) });
      alert('Lead saved! Go to the list to setup outreach.');
      onAdd(); 
    } catch (err) {
      alert('Error saving lead.');
    } finally {
      setLoading(false);
    }
  };

  // --- UPGRADED PHONE FORMATTER ---
  const formatPhone = (phoneStr) => {
    if (!phoneStr) return '';
    let clean = phoneStr.replace(/\D/g, ''); 
    
    // Fix Google Maps weirdness: +234 (0) 812... -> 2340812...
    if (clean.startsWith('2340')) {
      clean = '234' + clean.substring(4);
    } 
    // Standard local to international
    else if (clean.startsWith('0')) {
      clean = '234' + clean.substring(1);
    }
    return clean;
  };

  const handleSubmitJson = async (e) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;
    setLoading(true);

    try {
      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData)) {
        throw new Error("Pasted data must be a JSON array [ { ... } ]");
      }

      let successCount = 0;

      for (const item of parsedData) {
        if (!item.name || !item.phone) continue; 

        await api.createContact({
          name: item.name,
          phone: formatPhone(item.phone),
          nicheId: Number(formData.nicheId),
          socialLink: item.galleryImages?.[0] || 'Scraped from Google',
          notes: item.address || 'No address provided'
        });
        
        successCount++;
      }

      alert(`✅ Successfully imported ${successCount} leads!`);
      setJsonInput(''); // Clear input on success
      onAdd(); 

    } catch (err) {
      console.error(err);
      alert('Failed to import. Please ensure the pasted text is valid JSON format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{marginBottom: '15px'}}>Add New Leads</h2>

      <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
         <button 
           type="button" 
           onClick={() => setMode('manual')}
           style={{ flex: 1, padding: '10px', background: mode === 'manual' ? '#2563eb' : '#e2e8f0', color: mode === 'manual' ? '#fff' : '#000', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
         >
           ✍️ Manual Entry
         </button>
         <button 
           type="button" 
           onClick={() => setMode('json')}
           style={{ flex: 1, padding: '10px', background: mode === 'json' ? '#2563eb' : '#e2e8f0', color: mode === 'json' ? '#fff' : '#000', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold'}}
         >
           📦 Paste JSON
         </button>
      </div>

      <div className="form-group" style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
        <label style={{fontWeight: 'bold'}}>Assign to Category (Niche)</label>
        <div style={{display: 'flex', gap: '8px', marginTop: '5px'}}>
          <select className="input-field" value={formData.nicheId} required onChange={e => setFormData({...formData, nicheId: e.target.value})}>
            {niches.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button type="button" onClick={onNewNiche} style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '8px', width: '50px', fontSize: '1.2rem', cursor: 'pointer' }}>
            +
          </button>
        </div>
      </div>

      {mode === 'manual' ? (
        <form onSubmit={handleSubmitManual} style={{marginTop: '20px'}}>
          <div className="form-group">
            <label>Business Name</label>
            <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="form-group">
            <label>WhatsApp Number</label>
            <input className="input-field" type="tel" required placeholder="0812..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="form-group">
            <label>Social Profile / Website Link</label>
            <input className="input-field" type="url" value={formData.socialLink} onChange={e => setFormData({...formData, socialLink: e.target.value})} />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Lead'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitJson} style={{marginTop: '20px'}}>
          <div className="form-group">
            <label>Paste Google Scraper JSON Array Here</label>
            <textarea 
              className="input-field" 
              rows="12" 
              required
              placeholder={'[\n  {\n    "name": "Progressive Bookshop",\n    "phone": "0812 278 1484",\n    "address": "..."\n  }\n]'}
              value={jsonInput} 
              onChange={e => setJsonInput(e.target.value)}
              style={{fontFamily: 'monospace', fontSize: '0.85rem', whiteSpace: 'pre'}}
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading || !jsonInput.trim()}>
            {loading ? 'Importing Data (Please wait)...' : 'Import Leads'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddContact;
