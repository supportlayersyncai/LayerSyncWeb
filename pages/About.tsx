import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Users, Landmark, ShieldCheck, Cloud, Cpu, FileText, CreditCard, Mail } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader } from '../components/site/Primitives';
import { Aurora, Reveal } from '../components/site/Backgrounds';

/**
 * About — editorial/human personality.
 *
 * Team profiles are REAL, taken from the LayerSync proposal for Fine & Country
 * Zimbabwe (LS-FNC-2026-01). Do not embellish these — they are verifiable
 * career claims and prospects may check them.
 */

interface Person {
  name: string;
  role: string;
  initials: string;
  accent: 'orange' | 'green';
  bio: string[];
  experienceLabel: string;
  experience: { icon: React.ReactNode; text: string }[];
  stack?: string;
  atLayerSync: string;
}

const people: Person[] = [
  {
    name: 'Tinotenda Joel Muchenje',
    role: 'Senior Software Engineer · Enterprise Applications, AI & Solution Architecture',
    initials: 'TM',
    accent: 'orange',
    bio: [
      'Tino is a senior full-stack engineer with more than seven years designing and delivering enterprise software across financial services, insurance, healthcare and technology. His work spans the full lifecycle — solution architecture, backend, frontend, cloud infrastructure, systems integration and AI implementation.',
      'Before co-founding LayerSync he held senior engineering roles building production software for organisations in highly regulated environments. At Sybrin, one of Africa’s leading enterprise software companies, he delivered digital transformation systems for banks and insurers across multiple African markets. He has also shipped software across legal technology, fintech and AI startups.',
      'He specialises in practical AI for business — workflow automation, retrieval-augmented generation, intelligent document processing and enterprise AI assistants — and founded AI Community Zimbabwe, an initiative advancing AI knowledge and collaboration in Zimbabwe’s technology ecosystem.',
    ],
    experienceLabel: 'Systems delivered in production',
    experience: [
      { icon: <ShieldCheck className="w-4 h-4" />, text: 'KYC document management systems' },
      { icon: <FileText className="w-4 h-4" />, text: 'OCR-powered document intelligence' },
      { icon: <Landmark className="w-4 h-4" />, text: 'Core banking integrations' },
      { icon: <Cpu className="w-4 h-4" />, text: 'Insurance workflow automation' },
      { icon: <Cloud className="w-4 h-4" />, text: 'Financial reporting platforms' },
      { icon: <Mail className="w-4 h-4" />, text: 'Enterprise email orchestration' },
    ],
    atLayerSync:
      'Tino leads software architecture, full-stack engineering and AI implementation — making sure every platform is technically robust, scalable and built for long-term operation.',
  },
  {
    name: 'Andre Dingiswayo',
    role: 'Senior Software Engineer · Enterprise Systems, Backend Engineering & Cloud Infrastructure',
    initials: 'AD',
    accent: 'green',
    bio: [
      'Andre is a senior engineer specialising in enterprise backend development, cloud infrastructure and production-grade financial systems. He has built software for banks, stockbrokers and insurance organisations across Southern Africa, and brings enterprise engineering practice into every LayerSync build.',
      'His systems run in live production environments where security, performance and reliability are non-negotiable. Beyond engineering, he has led projects end to end — from requirements gathering through implementation, deployment, client training and post-production support.',
    ],
    experienceLabel: 'Systems delivered in production',
    experience: [
      { icon: <Landmark className="w-4 h-4" />, text: 'Core banking API integrations' },
      { icon: <CreditCard className="w-4 h-4" />, text: 'Direct debit & payment processing' },
      { icon: <FileText className="w-4 h-4" />, text: 'Enterprise document management' },
      { icon: <Cpu className="w-4 h-4" />, text: 'Insurance workflow automation' },
      { icon: <Mail className="w-4 h-4" />, text: 'Enterprise email management' },
    ],
    stack: 'C#, .NET, Angular, TypeScript, SQL Server, AWS, REST APIs, enterprise systems integration',
    atLayerSync:
      'Andre leads backend engineering, cloud infrastructure, enterprise integrations and production reliability — the secure, resilient foundation under every LayerSync system.',
  },
];

