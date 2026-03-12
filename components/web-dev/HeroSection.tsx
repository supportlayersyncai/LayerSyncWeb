import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
    isDarkMode: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isDarkMode }) => {
    return (
        <section className="relative py-20 md:py-32 px-6 overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[160px] ${isDarkMode ? 'bg-cyan-500/8' : 'bg-cyan-400/10'} ambient-glow`} />
                <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px] ${isDarkMode ? 'bg-purple-500/6' : 'bg-purple-400/8'} ambient-glow`} />
            </div>

            <div className="relative max-w-5xl mx-auto text-center z-10">
                {/* Eyebrow */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <span className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[11px] uppercase tracking-[0.25em] font-medium border ${isDarkMode ? 'bg-white/[0.03] border-white/[0.08] text-white/60' : 'bg-black/[0.02] border-black/[0.06] text-black/50'}`}>
                        <Sparkles className="w-3.5 h-3.5" />
                        Web Design & Website Rebuilds
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className={`hero-heading mb-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                >
                    Your Website Should Look{' '}
                    <span className="text-shimmer">as Premium</span>{' '}
                    as Your Business
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.25 }}
                    className={`sub-heading max-w-2xl mx-auto mb-12 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}
                >
                    We build and rebuild websites into modern digital experiences that earn trust, 
                    communicate value, and make your business impossible to ignore.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <a
                        href="#contact"
                        className="btn-glow px-8 py-4 rounded-full bg-white text-black font-semibold text-sm tracking-wide flex items-center gap-3 hover:bg-gray-100 transition-all dark:bg-white dark:text-black"
                    >
                        Request a Website Audit
                        <ArrowRight className="w-4 h-4" />
                    </a>
                    <a
                        href="#process"
                        className={`px-8 py-4 rounded-full font-medium text-sm tracking-wide border transition-all ${isDarkMode ? 'border-white/10 text-white/70 hover:border-white/25 hover:text-white' : 'border-black/10 text-black/60 hover:border-black/25 hover:text-black'}`}
                    >
                        See Our Process
                    </a>
                </motion.div>

                {/* Trust microcopy */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className={`mt-8 text-[11px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/25' : 'text-black/25'}`}
                >
                    Strategy-led design · Conversion-focused builds · Premium execution
                </motion.p>
            </div>
        </section>
    );
};
