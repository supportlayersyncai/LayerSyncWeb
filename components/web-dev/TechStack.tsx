import React from 'react';
import { motion } from 'framer-motion';

export const TechStack: React.FC = () => {
    const stack = ["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "PostgreSQL", "Supabase", "Framer Motion", "Three.js", "WebGL"];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto z-20">
            <div className="mb-20">
                <h6 className="text-center text-xs uppercase tracking-[0.4em] opacity-30 mb-8 font-bold text-white">Our Technology Stack</h6>
                <div className="flex flex-wrap justify-center gap-4">
                    {stack.map((tech, i) => (
                        <span key={i} className="px-6 py-2 rounded-full border border-white/5 bg-white/5 text-white/60 text-sm font-mono hover:border-cyan-500/50 hover:text-cyan-400 transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative aspect-[3/4] rounded-[32px] overflow-hidden bg-black/50 border border-white/5"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-tr from-cyan-900/20 to-purple-900/20 group-hover:opacity-0 transition-opacity duration-500`} />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <span className="text-4xl font-black text-white mix-blend-overlay">PROJECT 0{i}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 p-8 w-full">
                            <h3 className="text-xl font-bold text-white mb-2">E-Commerce {i}</h3>
                            <div className="h-[1px] w-full bg-white/10 group-hover:bg-cyan-500/50 transition-colors" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
