import React, { useState } from 'react';
import MessageButton from './MessageButton';
import OutreachSetup from './OutreachSetup';

const ContactList = ({ contacts, niches, isLoading, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);

  if (isLoading) return <div style={{padding: 40, textAlign: 'center'}}>Loading leads...</div>;
  if (!contacts || contacts.length === 0) return <div style={{padding: 40, textAlign: 'center'}}>📭 No leads found.</div>;

  return (
    <div className="contact-list">
      {contacts.map((contact) => {
        const isSetup = !!contact.msg1_text;

        if (editingId === contact.id) {
          return (
            <OutreachSetup 
              key={contact.id} 
              contact={contact}
              niches={niches} /* <--- NEW: Pass niches here */
              onComplete={() => { setEditingId(null); onRefresh(); }}
              onCancel={() => setEditingId(null)}
            />
          );
        }

        return (
          <div key={contact.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{contact.name}</h3>
              <span className={`status-badge status-${contact.status}`}>{contact.status}</span>
            </div>

            <a href={contact.socialLink} target="_blank" rel="noreferrer" className="source-link">🔗 Visit Profile</a>

            {!isSetup ? (
              <div style={{textAlign: 'center', padding: '20px 0'}}>
                <button className="primary-btn" onClick={() => setEditingId(contact.id)}>
                  ⚙️ Auto-Fill Template
                </button>
              </div>
            ) : (
              <div>
                <div className="action-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                  <MessageButton phone={contact.phoneNumber} imageUrl={null} text={contact.msg1_text} label="1. Intro" />
                  <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg2_image} text={contact.msg2_text} label="2. Curiosity" />
                  <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg3_image} text={contact.msg3_text} label="3. Screenshot" />
                  <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg4_image} text={contact.msg4_text} label="4. CTA" />
                </div>
                <button className="msg-btn" onClick={() => setEditingId(contact.id)} style={{marginTop: '10px', width: '100%', justifyContent: 'center', background: '#fff', border: '1px solid #e2e8f0'}}>
                  ✏️ Edit Messages
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
