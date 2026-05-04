import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { FileSearch, Video, Truck, LineChart, Users } from 'lucide-react';

const agents = [
    {
        title: "Document Intelligence Agent",
        icon: <FileSearch className="w-8 h-8" />,
        desc: "Ingests 100+ page contracts, extracts key terms, flags non-standard clauses, and compares against historical agreements.",
        color: "from-blue-600 to-cyan-400"
    },
    {
        title: "Meeting Intelligence Agent",
        icon: <Video className="w-8 h-8" />,
        desc: "Attends all sales and internal calls. Transcribes, summarizes, extracts action items, and automatically pushes updates to Jira/Salesforce.",
        color: "from-purple-600 to-pink-400"
    },
    {
        title: "Supply Chain Agent",
        icon: <Truck className="w-8 h-8" />,
        desc: "Monitors global logistics APIs, predicts delays based on weather/news, and autonomously suggests alternate routing for approval.",
        color: "from-emerald-600 to-teal-400"
    },
    {
        title: "Financial Analysis Agent",
        icon: <LineChart className="w-8 h-8" />,
        desc: "Aggregates daily spending across departments, compares to forecasted budgets, and generates automated anomaly reports for the CFO.",
        color: "from-amber-500 to-orange-400"
    },
    {
        title: "HR & Policy Agent",
        icon: <Users className="w-8 h-8" />,
        desc: "A secure, internal-only chatbot that instantly answers employee questions based strictly on your company handbook and policies.",
        color: "from-indigo-600 to-blue-500"
    }
];

export const EnterpriseAgents: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">Capabilities</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Complex, multi-step workflows handled by specialized autonomous agents.
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
                        className={`glass-card rounded-[32px] p-8 border group hover:-translate-y-2 transition-all duration-300 ${safeDarkMode ? 'border-white/5 hover:border-emerald-500/30' : 'border-black/5 hover:border-emerald-500/30'}`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${agent.color} shadow-lg group-hover:scale-110 transition-transform`}>
                            {agent.icon}
                        </div>
                        <h3 className={`text-xl font-bold mb-4 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{agent.title}</h3>
                        <p className={`text-sm leading-relaxed ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{agent.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
