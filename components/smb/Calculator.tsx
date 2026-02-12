import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const ROICalculator: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [employees, setEmployees] = useState(5);
    const [hoursSaved, setHoursSaved] = useState(10); // per employee per week
    const [hourlyRate, setHourlyRate] = useState(25);

    const weeklySavings = employees * hoursSaved * hourlyRate;
    const annualSavings = weeklySavings * 52;

    // Format currency
    const format = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    return (
        <section className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto z-20">
            <div className={`rounded-[32px] md:rounded-[48px] p-6 md:p-16 border overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#0A0A0A] border-white/5' : 'glass-card bg-white border-black/5'}`}>
                <div className="text-center mb-10 md:mb-16">
                    <h2 className={`hero-heading mb-4 md:mb-6 text-3xl md:text-5xl ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Calculate Your <span className={`${isDarkMode ? 'text-blue-500' : 'text-blue-600'}`}>*Leap*</span></h2>
                    <p className={`sub-heading max-w-2xl mx-auto text-sm md:text-lg ${isDarkMode ? 'text-white/70' : 'text-gray-600'}`}>See exactly how much manual admin is costing your business every year.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Controls */}
                    <div className="space-y-8 md:space-y-10">
                        <div>
                            <div className="flex justify-between mb-3 md:mb-4">
                                <label className={`text-xs md:text-sm uppercase tracking-widest font-bold ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>Team Size</label>
                                <div className={`font-mono text-lg md:text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{employees} People</div>
                            </div>
                            <input
                                type="range" min="1" max="50" value={employees}
                                onChange={(e) => setEmployees(Number(e.target.value))}
                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors ${isDarkMode ? 'bg-white/10 accent-blue-500 hover:accent-blue-400' : 'bg-black/10 accent-blue-600 hover:accent-blue-500'}`}
                                style={{ touchAction: 'none' }} // Prevent scrolling while sliding on mobile
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3 md:mb-4">
                                <label className={`text-xs md:text-sm uppercase tracking-widest font-bold ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>Admin Hours / Week</label>
                                <div className={`font-mono text-lg md:text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{hoursSaved} Hours</div>
                            </div>
                            <div className={`flex justify-between text-[10px] md:text-xs mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>
                                <span>Low Efficiency</span>
                                <span>High Burnout</span>
                            </div>
                            <input
                                type="range" min="1" max="40" value={hoursSaved}
                                onChange={(e) => setHoursSaved(Number(e.target.value))}
                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors ${isDarkMode ? 'bg-white/10 accent-blue-500 hover:accent-blue-400' : 'bg-black/10 accent-blue-600 hover:accent-blue-500'}`}
                                style={{ touchAction: 'none' }}
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-3 md:mb-4">
                                <label className={`text-xs md:text-sm uppercase tracking-widest font-bold ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>Avg Hourly Cost</label>
                                <div className={`font-mono text-lg md:text-xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>${hourlyRate}/hr</div>
                            </div>
                            <input
                                type="range" min="10" max="100" value={hourlyRate}
                                onChange={(e) => setHourlyRate(Number(e.target.value))}
                                className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors ${isDarkMode ? 'bg-white/10 accent-blue-500 hover:accent-blue-400' : 'bg-black/10 accent-blue-600 hover:accent-blue-500'}`}
                                style={{ touchAction: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Result */}
                    <div className={`relative p-8 md:p-10 rounded-[32px] border text-center flex flex-col justify-center min-h-[250px] md:min-h-[300px] transition-colors duration-300 ${isDarkMode ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                        <div className={`absolute top-0 right-0 p-20 md:p-32 rounded-full pointer-events-none blur-[60px] md:blur-[100px] ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-500/10'}`} />

                        <h4 className={`text-[10px] md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] font-bold mb-6 md:mb-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>Potential Annual Recapture</h4>
                        <div key={annualSavings} className={`text-4xl md:text-7xl font-light mb-4 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-500 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {format(annualSavings)}
                        </div>
                        <p className={`text-xs md:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            That's <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{format(weeklySavings)}</span> lost every single week to manual tasks.
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
