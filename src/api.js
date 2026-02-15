// src/api.js
const BASE_URL = 'https://sql-rebase-be.vercel.app';

export const api = {
  getNiches: async () => {
    try {
      const res = await fetch(`${BASE_URL}/niches`);
      const json = await res.json();
      return json.success ? json.data : [];
    } catch (e) { console.error(e); return []; }
  },

  createNiche: async (name) => {
    try {
      const res = await fetch(`${BASE_URL}/niches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      return json.data;
    } catch (e) { throw e; }
  },

  getContacts: async (nicheId) => {
    try {
      const url = nicheId ? `${BASE_URL}/contacts?nicheId=${nicheId}` : `${BASE_URL}/contacts`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const json = await response.json();
      return json.success ? json.data : [];
    } catch (error) { throw error; }
  },

  createContact: async (data) => {
    try {
      const response = await fetch(`${BASE_URL}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await response.json();
      // NEW: Throw the exact error message from the backend if it fails
      if (!response.ok) throw new Error(json.error || 'Failed to create contact');
      return json.data;
    } catch (error) { throw error; }
  },

  updateOutreach: async (contactId, formData) => {
    try {
      const response = await fetch(`${BASE_URL}/contacts/${contactId}/outreach`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update outreach');
      const json = await response.json();
      return json.data;
    } catch (error) { throw error; }
  },

  updateStatus: async (contactId, status) => {
    try {
      const response = await fetch(`${BASE_URL}/contacts/${contactId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update status');
      const json = await response.json();
      return json.data;
    } catch (error) { throw error; }
  }
};
