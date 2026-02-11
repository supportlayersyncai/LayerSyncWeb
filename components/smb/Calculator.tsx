import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ROICalculator: React.FC = () => {
    const [employees, setEmployees] = useState(5);
    const [hoursSaved, setHoursSaved] = useState(10); // per employee per week
    const [hourlyRate, setHourlyRate] = useState(25);

    const weeklySavings = employees * hoursSaved * hourlyRate;
    const annualSavings = weeklySavings * 52;

    // Format currency
    const format = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    return (
        <section className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto z-20">
            <div className="glass-card rounded-[32px] md:rounded-[48px] p-6 md:p-16 border border-white/5 bg-[#0A0A0A] overflow-hidden">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="hero-heading mb-4 md:mb-6 text-3xl md:text-5xl">Calculate Your <span className="text-blue-500">*Leap*</span></h2>
                    <p className="sub-heading max-w-2xl mx-auto text-sm md:text-lg">See exactly how much manual admin is costing your business every year.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Controls */}
                    <div className="space-y-8 md:space-y-10">
                        <div>
                            <div className="flex justify-between mb-3 md:mb-4">
                                <label className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/70">Team Size</label>
                                <div className="font-mono text-blue-400 text-lg md:text-xl">{employees} People</div>
                            </div>
                            <input
                                type="range" min="1" max="50" value={employees}
                                onChange={(e) => setEmployees(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
                                style={{ touchAction: 'none' }} // Prevent scrolling while sliding on mobile
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3 md:mb-4">
                                <label className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/70">Admin Hours / Week</label>
                                <div className="font-mono text-blue-400 text-lg md:text-xl">{hoursSaved} Hours</div>
                            </div>
                            <div className="flex justify-between text-[10px] md:text-xs text-white/30 mb-2">
                                <span>Low Efficiency</span>
                                <span>High Burnout</span>
                            </div>
                            <input
                                type="range" min="1" max="40" value={hoursSaved}
                                onChange={(e) => setHoursSaved(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
                                style={{ touchAction: 'none' }}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3 md:mb-4">
                                <label className="text-xs md:text-sm uppercase tracking-widest font-bold text-white/70">Avg Hourly Cost</label>
                                <div className="font-mono text-blue-400 text-lg md:text-xl">${hourlyRate}/hr</div>
                            </div>
                            <input
                                type="range" min="10" max="100" value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-colors"
                                style={{ touchAction: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Result */}
                    <div className="relative p-8 md:p-10 rounded-[32px] bg-blue-600/10 border border-blue-500/20 text-center flex flex-col justify-center min-h-[250px] md:min-h-[300px]">
                        <div className="absolute top-0 right-0 p-20 md:p-32 bg-blue-500/20 blur-[60px] md:blur-[100px] rounded-full pointer-events-none" />

                        <h4 className="text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] text-blue-300 font-bold mb-6 md:mb-8">Potential Annual Recapture</h4>
                        <div key={annualSavings} className="text-4xl md:text-7xl font-light text-white mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {format(annualSavings)}
                        </div>
                        <p className="text-white/40 text-xs md:text-base">
                            That's <span className="text-white font-bold">{format(weeklySavings)}</span> lost every single week to manual tasks.
                        </p>

                        <button className="mt-8 md:mt-12 mx-auto btn-glow px-6 md:px-8 py-3 rounded-full bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/40">
                            Reclaim This Value
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};
