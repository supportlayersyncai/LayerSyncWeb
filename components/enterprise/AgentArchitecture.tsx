import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Database, Brain, Workflow, LayoutDashboard } from 'lucide-react';

const layers = [
    {
        title: "Data Sources",
        icon: <Database className="w-5 h-5" />,
        items: ["ERPs (SAP, Oracle)", "CRMs (Salesforce)", "Internal Databases", "Unstructured Docs"],
        color: "from-slate-600 to-slate-400"
    },
    {
        title: "AI Processing",
        icon: <Brain className="w-5 h-5" />,
        items: ["Custom LLMs", "RAG Pipeline", "Vector Search", "Data Anonymization"],
        color: "from-blue-600 to-cyan-400"
    },
    {
        title: "Agent Orchestration",
        icon: <Workflow className="w-5 h-5" />,
        items: ["Task Routing", "Decision Logic", "Human-in-the-loop", "Multi-Agent Chat"],
        color: "from-purple-600 to-pink-400"
    },
    {
        title: "Business Outputs",
        icon: <LayoutDashboard className="w-5 h-5" />,
        items: ["Action Execution", "Automated Reports", "Slack/Teams Alerts", "API Webhooks"],
        color: "from-emerald-600 to-teal-400"
    }
];

export const AgentArchitecture: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Enterprise-Grade <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">Architecture</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    Built on a secure, modular foundation that integrates seamlessly with your existing infrastructure.
                </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
                <div className="flex flex-col gap-8 md:gap-12">
                    {layers.map((layer, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative"
                        >
                            {/* Connection lines between layers */}
                            {i < layers.length - 1 && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-8 md:h-12 overflow-hidden">
                                    <div className={`w-full h-full ${safeDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                                    <motion.div
                                        animate={{ top: ["-100%", "200%"] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: i * 0.3 }}
                                        className={`absolute left-0 w-full h-1/2 bg-gradient-to-b from-transparent to-white`}
                                    />
                                </div>
                            )}

                            <div className={`glass-card rounded-[24px] border p-6 md:p-8 ${safeDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${layer.color} shadow-lg`}>
                                        {layer.icon}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <div className={`text-xs uppercase tracking-widest font-bold mb-1 ${safeDarkMode ? 'text-white/40' : 'text-gray-400'}`}>Layer 0{i + 1}</div>
                                        <h3 className={`text-xl font-bold mb-4 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{layer.title}</h3>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                            {layer.items.map((item, j) => (
                                                <span key={j} className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${safeDarkMode ? 'bg-white/5 border-white/10 text-white/80' : 'bg-black/5 border-black/10 text-gray-800'}`}>
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
