import React, { useState } from 'react';
import MessageButton from './MessageButton';
import OutreachSetup from './OutreachSetup';

const ContactList = ({ contacts, isLoading, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);

  if (isLoading) return <div style={{padding: 40, textAlign: 'center'}}>Loading...</div>;
  if (!contacts || contacts.length === 0) return <div style={{padding: 40, textAlign: 'center'}}>No leads found.</div>;

  return (
    <div className="contact-list">
      {contacts.map((contact) => {
        // Check if outreach is configured (has at least text for msg1)
        const isSetup = contact.msg1_text || contact.msg1_image;

        if (editingId === contact.id) {
          return (
            <OutreachSetup 
              key={contact.id} 
              contact={contact} 
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

            <a href={contact.socialLink} target="_blank" rel="noreferrer" className="source-link">🔗 Source Profile</a>

            {!isSetup ? (
              <div style={{textAlign: 'center', padding: '20px 0'}}>
                <button className="primary-btn" onClick={() => setEditingId(contact.id)}>
                  ⚙️ Setup Outreach Messages
                </button>
              </div>
            ) : (
              <div>
                {contact.msg1_image && <img src={contact.msg1_image} alt="Pitch" className="lead-image" />}
                
                <div className="action-grid">
                  <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg1_image} text={contact.msg1_text} label="1. Pitch" />
                  <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg2_image} text={contact.msg2_text} label="2. Follow Up" />
                  <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg3_image} text={contact.msg3_text} label="3. Closing" />
                  
                  <button className="msg-btn" onClick={() => setEditingId(contact.id)} style={{gridColumn: 'span 2', justifyContent: 'center'}}>
                    ✏️ Edit Messages
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ContactList;
