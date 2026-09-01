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
    name: 'Tadiwa Chidzidzi',
    role: 'Sales, Business Development & Client Success',
    photo: '/team-tadiwa.webp',
    accent: 'orange',
    bio: [
      'Tadiwa owns the client relationship end to end. He is the person you meet first, the one who scopes the work with you, and the one still there after go-live — which is deliberate: the person who makes the commitments is the person accountable for them.',
    ],
    atLayerSync:
      'Tadiwa leads sales, business development and client success — your primary point of contact from first conversation through to a live system.',
  },
  {
    name: 'Kevin Chisango',
    role: 'Product Strategy, Brand & Solution Architecture',
    photo: '/team-kevin.webp',
    accent: 'green',
    bio: [
      'Kevin works on how the pieces fit — which modules a business actually needs, how they connect, and how the finished system is presented to the people who have to use it every day. Good architecture that nobody adopts is a failed project, so he treats both halves as the same problem.',
    ],
    atLayerSync:
      'Kevin leads product strategy, brand and solution architecture — shaping how our platforms fit together and how they land with your team.',
  },
  {
    name: 'Tinotenda Muchenje',
    role: 'Full-Stack Build, Automation & AI Workflows',
    photo: '/team-tino.webp',
    accent: 'orange',
    bio: [
      'Tino is a senior full-stack engineer with more than seven years designing and delivering enterprise software across financial services, insurance, healthcare and technology. His work spans the full lifecycle — solution architecture, backend, frontend, cloud infrastructure, systems integration and AI implementation.',
      'Before LayerSync he held senior engineering roles building production software for organisations in highly regulated environments. At Sybrin, one of Africa’s leading enterprise software companies, he delivered digital transformation systems for banks and insurers across multiple African markets. He has also shipped software across legal technology, fintech and AI startups.',
      'He specialises in practical AI for business — workflow automation, retrieval-augmented generation, intelligent document processing and enterprise AI assistants — and founded AI Community Zimbabwe, an initiative advancing AI knowledge and collaboration in Zimbabwe’s technology ecosystem.',
    ],
    experience: [
      { icon: <ShieldCheck className="w-4 h-4" />, text: 'KYC document management systems' },
      { icon: <FileText className="w-4 h-4" />, text: 'OCR-powered document intelligence' },
      { icon: <Landmark className="w-4 h-4" />, text: 'Core banking integrations' },
      { icon: <Cpu className="w-4 h-4" />, text: 'Insurance workflow automation' },
      { icon: <Cloud className="w-4 h-4" />, text: 'Financial reporting platforms' },
      { icon: <Mail className="w-4 h-4" />, text: 'Enterprise email orchestration' },
    ],
    atLayerSync:
      'Tino leads full-stack build, automation and AI workflows — the modules themselves and the intelligence layers that connect them.',
  },
  {
    name: 'Andre Dingiswayo',
    role: 'Engineering, Infrastructure & Reliability',
    photo: '/team-andre.webp',
    accent: 'green',
    bio: [
      'Andre is a senior engineer specialising in enterprise backend development, cloud infrastructure and production-grade financial systems. He has built software for banks, stockbrokers and insurance organisations across Southern Africa, and brings enterprise engineering practice into every LayerSync build.',
      'His systems run in live production environments where security, performance and reliability are non-negotiable. Beyond engineering, he has led projects end to end — from requirements gathering through implementation, deployment, client training and post-production support.',
    ],
    experience: [
      { icon: <Landmark className="w-4 h-4" />, text: 'Core banking API integrations' },
      { icon: <CreditCard className="w-4 h-4" />, text: 'Direct debit & payment processing' },
      { icon: <FileText className="w-4 h-4" />, text: 'Enterprise document management' },
      { icon: <Cpu className="w-4 h-4" />, text: 'Insurance workflow automation' },
      { icon: <Mail className="w-4 h-4" />, text: 'Enterprise email management' },
    ],
    stack: 'C#, .NET, Angular, TypeScript, SQL Server, AWS, REST APIs, enterprise systems integration',
    atLayerSync:
      'Andre leads engineering, infrastructure and reliability — the secure, resilient foundation every LayerSync system runs on.',
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
                LayerSync is two years old. The engineering team behind it is not. Our engineers
                carry over a decade each of production experience in regulated, business-critical
                environments — including core infrastructure inside Zimbabwean enterprise banking.
                That is the honest position we bring to every engagement.
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
