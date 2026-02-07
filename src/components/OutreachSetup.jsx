import React, { useState, useEffect } from 'react';
import { api } from '../api';

// --- CONFIGURATION: NICHE TEMPLATES ---
const TEMPLATES = {
  "Real estate": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your properties are presented online, especially for people coming from WhatsApp, Instagram, TikTok, so I decided to wait until I had something to show you.",
    msg3: "It’s designed to help you:\n\n1. Make {BUSINESS_NAME} stand out as more credible\n2. Allow buyers to filter listings by budget and location\n3. Focus on serious buyers instead of back-and-forth chats\n\ne.t.c so we can discuss more on it.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Short-lets": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your apartments are presented online, especially for guests coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s designed to make your apartments look more premium, allow guests to filter by price, location, and stay duration, and help you attract serious bookings instead of endless questions.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Autocar dealership": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your cars are presented online, especially for buyers coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s built to help {BUSINESS_NAME} look more trustworthy, let buyers filter cars by price, brand, year, and condition, and focus your time on serious buyers only.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Car rental services": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your rental cars are presented online, especially for customers coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s designed to make your service look more professional, allow customers to filter cars by price and rental duration, and reduce back-and-forth before bookings.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Furniture": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your furniture pieces are presented online, especially for customers coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s built to help {BUSINESS_NAME} look more premium, allow customers to filter items by price, category, and size, and make buying decisions easier.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Jewelry": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your jewelry is presented online, especially for customers coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s designed to make your pieces look more luxurious, allow customers to browse by price and collection, and build trust before they message you.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Fashion / beauty": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your products are presented online, especially for customers coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s built to help {BUSINESS_NAME} look more professional, allow customers to shop by price and category, and turn casual chats into actual orders.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
  },
  "Bookstore": {
    msg1: "Hi 👋\n\nMy name is Gbotemi. I came across {BUSINESS_NAME} and decided to reach out.",
    msg2: "I’ve been working on something recently that could really help how your books are presented online, especially for readers coming from WhatsApp and Instagram, so I decided to wait until I had something to show you.",
    msg3: "It’s designed to make {BUSINESS_NAME} look more organized, allow readers to filter books by genre and price, and find what they want faster.",
    msg4: "Would you like something like this set up for {BUSINESS_NAME}?"
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
        msg1_text: template.msg1.replace('{BUSINESS_NAME}', contact.name),
        msg2_text: template.msg2,
        msg3_text: template.msg3.replace('{BUSINESS_NAME}', contact.name), // Also replace in Msg 3 if needed
        msg4_text: template.msg4.replace('{BUSINESS_NAME}', contact.name)
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
      <h3 style={{marginTop: 0}}>⚙️ Setup Outreach for {contact.name}</h3>
      <form onSubmit={handleSubmit}>
        
        {/* Msg 1: Text Only */}
        <div className="form-group">
          <label className="text-sm font-bold">1. Introduction (Text Only)</label>
          <textarea className="input-field" rows="3"
            value={msgs.msg1_text} onChange={e => setMsgs({...msgs, msg1_text: e.target.value})} />
        </div>

        {/* Msg 2: Image + Text */}
        <div className="form-group">
          <label className="text-sm font-bold">2. Curiosity (Image + Text)</label>
          <textarea className="input-field" rows="4"
            value={msgs.msg2_text} onChange={e => setMsgs({...msgs, msg2_text: e.target.value})} />
          <div className="file-upload-box">
             <span>📸 Image 2:</span>
             <input type="file" accept="image/*" onChange={e => handleFileChange('img2', e.target.files[0])} />
          </div>
        </div>

        {/* Msg 3: Image + Text */}
        <div className="form-group">
          <label className="text-sm font-bold">3. Screenshot (Image + Text)</label>
          <textarea className="input-field" rows="6"
            value={msgs.msg3_text} onChange={e => setMsgs({...msgs, msg3_text: e.target.value})} />
          <div className="file-upload-box">
             <span>📸 Image 3 (Screenshot):</span>
             <input type="file" accept="image/*" onChange={e => handleFileChange('img3', e.target.files[0])} />
          </div>
        </div>

        {/* Msg 4: Image + Text */}
        <div className="form-group">
          <label className="text-sm font-bold">4. CTA (Image + Text)</label>
          <textarea className="input-field" rows="2"
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