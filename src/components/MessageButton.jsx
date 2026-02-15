import React from 'react';

const MessageButton = ({ phone, imageUrl, text, label }) => {
  const handleSend = async () => {
    // 1. Clean phone number and catch old bad formats
    let cleanPhone = phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('2340')) cleanPhone = '234' + cleanPhone.substring(4);
    if (cleanPhone.startsWith('0')) cleanPhone = '234' + cleanPhone.substring(1);

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

    // 3. Fallback: Safer navigation that bypasses mobile popup blockers
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text || '')}`;
    window.location.href = waUrl; 
  };

  return (
    <button className="msg-btn" onClick={handleSend} disabled={!text && !imageUrl}>
       {imageUrl ? '📸' : '💬'} {label}
    </button>
  );
};

export default MessageButton;
