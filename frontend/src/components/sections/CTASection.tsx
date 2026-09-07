import { Link } from 'react-router-dom';
import { MessageCircle, ArrowRight } from 'lucide-react';
import { WHATSAPP_URL } from '../../data/config';

interface CTASectionProps {
  heading?: string;
  subheading?: string;
  primaryLabel?: string;
  primaryTo?: string;
  showWhatsApp?: boolean;
  dark?: boolean;
}

export default function CTASection({
  heading = 'Ready to Partner With a Precision Lab?',
  subheading = 'Submit your case digitally and experience micron-level accuracy with reliable turnaround times.',
  primaryLabel = 'Request a Quote',
  primaryTo = '/quote',
  showWhatsApp = true,
  dark = true,
}: CTASectionProps) {
  return (
    <section
      className={`py-margin-desktop relative overflow-hidden ${
        dark ? 'bg-surface-charcoal' : 'bg-surface-container-lowest border-t border-stroke-subtle'
      }`}
      aria-labelledby="cta-heading"
    >
      {/* Grid BG */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage:
            'linear-gradient(to right, #5af8fb 1px, transparent 1px), linear-gradient(to bottom, #5af8fb 1px, transparent 1px)',
        }}
      />

      <div className="section-container relative z-10 text-center">
        <p className="font-mono text-label-caps tracking-[0.08em] uppercase text-secondary-fixed mb-4">
          Partner With Us
        </p>
        <h2
          id="cta-heading"
          className={`text-headline-md md:text-display-lg-mobile font-bold mb-4 max-w-2xl mx-auto ${
            dark ? 'text-on-primary' : 'text-primary'
          }`}
        >
          {heading}
        </h2>
        <p
          className={`text-body-lg max-w-xl mx-auto mb-stack-lg ${
            dark ? 'text-surface-dim' : 'text-on-surface-variant'
          }`}
        >
          {subheading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={primaryTo}
            className="btn-primary px-8 py-4 inline-flex items-center gap-2"
          >
            {primaryLabel} <ArrowRight size={16} />
          </Link>
          {showWhatsApp && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-8 py-4 rounded font-label-md text-label-md border transition-all duration-300 ${
                dark
                  ? 'border-surface-tint text-secondary-fixed hover:border-secondary-fixed hover:bg-secondary-fixed/10'
                  : 'border-stroke-subtle text-secondary hover:border-secondary hover:bg-secondary/5'
              }`}
            >
              <MessageCircle size={16} /> WhatsApp Us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
