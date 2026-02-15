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

  const formatPhone = (phoneStr) => {
    if (!phoneStr) return '';
    let clean = phoneStr.replace(/\D/g, ''); 
    if (clean.startsWith('2340')) clean = '234' + clean.substring(4);
    else if (clean.startsWith('0')) clean = '234' + clean.substring(1);
    return clean;
  };

  const handleSubmitManual = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createContact({ ...formData, phone: formatPhone(formData.phone), nicheId: Number(formData.nicheId) });
      alert('✅ Lead saved successfully!');
      onAdd(); 
    } catch (err) {
      // Shows "This phone number is already saved..."
      alert(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitJson = async (e) => {
    e.preventDefault();
    if (!jsonInput.trim()) return;
    setLoading(true);

    try {
      const parsedData = JSON.parse(jsonInput);
      
      if (!Array.isArray(parsedData)) {
        throw new Error("Pasted data must be a JSON array");
      }

      let successCount = 0;
      let duplicateCount = 0;

      for (const item of parsedData) {
        if (!item.name || !item.phone) continue; 

        try {
          await api.createContact({
            name: item.name,
            phone: formatPhone(item.phone),
            nicheId: Number(formData.nicheId),
            socialLink: item.galleryImages?.[0] || 'Scraped from Google',
            notes: item.address || 'No address provided'
          });
          successCount++;
        } catch (err) {
          // If it's a duplicate error, just increment the duplicate counter and move to the next
          if (err.message && err.message.includes('already saved')) {
            duplicateCount++;
          }
        }
      }

      alert(`✅ Imported: ${successCount} leads\n⚠️ Skipped (Duplicates): ${duplicateCount}`);
      setJsonInput(''); 
      onAdd(); 

    } catch (err) {
      alert('Failed to import. Please ensure the pasted text is valid JSON format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="page-title">Add New Leads</h2>

      <div className="toggle-group">
         <button 
           type="button" 
           className={`toggle-btn ${mode === 'manual' ? 'active' : ''}`} 
           onClick={() => setMode('manual')}
         >
           ✍️ Manual
         </button>
         <button 
           type="button" 
           className={`toggle-btn ${mode === 'json' ? 'active' : ''}`} 
           onClick={() => setMode('json')}
         >
           📦 Paste JSON
         </button>
      </div>

      <div className="card" style={{marginBottom: '20px'}}>
        <label className="input-label">Assign to Category (Niche)</label>
        <div style={{display: 'flex', gap: '8px', marginTop: '8px'}}>
          <select className="input-field" value={formData.nicheId} required onChange={e => setFormData({...formData, nicheId: e.target.value})}>
            {niches.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button type="button" onClick={onNewNiche} className="icon-btn">+</button>
        </div>
      </div>

      {mode === 'manual' ? (
        <form onSubmit={handleSubmitManual} className="card">
          <div className="form-group">
            <label className="input-label">Business Name</label>
            <input className="input-field" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="input-label">WhatsApp Number</label>
            <input className="input-field" type="tel" required placeholder="0812..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>

          <div className="form-group">
            <label className="input-label">Social Profile / Website Link</label>
            <input className="input-field" type="url" value={formData.socialLink} onChange={e => setFormData({...formData, socialLink: e.target.value})} />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Lead'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmitJson} className="card">
          <div className="form-group">
            <label className="input-label">Paste Google Scraper JSON</label>
            <textarea 
              className="input-field json-input" 
              rows="12" 
              required
              value={jsonInput} 
              onChange={e => setJsonInput(e.target.value)}
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading || !jsonInput.trim()}>
            {loading ? 'Importing Data...' : 'Import Leads'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddContact;
