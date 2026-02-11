import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

export const LaptopCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const projects = [
        { title: "Safari Logistics", image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2564&auto=format&fit=crop", desc: "Fleet Management Dashboard" },
        { title: "EcoCash Rewards", image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop", desc: "Loyalty Program App" },
        { title: "ZimTourism", image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?q=80&w=2668&auto=format&fit=crop", desc: "Interactive Travel Portal" },
    ];

    const next = () => setCurrentIndex((prev) => (prev + 1) % projects.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);

    return (
        <section className="relative py-12 md:py-20 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <div className="text-center mb-10 md:mb-16">
                <h2 className="hero-heading mb-4 md:mb-6 text-3xl md:text-5xl">Digital <span className="text-cyan-500">*Experiences*</span></h2>
                <p className="sub-heading max-w-2xl mx-auto text-sm md:text-lg">We don't just build websites. We engineer immersive digital platforms that convert.</p>
            </div>

            <div className="relative flex items-center justify-center">
                {/* Navigation - Smaller on mobile */}
                <button onClick={prev} className="absolute left-0 z-30 p-2 md:p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors"><ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>
                <button onClick={next} className="absolute right-0 z-30 p-2 md:p-4 rounded-full bg-white/5 hover:bg-white/10 backdrop-blur-md transition-colors"><ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white" /></button>

                {/* Laptop Frame - Adjusted perspective for mobile */}
                <div className="relative w-full max-w-4xl aspect-[16/10] bg-[#1a1a1a] rounded-[20px] md:rounded-[32px] p-2 md:p-4 shadow-2xl border border-white/10 transform perspective-1000 rotate-x-6 md:rotate-x-12 scale-95 md:scale-100">
                    {/* Screen Content */}
                    <div className="w-full h-full bg-black rounded-[16px] md:rounded-[20px] overflow-hidden relative group">
                        <AnimatePresence mode='wait'>
                            <motion.img
                                key={currentIndex}
                                src={projects[currentIndex].image}
                                alt={projects[currentIndex].title}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>

                        {/* Overlay - Always visible on mobile or different style? */}
                        <div className="absolute inset-x-0 bottom-0 p-4 md:p-8 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-between translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500">
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-white mb-1">{projects[currentIndex].title}</h3>
                                <p className="text-white/60 text-xs md:text-sm">{projects[currentIndex].desc}</p>
                            </div>
                            <button className="p-2 md:p-3 rounded-full bg-cyan-500 text-black hover:scale-110 transition-transform"><ExternalLink className="w-4 h-4 md:w-5 md:h-5" /></button>
                        </div>
                    </div>

                    {/* Base */}
                    <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-[120%] h-3 md:h-4 bg-[#2a2a2a] rounded-b-[32px] shadow-xl" />
                    <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 w-[20%] h-1 bg-[#3a3a3a] rounded-b-[8px]" />
                </div>
            </div>
        </section>
    );
};
