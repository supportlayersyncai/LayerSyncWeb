import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Briefcase, BarChart, Users, Phone, ShieldCheck, Cpu } from 'lucide-react';

const departments = [
    {
        id: 'ops',
        name: 'Operations',
        icon: <Cpu className="w-5 h-5" />,
        color: 'from-blue-600 to-blue-400',
        agents: ['Supply Chain Agent', 'Vendor Management Agent'],
        kpis: ['30% lower inventory costs', '2x faster procurement'],
        example: 'Automatically predicting inventory shortages and generating purchase orders for approval based on real-time sales data.'
    },
    {
        id: 'finance',
        name: 'Finance',
        icon: <BarChart className="w-5 h-5" />,
        color: 'from-emerald-600 to-emerald-400',
        agents: ['Financial Analysis Agent', 'Invoice Reconciliation Agent'],
        kpis: ['99% anomaly detection', 'End-of-month close in 1 day'],
        example: 'Reconciling thousands of invoices against purchase orders and flagging discrepancies instantly.'
    },
    {
        id: 'hr',
        name: 'Human Resources',
        icon: <Users className="w-5 h-5" />,
        color: 'from-purple-600 to-purple-400',
        agents: ['Onboarding Agent', 'Policy Compliance Agent'],
        kpis: ['50% faster onboarding', '0 compliance breaches'],
        example: 'Guiding new hires through paperwork, answering HR policy questions 24/7, and provisioning software access.'
    },
    {
        id: 'sales',
        name: 'Sales',
        icon: <Briefcase className="w-5 h-5" />,
        color: 'from-pink-600 to-pink-400',
        agents: ['Meeting Intelligence Agent', 'Proposal Generation Agent'],
        kpis: ['3x pipeline velocity', '10 hrs saved per rep/week'],
        example: 'Transcribing sales calls, extracting action items, updating Salesforce, and drafting follow-up emails.'
    },
    {
        id: 'cs',
        name: 'Customer Success',
        icon: <Phone className="w-5 h-5" />,
        color: 'from-amber-600 to-amber-400',
        agents: ['Health Score Agent', 'Churn Prediction Agent'],
        kpis: ['25% churn reduction', '100% SLA compliance'],
        example: 'Monitoring account usage, identifying at-risk customers, and suggesting targeted interventions before churn happens.'
    },
    {
        id: 'it',
        name: 'IT & Security',
        icon: <ShieldCheck className="w-5 h-5" />,
        color: 'from-slate-600 to-slate-400',
        agents: ['Level 1 Support Agent', 'Threat Detection Agent'],
        kpis: ['80% ticket deflection', 'Instant threat isolation'],
        example: 'Resolving common IT tickets (password resets, access requests) automatically via Slack or Teams.'
    }
];

export const OrgTransformation: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;
    const [activeDept, setActiveDept] = useState(departments[0]);

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Transform Every <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">Department</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Click to explore how autonomous agents optimize specific business units.
                </p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Department Selector */}
                <div className="lg:col-span-5 grid grid-cols-2 gap-3 md:gap-4">
                    {departments.map((dept, i) => (
                        <motion.button
                            key={dept.id}
                            onClick={() => setActiveDept(dept)}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-[24px] border transition-all duration-300 cursor-pointer ${activeDept.id === dept.id
                                ? `bg-gradient-to-br ${dept.color} text-white border-transparent shadow-lg scale-105 z-10`
                                : safeDarkMode
                                    ? 'bg-white/5 border-white/5 hover:border-white/20 text-white/60 hover:text-white'
                                    : 'bg-black/5 border-black/5 hover:border-black/20 text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            <div className="mb-3">{dept.icon}</div>
                            <div className="text-xs md:text-sm font-bold text-center leading-tight">{dept.name}</div>
                        </motion.button>
                    ))}
                </div>

                {/* Content Panel */}
                <div className={`lg:col-span-7 glass-card rounded-[32px] md:rounded-[48px] p-6 md:p-10 border ${safeDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeDept.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${activeDept.color}`}>
                                    {activeDept.icon}
                                </div>
                                <h3 className={`text-2xl md:text-3xl font-light ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {activeDept.name} Intelligence
                                </h3>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h4 className={`text-xs uppercase tracking-widest font-bold mb-4 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Deployed Agents</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeDept.agents.map((agent, i) => (
                                            <span key={i} className={`px-4 py-2 rounded-full text-sm font-medium ${safeDarkMode ? 'bg-white/10 text-white' : 'bg-black/10 text-gray-900'}`}>
                                                {agent}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className={`text-xs uppercase tracking-widest font-bold mb-4 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Example Workflow</h4>
                                    <div className={`p-5 rounded-2xl border ${safeDarkMode ? 'bg-[#0A0A0A]/50 border-white/10' : 'bg-white/50 border-black/10'}`}>
                                        <p className={`text-sm leading-relaxed ${safeDarkMode ? 'text-white/80' : 'text-gray-700'}`}>
                                            {activeDept.example}
                                        </p>
                                    </div>
                                </div>

                                <div className={`pt-6 border-t grid grid-cols-2 gap-4 ${safeDarkMode ? 'border-white/5' : 'border-black/5'}`}>
                                    {activeDept.kpis.map((kpi, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className={`mt-0.5 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${activeDept.color} flex-shrink-0`} />
                                            <span className={`text-xs md:text-sm font-bold ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{kpi}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};
