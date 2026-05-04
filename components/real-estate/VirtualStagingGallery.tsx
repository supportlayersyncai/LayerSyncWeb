import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const styles = [
    { name: "Modern", accent: "from-purple-600 to-pink-600", description: "Clean lines, neutral tones, contemporary furniture" },
    { name: "Minimalist", accent: "from-blue-600 to-cyan-600", description: "Sparse, intentional placement, monochromatic palette" },
    { name: "Luxury", accent: "from-amber-600 to-yellow-500", description: "Rich textures, premium materials, opulent details" },
    { name: "Scandinavian", accent: "from-emerald-600 to-teal-500", description: "Light woods, organic shapes, hygge aesthetics" },
];

const rooms = [
    { name: "Living Room", sizes: ["2,400 sq ft", "Open concept"] },
    { name: "Master Bedroom", sizes: ["800 sq ft", "En-suite"] },
    { name: "Kitchen", sizes: ["600 sq ft", "Island layout"] },
];

export const VirtualStagingGallery: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;
    const [activeStyle, setActiveStyle] = useState(0);
    const [activeRoom, setActiveRoom] = useState(0);

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 md:mb-20"
            >
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    One Room. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">Infinite Styles.</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Choose any aesthetic. Our AI adapts to your buyer's taste in seconds, not days.
                </p>
            </motion.div>

            {/* Style Selector */}
            <div className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12">
                {styles.map((style, i) => (
                    <motion.button
                        key={i}
                        onClick={() => setActiveStyle(i)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 cursor-pointer ${activeStyle === i
                            ? `bg-gradient-to-r ${style.accent} text-white shadow-lg`
                            : safeDarkMode
                                ? 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                                : 'bg-black/5 text-gray-600 hover:bg-black/10 border border-black/10'
                        }`}
                    >
                        {style.name}
                    </motion.button>
                ))}
            </div>

            {/* Room Tabs */}
            <div className="flex justify-center gap-2 mb-10">
                {rooms.map((room, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveRoom(i)}
                        className={`px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all cursor-pointer ${activeRoom === i
                            ? safeDarkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-900'
                            : safeDarkMode ? 'text-white/40 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        {room.name}
                    </button>
                ))}
            </div>

            {/* Gallery Display */}
            <motion.div
                layout
                className={`relative rounded-[32px] md:rounded-[48px] overflow-hidden border ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeStyle}-${activeRoom}`}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-[16/9] md:aspect-[21/9]"
                    >
                        {/* Simulated staged room — gradient placeholder with style info */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${styles[activeStyle].accent} opacity-20`} />
                        <div className={`absolute inset-0 ${safeDarkMode ? 'bg-[#0A0A0A]/80' : 'bg-white/80'} backdrop-blur-sm`} />

                        {/* Content Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center px-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${styles[activeStyle].accent} flex items-center justify-center mx-auto mb-8 shadow-2xl`}
                                >
                                    <Sparkles className="w-8 h-8 text-white" />
                                </motion.div>
                                <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`text-3xl md:text-5xl font-light mb-4 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}
                                >
                                    {rooms[activeRoom].name} — <span className={`text-transparent bg-clip-text bg-gradient-to-r ${styles[activeStyle].accent}`}>{styles[activeStyle].name}</span>
                                </motion.h3>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className={`text-sm md:text-base mb-6 ${safeDarkMode ? 'text-white/50' : 'text-gray-500'}`}
                                >
                                    {styles[activeStyle].description}
                                </motion.p>
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="flex items-center justify-center gap-6"
                                >
                                    {rooms[activeRoom].sizes.map((size, i) => (
                                        <span key={i} className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>{size}</span>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Bottom Info Bar */}
                <div className={`flex items-center justify-between px-6 md:px-10 py-4 md:py-6 border-t ${safeDarkMode ? 'border-white/5 bg-black/50' : 'border-black/5 bg-white/50'} backdrop-blur-md`}>
                    <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>
                        AI Staged in 3.2s
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                            Cost: $2.00
                        </span>
                        <span className={`text-[10px] uppercase tracking-widest font-bold line-through ${safeDarkMode ? 'text-white/20' : 'text-gray-300'}`}>
                            Traditional: $500
                        </span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
