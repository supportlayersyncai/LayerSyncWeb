import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Users } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader, ProofPlaceholder } from '../components/site/Primitives';

/**
 * About — the four partners and the rare combination behind LayerSync.
 * Partner names/bios are placeholders until Kev supplies the real details.
 */
export const About: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

  const partners = [
    'Partner 1 — name, role, and the operating experience they bring.',
    'Partner 2 — name, role, and what they own day-to-day.',
    'Partner 3 — name, role, the technical depth behind the builds.',
    'Partner 4 — name, role, and how they got here.',
  ];

  return (
    <div className={`relative z-20 ${dark ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
      {/* HERO */}
      <section className="relative pt-40 md:pt-56 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
        <div className="ambient-glow absolute top-[10%] left-[8%] w-[40vw] h-[40vw] blur-[150px] bg-brand-green/10 pointer-events-none" />
        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <Eyebrow><Users className="w-3 h-3" /> Who we are</Eyebrow>
          <h1 className="hero-heading mb-8 text-shimmer">
            Four partners who'd rather build the system than <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">sell you one.</span>
          </h1>
          <p className="sub-heading max-w-2xl mx-auto">
            LayerSync is a small team based in Harare, building software for businesses across
            Zimbabwe and the region. We're operators first — we've felt the spreadsheet-and-WhatsApp
            chaos ourselves, which is why we build the way we do.
          </p>
        </div>
      </section>

      {/* THE RARE COMBINATION */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            title={<>The rare <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">combination.</span></>}
          />
          <div className="mt-8 space-y-6 text-gray-600 dark:text-dark-text-secondary leading-relaxed text-base md:text-lg font-light">
            <p>
              Plenty of people can write code. Plenty understand business. Very few can sit with a
              brokerage owner, understand exactly why deals are slipping, and then go build the
              system that fixes it — and stand behind it once it's live.
            </p>
            <p>
              That's the combination LayerSync is built on: people who understand the operation and
              can build the software, in the same room. No translation layer between "the business
              people" and "the developers," because they're the same people.
            </p>
            <p>
              It's also why we start every engagement with a diagnostic instead of a pitch. We'd
              rather understand your problem properly than sell you a package that half-fits.
            </p>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
        <div className="ambient-glow absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader align="center" title={<>The <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">team.</span></>} />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {partners.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1 }}
              >
                <ProofPlaceholder note={`[TEAM — Kev to supply] ${p}`} className="h-full flex flex-col justify-center min-h-[220px]" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-32 px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 md:p-20 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center"
        >
          <h3 className="hero-heading mb-8 text-shimmer">Let's talk about your operation.</h3>
          <p className="sub-heading mb-12 max-w-2xl mx-auto">
            The best way to understand how we work is to put a real problem in front of us.
          </p>
          <CTAButton />
        </motion.div>
      </section>
    </div>
  );
};
