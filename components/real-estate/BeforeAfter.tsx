import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const RealEstateFeatures: React.FC = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handlePointerDown = () => { isDragging.current = true; };
    const handlePointerUp = () => { isDragging.current = false; };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current || !containerRef.current) return;
        const { left, width } = containerRef.current.getBoundingClientRect();
        const position = ((e.clientX - left) / width) * 100;
        setSliderPosition(Math.min(Math.max(position, 5), 95));
    };

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-20 md:mb-32">
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                    <h2 className="text-3xl md:text-5xl font-light mb-6 text-gray-900 dark:text-white">AI Virtual <span className="text-purple-600 dark:text-purple-400 font-normal italic">Staging</span></h2>
                    <p className="text-sm md:text-lg text-gray-600 dark:text-white/60 mb-8 leading-relaxed">
                        Transform empty listings into fully furnished dream homes in seconds. Our AI understands architectural context, lighting, and style preferences to deliver photo-realistic results at a fraction of the cost.
                    </p>
                    <ul className="space-y-4 mb-10">
                        {["98% Cost Reduction vs Physical Staging", "40% Faster Time-to-Sale", "Unlimited Style Iterations"].map((item, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-3 text-sm text-gray-700 dark:text-white/80"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" /> {item}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* Before/After Slider */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative aspect-[4/3] rounded-[24px] md:rounded-[32px] overflow-hidden cursor-ew-resize select-none border border-black/10 dark:border-white/10 shadow-2xl"
                    ref={containerRef}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    style={{ touchAction: 'none' }}
                >
                    {/* Before Image */}
                    <img
                        src="/ai-staging-before.png"
                        alt="Before — Empty Room"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />

                    {/* After Image (clipped) */}
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                        <img
                            src="/ai-staging-after.png"
                            alt="After — AI Staged"
                            className="absolute inset-0 w-full h-full object-cover"
                            draggable={false}
                        />
                    </div>

                    {/* Dynamic Sticker — follows slider */}
                    <div
                        className="absolute top-4 z-30 transition-all duration-200 ease-out"
                        style={{ left: `${Math.min(Math.max(sliderPosition, 10), 85)}%`, transform: 'translateX(-50%)' }}
                    >
                        <div className={`px-4 py-1.5 rounded-full backdrop-blur-md text-[10px] uppercase tracking-widest font-bold text-white transition-colors duration-300 whitespace-nowrap ${sliderPosition >= 50
                            ? 'bg-purple-600/80'
                            : 'bg-black/60'
                            }`}>
                            {sliderPosition >= 50 ? 'AI Staged' : 'Before'}
                        </div>
                    </div>

                    {/* Slider Handle */}
                    <div className="absolute top-0 bottom-0 w-[2px] bg-white z-10" style={{ left: `${sliderPosition}%` }}>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg shadow-black/30">
                            <div className="flex gap-0.5">
                                <ArrowLeft className="w-3 h-3 text-black" />
                                <ArrowRight className="w-3 h-3 text-black" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
