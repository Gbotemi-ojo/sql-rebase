import React from 'react';

const MessageButton = ({ phone, imageUrl, text, label }) => {
  const handleSend = async () => {
    // 1. Clean phone number (used only for fallback if share fails)
    const cleanPhone = phone.replace(/\D/g, ''); 

    // 2. Handle Image Sharing Logic
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Mobile Native Share (This opens the "Share Sheet")
        if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'image.jpg', { type: blob.type })] })) {
             await navigator.share({
                files: [new File([blob], 'image.jpg', { type: blob.type })],
                text: text,
            });
            return; // If native share works, we stop here.
        } 
      } catch (err) {
        console.error("Share failed", err);
      }
    }

    // 3. Fallback: If no image or share fails, open WhatsApp Chat directly
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
    window.open(waUrl, '_blank');
  };

  return (
    <button className="msg-btn" onClick={handleSend} disabled={!text && !imageUrl}>
       {imageUrl ? '📸' : '💬'} {label}
    </button>
  );
};

export default MessageButton;
