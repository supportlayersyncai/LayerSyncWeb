import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const RealEstateHero: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

    const stats = [
        { value: "98%", label: "Cost Reduction" },
        { value: "40%", label: "Faster Sales" },
        { value: "24/7", label: "Lead Capture" },
        { value: "3.2s", label: "Staging Time" },
    ];

    return (
        <div ref={ref} className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20 md:pt-0">
            <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
                <div className={`absolute inset-0 transition-colors duration-700 ${safeDarkMode ? 'bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]' : 'bg-gradient-to-br from-gray-100 via-white to-gray-100'}`} />
                <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-600/20 rounded-full blur-[80px] md:blur-[120px] animate-float" />
                <div className="absolute bottom-1/4 right-1/4 w-60 h-60 md:w-80 md:h-80 bg-pink-600/15 rounded-full blur-[70px] md:blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-60 md:h-60 bg-violet-500/10 rounded-full blur-[60px] md:blur-[80px] animate-float" style={{ animationDelay: '6s' }} />
            </motion.div>

            <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                    <h1 className="hero-heading mb-6 md:mb-8 text-gray-900 dark:text-dark-text-primary">
                        Automate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 animate-gradient-x">Luxury Real Estate</span>
                    </h1>
                    <p className="sub-heading text-gray-600 dark:text-dark-text-secondary mb-8 md:mb-10 max-w-2xl mx-auto">
                        LayerSync empowers agencies to scale with AI-driven virtual staging, automated lead qualification, listing copy generation, and 24/7 client engagement.
                    </p>

                    {/* CTA Button */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12 md:mb-16">
                        <button className="btn-glow px-8 md:px-12 py-4 md:py-5 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-900/30 inline-flex items-center gap-3 cursor-pointer hover:shadow-purple-900/50 transition-shadow">
                            See It In Action <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>

                    {/* Stats Row */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        className={`inline-flex flex-wrap justify-center gap-6 md:gap-10 py-5 px-8 md:px-12 rounded-[20px] md:rounded-full border ${safeDarkMode ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-white/60 border-black/5 backdrop-blur-md shadow-lg'}`}
                    >
                        {stats.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-xl md:text-2xl font-light bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{s.value}</div>
                                <div className={`text-[8px] md:text-[9px] uppercase tracking-widest font-bold mt-1 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            <motion.div style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-dark-text-tertiary font-bold">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent dark:from-white/30 dark:to-transparent" />
            </motion.div>
        </div>
    );
};
