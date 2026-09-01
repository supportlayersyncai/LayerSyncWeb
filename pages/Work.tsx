import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { Briefcase, Check, ArrowRight, ExternalLink } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader } from '../components/site/Primitives';
import { FloatingOrbs, Reveal } from '../components/site/Backgrounds';
import { DeviceShowcase, type ShowcaseItem } from '../components/site/DeviceShowcase';

/**
 * Work — gallery personality. Centerpiece is the device showcase (the laptop
 * carousel from the web-design page, reused here to show the range of things
 * we build). Verified case studies are placeholders until supplied.
 */
export const Work: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  // Real, shipped product screens lead. Design concepts are labelled as such.
  const showcase: ShowcaseItem[] = [
    { title: 'SynCRM — pipeline dashboard', desc: 'Live lead pipeline, win rate and lead scoring', image: '/syncrm-dashboard.webp', tag: 'SynCRM', badge: 'Live product' },
    { title: 'SynCRM — agent performance', desc: 'Assigned, contacted, viewings and conversion by agent', image: '/syncrm-reports.webp', tag: 'SynCRM', badge: 'Live product' },
    { title: 'SynCRM Copilot', desc: 'Ask about your pipeline and act on leads in plain language', image: '/syncrm-copilot.webp', tag: 'SynCRM', badge: 'Live product' },
    { title: 'Energy dashboard', desc: 'Operations dashboard design', image: '/portfolio-1.webp', tag: 'Web', fit: 'object-left-top', badge: 'Concept' },
    { title: 'Customer portal', desc: 'Client-facing portal design', image: '/portfolio-3.webp', tag: 'Web', fit: 'object-center', badge: 'Concept' },
  ];

  /** Live, shipped platforms — verifiable, with public URLs. */
  const products = [
    {
      name: 'SynCRM',
      kind: 'Real-estate system of record',
      href: 'https://syncrm.vercel.app',
      accent: 'orange' as const,
      summary:
        'An operational platform that replaces the spreadsheet-and-messaging black box most sales teams run on.',
      built: [
        'Pipeline and Kanban deal tracking',
        'Lead scoring',
        'Automated listing ingestion from external portals',
        'Contact management',
        'Email campaigns',
        'AI copilot layer',
      ],
    },
    {
      name: 'KurimaSense',
      kind: 'Institutional data platform',
      href: 'https://kurima-sense.vercel.app',
      accent: 'green' as const,
      summary:
        'A multi-tenant B2B platform giving agricultural lenders, insurers and contractors a portfolio-level view of field-by-field risk.',
      built: [
        'Portfolio aggregation across many growers',
        'Daily attention-allocation dashboard',
        'Multi-tenant data model',
        'Season accumulation analytics',
        'Map-based portfolio view',
      ],
    },
  ];

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      {/* ===== HERO + SHOWCASE ===== */}
      <section className="relative pt-36 md:pt-52 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
        <FloatingOrbs accent="orange" />
        <div className="max-w-5xl mx-auto relative z-10 text-center mb-14 md:mb-20">
          <Reveal>
            <Eyebrow><Briefcase className="w-3 h-3" /> Selected work</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="hero-heading mb-8 text-shimmer">
              The systems we've <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">put into the world.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="sub-heading max-w-2xl mx-auto">
              We'd rather show you one real system that changed how a business runs than a wall of
              logos. SynCRM is our flagship, and it's live today — these are its actual screens.
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} y={32} className="max-w-5xl mx-auto relative z-10">
          <DeviceShowcase items={showcase} isDarkMode={dark} />
        </Reveal>
      </section>

      {/* ===== LIVE PLATFORMS — real, verifiable, public URLs ===== */}
      <section className="pb-16 md:pb-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            align="center"
            title={<>Live systems, <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">not slideware.</span></>}
            sub="Two platforms we designed, built and still operate. Both are running in production — you can open them."
            className="mb-14"
          />
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {products.map((p, i) => {
              const accentText = p.accent === 'orange' ? 'text-brand-orange' : 'text-brand-green';
              const accentTick = p.accent === 'orange' ? 'text-brand-orange' : 'text-brand-green';
              return (
                <Reveal key={p.name} delay={i * 0.1}>
                  <article className="glass-card card-hover-glow rounded-[32px] border border-black/5 dark:border-white/5 p-8 md:p-10 h-full flex flex-col">
                    <div className={`text-[10px] uppercase tracking-[0.3em] font-bold mb-4 ${accentText}`}>
                      {p.kind} · Live
                    </div>
                    <h3 className="text-2xl md:text-3xl font-light mb-4 text-gray-900 dark:text-dark-text-primary">{p.name}</h3>
                    <p className="text-sm md:text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed mb-7">
                      {p.summary}
                    </p>
                    <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-4">
                      What we built
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2.5 mb-8">
                      {p.built.map((f) => (
                        <div key={f} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-dark-text-secondary">
                          <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${accentTick}`} />
                          <span className="leading-snug">{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[11px] uppercase tracking-[0.2em] font-bold inline-flex items-center gap-2 group ${accentText}`}
                      >
                        Visit the live platform <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {p.name === 'SynCRM' && (
                        <Link to="/syncrm" className="text-[11px] uppercase tracking-[0.2em] font-bold text-gray-500 dark:text-dark-text-tertiary inline-flex items-center gap-2 group hover:text-brand-orange transition-colors">
                          Read more <ArrowRight className="w-4 h-4 cta-arrow" />
                        </Link>
                      )}
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CLIENT DELIVERY ===== */}
      <section className="pb-20 md:pb-28 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <article className="glass-card rounded-[32px] border border-black/5 dark:border-white/5 p-8 md:p-12 text-center">
              <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green mb-4">Client delivery · Across sectors</div>
              <h3 className="text-2xl md:text-3xl font-light mb-5 text-gray-900 dark:text-dark-text-primary">
                A growing book of bespoke systems
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-dark-text-secondary leading-relaxed max-w-2xl mx-auto mb-8">
                Alongside our own platforms we build for clients across real estate, professional
                services and events — booking and operations systems, AI chat and voice agents, web
                platforms and automation. Each one scoped, built and shipped the same end-to-end way.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {['Booking & operations systems', 'AI chat & voice agents', 'Web platforms', 'Process automation'].map((t) => (
                  <span key={t} className="text-xs rounded-full px-4 py-2 bg-black/[0.04] dark:bg-white/[0.05] text-gray-600 dark:text-dark-text-secondary border border-black/5 dark:border-white/5">
                    {t}
                  </span>
                ))}
              </div>
              <p className="mt-8 text-xs text-gray-400 dark:text-dark-text-tertiary">
                Named client case studies are published only with permission — ask us and we'll walk you through the detail.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-20 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center relative overflow-hidden"
        >
          <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-brand-green/10 pointer-events-none" />
          <div className="relative z-10">
            <h3 className="hero-heading mb-8 text-shimmer">Want to be the next one?</h3>
            <p className="sub-heading mb-12 max-w-2xl mx-auto">
              Start with a diagnostic. If we build something for you worth writing about, this is
              where it'll live.
            </p>
            <CTAButton />
          </div>
        </motion.div>
      </section>
    </div>
  );
};
