// ---------------------------------------------------------------------------
// Centralised funnel data. Hard-coded for now (copied from the original HTML).
// When the backend is ready, replace these with API responses — components only
// read from this module and from the shared booking state held in App.jsx.
// ---------------------------------------------------------------------------

export const navSteps = [
  { id: 'page1', label: 'Landing' },
  { id: 'page2', label: 'Booking' },
  { id: 'page3', label: 'Payment' },
];

export const heroStats = [
  { num: '500+', label: 'Videos Made' },
  { num: '4.9★', label: 'Client Rating' },
  { num: '48hr', label: 'Delivery' },
];

// Carousel testimonials. `avatars` are the two faces that peek over the card top;
// swap these URLs (and add a real `video` link) when the backend is ready.
export const testimonials = [
  { name: 'Father & Daughter', designation: 'Birthday Special',     avatars: ['/v1.jpeg', '/v1.1.jpeg'], videoId: '1203095740' },
  { name: 'Husband & Wife',    designation: 'Birthday Celebration', avatars: ['/v2.jpeg', '/v2.1.jpeg'], videoId: '1203096555' },
  { name: 'Father & Daughter', designation: 'Birthday Celebration', avatars: ['/v3.jpeg', '/v3.1.jpeg'], videoId: '1203096556' },
  { name: 'Husband & Wife',    designation: 'Anniversary Video',    avatars: ['/v4.jpeg', '/v4.1.jpeg'], videoId: '1203096557' },
  { name: 'Husband & Wife',    designation: 'Surprise Gift',        avatars: ['/v5.jpeg', '/v5.1.jpeg'], videoId: '1203098940' },
];

// Shown if an avatar image fails to load (neutral grey silhouette).
export const AVATAR_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23c8c8c8'/%3E%3Ccircle cx='50' cy='38' r='18' fill='%239a9a9a'/%3E%3Cpath d='M18 88c0-18 14-30 32-30s32 12 32 30z' fill='%239a9a9a'/%3E%3C/svg%3E";

// Card width (300) + gap (20) — used to compute carousel dot index from scroll.
export const CARD_STRIDE = 320;

// Video type chips (Booking page)
export const videoTypes = ['🎂 Birthday', '💍 Wedding', '❤️ Anniversary', '✨ Other'];

// Duration options + slider positions; price flows into Payment & Confirm.
export const durations = [
  { label: '30 Sec', short: '30s', long: '30 Seconds', original: '₹2,499', discount: '− ₹500',   saved: '− ₹500 saved',   final: '₹1,999' },
  { label: '1 Min',  short: '1m',  long: '1 Minute',   original: '₹4,999', discount: '− ₹1,000', saved: '− ₹1,000 saved', final: '₹3,999' },
  { label: '2 Min',  short: '2m',  long: '2 Minutes',  original: '₹5,999', discount: '− ₹1,000', saved: '− ₹1,000 saved', final: '₹4,999' },
  { label: '3 Min',  short: '3m',  long: '3 Minutes',  original: '₹7,999', discount: '− ₹1,000', saved: '− ₹1,000 saved', final: '₹6,999' },
];
export const sliderPositions = [0, 33, 66, 100];

// Payment methods (Payment page)
export const paymentMethods = [
  { icon: '📱', name: 'UPI Payment',         desc: 'GPay, PhonePe, Paytm, BHIM' },
  { icon: '💳', name: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
  { icon: '🏦', name: 'Net Banking',         desc: 'All major banks supported' },
  { icon: '👜', name: 'Wallets',             desc: 'Amazon Pay, Mobikwik' },
];

// Confirmation journey steps
export const journeySteps = [
  { icon: '✅', label: 'Booking Confirmed', state: 'done' },
  { icon: '🎬', label: 'Editing Started',   state: 'current' },
  { icon: '🔍', label: 'Quality Check',     state: '' },
  { icon: '🚀', label: 'Delivered',         state: '' },
];

export const bookingId = '#TTS-2024-0847';

// Merchant UPI details the customer pays to (replace with your real VPA later).
export const merchantUpiId = 'vasanthvijayg14@okaxis';
export const merchantName = 'TIME TO SHOOT';

// WhatsApp number that receives booking details when the customer taps Pay.
// Use country code + number, DIGITS ONLY (no +, spaces or dashes).
// e.g. India: '919876543210'.  A wa.me/message/... link will NOT work here —
// WhatsApp needs a plain number to pre-fill the message.
// (Resolved from the wa.me/message/PB6XEXRKZL7BH1 link.)
export const whatsappNumber = '917448326503';
