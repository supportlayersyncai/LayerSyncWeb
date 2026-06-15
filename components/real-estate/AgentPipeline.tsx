import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Upload, UserCheck, Layers, Share2, MessageSquare, BarChart3 } from 'lucide-react';

const steps = [
    { icon: <Upload className="w-6 h-6" />, title: "Lead Capture", desc: "Every enquiry — from WhatsApp, your website, property portals, or walk-ins — is automatically captured into SynCRM with source tracking.", color: "from-purple-600 to-purple-400", glow: "purple" },
    { icon: <UserCheck className="w-6 h-6" />, title: "Intelligent Lead Qualification", desc: "SynCRM’s AI Copilot qualifies each lead against budget, location preference, and property type — and tells your agents exactly who to call first.", color: "from-pink-600 to-pink-400", glow: "pink" },
    { icon: <Layers className="w-6 h-6" />, title: "Property Matching", desc: "SynCRM automatically surfaces the right listings for each qualified lead based on their preferences — no manual searching required.", color: "from-violet-600 to-violet-400", glow: "violet" },
    { icon: <Share2 className="w-6 h-6" />, title: "Sync Media — Automated Marketing", desc: "New listings automatically generate listing flyers, social posts, and campaigns. Distributed to Facebook, Instagram, WhatsApp Business, and your website.", color: "from-blue-600 to-blue-400", glow: "blue" },
    { icon: <MessageSquare className="w-6 h-6" />, title: "24/7 WhatsApp Agent", desc: "Our AI engages enquiries on WhatsApp at any hour — answering questions, scheduling viewings, and syncing confirmed appointments back into SynCRM automatically.", color: "from-cyan-600 to-cyan-400", glow: "cyan" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Pipeline & Performance Dashboards", desc: "Principals and managers get real-time visibility into lead volumes, agent activity, pipeline health, and conversion rates — from any device.", color: "from-emerald-600 to-emerald-400", glow: "emerald" },
];

export const AgentPipeline: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20 overflow-hidden">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16 md:mb-24"
            >
                <div className={`inline-flex items-center gap-2 mb-6 py-2 px-6 rounded-full border text-[10px] uppercase tracking-[0.3em] font-bold ${safeDarkMode ? 'border-purple-500/30 bg-purple-500/10 text-purple-400' : 'border-purple-500/20 bg-purple-50 text-purple-600'}`}>
                    End-to-End Automation
                </div>
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    How <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">SynCRM Works</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    From first enquiry to closed deal — every step is automated, intelligent, and synchronized.
                </p>
            </motion.div>

            {/* Pipeline Steps */}
            <div className="relative">
                {/* Vertical Connecting Line */}
                <div className={`absolute left-1/2 top-0 bottom-0 w-[1px] -translate-x-1/2 hidden md:block ${safeDarkMode ? 'bg-gradient-to-b from-purple-500/30 via-blue-500/30 to-emerald-500/30' : 'bg-gradient-to-b from-purple-300/50 via-blue-300/50 to-emerald-300/50'}`} />

                {/* Animated Particle on Line */}
                <motion.div
                    className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full hidden md:block z-20 ${safeDarkMode ? 'bg-purple-500 shadow-[0_0_20px_rgba(147,51,234,0.6)]' : 'bg-purple-400 shadow-[0_0_15px_rgba(147,51,234,0.4)]'}`}
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />

                <div className="space-y-8 md:space-y-0">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className={`relative md:grid md:grid-cols-2 md:gap-16 items-center ${i % 2 === 0 ? '' : 'md:direction-rtl'}`}
                        >
                            {/* Step Number Dot on Line */}
                            <div className={`absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full hidden md:flex items-center justify-center z-10 text-xs font-bold ${safeDarkMode ? 'bg-[#0A0A0A] border-2 border-purple-500/50 text-purple-400' : 'bg-white border-2 border-purple-400/50 text-purple-600'}`}>
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            {/* Card */}
                            <div className={`${i % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:col-start-2 md:pl-16 md:text-left'}`}>
                                <div className={`glass-card card-hover-glow rounded-[24px] md:rounded-[32px] p-6 md:p-10 border transition-all duration-300 group cursor-pointer ${safeDarkMode ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'}`}>
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white mb-6 ${i % 2 === 0 ? 'md:ml-auto' : ''} group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                        {step.icon}
                                    </div>
                                    <h3 className={`text-xl md:text-2xl font-light mb-3 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                                    <p className={`text-sm leading-relaxed ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{step.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
