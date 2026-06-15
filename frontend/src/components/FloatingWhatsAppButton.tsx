import React from 'react';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsAppButton: React.FC = () => {
  const whatsappNumber = '919999999999'; // Replace with your WhatsApp number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20SS%20Fashion!%20I%20need%20help%20with%20an%20order.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 animate-float"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
};
