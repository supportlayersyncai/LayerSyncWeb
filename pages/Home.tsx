import React, { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { ScrollCanvas } from '../components/ScrollCanvas';
import { TextBeat } from '../components/TextBeat';
import {
    ArrowRight,
    Building2,
    Compass,
    Hammer,
    KeyRound,
    Clock,
    ShieldCheck,
    Eye,
    MapPin,
} from 'lucide-react';
import { CTAButton, GhostLink, Eyebrow, SectionHeader } from '../components/site/Primitives';

export const Home: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const scrollytellingRef = useRef<HTMLDivElement>(null);
    const safeDarkMode = isDarkMode ?? true;

    const { scrollYProgress: localScrollYProgress } = useScroll({
        target: scrollytellingRef,
        offset: ["start start", "end end"]
    });

    const indicatorOpacity = useTransform(localScrollYProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 0]);

    const howWeWork = [
        { icon: <Compass className="w-6 h-6" />, tag: 'Diagnose', desc: 'We start by understanding how your operation actually runs — and where it leaks time, money, or deals.' },
        { icon: <Hammer className="w-6 h-6" />, tag: 'Build', desc: 'We build a system that fits the way you work — not a template you have to bend your business around.' },
        { icon: <KeyRound className="w-6 h-6" />, tag: 'Own', desc: 'You own it. It runs on your infrastructure, your data stays yours, and your team can operate it.' },
    ];

    const why = [
        { icon: <Clock className="w-6 h-6" />, title: 'Operators, not an agency', desc: "We've run the businesses we build for. We know what spreadsheet-and-WhatsApp chaos actually costs.", color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
        { icon: <Eye className="w-6 h-6" />, title: 'We diagnose before we build', desc: "No packages. We understand the problem first, then build only what fixes it — or tell you a system won't.", color: 'text-brand-green', bg: 'bg-brand-green/10' },
        { icon: <KeyRound className="w-6 h-6" />, title: 'You own what we build', desc: 'Systems run in your environment, your data stays private, and you keep the keys. We support, we don\'t lock in.', color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
        { icon: <MapPin className="w-6 h-6" />, title: 'Built for how business works here', desc: 'WhatsApp-first, local realities, and the way Zimbabwean and regional businesses actually operate.', color: 'text-brand-green', bg: 'bg-brand-green/10' },
    ];

    return (
        <>
            {/* ===== HERO SCROLLYTELLING ===== */}
            <section ref={scrollytellingRef} className="relative h-[280vh] w-full z-10">
                <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                    <ScrollCanvas isDarkMode={safeDarkMode} scrollYProgress={localScrollYProgress} />

                    <TextBeat
                        firstBeat
                        title="We build the systems businesses *run on.*"
                        subtitle="LayerSync is a team of operators and engineers who build custom software for businesses that have outgrown spreadsheets and WhatsApp. We diagnose the problem, build the system, and hand it over."
                        scrollYProgress={localScrollYProgress}
                        range={[0, 0.22]}
                    />

                    <TextBeat
                        title="Our flagship is *SynCRM.*"
                        subtitle="The operating system for real estate agencies — every lead, agent, and deal in one place, so you can finally see your whole pipeline instead of guessing."
                        scrollYProgress={localScrollYProgress}
                        range={[0.26, 0.55]}
                    />

                    <TextBeat
                        title="Everything starts with a *diagnostic.*"
                        subtitle="A short, honest conversation about where your operation is losing time or money — and whether a system can fix it. If it can't, we'll tell you that too."
                        scrollYProgress={localScrollYProgress}
                        range={[0.6, 0.9]}
                    />

                    <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-gray-400 dark:text-dark-text-tertiary font-bold">Scroll to Explore</span>
                        <div className={`w-[1px] h-16 bg-gradient-to-b from-current opacity-30 to-transparent`} />
                    </motion.div>
                </div>
            </section>

            {/* ===== CONTENT ===== */}
            <div className={`relative z-20 transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>

                {/* ===== HOW WE WORK ===== */}
                <section className="relative py-20 md:py-32 px-4 md:px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        {/* Header: text LEFT, gorilla RIGHT */}
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-4 md:mb-8">
                            <motion.div
                                initial={{ opacity: 0, x: -40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-left"
                            >
                                <Eyebrow>How we work</Eyebrow>
                                <h2 className="hero-heading mb-6">Diagnose. Build. <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">Own.</span></h2>
                                <p className="sub-heading max-w-xl">Three steps, every time. No packages, no menu of services — just understanding the problem and building the thing that solves it.</p>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="flex justify-center md:justify-end"
                            >
                                <img
                                    src="/harambe-ai.webp"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    width="520"
                                    height="520"
                                    className="w-[280px] md:w-[420px] lg:w-[480px] animate-float drop-shadow-[0_0_40px_rgba(211,97,53,0.18)]"
                                />
                            </motion.div>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-10 md:mt-12">
                            {howWeWork.map((s, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    className="glass-card card-hover-glow rounded-[32px] p-8 md:p-10 border border-black/5 dark:border-white/5"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center mb-8">{s.icon}</div>
                                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 dark:text-dark-text-tertiary mb-3">Step {i + 1}</div>
                                    <h3 className="text-xl md:text-2xl font-light mb-4 text-gray-900 dark:text-dark-text-primary">{s.tag}</h3>
                                    <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">{s.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== SYNCRM FLAGSHIP TEASER ===== */}
                <section className="relative py-10 md:py-20 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <Link to="/syncrm" className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-card card-hover-glow rounded-[40px] md:rounded-[56px] p-8 md:p-16 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-500 relative overflow-hidden"
                            >
                                <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-orange rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
                                <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-14">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[24px] bg-brand-orange/15 text-brand-orange flex items-center justify-center flex-shrink-0">
                                        <Building2 className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] uppercase tracking-[0.3em] text-brand-orange font-bold mb-3">Flagship product</div>
                                        <h3 className="text-3xl md:text-5xl font-light mb-4 text-gray-900 dark:text-dark-text-primary group-hover:text-shimmer transition-all">SynCRM</h3>
                                        <p className="text-gray-600 dark:text-dark-text-secondary text-sm md:text-lg leading-relaxed max-w-2xl">
                                            The operating system for real estate agencies. Stop running blind — every lead, agent, and deal in one place, so you can see your whole pipeline.
                                        </p>
                                    </div>
                                    <div className="hidden lg:flex w-14 h-14 rounded-full border border-black/10 dark:border-white/10 items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-300 flex-shrink-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </section>

                {/* ===== WHAT WE BUILD TEASER ===== */}
                <section className="relative py-10 md:py-20 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6 md:gap-8">
                        <Link to="/what-we-build" className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="glass-card card-hover-glow rounded-[40px] p-8 md:p-12 border border-black/5 dark:border-white/5 h-full"
                            >
                                <Hammer className="w-8 h-8 text-brand-green mb-6" />
                                <h3 className="text-2xl md:text-3xl font-light mb-4 text-gray-900 dark:text-dark-text-primary group-hover:text-shimmer transition-all">What we build</h3>
                                <p className="text-gray-600 dark:text-dark-text-secondary text-sm md:text-base leading-relaxed mb-6">
                                    Custom operations systems, AI agents, dashboards, and software for businesses that have outgrown manual work and off-the-shelf tools.
                                </p>
                                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-green inline-flex items-center gap-2">Explore <ArrowRight className="w-4 h-4" /></span>
                            </motion.div>
                        </Link>
                        <Link to="/work" className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="glass-card card-hover-glow rounded-[40px] p-8 md:p-12 border border-black/5 dark:border-white/5 h-full"
                            >
                                <Eye className="w-8 h-8 text-brand-orange mb-6" />
                                <h3 className="text-2xl md:text-3xl font-light mb-4 text-gray-900 dark:text-dark-text-primary group-hover:text-shimmer transition-all">Our work</h3>
                                <p className="text-gray-600 dark:text-dark-text-secondary text-sm md:text-base leading-relaxed mb-6">
                                    The systems we've put into the world — real builds for real businesses, written up with the numbers we can stand behind.
                                </p>
                                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-orange inline-flex items-center gap-2">See the work <ArrowRight className="w-4 h-4" /></span>
                            </motion.div>
                        </Link>
                    </div>
                </section>

                {/* ===== WHY LAYERSYNC ===== */}
                <section className="py-20 md:py-32 px-4 md:px-6 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-20">
                            <motion.div
                                initial={{ opacity: 0, x: -60, scale: 0.9 }}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="flex justify-center md:justify-start order-2 md:order-1"
                            >
                                <img
                                    src="/lion-ai.webp"
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    width="520"
                                    height="520"
                                    className="w-[300px] md:w-[440px] lg:w-[500px] animate-float drop-shadow-[0_0_40px_rgba(127,176,105,0.15)]"
                                    style={{ animationDelay: '2s' }}
                                />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 40 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-right order-1 md:order-2"
                            >
                                <h2 className="hero-heading mb-6">Why *LayerSync*?</h2>
                                <p className="sub-heading max-w-xl ml-auto">We're a small team that builds software the way we'd want it built for our own business — honestly, and to last.</p>
                            </motion.div>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {why.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className="glass-card card-hover-glow rounded-[32px] p-8 md:p-10 border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8`}>{item.icon}</div>
                                    <h4 className="text-lg md:text-xl font-light mb-4 text-gray-900 dark:text-dark-text-primary">{item.title}</h4>
                                    <p className="text-gray-500 dark:text-dark-text-secondary leading-relaxed text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== REAL PRODUCT PROOF ===== */}
                <section className="py-16 md:py-28 px-4 md:px-6">
                    <div className="max-w-6xl mx-auto">
                        <SectionHeader
                            align="center"
                            title={<>Software we've actually <span className="italic font-extralight text-gray-400 dark:text-dark-text-secondary">shipped.</span></>}
                            sub="SynCRM is live and running today. This is the real dashboard, not a mockup."
                            className="mb-14"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 32 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <Link to="/syncrm" className="block group">
                                <div className="rounded-[24px] md:rounded-[32px] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl relative">
                                    <img
                                        src="/syncrm-dashboard.webp"
                                        alt="The SynCRM pipeline dashboard, showing total, open, won and lost leads with win rate and lead score distribution"
                                        loading="lazy"
                                        decoding="async"
                                        width="1800"
                                        height="1058"
                                        className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 bg-gradient-to-t from-black/85 to-transparent flex items-end justify-between gap-4">
                                        <div>
                                            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-green mb-1.5">Live product</div>
                                            <h3 className="text-lg md:text-2xl font-light text-white">SynCRM — pipeline dashboard</h3>
                                        </div>
                                        <span className="hidden sm:inline-flex text-[11px] uppercase tracking-[0.2em] font-bold text-white items-center gap-2 whitespace-nowrap">
                                            Explore SynCRM <ArrowRight className="w-4 h-4 cta-arrow" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* ===== FINAL CTA (with buffalo) ===== */}
                <section className="relative py-20 md:py-40 px-4 md:px-6 max-w-7xl mx-auto z-20">
                    {/* Buffalo peeking in beside the CTA */}
                    <img
                        src="/buffalo-ai.webp"
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="hidden xl:block absolute right-0 bottom-16 w-[260px] z-0 animate-float drop-shadow-[0_0_40px_rgba(127,176,105,0.18)] pointer-events-none"
                        style={{ animationDelay: '3s' }}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto p-10 md:p-24 lg:p-28 rounded-[40px] md:rounded-[64px] border border-black/5 dark:border-white/5 glass-card text-center relative z-10 overflow-hidden"
                    >
                        <div className="ambient-glow absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-brand-green/10 pointer-events-none" />
                        <div className="relative z-10">
                            <h3 className="hero-heading mb-8 md:mb-12 text-shimmer">Start with a diagnostic.</h3>
                            <p className="sub-heading mb-12 max-w-2xl mx-auto">Tell us where your operation is losing time or deals. We'll tell you — honestly — whether a system can fix it, and what we'd build.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <CTAButton />
                                <GhostLink to="/syncrm" label="In real estate? See SynCRM" />
                            </div>
                            <p className="mt-10 text-[10px] uppercase tracking-widest text-gray-400 dark:text-dark-text-tertiary font-bold">No commitment · We reply within one business day</p>
                        </div>
                    </motion.div>
                </section>

            </div>
        </>
    );
};
