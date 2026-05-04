import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { X, Check, Clock, AlertTriangle } from 'lucide-react';

const manualTasks = [
    { task: "Invoice Generation", time: "2.5 hrs/week", pain: "Typos, missed invoices" },
    { task: "Email Triage", time: "4 hrs/week", pain: "Delayed responses" },
    { task: "Appointment Scheduling", time: "3 hrs/week", pain: "Double bookings" },
    { task: "Data Entry & CRM", time: "5 hrs/week", pain: "Outdated records" },
    { task: "Report Generation", time: "3 hrs/week", pain: "Inconsistent formats" },
    { task: "Follow-Up Reminders", time: "2 hrs/week", pain: "Forgotten leads" },
];

export const PainPoints: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    The <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Manual Work</span> Problem
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Your team spends 19.5 hours per week on tasks that AI can handle flawlessly.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {/* Without LayerSync */}
                <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    className={`rounded-[32px] p-6 md:p-10 border ${safeDarkMode ? 'bg-red-500/5 border-red-500/10' : 'bg-red-50 border-red-200/50'}`}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                        <div>
                            <div className={`text-sm font-bold ${safeDarkMode ? 'text-red-400' : 'text-red-600'}`}>Without LayerSync</div>
                            <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Manual Chaos</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {manualTasks.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                                className={`flex items-center gap-4 p-4 rounded-xl ${safeDarkMode ? 'bg-white/5' : 'bg-white'}`}
                            >
                                <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className={`text-sm font-medium ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.task}</div>
                                    <div className={`text-xs ${safeDarkMode ? 'text-white/40' : 'text-gray-500'}`}>{t.pain}</div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3 h-3 text-red-400" />
                                    <span className={`text-xs font-mono ${safeDarkMode ? 'text-red-400' : 'text-red-600'}`}>{t.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className={`mt-6 pt-6 border-t text-center ${safeDarkMode ? 'border-white/5' : 'border-red-100'}`}>
                        <div className="text-2xl font-light text-red-500">19.5 hrs/week</div>
                        <div className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Wasted on Admin</div>
                    </div>
                </motion.div>

                {/* With LayerSync */}
                <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    className={`rounded-[32px] p-6 md:p-10 border ${safeDarkMode ? 'bg-green-500/5 border-green-500/10' : 'bg-green-50 border-green-200/50'}`}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center"><Check className="w-5 h-5 text-green-500" /></div>
                        <div>
                            <div className={`text-sm font-bold ${safeDarkMode ? 'text-green-400' : 'text-green-600'}`}>With LayerSync</div>
                            <div className={`text-[10px] uppercase tracking-widest font-bold ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Fully Automated</div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {manualTasks.map((t, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 + 0.3 }}
                                className={`flex items-center gap-4 p-4 rounded-xl ${safeDarkMode ? 'bg-white/5' : 'bg-white'}`}
                            >
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <div className="flex-1">
                                    <div className={`text-sm font-medium ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.task}</div>
                                    <div className={`text-xs ${safeDarkMode ? 'text-green-400/60' : 'text-green-600'}`}>Automated by AI Agent</div>
                                </div>
                                <span className={`text-xs font-mono ${safeDarkMode ? 'text-green-400' : 'text-green-600'}`}>0 hrs</span>
                            </motion.div>
                        ))}
                    </div>
                    <div className={`mt-6 pt-6 border-t text-center ${safeDarkMode ? 'border-white/5' : 'border-green-100'}`}>
                        <div className="text-2xl font-light text-green-500">19.5 hrs saved</div>
                        <div className={`text-[10px] uppercase tracking-widest font-bold mt-1 ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>Every Single Week</div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
