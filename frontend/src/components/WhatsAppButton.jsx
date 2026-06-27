import React from 'react';

const WhatsAppButton = () => {
  // Configurable owner WhatsApp number (including country code, e.g. +91 for India)
  const phoneNumber = '919876543210'; 
  const message = encodeURIComponent('Hello Raja Rice Traders, I am interested in inquiring about your rice products. Please share more details.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba59] transition-all duration-300 hover:scale-110 group cursor-pointer"
      title="Chat with us on WhatsApp"
      id="floating-whatsapp-btn"
    >
      {/* Pulse effect rings */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
      
      {/* SVG Icon */}
      <svg
        className="w-8 h-8 relative z-10 transition-transform duration-300 group-hover:rotate-6"
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.58 2.012 14.12 1.01 11.516 1.01 6.082 1.01 1.657 5.378 1.653 10.81c-.001 1.762.463 3.484 1.347 5.02l-.99 3.616 3.737-.98c1.533.84 3.238 1.277 4.898 1.282zM17.43 14.1c-.32-.16-1.89-.93-2.185-1.04-.294-.11-.51-.16-.723.16-.214.32-.83 1.04-1.016 1.25-.187.21-.374.24-.694.08-.32-.16-1.353-.5-2.578-1.593-.952-.85-1.595-1.9-1.782-2.22-.187-.32-.02-.49.14-.65.144-.144.32-.37.48-.56.16-.19.213-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.636-.53-.55-.72-.56h-.61c-.214 0-.56.08-.853.4-.293.32-1.12 1.1-1.12 2.68 0 1.58 1.15 3.11 1.31 3.32.16.21 2.26 3.45 5.48 4.84.765.33 1.36.53 1.83.68.77.245 1.47.21 2.02.13.62-.09 1.89-.77 2.155-1.48.267-.71.267-1.32.187-1.45-.08-.13-.294-.21-.614-.37z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
