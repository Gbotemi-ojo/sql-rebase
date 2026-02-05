import React from 'react';

const MessageButton = ({ phone, imageUrl, text, label }) => {

  const handleSend = async () => {
    // 1. Clean phone number
    const cleanPhone = phone.replace(/\D/g, ''); 

    // 2. Handle Image Copying Logic
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Mobile Native Share
        if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'image.jpg', { type: blob.type })] })) {
             await navigator.share({
                files: [new File([blob], 'image.jpg', { type: blob.type })],
                text: text,
            });
            return; 
        } 
        
        // Clipboard Fallback
        const item = new ClipboardItem({ [blob.type]: blob });
        await navigator.clipboard.write([item]);
        alert("📸 Image copied! Paste into WhatsApp.");
      } catch (err) {
        console.error("Copy failed", err);
        alert("Could not copy image. Please save manually.");
      }
    }

    // 3. Open WhatsApp
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
