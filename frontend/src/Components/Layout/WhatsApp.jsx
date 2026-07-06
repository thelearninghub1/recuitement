import React from 'react';

const WhatsApp = () => {
  const phoneNumber = '00966503865055';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  const handleClick = () => {
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div
      onClick={handleClick}
      className="fixed bottom-4 left-4 cursor-pointer z-50 animate-bounce"
    >
      <div className="relative">
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
        
        {/* Button with gradient and shadow */}
        <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-3 shadow-2xl hover:scale-110 transition-transform duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-7 h-7"
          >
            <path d="M12.032 2.017c-5.525 0-10 4.475-10 10 0 1.768.461 3.426 1.266 4.86L2 22l5.236-1.3a9.958 9.958 0 0 0 4.796 1.217c5.525 0 10-4.475 10-10s-4.475-10-10-10zM12.032 18.92c-1.634 0-3.166-.45-4.501-1.293l-3.216.8.858-3.131a8.895 8.895 0 0 1-1.383-4.694c0-4.817 3.92-8.737 8.737-8.737 4.817 0 8.737 3.92 8.737 8.737 0 4.817-3.92 8.737-8.737 8.737zm4.791-5.54c-.262-.131-1.554-.767-1.793-.855-.239-.088-.413-.131-.587.131-.174.262-.674.855-.826 1.03-.152.175-.304.197-.566.066-.262-.131-1.106-.408-2.107-1.3-.779-.695-1.305-1.554-1.458-1.816-.152-.262-.016-.403.114-.533.117-.117.262-.305.393-.458.131-.152.174-.262.262-.437.088-.175.044-.328-.022-.459-.066-.131-.587-1.415-.804-1.937-.211-.506-.427-.438-.587-.446-.152-.008-.327-.009-.5-.009s-.46.066-.7.328c-.24.262-.915.895-.915 2.182 0 1.287.937 2.53 1.068 2.705.131.175 1.845 2.817 4.47 3.952.624.27 1.112.432 1.492.553.627.198 1.197.17 1.648.103.503-.074 1.554-.635 1.773-1.248.219-.613.219-1.138.153-1.248-.066-.11-.24-.175-.502-.306z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WhatsApp;