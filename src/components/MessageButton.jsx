import React, { useState } from 'react';

const MessageButton = ({ phone, imageUrl, text, label }) => {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSend = async () => {
    const cleanPhone = phone.replace(/\D/g, ''); 
    
    // If no image, just open WhatsApp immediately
    if (!imageUrl) {
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`, '_blank');
      return;
    }

    setStatus('loading');

    try {
      // 1. Fetch the image
      // "crossOrigin" is crucial for Cloudinary images to be allowed in the clipboard
      const response = await fetch(imageUrl, { mode: 'cors', credentials: 'omit' });
      if (!response.ok) throw new Error("Failed to fetch image");
      
      const blob = await response.blob();

      // 2. Prepare the Clipboard Item
      // Some browsers (like Safari) are very strict about MIME types.
      // We wrap this in a try/catch specifically for the copy operation.
      try {
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        
        // 3. Success! Show Alert then Open
        setStatus('success');
        alert("✅ IMAGE COPIED!\n\n1. WhatsApp will open.\n2. Tap the text box.\n3. PASTE the image.");
        
        // Open WhatsApp
        window.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
        
      } catch (clipboardError) {
        console.error("Clipboard failed", clipboardError);
        // If clipboard fails (common on non-HTTPS or specific Android versions),
        // we fallback to just text but warn the user.
        alert("⚠️ Could not auto-copy image.\n\nPlease long-press the image above to copy it manually, then click this button again.");
        window.location.href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
      }

    } catch (err) {
      console.error("Workflow failed", err);
      alert("Error loading image. Please check your internet connection.");
    } finally {
      setStatus('idle');
    }
  };

  return (
    <button 
      className="msg-btn" 
      onClick={handleSend} 
      disabled={status === 'loading'}
      style={{ 
        opacity: status === 'loading' ? 0.7 : 1,
        background: status === 'success' ? '#dcfce7' : undefined 
      }}
    >
       {status === 'loading' ? '⏳ Preparing...' : (
         <>
           <span>{imageUrl ? '📸' : '💬'}</span> {label}
         </>
       )}
    </button>
  );
};

export default MessageButton;