const PersonCard: React.FC<{ p: Person }> = ({ p }) => {
  const ring =
    p.accent === 'orange'
      ? 'bg-brand-orange/12 text-brand-orange border-brand-orange/25'
      : 'bg-brand-green/12 text-brand-green border-brand-green/25';
  const chip =
    p.accent === 'orange'
      ? 'text-brand-orange bg-brand-orange/8'
      : 'text-brand-green bg-brand-green/8';

  return (
    <article className="glass-card rounded-[32px] border border-black/5 dark:border-white/5 p-8 md:p-12 h-full">
      <header className="flex items-start gap-5 mb-8">
        <div className={`w-16 h-16 md:w-[72px] md:h-[72px] rounded-2xl border flex items-center justify-center text-lg font-semibold flex-shrink-0 ${ring}`}>
          {p.initials}
        </div>
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-dark-text-primary leading-snug">
            {p.name}
          </h3>
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-bold text-gray-500 dark:text-dark-text-tertiary mt-2 leading-relaxed">
            {p.role}
          </p>
        </div>
      </header>

      <div className="space-y-4 mb-8">
        {p.bio.map((para, i) => (
          <p key={i} className="text-sm md:text-[15px] text-gray-600 dark:text-dark-text-secondary leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      <div className="mb-8">
        <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-4">
          {p.experienceLabel}
        </div>
        <ul className="grid sm:grid-cols-2 gap-2.5">
          {p.experience.map((e, i) => (
            <li
              key={i}
              className={`flex items-center gap-2.5 text-xs md:text-[13px] rounded-xl px-3 py-2.5 ${chip}`}
            >
              <span className="flex-shrink-0">{e.icon}</span>
              <span className="text-gray-700 dark:text-dark-text-secondary leading-snug">{e.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {p.stack && (
        <div className="mb-8">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-3">
            Technical stack
          </div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{p.stack}</p>
        </div>
      )}

      <div className="pt-6 border-t border-black/5 dark:border-white/5">
        <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-3">
          At LayerSync
        </div>
        <p className="text-sm md:text-[15px] text-gray-700 dark:text-dark-text-secondary leading-relaxed">
          {p.atLayerSync}
        </p>
      </div>
    </article>
  );
};

export const About: React.FC = () => {
  const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
  const dark = isDarkMode ?? true;

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
                Young company. <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">Experienced builders.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sub-heading max-w-xl">
                LayerSync is two years old. The engineering team behind it is not. Between them, our
                engineers carry over a decade each of production experience in regulated,
                business-critical environments — including core infrastructure inside Zimbabwean
                enterprise banking. That is the honest position we bring to every engagement.
              </p>
            </Reveal>
          </div>
          {/* Mascot collage */}
          <Reveal delay={0.15} className="relative h-[300px] md:h-[380px]">
            <img src="/lion-ai.webp" alt="" loading="lazy" className="absolute left-0 bottom-0 w-[58%] animate-float drop-shadow-[0_0_40px_rgba(211,97,53,0.18)]" />
            <img src="/buffalo-ai.webp" alt="" loading="lazy" className="absolute right-0 top-2 w-[52%] animate-float drop-shadow-[0_0_40px_rgba(127,176,105,0.18)]" style={{ animationDelay: '2.5s' }} />
            <img src="/harambe-ai.webp" alt="" loading="lazy" className="absolute right-[20%] bottom-[-4%] w-[40%] animate-float drop-shadow-[0_0_30px_rgba(211,97,53,0.15)]" style={{ animationDelay: '4s' }} />
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

      {/* TECHNICAL LEADERSHIP */}
      <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
        <div className="ambient-glow absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            align="center"
            title={<>Technical <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">leadership.</span></>}
            sub="The engineers who design, build and support what we deliver — the same people you meet on day one and the same people who are there after go-live."
            className="mb-14"
          />
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {people.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.1}>
                <PersonCard p={p} />
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
