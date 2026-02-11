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
                    <h2 className="text-3xl md:text-5xl font-light mb-6 text-white">AI Virtual <span className="text-purple-400 font-normal italic">Staging</span></h2>
                    <p className="text-sm md:text-lg text-white/60 mb-8 leading-relaxed">
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
                                className="flex items-center gap-3 text-sm text-white/80"
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
                    className="relative aspect-[4/3] rounded-[24px] md:rounded-[32px] overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl"
                    ref={containerRef}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    onPointerMove={handlePointerMove}
                    style={{ touchAction: 'none' }}
                >

                    {/* Before: Empty Room - Using gradient placeholder */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-20 h-14 border-2 border-gray-500/50 rounded-lg mb-3 mx-auto" />
                            <div className="w-32 h-1 bg-gray-500/30 rounded mx-auto mb-2" />
                            <div className="w-24 h-1 bg-gray-500/20 rounded mx-auto" />
                            <p className="text-gray-400 text-xs mt-4 uppercase tracking-widest">Empty Room</p>
                        </div>
                    </div>

                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-white z-20">Before</div>

                    {/* After: Staged Room */}
                    <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-indigo-800/70 to-blue-900/80 flex items-center justify-center">
                            {/* Furniture silhouettes */}
                            <div className="relative w-full h-full flex items-end justify-center pb-8 px-8 gap-4">
                                <div className="w-24 h-16 bg-white/10 rounded-t-lg border border-white/20" /> {/* Sofa */}
                                <div className="w-8 h-24 bg-white/10 rounded-t-md border border-white/20" /> {/* Lamp */}
                                <div className="w-16 h-10 bg-white/10 rounded-lg border border-white/20" /> {/* Table */}
                            </div>
                            <div className="absolute inset-0 bg-purple-500/5 backdrop-blur-[1px]" />
                        </div>
                        <div className="absolute top-4 right-4 bg-purple-500/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-white z-20">AI Staged</div>
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
