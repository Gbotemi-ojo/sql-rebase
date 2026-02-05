import React, { useState } from 'react';
import { api } from '../api';

const OutreachSetup = ({ contact, onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState({
    msg1_text: '',
    msg2_text: 'Hey, just checking in on my previous message. Any thoughts?',
    msg3_text: 'Hi, are you open to discussing a website revamp? I have some ideas specifically for your niche.',
  });
  const [files, setFiles] = useState({ img1: null, img2: null, img3: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('msg1_text', msgs.msg1_text);
    formData.append('msg2_text', msgs.msg2_text);
    formData.append('msg3_text', msgs.msg3_text);
    
    // Key names must match what backend multer expects ('img1', 'img2', 'img3')
    if (files.img1) formData.append('img1', files.img1);
    if (files.img2) formData.append('img2', files.img2);
    if (files.img3) formData.append('img3', files.img3);

    try {
      await api.updateOutreach(contact.id, formData);
      alert('Outreach assets saved!');
      onComplete();
    } catch (err) {
      alert('Failed to save assets.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key, file) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  return (
    <div className="card" style={{border: '2px solid #2563eb', background: '#eff6ff'}}>
      <h3>⚙️ Setup Outreach for {contact.name}</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Msg 1 */}
        <div className="form-group">
          <label className="text-sm font-bold">1. The Pitch (Image + Text)</label>
          <textarea className="input-field" rows="3" placeholder="Caption..."
            value={msgs.msg1_text} onChange={e => setMsgs({...msgs, msg1_text: e.target.value})} />
          <input type="file" accept="image/*" onChange={e => handleFileChange('img1', e.target.files[0])} style={{marginTop: 5}} />
        </div>

        {/* Msg 2 */}
        <div className="form-group">
          <label className="text-sm font-bold">2. Follow Up</label>
          <textarea className="input-field" rows="2"
            value={msgs.msg2_text} onChange={e => setMsgs({...msgs, msg2_text: e.target.value})} />
        </div>

        {/* Msg 3 */}
        <div className="form-group">
          <label className="text-sm font-bold">3. Closing</label>
          <textarea className="input-field" rows="2"
            value={msgs.msg3_text} onChange={e => setMsgs({...msgs, msg3_text: e.target.value})} />
        </div>

        <div style={{display: 'flex', gap: 10}}>
          <button type="button" onClick={onCancel} className="msg-btn" style={{flex: 1}}>Cancel</button>
          <button type="submit" className="primary-btn" style={{marginTop: 0, flex: 2}} disabled={loading}>
            {loading ? 'Uploading...' : 'Save All'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OutreachSetup;
