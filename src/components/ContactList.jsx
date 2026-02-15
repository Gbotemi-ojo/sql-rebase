import React, { useState } from 'react';
import MessageButton from './MessageButton';
import OutreachSetup from './OutreachSetup';
import { api } from '../api';

const ContactList = ({ contacts, niches, isLoading, onRefresh }) => {
  const [editingId, setEditingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  const filteredContacts = contacts.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await api.updateStatus(contactId, newStatus);
      onRefresh(); 
    } catch (e) { alert("Failed to update status"); }
  };

  const handleNicheChange = async (contactId, newNicheId) => {
    try {
      await api.updateNiche(contactId, Number(newNicheId));
      onRefresh(); 
    } catch (e) { alert("Failed to update category"); }
  };

  if (isLoading) return <div className="empty-state">Loading leads...</div>;
  if (!contacts || contacts.length === 0) return <div className="empty-state">📭 No leads found. Add one!</div>;

  return (
    <div>
      <div className="controls-row">
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
        
        <button className="sort-btn" onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}>
          {sortOrder === 'newest' ? '🔽 Newest' : '🔼 Oldest'}
        </button>
      </div>

      {sortedContacts.length === 0 && (
        <div className="empty-state">No {filterStatus === 'all' ? '' : filterStatus} leads found.</div>
      )}

      <div className="contact-list">
        {sortedContacts.map((contact) => {
          const isSetup = !!contact.msg1_text;

          if (editingId === contact.id) {
            return (
              <OutreachSetup 
                key={contact.id} contact={contact} niches={niches}
                onComplete={() => { setEditingId(null); onRefresh(); }} onCancel={() => setEditingId(null)}
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

              <div className="card-meta">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <a href={contact.socialLink} target="_blank" rel="noreferrer" className="source-link">🔗 Visit Profile</a>
                  <span className="date-badge">Added: {new Date(contact.createdAt).toLocaleDateString()}</span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
                    Category
                  </span>
                  <select 
                    className="niche-change-select"
                    value={contact.nicheId}
                    onChange={(e) => handleNicheChange(contact.id, e.target.value)}
                  >
                    {niches.map(n => <option key={n.id} value={n.id}>{n.name}</option>)}
                  </select>
                </div>
              </div>

              {!isSetup ? (
                <div style={{textAlign: 'center', marginTop: '10px'}}>
                  <button className="primary-btn" onClick={() => setEditingId(contact.id)}>⚙️ Auto-Fill Template</button>
                </div>
              ) : (
                <div style={{marginTop: '15px'}}>
                  <div className="action-grid">
                    <MessageButton phone={contact.phoneNumber} imageUrl={null} text={contact.msg1_text} label="1. Intro" />
                    <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg2_image} text={contact.msg2_text} label="2. Curiosity" />
                    <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg3_image} text={contact.msg3_text} label="3. Screenshot" />
                    <MessageButton phone={contact.phoneNumber} imageUrl={contact.msg4_image} text={contact.msg4_text} label="4. CTA" />
                  </div>
                  <button className="secondary-btn" onClick={() => setEditingId(contact.id)} style={{marginTop: '10px'}}>✏️ Edit Messages</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContactList;
