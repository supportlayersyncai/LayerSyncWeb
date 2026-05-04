import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Mail, Calendar, FileSpreadsheet, Database, CreditCard, MessageSquare } from 'lucide-react';

const agents = [
    {
        icon: <CreditCard className="w-6 h-6" />,
        title: "Invoice Agent",
        desc: "Auto-generates and sends invoices when a project moves to 'Done' in your CRM.",
        color: "from-blue-600 to-cyan-600",
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        workflow: ["CRM Trigger", "QuickBooks Sync", "Email Client"]
    },
    {
        icon: <Calendar className="w-6 h-6" />,
        title: "Scheduling Agent",
        desc: "Handles booking, reschedules, and sends reminders without human intervention.",
        color: "from-purple-600 to-pink-600",
        bg: "bg-purple-500/10",
        text: "text-purple-500",
        workflow: ["Web Form", "Calendar Sync", "SMS Reminder"]
    },
    {
        icon: <Mail className="w-6 h-6" />,
        title: "Email Triage Agent",
        desc: "Sorts incoming emails, responds to FAQs, and escalates urgent issues to the team.",
        color: "from-emerald-600 to-teal-600",
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        workflow: ["Gmail Intake", "AI Classification", "Draft/Send"]
    },
    {
        icon: <Database className="w-6 h-6" />,
        title: "Data Entry Agent",
        desc: "Extracts info from PDFs or forms and instantly updates your CRM and spreadsheets.",
        color: "from-orange-600 to-amber-600",
        bg: "bg-orange-500/10",
        text: "text-orange-500",
        workflow: ["PDF Receipt", "Data Extraction", "CRM Update"]
    },
    {
        icon: <FileSpreadsheet className="w-6 h-6" />,
        title: "Report Agent",
        desc: "Compiles weekly performance data from multiple sources into a polished PDF report.",
        color: "from-rose-600 to-red-600",
        bg: "bg-rose-500/10",
        text: "text-rose-500",
        workflow: ["Data Pull", "Format Chart", "Slack Delivery"]
    },
    {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Customer Success Agent",
        desc: "Monitors usage and sends personalized check-ins to prevent churn.",
        color: "from-indigo-600 to-blue-600",
        bg: "bg-indigo-500/10",
        text: "text-indigo-500",
        workflow: ["Usage Drop", "AI Personalization", "Outreach"]
    }
];

export const AgentShowcase: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Meet Your New <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">Digital Employees</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Custom-built agents designed to execute specific workflows flawlessly.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {agents.map((agent, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-card rounded-[24px] md:rounded-[32px] p-6 md:p-8 border group hover:-translate-y-2 transition-all duration-300 ${safeDarkMode ? 'border-white/5 hover:border-white/10' : 'border-black/5 hover:border-black/10'}`}
                    >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${agent.bg} ${agent.text}`}>
                            {agent.icon}
                        </div>
                        <h3 className={`text-xl font-bold mb-3 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{agent.title}</h3>
                        <p className={`text-sm mb-8 ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{agent.desc}</p>
                        
                        <div className="space-y-2">
                            <div className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Workflow</div>
                            <div className="flex flex-wrap items-center gap-2">
                                {agent.workflow.map((step, j) => (
                                    <React.Fragment key={j}>
                                        <div className={`text-[10px] md:text-xs font-medium px-2 py-1 rounded-md ${safeDarkMode ? 'bg-white/5 text-white/80' : 'bg-black/5 text-gray-800'}`}>
                                            {step}
                                        </div>
                                        {j < agent.workflow.length - 1 && (
                                            <div className={`text-[10px] ${safeDarkMode ? 'text-white/30' : 'text-gray-400'}`}>→</div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
