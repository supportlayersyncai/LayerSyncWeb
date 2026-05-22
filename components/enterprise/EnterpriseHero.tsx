import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const EnterpriseHero: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const stats = [
        { value: "10x", label: "Efficiency Gain" },
        { value: "99.9%", label: "SLA Uptime" },
        { value: "SOC 2", label: "Compliant" },
        { value: "0", label: "Data Retention" },
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-20 md:pt-0">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 transition-colors duration-700 ${safeDarkMode ? 'bg-gradient-to-br from-[#021815] via-[#052825] to-[#041a18]' : 'bg-gradient-to-br from-emerald-50 via-white to-teal-50'}`} />
                <div className="absolute top-1/3 left-1/3 w-64 h-64 md:w-96 md:h-96 bg-emerald-600/15 rounded-full blur-[80px] md:blur-[120px] animate-float" />
                <div className="absolute bottom-1/3 right-1/4 w-60 h-60 md:w-80 md:h-80 bg-teal-600/10 rounded-full blur-[70px] md:blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
                
                {/* Particle Grid Overlay */}
                <div className={`absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMSkiPjwvY2lyY2xlPgo8L3N2Zz4=')] opacity-50`} />
            </div>

            <div className="relative z-10 text-center px-4 md:px-6 max-w-5xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>

                    <h1 className="hero-heading mb-6 md:mb-8 text-gray-900 dark:text-dark-text-primary">
                        Organisation-Wide AI. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400 animate-gradient-x">Privately Deployed.</span>
                    </h1>
                    <p className="sub-heading text-gray-600 dark:text-dark-text-secondary mb-8 md:mb-10 max-w-2xl mx-auto">
                        Deploy private, highly-secure AI across your entire organisation — operations, finance, HR, and sales. Built for the security, compliance, and scale requirements of African enterprises.
                    </p>

                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-12 md:mb-16">
                        <button className="btn-glow px-8 md:px-12 py-4 md:py-5 rounded-full md:rounded-[24px] font-bold uppercase tracking-[0.15em] text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl shadow-emerald-900/30 inline-flex items-center gap-3 cursor-pointer">
                            Request Enterprise Assessment <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        className={`inline-flex flex-wrap justify-center gap-6 md:gap-10 py-5 px-8 md:px-12 rounded-[20px] md:rounded-full border ${safeDarkMode ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-white/60 border-black/5 backdrop-blur-md shadow-lg'}`}
                    >
                        {stats.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-xl md:text-2xl font-light bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{s.value}</div>
                                <div className={`text-[8px] md:text-[9px] uppercase tracking-widest font-bold mt-1 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{s.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
            
            <motion.div initial={{ opacity: 1 }} animate={{ opacity: 1 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 dark:text-dark-text-tertiary font-bold">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-gray-400 to-transparent dark:from-white/30 dark:to-transparent" />
            </motion.div>
        </div>
    );
};
