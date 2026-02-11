import React from 'react';
import { ROICalculator } from '../components/smb/Calculator';
import { WorkflowViz } from '../components/smb/WorkflowViz';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const SMB: React.FC = () => {
    return (
        <div className="bg-[#050505] min-h-screen pb-20 pt-24 md:pt-32 overflow-x-hidden">
            {/* Simple Hero */}
            <section className="text-center px-4 md:px-6 max-w-4xl mx-auto mb-20 md:mb-32">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                    <h1 className="hero-heading mb-6 md:mb-8 text-white text-4xl md:text-7xl">
                        Smarter Business <br />
                        <span className="text-blue-500">*Automation*</span>
                    </h1>
                    <p className="sub-heading text-white/70 mb-8 md:mb-10 text-sm md:text-xl">
                        LayerSync identifies repetitive tasks in your workflow and builds custom AI agents to handle them.
                        Reduce overhead, eliminate errors, and scale without hiring.
                    </p>
                </motion.div>
            </section>

            <WorkflowViz />

            <ROICalculator />

            {/* Features Grid */}
            <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-white">
                    {[
                        { title: "No-Code Integration", desc: "Connects with Gmail, Slack, Excel, and 5,000+ apps via Zapier/Make." },
                        { title: "100% Accuracy", desc: "AI agents don't make typos, forget deadlines, or take sick days." },
                        { title: "Rapid Deployment", desc: "Most custom workflows are live within 48 hours of our audit." }
                    ].map((f, i) => (
                        <div key={i} className="p-8 rounded-[32px] border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                                <Check className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                            <p className="text-white/50 leading-relaxed text-sm">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};
