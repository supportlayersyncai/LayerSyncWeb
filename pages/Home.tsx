import React, { useRef } from 'react';
import { useScroll, motion, useTransform } from 'framer-motion';
import { useOutletContext, Link } from 'react-router-dom';
import { ScrollCanvas } from '../components/ScrollCanvas';
import { TextBeat } from '../components/TextBeat';
import { ROITable } from '../components/home/ROITable';
import { Pricing } from '../components/home/Pricing';
import { FAQ } from '../components/home/FAQ';
import {
    ArrowRight,
    Building2,
    Cpu,
    Globe,
    Sparkles,
    Zap,
    Shield,
    TrendingUp
} from 'lucide-react';

export const Home: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const scrollytellingRef = useRef<HTMLDivElement>(null);

    const safeDarkMode = isDarkMode ?? true;
    const borderSubtle = safeDarkMode ? "border-white/5" : "border-black/5";

    const { scrollYProgress: localScrollYProgress } = useScroll({
        target: scrollytellingRef,
        offset: ["start start", "end end"]
    });

    const indicatorOpacity = useTransform(localScrollYProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 0]);

    const solutions = [
        {
            title: "Real Estate AI",
            subtitle: "Virtual Staging • Lead Qualification • CRM Sync",
            desc: "Transform empty listings into furnished dream homes. Qualify leads 24/7 on WhatsApp. Close faster.",
            href: "/solutions/real-estate",
            gradient: "from-purple-600 to-pink-600",
            glowColor: "purple",
            icon: <Building2 className="w-7 h-7" />,
            stats: [
                { value: "98%", label: "Cost Reduction" },
                { value: "40%", label: "Faster Sales" },
                { value: "24/7", label: "Lead Capture" }
            ]
        },
        {
            title: "SMB Automation",
            subtitle: "Workflow Agents • ROI Recovery • Zero-Code",
            desc: "Identify and eliminate manual bottlenecks. Our AI agents handle admin, invoicing, and scheduling autonomously.",
            href: "/solutions/smb",
            gradient: "from-blue-600 to-cyan-600",
            glowColor: "blue",
            icon: <Cpu className="w-7 h-7" />,
            stats: [
                { value: "$65K+", label: "Annual Savings" },
                { value: "48hr", label: "Deployment" },
                { value: "5000+", label: "App Integrations" }
            ]
        },
        {
            title: "Web Development",
            subtitle: "Immersive Portals • 3D Experiences • Conversion",
            desc: "We engineer premium digital platforms that don't just look stunning — they convert visitors into customers.",
            href: "/solutions/web-dev",
            gradient: "from-cyan-600 to-emerald-600",
            glowColor: "cyan",
            icon: <Globe className="w-7 h-7" />,
            stats: [
                { value: "3x", label: "Conversion Rate" },
                { value: "100%", label: "Responsive" },
                { value: "A+", label: "Performance" }
            ]
        }
    ];

    return (
        <>
            {/* Hero Scrollytelling */}
            <section ref={scrollytellingRef} className="relative h-[400vh] w-full z-10">
                <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                    <ScrollCanvas isDarkMode={safeDarkMode} scrollYProgress={localScrollYProgress} />

                    <TextBeat
                        title="Synchronized *Intelligence*"
                        subtitle="We layer AI into your business operations — automating what's manual, scaling what's human, and building what's next."
                        scrollYProgress={localScrollYProgress}
                        range={[0, 0.2]}
                    />

                    <TextBeat
                        title="95% Cost *Savings*"
                        subtitle="Virtual staging for $2 instead of $500. Listing copy for $5 instead of $50. Enterprise-grade AI at startup prices."
                        scrollYProgress={localScrollYProgress}
                        range={[0.25, 0.45]}
                    />

                    <TextBeat
                        title="24/7 *Growth*"
                        subtitle="Capture leads while you sleep. Our AI agents qualify prospects, book meetings, and sync with your CRM — automatically."
                        scrollYProgress={localScrollYProgress}
                        range={[0.5, 0.7]}
                    />

                    <TextBeat
                        title="Systematic *Sync*"
                        subtitle="Three verticals. One partner. We architect custom AI ecosystems that layer perfectly over your existing stack."
                        scrollYProgress={localScrollYProgress}
                        range={[0.75, 0.95]}
                    />

                    <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5">
                        <span className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-bold">Scroll to Explore</span>
                        <div className={`w-[1px] h-16 bg-gradient-to-b from-current opacity-30 to-transparent`} />
                    </motion.div>
                </div>
            </section>

            {/* Content */}
            <div className={`relative z-20 transition-colors duration-700 ${safeDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>

                {/* ===== SOLUTIONS HUB ===== */}
                <section id="services" className="relative py-20 md:py-40 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Section Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-6"
                        >
                            <div className="inline-flex items-center gap-2 mb-8 py-2 px-6 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] font-bold text-white/40">
                                <Sparkles className="w-3 h-3" /> Our Solutions
                            </div>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="hero-heading text-center mb-6 text-shimmer"
                        >
                            Three Verticals. <br className="hidden md:block" />One *Partner*.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="sub-heading text-center max-w-2xl mx-auto mb-20 md:mb-32"
                        >
                            Choose the transformation that fits your business. Each solution is a complete AI ecosystem, built to scale.
                        </motion.p>

                        {/* Solution Cards */}
                        <div className="grid gap-8 md:gap-10">
                            {solutions.map((s, i) => (
                                <Link key={i} to={s.href} className="block group cursor-pointer">
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.15, duration: 0.6 }}
                                        className={`glass-card card-hover-glow rounded-[32px] md:rounded-[48px] p-8 md:p-14 border ${borderSubtle} hover:border-white/10 transition-all duration-500 relative overflow-hidden`}
                                    >
                                        {/* Background Gradient Glow */}
                                        <div className={`absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br ${s.gradient} rounded-full blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none`} />

                                        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-14">
                                            {/* Icon */}
                                            <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[24px] bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500 animate-float`}
                                                style={{ animationDelay: `${i * 0.5}s` }}>
                                                {s.icon}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold mb-3">{s.subtitle}</div>
                                                <h3 className="text-2xl md:text-4xl font-light mb-4 text-white group-hover:text-shimmer transition-all">{s.title}</h3>
                                                <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl">{s.desc}</p>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex lg:flex-col gap-6 lg:gap-4 flex-shrink-0">
                                                {s.stats.map((stat, j) => (
                                                    <div key={j} className="text-center lg:text-right">
                                                        <div className={`text-xl md:text-2xl font-light bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{stat.value}</div>
                                                        <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Arrow */}
                                            <div className="hidden lg:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300 flex-shrink-0">
                                                <ArrowRight className="w-5 h-5 opacity-30 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ===== WHY LAYERSYNC ===== */}
                <section className="py-20 md:py-32 px-4 md:px-6">
                    <div className="max-w-7xl mx-auto">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-20">
                            <h2 className="hero-heading mb-6">Why *LayerSync*?</h2>
                            <p className="sub-heading max-w-2xl mx-auto">We don't just build tools. We engineer complete AI ecosystems that compound your competitive advantage.</p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
                            {[
                                { icon: <Zap className="w-6 h-6" />, title: "Deploy in 48 Hours", desc: "From audit to live AI agents in under two days. No months-long implementations.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                                { icon: <Shield className="w-6 h-6" />, title: "Enterprise Security", desc: "SOC 2 compliant infrastructure. Your data never leaves your environment.", color: "text-green-400", bg: "bg-green-500/10" },
                                { icon: <TrendingUp className="w-6 h-6" />, title: "Measurable ROI", desc: "Every deployment includes a custom ROI dashboard. If we don't save you money, we work for free.", color: "text-blue-400", bg: "bg-blue-500/10" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15 }}
                                    className={`glass-card card-hover-glow rounded-[32px] p-8 md:p-10 border ${borderSubtle} hover:border-white/10 transition-all duration-300`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-8`}>{item.icon}</div>
                                    <h4 className="text-xl md:text-2xl font-light mb-4 text-white">{item.title}</h4>
                                    <p className="text-white/40 leading-relaxed text-sm">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <ROITable isDarkMode={safeDarkMode} />

                <Pricing isDarkMode={safeDarkMode} />

                <FAQ isDarkMode={safeDarkMode} />

                {/* ===== FINAL CTA ===== */}
                <section id="apply" className="relative py-20 md:py-40 px-4 md:px-6 max-w-7xl mx-auto z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className={`p-10 md:p-24 lg:p-32 rounded-[40px] md:rounded-[64px] border ${borderSubtle} glass-card text-center relative overflow-hidden`}
                    >
                        <div className={`ambient-glow absolute inset-0 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-cyan-600/10 pointer-events-none`} />
                        <div className="relative z-10">
                            <h3 className="hero-heading mb-8 md:mb-16 text-shimmer leading-[1.1]">Ready to *Sync*?</h3>
                            <p className="sub-heading mb-12 md:mb-20 max-w-3xl mx-auto">We are accepting a limited number of partners for our early program. Secure your free AI audit today.</p>
                            <button className={`btn-glow px-10 md:px-16 py-5 md:py-6 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] text-xs md:text-sm shadow-2xl inline-flex items-center gap-4 ${safeDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                Request AI Audit <ArrowRight className="w-5 h-5" />
                            </button>
                            <p className="mt-10 md:mt-12 text-[10px] uppercase tracking-widest opacity-30 font-bold">Limited Onboarding Slots Available</p>
                        </div>
                    </motion.div>
                </section>

            </div>
        </>
    );
};
