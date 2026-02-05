import React, { useState, useEffect } from 'react';
import { api } from '../api';

const AddContact = ({ onAdd, niches, onNewNiche }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', phone: '', nicheId: '', socialLink: '', notes: ''
  });

  // Set default niche when list loads
  useEffect(() => {
    if (niches.length > 0 && !formData.nicheId) {
      setFormData(prev => ({ ...prev, nicheId: niches[0].id }));
    }
  }, [niches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createContact({
        ...formData,
        nicheId: Number(formData.nicheId)
      });
      alert('Lead saved! Go to the list to setup outreach.');
      onAdd(); 
    } catch (err) {
      alert('Error saving lead.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 style={{marginBottom: '20px'}}>Add New Lead</h2>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label>Business Name</label>
          <input className="input-field" required value={formData.name} 
            onChange={e => setFormData({...formData, name: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Niche</label>
          <div style={{display: 'flex', gap: '8px'}}>
            <select className="input-field" value={formData.nicheId} required
              onChange={e => setFormData({...formData, nicheId: e.target.value})}>
              {niches.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
            {/* Quick Add Button */}
            <button type="button" onClick={onNewNiche} style={{
               background: '#e2e8f0', border: '1px solid #cbd5e1', 
               borderRadius: '8px', width: '50px', fontSize: '1.2rem', cursor: 'pointer'
            }}>
              +
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>WhatsApp Number</label>
          <input className="input-field" type="tel" required placeholder="+234..."
            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Social Profile Link</label>
          <input className="input-field" type="url" 
            value={formData.socialLink} onChange={e => setFormData({...formData, socialLink: e.target.value})} />
        </div>

        <button type="submit" className="primary-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Save Lead'}
        </button>
      </form>
    </div>
  );
};

export default AddContact;
