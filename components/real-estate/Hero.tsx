import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Play } from 'lucide-react';

export const RealEstateHero: React.FC = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

    return (
        <div ref={ref} className="relative h-[85vh] md:h-[80vh] w-full overflow-hidden flex items-center justify-center pt-20 md:pt-0">
            {/* Background Parallax with Gradient Overlay */}
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]" />
                {/* Animated ambient orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 md:px-6 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 mb-6 py-2 px-4 md:px-6 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] md:text-xs uppercase tracking-[0.2em] font-bold"
                    >
                        <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        AI Agency Partner
                    </motion.div>
                    <h1 className="hero-heading mb-6 md:mb-8 text-white">
                        Automate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x">Luxury Real Estate</span>
                    </h1>
                    <p className="sub-heading text-white/70 mb-8 md:mb-10 max-w-2xl mx-auto">
                        LayerSync empowers agencies to scale with AI-driven virtual staging, automated lead qualification, and 24/7 client engagement.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full px-4 md:px-0">
                        <button className="w-full sm:w-auto btn-glow px-8 md:px-10 py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3">
                            Request Audit <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="w-full sm:w-auto btn-glow px-8 md:px-10 py-4 rounded-full border border-white/20 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-3 hover:bg-white/5 transition-colors">
                            <Play className="w-4 h-4" /> Watch Demo
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
        </div>
    );
};
