import React, { useState } from 'react';

const MessageButton = ({ phone, imageUrl, text, label }) => {
  const [status, setStatus] = useState('idle'); // idle, copying, done

  const handleSend = async () => {
    // 1. Clean phone number (remove spaces, +, etc.)
    const cleanPhone = phone.replace(/\D/g, ''); 
    setStatus('copying');

    try {
      // 2. If there is an image, copy it to clipboard
      if (imageUrl) {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // This writes the image binary to the clipboard
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        
        // Short delay to ensure user sees the feedback
        alert("📸 Image Copied! \n\n1. WhatsApp will open now.\n2. Tap the text box.\n3. Press PASTE.");
      }

      // 3. Open the specific WhatsApp Chat
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
      window.location.href = waUrl; // Opens WhatsApp directly
      
    } catch (err) {
      console.error("Workflow failed", err);
      alert("Could not auto-copy image. Please download it manually, then click this button again.");
      
      // Fallback: Just open WhatsApp without image if copy fails
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
      window.location.href = waUrl;
    } finally {
      setStatus('idle');
    }
  };

  return (
    <button 
      className="msg-btn" 
      onClick={handleSend} 
      disabled={(!text && !imageUrl) || status === 'copying'}
      style={{ opacity: status === 'copying' ? 0.7 : 1 }}
    >
       {status === 'copying' ? '⏳ Copying...' : (
         <>
           <span>{imageUrl ? '📸' : '💬'}</span> {label}
         </>
       )}
    </button>
  );
};

export default MessageButton;
