import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Users, Landmark, ShieldCheck, Cloud, Cpu, FileText, CreditCard, Mail } from 'lucide-react';
import { CTAButton, Eyebrow, SectionHeader } from '../components/site/Primitives';
import { Aurora, Reveal } from '../components/site/Backgrounds';

/**
 * About — editorial/human personality.
 *
 * Team profiles are REAL. Sources:
 *   - Roles + photos: LayerSync proposal for Stonebridge Real Estate (Aug 2026)
 *   - Detailed engineering backgrounds (Tino, Andre): LayerSync proposal for
 *     Fine & Country Zimbabwe (LS-FNC-2026-01)
 *
 * Do not embellish these — they are verifiable career claims and prospects may
 * check them. Tadiwa and Kevin have shorter cards because the source documents
 * give role scope only; add depth when they supply fuller bios.
 */

interface Person {
  name: string;
  role: string;
  photo: string;
  accent: 'orange' | 'green';
  bio: string[];
  experience?: { icon: React.ReactNode; text: string }[];
  stack?: string;
  atLayerSync: string;
}

const people: Person[] = [
  {
    name: 'Kevin Chisango',
    role: 'Founder & CEO · Product & Architecture',
    photo: '/team-kevin.webp',
    accent: 'orange',
    bio: [
      'Kevin sets product and technical direction, and architects the systems the company builds — data models, multi-tenant platforms and AI systems, end to end.',
      'He has a track record of shipped, live products, including KurimaSense (institutional agricultural-risk intelligence) and SynCRM (a real-estate system of record). His background spans systems engineering, product and strategy.',
    ],
    atLayerSync:
      'Kevin owns the vision and the technical foundation — the architecture underneath every platform we ship.',
  },
  {
    name: 'Tadiwa Gerald Chidzidzi',
    role: 'Co-Founder & Chief Operating Officer',
    photo: '/team-tadiwa.webp',
    accent: 'green',
    bio: [
      'Tadiwa runs the company day to day — operations, delivery management and client relationships — turning build capability into a functioning, reliable business.',
      'He is the person who makes sure scoped work ships on time and that the engine keeps running while the team builds. In practice he is also your primary point of contact, from first conversation through to go-live.',
    ],
    atLayerSync:
      'Tadiwa is the operator who makes delivery real — accountable for the commitments we make to you.',
  },
  {
    name: 'Andre Dingiswayo',
    role: 'Co-Founder & Lead Engineer',
    photo: '/team-andre.webp',
    accent: 'green',
    bio: [
      'Andre is a full-stack engineer with four-plus years building and deploying production fintech systems for major banks, stockbrokers and insurers across Southern Africa.',
      'At Sybrin he led development of core banking API integrations, document-management systems used by leading financial institutions, and payment-automation modules. He has delivered systems end to end — from requirements through to post-deployment support — and brings the discipline that financial-institution software demands.',
    ],
    experience: [
      { icon: <Landmark className="w-4 h-4" />, text: 'Core banking API integrations' },
      { icon: <CreditCard className="w-4 h-4" />, text: 'Payment-automation modules' },
      { icon: <FileText className="w-4 h-4" />, text: 'Enterprise document management' },
      { icon: <ShieldCheck className="w-4 h-4" />, text: 'Production fintech systems' },
    ],
    stack: 'C#/.NET Core, Angular, TypeScript, AWS',
    atLayerSync:
      'Andre brings enterprise-grade engineering rigour — the secure, resilient foundation every LayerSync system runs on.',
  },
  {
    name: 'Tino Muchenje',
    role: 'Co-Founder & Full-Stack Engineer',
    photo: '/team-tino.webp',
    accent: 'orange',
    bio: [
      'Tino builds across the stack and specialises in AI workflow automation — a prize-winner at an n8n automation hackathon, and fast at turning an idea into a working system.',
      'He is the team’s edge in connecting AI and automation tooling into real, shipped product: workflow automation, retrieval-augmented generation, intelligent document processing and AI assistants that do actual work inside a business.',
    ],
    experience: [
      { icon: <Cpu className="w-4 h-4" />, text: 'AI workflow automation' },
      { icon: <FileText className="w-4 h-4" />, text: 'Intelligent document processing' },
      { icon: <Cloud className="w-4 h-4" />, text: 'Retrieval-augmented generation' },
      { icon: <Mail className="w-4 h-4" />, text: 'AI assistants & copilots' },
    ],
    atLayerSync:
      'Tino builds full-stack and wires in the AI and automation layers that connect the whole system together.',
  },
];

