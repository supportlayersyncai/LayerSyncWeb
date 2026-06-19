import React from 'react';
import { Star, Quote } from 'lucide-react';

/**
 * Testimonial card.
 *
 * NOTE: the testimonials wired into the site today are PLACEHOLDER / mock copy
 * (e.g. Oasis Realty) added at the client's request to fill the design while
 * real, permissioned quotes are gathered. Replace `mockTestimonials` content
 * with verified quotes before treating these as real proof.
 */
export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  accent?: 'orange' | 'green';
  rating?: number;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export const TestimonialCard: React.FC<{ t: Testimonial; className?: string }> = ({ t, className = '' }) => {
  const accent = t.accent ?? 'orange';
  const ring = accent === 'orange' ? 'bg-brand-orange/15 text-brand-orange' : 'bg-brand-green/15 text-brand-green';
  return (
    <figure className={`glass-card card-hover-glow rounded-[28px] p-7 md:p-8 border border-black/5 dark:border-white/5 flex flex-col h-full ${className}`}>
      <Quote className="w-7 h-7 text-brand-orange/40 mb-4" />
      <div className="flex gap-0.5 mb-4" aria-label={`${t.rating ?? 5} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i < (t.rating ?? 5) ? 'fill-brand-orange text-brand-orange' : 'text-gray-300 dark:text-white/15'}`} />
        ))}
      </div>
      <blockquote className="text-sm md:text-base text-gray-700 dark:text-dark-text-secondary leading-relaxed flex-grow">
        “{t.quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-black/5 dark:border-white/5">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${ring}`}>
          {initials(t.name)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">{t.name}</div>
          <div className="text-xs text-gray-500 dark:text-dark-text-tertiary">{t.role}, {t.company}</div>
        </div>
      </figcaption>
    </figure>
  );
};

/** Shared placeholder/mock testimonials (replace with verified quotes). */
export const mockTestimonials: Record<string, Testimonial> = {
  oasis: {
    quote:
      'Before SynCRM our leads lived in five different WhatsApp accounts. Now every enquiry lands in one place and nothing slips through — for the first time I can see the whole pipeline.',
    name: 'Tariro Moyo',
    role: 'Managing Director',
    company: 'Oasis Realty',
    accent: 'orange',
  },
  principal: {
    quote:
      'I used to find out a deal had died in the Monday meeting. Now I can see a stalling deal days earlier and actually do something about it.',
    name: 'David Nkomo',
    role: 'Principal',
    company: 'Harare Property Group',
    accent: 'green',
  },
  agent: {
    quote:
      'Leads arrive with the full conversation already attached. I spend my time closing, not updating a spreadsheet on Friday afternoon.',
    name: 'Rumbidzai Chari',
    role: 'Sales Agent',
    company: 'Oasis Realty',
    accent: 'orange',
  },
  smb: {
    quote:
      "They didn't try to sell us a package. They sat with us, found exactly where we were bleeding hours, and built a system around that.",
    name: 'Kuda Sibanda',
    role: 'Operations Lead',
    company: 'Savanna Distribution',
    accent: 'green',
  },
};
