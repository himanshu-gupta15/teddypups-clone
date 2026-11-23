/** Business details. The WhatsApp number is a placeholder: set NEXT_PUBLIC_WHATSAPP_NUMBER to change it. */
const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '971500000000';
const greeting = "Hi TeddyPups! I'd love to know more about your puppies.";

export const site = {
  name: 'TeddyPups U.A.E.',
  shortName: 'TeddyPups',
  tagline: 'every puppy is family',
  description:
    'Teddy bear and teacup puppies in Dubai. Meet local puppies in our Downtown Dubai showroom or bring home a rare breed imported from trusted breeders.',
  phoneDisplay: '+971 50 000 0000',
  phoneHref: 'tel:+971500000000',
  email: 'info@instabizweb.com',
  address: 'Downtown Dubai, United Arab Emirates',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=Downtown+Dubai',
  whatsappHref: `https://wa.me/${phone}?text=${encodeURIComponent(greeting)}`,
  greeting,
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
  ],
  success: {
    heading: 'Message received!',
    body: 'Thank you — our team will get back to you promptly. For the quickest reply, message us on WhatsApp.',
  },
};

export const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/puppies', label: 'Puppies' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
];

export const footerLinks = [
  { href: '/puppies', label: 'Available puppies' },
  { href: '/gone-home', label: 'Gone home' },
  { href: '/happy-families', label: 'Happy families' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/how-it-works#delivery', label: 'Delivery & collection' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Visit & contact' },
];