const PersonCard: React.FC<{ p: Person }> = ({ p }) => {
  const chip =
    p.accent === 'orange'
      ? 'text-brand-orange bg-brand-orange/8'
      : 'text-brand-green bg-brand-green/8';
  const ring = p.accent === 'orange' ? 'ring-brand-orange/30' : 'ring-brand-green/30';

  return (
    <article className="glass-card rounded-[32px] border border-black/5 dark:border-white/5 p-8 md:p-10 h-full flex flex-col">
      <header className="flex items-center gap-5 mb-7">
        <img
          src={p.photo}
          alt={`${p.name}, ${p.role}, LayerSync founding partner`}
          loading="lazy"
          decoding="async"
          width="300"
          height="300"
          className={`w-[76px] h-[76px] md:w-20 md:h-20 rounded-2xl object-cover flex-shrink-0 ring-2 ${ring}`}
        />
        <div className="min-w-0">
          <h3 className="text-xl md:text-2xl font-light text-gray-900 dark:text-dark-text-primary leading-snug">
            {p.name}
          </h3>
          <p className="text-[10px] md:text-[11px] uppercase tracking-[0.18em] font-bold text-gray-500 dark:text-dark-text-tertiary mt-2 leading-relaxed">
            {p.role}
          </p>
        </div>
      </header>

      <div className="space-y-4 mb-7">
        {p.bio.map((para, i) => (
          <p key={i} className="text-sm md:text-[15px] text-gray-600 dark:text-dark-text-secondary leading-relaxed">
            {para}
          </p>
        ))}
      </div>

      {p.experience && (
        <div className="mb-7">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-4">
            Systems delivered in production
          </div>
          <ul className="grid sm:grid-cols-2 gap-2.5">
            {p.experience.map((e, i) => (
              <li key={i} className={`flex items-center gap-2.5 text-xs md:text-[13px] rounded-xl px-3 py-2.5 ${chip}`}>
                <span className="flex-shrink-0">{e.icon}</span>
                <span className="text-gray-700 dark:text-dark-text-secondary leading-snug">{e.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {p.stack && (
        <div className="mb-7">
          <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-3">
            Technical stack
          </div>
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{p.stack}</p>
        </div>
      )}

      <div className="pt-6 mt-auto border-t border-black/5 dark:border-white/5">
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
                LayerSync was founded in 2024 in Harare. The company is young; the engineering
                behind it is not. Between them our engineers carry over a decade of production
                experience in regulated, business-critical environments — including core banking
                infrastructure used by leading financial institutions. That is the honest position
                we bring to every engagement.
              </p>
            </Reveal>
          </div>
          {/* Founder photo cluster */}
          <Reveal delay={0.15}>
            <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-sm mx-auto lg:ml-auto lg:mr-0">
              {people.map((p, i) => (
                <img
                  key={p.name}
                  src={p.photo}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width="300"
                  height="300"
                  className="w-full aspect-square object-cover rounded-2xl md:rounded-[20px] animate-float"
                  style={{ animationDelay: `${i * 1.3}s`, animationDuration: '9s' }}
                />
              ))}
            </div>
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

      {/* FOUNDING PARTNERS */}
      <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
        <div className="ambient-glow absolute bottom-[5%] right-[5%] w-[40vw] h-[40vw] blur-[150px] bg-brand-orange/10 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            align="center"
            title={<>Four founding <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">partners.</span></>}
            sub="Each owns a distinct part of delivery — and every one of them is someone you'll actually deal with. The people who make the commitments are the people accountable for them."
            className="mb-14"
          />
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {people.map((p, i) => (
              <Reveal key={p.name} delay={(i % 2) * 0.1}>
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
