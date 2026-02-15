import React, { useState, useEffect } from 'react';
import { api } from '../api';

// --- CONFIGURATION: NICHE TEMPLATES ---
const TEMPLATES = {
  "Bookstore": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently, but I was waiting until I had something to show you.",
    msg3: "It’s designed to help you:\n\n• Make {BUSINESS_NAME} look more organized online\n• Let customers easily check if a book is in stock\n• Accept payments seamlessly using Paystack\n• Send broadcast messages to let customers know when a book is available\n• Allow customers to request specific books directly on the website\n• e.t.c",
    msg4: "Would you be open to a quick chat or call whenever you are available for it?"
  },
  "Gyms, fitness studios & trainers": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently, but I was waiting until I had something to show you.",
    msg3: "It’s designed to help you:\n\n• Make {BUSINESS_NAME} look more professional online\n• List price lists and training plans clearly for potential clients\n• Send automated email reminders to customers to renew their subscriptions\n• Let members book sessions or classes directly\n• e.t.c",
    msg4: "Would you be open to a quick chat or call whenever you are available for it?"
  },
  "Event planners & wedding vendors": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently, but I was waiting until I had something to show you.",
    msg3: "It’s built to help you:\n\n• Make {BUSINESS_NAME} look more premium online\n• Allow potential clients to filter packages by budget and event type\n• Showcase your past event portfolios beautifully\n• Let clients easily check your availability\n• e.t.c",
    msg4: "Would you be open to a quick chat or call whenever you are available for it?"
  },
  "Pharmacy": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently, but I was waiting until I had something to show you.",
    msg3: "It’s designed to help you:\n\n• Make {BUSINESS_NAME} look more organized and trustworthy\n• Allow customers to search for specific wellness products or over-the-counter items\n• Accept payments securely using Paystack\n• Send single-click broadcast messages to customers about restocks or offers\n• e.t.c",
    msg4: "Would you be open to a quick chat or call whenever you are available for it?"
  }
};

const OutreachSetup = ({ contact, niches, onComplete, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState({
    msg1_text: '', msg2_text: '', msg3_text: '', msg4_text: '',
  });
  const [files, setFiles] = useState({ img2: null, img3: null, img4: null });

  // AUTO-FILL LOGIC
  useEffect(() => {
    // 1. Find the Niche Name using the ID
    const nicheObj = niches.find(n => n.id === contact.nicheId);
    const nicheName = nicheObj ? nicheObj.name : "";

    // 2. Look up the Template by Name (Case insensitive matching)
    const template = TEMPLATES[nicheName] || TEMPLATES[Object.keys(TEMPLATES).find(k => k.toLowerCase() === nicheName.toLowerCase())];
    
    // 3. If template exists and fields are empty, fill them
    if (template && !contact.msg1_text) {
      setMsgs({
        msg1_text: template.msg1.replace(/{BUSINESS_NAME}/g, contact.name),
        msg2_text: template.msg2.replace(/{BUSINESS_NAME}/g, contact.name),
        msg3_text: template.msg3.replace(/{BUSINESS_NAME}/g, contact.name), 
        msg4_text: template.msg4.replace(/{BUSINESS_NAME}/g, contact.name)
      });
    } else {
      // Load existing saved data
      setMsgs({
        msg1_text: contact.msg1_text || '',
        msg2_text: contact.msg2_text || '',
        msg3_text: contact.msg3_text || '',
        msg4_text: contact.msg4_text || '',
      });
    }
  }, [contact, niches]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('msg1_text', msgs.msg1_text);
    formData.append('msg2_text', msgs.msg2_text);
    formData.append('msg3_text', msgs.msg3_text);
    formData.append('msg4_text', msgs.msg4_text);
    
    if (files.img2) formData.append('img2', files.img2);
    if (files.img3) formData.append('img3', files.img3);
    if (files.img4) formData.append('img4', files.img4);

    try {
      await api.updateOutreach(contact.id, formData);
      alert('Assets saved!');
      onComplete();
    } catch (err) {
      alert('Failed to save assets. If you uploaded large images, Vercel might have blocked the request (4.5MB limit).');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (key, file) => {
    // VERCEL PAYLOAD CHECK: Blocks files over 4MB to prevent silent crashes
    if (file && file.size > 4 * 1024 * 1024) {
        alert(`⚠️ File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Vercel limits uploads to ~4MB. Please compress the screenshot.`);
        return;
    }
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  return (
    <div className="card" style={{border: '2px solid #2563eb', background: '#eff6ff'}}>
      <h3 style={{marginTop: 0}}>⚙️ Setup Outreach for {contact.name}</h3>
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <label className="text-sm font-bold">1. Introduction (Text Only)</label>
          <textarea className="input-field" rows="3"
            value={msgs.msg1_text} onChange={e => setMsgs({...msgs, msg1_text: e.target.value})} />
        </div>

        <div className="form-group">
          <label className="text-sm font-bold">2. Curiosity (Image + Text)</label>
          <textarea className="input-field" rows="3"
            value={msgs.msg2_text} onChange={e => setMsgs({...msgs, msg2_text: e.target.value})} />
          <div className="file-upload-box">
             <span>📸 Image 2:</span>
             <input type="file" accept="image/*" onChange={e => handleFileChange('img2', e.target.files[0])} />
          </div>
        </div>

        <div className="form-group">
          <label className="text-sm font-bold">3. Screenshot (Image + Text)</label>
          <textarea className="input-field" rows="8"
            value={msgs.msg3_text} onChange={e => setMsgs({...msgs, msg3_text: e.target.value})} />
          <div className="file-upload-box">
             <span>📸 Image 3 (Screenshot):</span>
             <input type="file" accept="image/*" onChange={e => handleFileChange('img3', e.target.files[0])} />
          </div>
        </div>

        <div className="form-group">
          <label className="text-sm font-bold">4. CTA (Image + Text)</label>
          <textarea className="input-field" rows="3"
            value={msgs.msg4_text} onChange={e => setMsgs({...msgs, msg4_text: e.target.value})} />
          <div className="file-upload-box">
             <span>📸 Image 4:</span>
             <input type="file" accept="image/*" onChange={e => handleFileChange('img4', e.target.files[0])} />
          </div>
        </div>

        <div style={{display: 'flex', gap: 10, marginTop: 20}}>
          <button type="button" onClick={onCancel} className="msg-btn" style={{flex: 1}}>Cancel</button>
          <button type="submit" className="primary-btn" style={{marginTop: 0, flex: 2}} disabled={loading}>
            {loading ? 'Uploading...' : 'Save & Ready'}
          </button>
        </div>
      </form>
      <style>{`
        .file-upload-box {
          background: white;
          padding: 8px;
          border: 1px dashed #cbd5e1;
          border-radius: 6px;
          margin-top: 6px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default OutreachSetup;
