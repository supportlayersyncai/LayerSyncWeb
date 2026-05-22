import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Calculator, TrendingDown, Clock, Building2 } from 'lucide-react';

export const EnterpriseROI: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    const [departments, setDepartments] = useState(5);
    const [employees, setEmployees] = useState(500);
    const [avgSalary, setAvgSalary] = useState(15000);

    // Calculations based on 25% efficiency gain
    const totalPayroll = employees * avgSalary;
    const efficiencyGain = 0.25;
    const hoursSavedAnnually = employees * 40 * 52 * efficiencyGain;
    const savingsAnnually = totalPayroll * efficiencyGain;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">ROI Calculator</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Calculate the financial impact of deploying LayerSync across your organization.
                </p>
            </motion.div>

            <div className={`glass-card rounded-[32px] md:rounded-[48px] border overflow-hidden ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                <div className="grid lg:grid-cols-2">
                    {/* Inputs */}
                    <div className={`p-8 md:p-12 border-b lg:border-b-0 lg:border-r ${safeDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500"><Calculator className="w-5 h-5" /></div>
                            <h3 className={`text-xl font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>Your Organization</h3>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className={`text-sm font-bold ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>Departments to Automate</label>
                                    <span className={`text-sm font-bold ${safeDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{departments}</span>
                                </div>
                                <input type="range" min="1" max="20" value={departments} onChange={(e) => setDepartments(Number(e.target.value))} className="w-full accent-emerald-500" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className={`text-sm font-bold ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>Total Employees (in scope)</label>
                                    <span className={`text-sm font-bold ${safeDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{employees}</span>
                                </div>
                                <input type="range" min="50" max="5000" step="50" value={employees} onChange={(e) => setEmployees(Number(e.target.value))} className="w-full accent-emerald-500" />
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className={`text-sm font-bold ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>Average Annual Salary (USD)</label>
                                    <span className={`text-sm font-bold ${safeDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>${avgSalary.toLocaleString()}</span>
                                </div>
                                <input type="range" min="5000" max="60000" step="1000" value={avgSalary} onChange={(e) => setAvgSalary(Number(e.target.value))} className="w-full accent-emerald-500" />
                            </div>
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
                        
                        <h3 className={`text-xl font-bold mb-10 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>Projected Annual Impact</h3>

                        <div className="space-y-6">
                            <div className={`p-6 rounded-[24px] border ${safeDarkMode ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                                    <div className={`text-xs uppercase tracking-widest font-bold ${safeDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Cost Savings</div>
                                </div>
                                <div className="text-4xl md:text-5xl font-light text-emerald-500">
                                    ${(savingsAnnually / 1000000).toFixed(1)}M
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className={`p-5 rounded-2xl border ${safeDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className={`w-4 h-4 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`} />
                                        <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Hours Recovered</div>
                                    </div>
                                    <div className={`text-2xl font-light ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {Math.round(hoursSavedAnnually).toLocaleString()}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-2xl border ${safeDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Building2 className={`w-4 h-4 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`} />
                                        <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>FTE Equivalent</div>
                                    </div>
                                    <div className={`text-2xl font-light ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {Math.round(employees * efficiencyGain)}
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
