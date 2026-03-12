import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface TransformationSectionProps {
    isDarkMode: boolean;
}

const transformations = [
    { before: 'Dated & Stale', after: 'Modern & Current' },
    { before: 'Unclear Messaging', after: 'Strategic Clarity' },
    { before: 'Generic Templates', after: 'Distinctive Identity' },
    { before: 'Low-Trust Design', after: 'Premium Credibility' },
    { before: 'Visually Weak', after: 'Polished & Refined' },
    { before: 'Passive Brochure', after: 'Active Conversion Asset' },
];

export const TransformationSection: React.FC<TransformationSectionProps> = ({ isDarkMode }) => {
    return (
        <section className="relative py-24 md:py-32 px-6">
            {/* Divider glow */}
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
                        The Transformation
                    </span>
                    <h2 className={`hero-heading mt-4 mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        From Overlooked to{' '}
                        <span className="text-shimmer">Unmistakable</span>
                    </h2>
                    <p className={`sub-heading max-w-2xl mx-auto ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        We don't just redesign websites. We redefine how your business is perceived online.
                    </p>
                </motion.div>

                {/* Transformation rows */}
                <div className="space-y-4">
                    {transformations.map((item, index) => (
                        <motion.div
                            key={item.after}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.07 }}
                            className={`glass-card rounded-2xl p-5 md:p-6 flex items-center justify-between gap-4 group hover:scale-[1.01]`}
                        >
                            {/* Before */}
                            <div className="flex-1 text-right">
                                <span className={`text-sm md:text-base font-medium ${isDarkMode ? 'text-white/30 group-hover:text-red-400/50' : 'text-gray-400 group-hover:text-red-400/70'} transition-colors duration-500`}>
                                    {item.before}
                                </span>
                            </div>

                            {/* Arrow */}
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50'} group-hover:scale-110 transition-transform duration-500`}>
                                <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                            </div>

                            {/* After */}
                            <div className="flex-1 text-left">
                                <span className={`text-sm md:text-base font-semibold ${isDarkMode ? 'text-white/80 group-hover:text-cyan-400' : 'text-gray-800 group-hover:text-cyan-600'} transition-colors duration-500`}>
                                    {item.after}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
