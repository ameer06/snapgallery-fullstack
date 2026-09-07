import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL } from '../../data/config';

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2
                 bg-[#25D366] text-white rounded-full shadow-lg
                 px-4 py-3 md:px-5 md:py-3.5
                 hover:bg-[#1ebe5d] transition-all duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2
                 group"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle size={22} className="flex-shrink-0" />
      <span className="font-label-md text-label-md hidden sm:block">WhatsApp Us</span>
    </a>
  );
}
