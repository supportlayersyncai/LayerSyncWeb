import React from 'react';
import { motion } from 'framer-motion';

export const TechStack: React.FC = () => {
    const stack = ["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "PostgreSQL", "Supabase", "Framer Motion", "Three.js", "WebGL"];

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto z-20">
            <div className="mb-20">
                <h6 className="text-center text-xs uppercase tracking-[0.4em] font-bold text-gray-500 dark:text-dark-text-tertiary mb-8">Our Technology Stack</h6>
                <div className="flex flex-wrap justify-center gap-4">
                    {stack.map((tech, i) => (
                        <span key={i} className="px-6 py-2 rounded-full border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-gray-700 dark:text-dark-text-secondary text-sm font-mono hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors cursor-default">
                            {tech}
                        </span>
                    ))}
                </div>
            </div>


        </section>
    );
};
