import React, { useState } from 'react';

const MessageButton = ({ phone, imageUrl, text, label }) => {
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const cleanPhone = phone.replace(/\D/g, ''); 
    
    // If no image, just open WhatsApp immediately
    if (!imageUrl) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`, '_blank');
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch the image as a "Blob" (File object)
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
      
      // 2. Create a temporary link to FORCE download
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `outreach-lead-${cleanPhone}.jpg`; // Name of saved file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 3. Small delay to let the download start, then open WhatsApp
      setTimeout(() => {
        window.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
        setLoading(false);
      }, 1000);

    } catch (err) {
      console.error("Download failed", err);
      alert("Could not save image automatically. Opening chat anyway...");
      window.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
      setLoading(false);
    }
  };

  return (
    <button 
      className="msg-btn" 
      onClick={handleSend} 
      disabled={loading || (!text && !imageUrl)}
      style={{ opacity: loading ? 0.7 : 1 }}
    >
       {loading ? '⬇️ Saving...' : (
         <>
           <span>{imageUrl ? '📸' : '💬'}</span> {label}
         </>
       )}
    </button>
  );
};

export default MessageButton;