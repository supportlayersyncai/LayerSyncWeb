import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';

export const RealEstateHero: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;
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
                <div className={`absolute inset-0 transition-colors duration-700 ${safeDarkMode ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' : 'bg-gradient-to-br from-gray-100 via-white to-gray-100'}`} />
                {/* Animated ambient orbs */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-60 h-60 md:w-80 md:h-80 bg-pink-600/15 rounded-full blur-[70px] md:blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
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
                    <h1 className="hero-heading mb-6 md:mb-8 text-gray-900 dark:text-white">
                        Automate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 animate-gradient-x">Luxury Real Estate</span>
                    </h1>
                    <p className="sub-heading text-gray-600 dark:text-white/70 mb-8 md:mb-10 max-w-2xl mx-auto">
                        LayerSync empowers agencies to scale with AI-driven virtual staging, automated lead qualification, and 24/7 client engagement.
                    </p>


                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-white/30 font-bold">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent dark:from-white/30 dark:to-transparent" />
            </motion.div>
        </div>
    );
};
