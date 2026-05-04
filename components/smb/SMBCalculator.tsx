import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Calculator, TrendingDown, Clock, MousePointer2 } from 'lucide-react';

export const SMBCalculator: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const [hoursPerWeek, setHoursPerWeek] = useState(20);
    const [hourlyRate, setHourlyRate] = useState(35);

    const weeklyCost = hoursPerWeek * hourlyRate;
    const annualCost = weeklyCost * 52;
    // Assuming LayerSync automation saves 90% of the manual time
    const savingsAnnual = annualCost * 0.9;
    const hoursSavedAnnual = hoursPerWeek * 52 * 0.9;

    return (
        <section className="relative px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
                <h2 className={`text-3xl md:text-5xl font-light mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">ROI</span>
                </h2>
            </motion.div>

            <div className={`glass-card rounded-[32px] md:rounded-[48px] border overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <div className="grid lg:grid-cols-2">
                    {/* Inputs */}
                    <div className={`p-8 md:p-12 border-b lg:border-b-0 lg:border-r ${safeDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-500"><MousePointer2 className="w-5 h-5" /></div>
                            <h3 className={`text-xl font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Current Process</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className={`text-sm font-bold ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>Manual Admin Hours (Weekly)</label>
                                    <span className={`text-sm font-bold ${safeDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{hoursPerWeek} hrs</span>
                                </div>
                                <input type="range" min="5" max="100" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(Number(e.target.value))} className="w-full accent-cyan-500" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className={`text-sm font-bold ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>Average Hourly Blended Rate</label>
                                    <span className={`text-sm font-bold ${safeDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>${hourlyRate}/hr</span>
                                </div>
                                <input type="range" min="15" max="150" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} className="w-full accent-cyan-500" />
                            </div>
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
                        
                        <h3 className={`text-xl font-bold mb-10 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>Projected Annual Savings</h3>

                        <div className="space-y-6">
                            <div className={`p-6 rounded-[24px] border ${safeDarkMode ? 'bg-cyan-500/10 border-cyan-500/20' : 'bg-cyan-50 border-cyan-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown className="w-4 h-4 text-cyan-500" />
                                    <div className={`text-xs uppercase tracking-widest font-bold ${safeDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>Cost Savings</div>
                                </div>
                                <div className="text-4xl md:text-5xl font-light text-cyan-500">
                                    ${Math.round(savingsAnnual).toLocaleString()}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className={`p-5 rounded-2xl border ${safeDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className={`w-4 h-4 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`} />
                                        <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Hours Recovered</div>
                                    </div>
                                    <div className={`text-2xl font-light ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {Math.round(hoursSavedAnnual).toLocaleString()}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-2xl border ${safeDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Calculator className={`w-4 h-4 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`} />
                                        <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Current Cost</div>
                                    </div>
                                    <div className={`text-xl font-light ${safeDarkMode ? 'text-white/60' : 'text-gray-500'} line-through`}>
                                        ${Math.round(annualCost).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
