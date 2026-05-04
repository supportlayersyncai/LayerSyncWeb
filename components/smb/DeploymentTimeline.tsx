import React from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { Search, Map, Code, TestTube, Rocket } from 'lucide-react';

const steps = [
    { day: "Day 0", title: "Free Audit", desc: "We review your current processes and identify automation opportunities.", icon: <Search className="w-5 h-5" /> },
    { day: "Day 0", title: "Workflow Mapping", desc: "We design the optimal automated workflow and get your approval.", icon: <Map className="w-5 h-5" /> },
    { day: "Day 1", title: "Agent Build", desc: "Our team develops the custom AI agents and integrates them with your tools.", icon: <Code className="w-5 h-5" /> },
    { day: "Day 1", title: "Testing", desc: "Rigorous testing to ensure 100% accuracy in edge cases.", icon: <TestTube className="w-5 h-5" /> },
    { day: "Day 2", title: "Go Live", desc: "Your new digital workforce is deployed and starts saving you time immediately.", icon: <Rocket className="w-5 h-5" /> },
];

export const DeploymentTimeline: React.FC = () => {
    const { isDarkMode } = useOutletContext<{ isDarkMode: boolean }>();
    const safeDarkMode = isDarkMode ?? true;

    return (
        <section className="relative py-20 md:py-32 px-4 md:px-6 max-w-7xl mx-auto z-20 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16 md:mb-24">
                <h2 className={`hero-heading mb-6 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Live in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">48 Hours</span>
                </h2>
                <p className={`sub-heading max-w-2xl mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>
                    No months-long implementation projects. We move fast.
                </p>
            </motion.div>

            <div className="relative">
                {/* Connecting Line (Horizontal on Desktop, Vertical on Mobile) */}
                <div className={`absolute left-8 md:left-0 md:top-1/2 bottom-0 md:bottom-auto md:w-full w-[2px] md:h-[2px] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 ${safeDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
                <motion.div
                    initial={{ height: 0, width: 0 }}
                    whileInView={{ height: "100%", width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className={`absolute left-8 md:left-0 md:top-1/2 top-0 md:w-full w-[2px] md:h-[2px] -translate-x-1/2 md:translate-x-0 md:-translate-y-1/2 bg-gradient-to-b md:bg-gradient-to-r from-blue-600 to-cyan-600 origin-top md:origin-left`}
                />

                <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-4 pl-16 md:pl-0">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="flex flex-col md:items-center relative"
                        >
                            {/* Dot */}
                            <div className={`absolute -left-16 md:static w-12 h-12 rounded-full flex items-center justify-center mb-0 md:mb-6 z-10 border-4 shadow-lg ${safeDarkMode ? 'bg-[#0A0A0A] border-blue-500 text-blue-400' : 'bg-white border-blue-500 text-blue-600'}`}>
                                {step.icon}
                            </div>
                            
                            {/* Content */}
                            <div className="md:text-center mt-2 md:mt-0">
                                <div className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${safeDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{step.day}</div>
                                <h3 className={`text-lg md:text-xl font-bold mb-2 ${safeDarkMode ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
                                <p className={`text-sm max-w-[200px] md:mx-auto ${safeDarkMode ? 'text-white/60' : 'text-gray-600'}`}>{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
