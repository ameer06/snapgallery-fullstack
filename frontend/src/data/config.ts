// Central configuration — edit these values to update across the site

export const SITE_CONFIG = {
  companyName: 'Dental Forge Technologies',
  companyFullName: 'Dental Forge Technologies LLP',
  tagline: 'Precision Digital Dental Laboratory',
  description:
    'A digital-first CAD/CAM dental laboratory providing precision milled restorations, clear aligners, and digital workflows for dentists, clinics, and hospitals across India.',

  // Contact — update with real details
  phone: '+91 00000 00000',
  whatsapp: '+919000000000', // no spaces/dashes, used in wa.me link
  whatsappDisplay: '+91 90000 00000',
  email: 'cases@dentalforgetech.com',
  address: {
    line1: '[Address Line 1]',
    line2: '[City, State — PIN]',
    full: '[Address Line 1], [City], [State] — [PIN]',
  },

  // Business hours (IST)
  hours: [
    { day: 'Monday – Friday', time: '09:00 – 19:00 IST' },
    { day: 'Saturday', time: '10:00 – 15:00 IST' },
    { day: 'Sunday', time: 'Closed' },
  ],

  // Social / legal
  established: '2024',
  copyright: '© 2024 Dental Forge Technologies LLP. Precision Manufacturing for Modern Dentistry.',
};

export const WHATSAPP_URL = `https://wa.me/${SITE_CONFIG.whatsapp}?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20dental%20lab%20services.`;
