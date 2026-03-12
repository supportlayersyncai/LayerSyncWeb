import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
    isDarkMode: boolean;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({ isDarkMode }) => {
    return (
        <section id="contact" className="relative py-28 md:py-40 px-6 overflow-hidden">
            {/* Background ambient glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] ${isDarkMode ? 'bg-cyan-500/5' : 'bg-cyan-400/8'}`} />
                <div className={`absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full blur-[130px] ${isDarkMode ? 'bg-purple-500/4' : 'bg-purple-400/6'}`} />
            </div>

            {/* Top divider */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[1px] ${isDarkMode ? 'bg-gradient-to-r from-transparent via-white/10 to-transparent' : 'bg-gradient-to-r from-transparent via-black/5 to-transparent'}`} />
            </div>

            <div className="relative max-w-3xl mx-auto text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className={`hero-heading mb-8 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Your Business Has{' '}
                        <span className="text-shimmer">Evolved</span>.{' '}
                        <br className="hidden md:block" />
                        Your Website Should Too.
                    </h2>

                    <p className={`sub-heading max-w-xl mx-auto mb-12 ${isDarkMode ? 'text-white/50' : 'text-gray-500'}`}>
                        If your website no longer reflects the level your business operates at, 
                        it's time to rebuild it properly.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#get-started"
                            className="btn-glow px-10 py-5 rounded-full bg-white text-black font-semibold text-sm tracking-wide flex items-center gap-3 hover:bg-gray-100 transition-all dark:bg-white dark:text-black"
                        >
                            Book a Free Consultation
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <a
                            href="#audit"
                            className={`px-10 py-5 rounded-full font-medium text-sm tracking-wide border transition-all ${isDarkMode ? 'border-white/10 text-white/70 hover:border-white/25 hover:text-white' : 'border-black/10 text-black/60 hover:border-black/25 hover:text-black'}`}
                        >
                            Request a Website Audit
                        </a>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`mt-8 text-[11px] uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/20' : 'text-black/20'}`}
                    >
                        No commitment required · Free initial consultation
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
};
