import React from 'react';
import { motion } from 'framer-motion';

interface ProcessSectionProps {
    isDarkMode: boolean;
}

const steps = [
    {
        num: '01',
        title: 'Discovery & Audit',
        desc: 'We audit your current site and understand your business, audience, and goals.',
    },
    {
        num: '02',
        title: 'Strategy & Direction',
        desc: 'We define the visual direction, messaging hierarchy, and conversion strategy.',
    },
    {
        num: '03',
        title: 'Structure & Wireframing',
        desc: 'We map out the page architecture, user flow, and content placement.',
    },
    {
        num: '04',
        title: 'Premium Design',
        desc: 'We design every page with precision — modern, polished, and brand-aligned.',
    },
    {
        num: '05',
        title: 'Build & Launch',
        desc: 'We develop, test, and launch a fully responsive, high-performance website.',
    },
    {
        num: '06',
        title: 'Refinement',
        desc: 'We review performance and refine based on real user behaviour and feedback.',
    },
];

export const ProcessSection: React.FC<ProcessSectionProps> = ({ isDarkMode }) => {
    return (
        <section id="process" className="relative py-24 md:py-32 px-6">
            {/* Subtle divider */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`} />
            </div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <span className={`text-[11px] uppercase tracking-[0.3em] font-medium ${isDarkMode ? 'text-cyan-400/60' : 'text-cyan-600/60'}`}>
                        Our Process
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Precision at{' '}
                        <span className="text-shimmer">Every Stage</span>
                    </h2>
                    <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        A structured, transparent process designed to deliver exceptional results 
                        without surprises.
                    </p>
                </motion.div>

                {/* Process steps - vertical timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className={`absolute left-6 md:left-8 top-0 bottom-0 w-px ${isDarkMode ? 'bg-white/[0.06]' : 'bg-black/[0.06]'}`} />

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.num}
                                initial={{ opacity: 0, y: 25 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="relative flex gap-6 md:gap-8 items-start"
                            >
                                {/* Step number circle */}
                                <div className={`relative z-10 flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-mono text-xs md:text-sm font-bold border ${isDarkMode ? 'bg-[#0a0a0a] border-white/[0.08] text-cyan-400/80' : 'bg-white border-black/[0.06] text-cyan-600'} shadow-lg`}>
                                    {step.num}
                                </div>

                                {/* Content */}
                                <div className="pt-1.5 md:pt-3 pb-2">
                                    <h3 className={`text-base md:text-lg font-semibold mb-1.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {step.title}
                                    </h3>
                                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-white/40' : 'text-gray-500'}`}>
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
