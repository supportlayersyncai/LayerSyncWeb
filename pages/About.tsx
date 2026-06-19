import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Users } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader, ProofPlaceholder } from '../components/site/Primitives';
import { Aurora, Reveal } from '../components/site/Backgrounds';

/**
 * About — editorial/human personality. Asymmetric hero with the brand mascots,
 * larger type, warmer feel. Partner names/bios are placeholders until supplied.
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
      {/* HERO — asymmetric editorial */}
      <section className="relative pt-36 md:pt-52 pb-16 md:pb-24 px-4 md:px-6 overflow-hidden">
        <Aurora accent="orange" />
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <Reveal><Eyebrow><Users className="w-3 h-3" /> Who we are</Eyebrow></Reveal>
            <Reveal delay={0.05}>
              <h1 className="hero-heading mb-8 text-shimmer">
                Four partners who'd rather build the system than <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">sell you one.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sub-heading max-w-xl">
                LayerSync is a small team based in Harare, building software for businesses across
                Zimbabwe and the region. We're operators first — we've felt the
                spreadsheet-and-WhatsApp chaos ourselves, which is why we build the way we do.
              </p>
            </Reveal>
          </div>
          {/* Mascot collage */}
          <Reveal delay={0.15} className="relative h-[300px] md:h-[380px]">
            <img src="/lion-ai.png" alt="" loading="lazy" className="absolute left-0 bottom-0 w-[58%] animate-float drop-shadow-[0_0_40px_rgba(211,97,53,0.18)]" />
            <img src="/buffalo-ai.png" alt="" loading="lazy" className="absolute right-0 top-2 w-[52%] animate-float drop-shadow-[0_0_40px_rgba(127,176,105,0.18)]" style={{ animationDelay: '2.5s' }} />
            <img src="/harambe-ai.png" alt="" loading="lazy" className="absolute right-[20%] bottom-[-4%] w-[40%] animate-float drop-shadow-[0_0_30px_rgba(211,97,53,0.15)]" style={{ animationDelay: '4s' }} />
          </Reveal>
        </div>
      </section>

      {/* THE RARE COMBINATION */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title={<>The rare <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">combination.</span></>} />
          <div className="mt-8 space-y-6 text-gray-600 dark:text-dark-text-secondary leading-relaxed text-base md:text-lg font-light">
            <Reveal>
              <p>
                Plenty of people can write code. Plenty understand business. Very few can sit with a
                brokerage owner, understand exactly why deals are slipping, and then go build the
                system that fixes it — and stand behind it once it's live.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                That's the combination LayerSync is built on: people who understand the operation and
                can build the software, in the same room. No translation layer between "the business
                people" and "the developers," because they're the same people.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                It's also why we start every engagement with a diagnostic instead of a pitch. We'd
                rather understand your problem properly than sell you a package that half-fits.
              </p>
            </Reveal>
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
              <Reveal key={i} delay={(i % 4) * 0.08}>
                <ProofPlaceholder note={`[TEAM — Kev to supply] ${p}`} className="h-full flex flex-col justify-center min-h-[220px]" />
              </Reveal>
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
