import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Download, ExternalLink, FileText, ArrowRight } from 'lucide-react';
import { Eyebrow } from '../components/site/Primitives';
import { Aurora, Reveal } from '../components/site/Backgrounds';

/**
 * The Layer Map — lead-magnet landing page.
 *
 * This URL is handed out from ManyChat, so it is optimised for that traffic:
 *  - Almost all of it is mobile, inside an in-app browser.
 *  - iOS Safari and most in-app browsers will NOT render a PDF inside an
 *    <iframe> (they show a blank box), so the embedded viewer is desktop-only
 *    and the Open/Download buttons are always the primary action.
 *  - Keep this route stable: /layer-map is pasted into campaigns.
 */

const PDF = '/the-layer-map.pdf';
const DOWNLOAD_NAME = 'The Layer Map - LayerSync.pdf';

const layers = [
  { n: 1, name: 'Asking', desc: 'A person, a chat window, and a copy button.' },
  { n: 2, name: 'Assisting', desc: 'AI moves into the tools where the work lives.' },
  { n: 3, name: 'Automating', desc: 'Work happens without a person starting it.' },
  { n: 4, name: 'Delegating', desc: 'You hand over outcomes instead of steps.' },
  { n: 5, name: 'Compounding', desc: 'The systems become the operating model.' },
];

export const LayerMap: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      {/* ===== HERO + PRIMARY ACTIONS ===== */}
      <section className="relative pt-32 md:pt-44 pb-12 md:pb-16 px-4 md:px-6 overflow-hidden">
        <Aurora accent="orange" />
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <Reveal>
            <Eyebrow><FileText className="w-3 h-3" /> A LayerSync field guide</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="hero-heading mb-6 text-shimmer">The Layer Map</h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="sub-heading mb-10 max-w-2xl mx-auto">
              What using AI actually looks like at each stage of a business, how to tell which stage
              you're on, and exactly what has to change to reach the next one.
            </p>
          </Reveal>

          {/* Primary actions — always visible, work on every device */}
          <Reveal delay={0.15}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href={PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow group w-full sm:w-auto px-10 py-4 md:py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs inline-flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black"
              >
                Read it now <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href={PDF}
                download={DOWNLOAD_NAME}
                className="group w-full sm:w-auto px-9 py-4 md:py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs inline-flex items-center justify-center gap-3 border border-black/15 dark:border-white/20 text-gray-700 dark:text-dark-text-secondary hover:border-black/40 dark:hover:border-white/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                Download PDF <Download className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-[10px] uppercase tracking-widest text-gray-400 dark:text-dark-text-tertiary font-bold">
              33 pages · Free · No email required
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== WHAT'S INSIDE ===== */}
      <section className="pb-12 md:pb-16 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="glass-card rounded-[28px] border border-black/5 dark:border-white/5 p-7 md:p-10">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-6">
                The five layers
              </div>
              <ol className="space-y-4">
                {layers.map((l) => (
                  <li key={l.n} className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-lg bg-brand-orange/12 text-brand-orange text-sm font-semibold flex items-center justify-center flex-shrink-0">
                      {l.n}
                    </span>
                    <div>
                      <span className="text-base md:text-lg font-light text-gray-900 dark:text-dark-text-primary">{l.name}</span>
                      <span className="block text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed mt-0.5">
                        {l.desc}
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                Includes a four-minute diagnostic to place your business on the map — and what
                specifically has to change to move up a layer.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== INLINE VIEWER (desktop only — mobile browsers can't render this) ===== */}
      <section className="hidden lg:block pb-20 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="rounded-[24px] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl bg-white">
              <object data={PDF} type="application/pdf" width="100%" height="820">
                {/* Fallback if the browser has no built-in PDF viewer */}
                <div className="p-10 text-center">
                  <p className="text-sm text-gray-600 mb-5">
                    Your browser can't display the PDF inline.
                  </p>
                  <a
                    href={PDF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-orange inline-flex items-center gap-2"
                  >
                    Open it in a new tab <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </object>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== WHO MADE THIS + WAY INTO THE SITE ===== */}
      <section className="pb-24 md:pb-32 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="glass-card rounded-[28px] border border-black/5 dark:border-white/5 p-8 md:p-12 text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-4">
                Who made this
              </div>
              <h2 className="text-2xl md:text-3xl font-light mb-5 text-gray-900 dark:text-dark-text-primary">
                We build the systems businesses run on.
              </h2>
              <p className="text-sm md:text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-xl mx-auto mb-9">
                LayerSync is an AI systems and software company in Harare. We build the custom
                platforms, data systems and automation that move a business up the layers — including
                SynCRM, our real-estate system of record.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Link
                  to="/"
                  className="btn-glow group w-full sm:w-auto px-9 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs inline-flex items-center justify-center gap-3 bg-black text-white dark:bg-white dark:text-black"
                >
                  Explore LayerSync <ArrowRight className="w-4 h-4 cta-arrow" />
                </Link>
                <Link
                  to="/contact"
                  className="group w-full sm:w-auto px-9 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[11px] md:text-xs inline-flex items-center justify-center gap-3 border border-black/15 dark:border-white/20 text-gray-700 dark:text-dark-text-secondary hover:border-black/40 dark:hover:border-white/50 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Book a diagnostic <ArrowRight className="w-4 h-4 cta-arrow" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
