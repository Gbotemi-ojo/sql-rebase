import React, { useState } from 'react';
import MessageButton from './MessageButton';
import OutreachSetup from './OutreachSetup';
import { api } from '../api';

const ContactList = ({ contacts, niches, isLoading, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Filter Logic
  const filteredContacts = contacts.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  // Status Change Handler
  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await api.updateStatus(contactId, newStatus);
      onRefresh(); 
    } catch (e) {
      alert("Failed to update status");
    }
  };

  if (isLoading) return <div style={{padding: 40, textAlign: 'center', color: '#64748b'}}>Loading leads...</div>;
  if (!contacts || contacts.length === 0) return <div style={{padding: 40, textAlign: 'center', color: '#64748b'}}>📭 No leads found. Add one!</div>;

  return (
    <div>
      {/* Filter Bar */}
      <div className="filter-bar">
        {['all', 'pending', 'replied', 'successful', 'ignored'].map(status => (
          <button 
            key={status}
            className={`filter-pill ${filterStatus === status ? 'active' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div style={{padding: 40, textAlign: 'center', color: '#64748b'}}>
           No {filterStatus === 'all' ? '' : filterStatus} leads found.
        </div>
      )}

      <div className="contact-list">
        {filteredContacts.map((contact) => {
          const isSetup = !!contact.msg1_text;

          if (editingId === contact.id) {
            return (
              <OutreachSetup 
                key={contact.id} 
                contact={contact}
                niches={niches}
                onComplete={() => { setEditingId(null); onRefresh(); }}
                onCancel={() => setEditingId(null)}
              />
            );
          }

          return (
            <div key={contact.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{contact.name}</h3>
                <select 
                  className={`status-select status-${contact.status}`}
                  value={contact.status}
                  onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                >
                  <option value="pending">⏳ Pending</option>
                  <option value="replied">🗣️ Replied</option>
                  <option value="successful">✅ Closed</option>
                  <option value="ignored">❌ Ignored</option>
                </select>
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
                  
                  <button 
                    className="msg-btn" 
                    onClick={() => setEditingId(contact.id)} 
                    style={{marginTop: '10px', width: '100%', justifyContent: 'center', background: '#fff', border: '1px solid #e2e8f0'}}
                  >
                    ✏️ Edit Messages
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .filter-bar {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          overflow-x: auto;
          padding-bottom: 5px;
        }
        .filter-pill {
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #cbd5e1;
          background: white;
          color: #64748b;
          font-size: 0.9rem;
          cursor: pointer;
          white-space: nowrap;
        }
        .filter-pill.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }
        .status-select {
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid #ddd;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .status-select.status-pending { background: #fff7ed; color: #c2410c; border-color: #fdba74; }
        .status-select.status-replied { background: #eff6ff; color: #1d4ed8; border-color: #93c5fd; }
        .status-select.status-successful { background: #f0fdf4; color: #15803d; border-color: #86efac; }
        .status-select.status-ignored { background: #fef2f2; color: #b91c1c; border-color: #fca5a5; }
      `}</style>
    </div>
  );
};

export default ContactList;
