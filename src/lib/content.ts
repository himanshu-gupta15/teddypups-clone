import type { Faq, Testimonial } from './types';

export const faqs: Faq[] = [
  {
    id: 'faq-1',
    question: 'Are your puppies vaccinated and health-checked?',
    answer:
      'Yes. All our puppies come with a verified health certificate from licensed vets. Every puppy is vaccinated, dewormed, and thoroughly checked before joining your family.',
  },
  {
    id: 'faq-2',
    question: 'Can I meet a puppy before I decide?',
    answer:
      'Yes. Come meet our locally available puppies in our Downtown Dubai showroom and spend time bonding before making your decision.',
  },
  {
    id: 'faq-3',
    question: 'Can I take my puppy home the same day?',
    answer: 'Local puppies are available immediately, so you can take your puppy home the same day.',
  },
  {
    id: 'faq-4',
    question: 'Do you import puppies from abroad?',
    answer:
      'Yes. Through our Order Upon Request service we source rare and premium teacup breeds from the most reputable, certified breeders across Europe, Korea, and beyond — and we handle the import for you.',
  },
  {
    id: 'faq-5',
    question: 'How does an imported puppy travel to Dubai?',
    answer:
      'We manage every part of the import process, including health checks, travel arrangements, and the necessary documentation, so your puppy arrives happy, healthy, and stress-free.',
  },
  {
    id: 'faq-6',
    question: 'Will I see photos and health details first?',
    answer:
      'Yes. Photos, videos, and health certificates are shared before your puppy travels, and our team sends real photos and health details directly on WhatsApp.',
  },
  {
    id: 'faq-7',
    question: 'Do you deliver?',
    answer:
      'Yes. We deliver within Dubai, and our trusted international cargo partners deliver puppies safely to loving homes all around the world.',
  },
  {
    id: 'faq-8',
    question: 'Which breeds do you usually have?',
    answer:
      'Breeds we regularly have include Maltipoo, Pomeranian, Poodle and Bichon, plus rare teacup lines such as Korean teacup poodles, Maltese, Pom and Yorkie.',
  },
  {
    id: 'faq-9',
    question: 'Is there help after my puppy comes home?',
    answer:
      'Yes. Our team is available 24/7 and offers advice on training, nutrition, and general care to ensure a smooth transition for you and your new furry friend.',
  },
];

export const testimonial: Testimonial = {
  quote:
    'TeddyPups truly made our dream a reality. They supported us at every step of the import journey. Our Maltipoo arrived healthy, cheerful, and absolutely perfect. Having 24/7 support throughout the process gave us complete peace of mind.',
  author: 'Sarah M.',
  location: 'Dubai, UAE',
};

export type Journey = {
  key: 'local' | 'imported';
  label: string;
  hint: string;
  heading: string;
  body: string;
  note: string;
  steps: { title: string; text: string }[];
};

export const journeys: Journey[] = [
  {
    key: 'local',
    label: 'In Dubai',
    hint: 'meet in person',
    heading: 'Meet your puppy in person',
    body: "Step into our Downtown Dubai showroom and experience the joy of choosing your puppy face-to-face. We source healthy, well-socialized puppies from trusted local breeders, ensuring they're raised with care, proper nutrition, and veterinary checks.",
    note: '',
    steps: [
      {
        title: 'Explore our puppies',
        text: 'Browse our website to view the available puppies. Each listing includes photos, breed details, age, and health information.',
      },
      {
        title: 'Choose your puppy',
        text: 'Once you find a puppy you love, open their profile for more information or to enquire further. You can also reach out to us directly if you have any questions.',
      },
      {
        title: 'Meet before you choose',
        text: 'Spend time bonding before making your decision.',
      },
      {
        title: 'Pick-up or delivery',
        text: 'Pick up your puppy from us or have them delivered to your home within Dubai. Our delivery service is safe and reliable, ensuring your puppy arrives comfortably.',
      },
    ],
  },
  {
    key: 'imported',
    label: 'Imported',
    hint: 'order upon request',
    heading: 'Order upon request',
    body: "Looking for a truly exceptional companion? Our Order Upon Request service gives you access to some of the world's most sought-after teacup breeds — ethically sourced from the most reputable, certified breeders across Europe, Korea, and beyond.",
    note: "From Korean teacup poodles to rare Maltese, Pom, and Yorkie lines, we bring the world's finest puppies to Dubai, just for you.",
    steps: [
      {
        title: 'Reserve your puppy',
        text: 'Browse our selection of available breeds and place a reservation for the teacup puppy that captures your heart. Our reservation-only model ensures that each puppy is specifically sourced to meet your preferences.',
      },
      {
        title: 'Personalized consultation',
        text: "Once your reservation is confirmed, we will work closely with you to finalize details and provide updates on your puppy's journey.",
      },
      {
        title: 'Import and arrival',
        text: 'We manage all aspects of the import process, including health checks, travel arrangements, and necessary documentation. Your puppy will be carefully transported and will arrive ready to join your family.',
      },
      {
        title: 'Welcome home',
        text: 'Upon arrival, we provide support to help your new puppy acclimate to their new environment. Our team is available for any additional assistance and to ensure a smooth transition into your home.',
      },
    ],
  },
];
