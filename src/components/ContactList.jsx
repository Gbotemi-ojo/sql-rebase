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
        const isSetup = !!contact.msg1_text; // Check if at least Msg 1 is set

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
                  ⚙️ Setup Messages
                </button>
              </div>
            ) : (
              <div>
                <div className="action-grid" style={{gridTemplateColumns: '1fr 1fr'}}>
                  {/* 1. Opener (Text Only - Opens Direct Chat) */}
                  <MessageButton 
                    phone={contact.phoneNumber} 
                    imageUrl={null} 
                    text={contact.msg1_text} 
                    label="1. Opener" 
                  />
                  
                  {/* 2. Pitch (Image - Uses Native Share) */}
                  <MessageButton 
                    phone={contact.phoneNumber} 
                    imageUrl={contact.msg2_image} 
                    text={contact.msg2_text} 
                    label="2. Pitch" 
                  />
                  
                  {/* 3. Follow Up (Image - Uses Native Share) */}
                  <MessageButton 
                    phone={contact.phoneNumber} 
                    imageUrl={contact.msg3_image} 
                    text={contact.msg3_text} 
                    label="3. Follow Up" 
                  />

                  {/* 4. Closing (Image - Uses Native Share) */}
                  <MessageButton 
                    phone={contact.phoneNumber} 
                    imageUrl={contact.msg4_image} 
                    text={contact.msg4_text} 
                    label="4. Closing" 
                  />
                </div>
                  
                <button className="msg-btn" onClick={() => setEditingId(contact.id)} style={{marginTop: '10px', width: '100%', justifyContent: 'center'}}>
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
