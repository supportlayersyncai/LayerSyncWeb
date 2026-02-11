'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface FuturisticTextProps {
    className?: string;
    text: string;
}

export const FuturisticText = ({ className, text }: FuturisticTextProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={cn("relative perspective-1000 group cursor-default", className)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Text with 3D Rotate */}
            <motion.h1
                className="font-orbitron font-bold text-6xl md:text-8xl lg:text-9xl text-white tracking-widest relative z-10 select-none"
                initial={{ rotateX: 0 }}
                animate={{
                    rotateX: isHovered ? 15 : 0,
                    scale: isHovered ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {text.split('').map((char, i) => (
                    <span key={i} className="inline-block hover:text-accent-cyan transition-colors duration-300">
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </motion.h1>

            {/* Shadow/Reflection Effect */}
            <motion.h1
                className="absolute top-0 left-0 font-orbitron font-bold text-6xl md:text-8xl lg:text-9xl text-accent-cyan/20 blur-sm tracking-widest -z-10"
                initial={{ rotateX: 0, y: 0 }}
                animate={{
                    rotateX: isHovered ? 15 : 0,
                    y: isHovered ? 20 : 0
                }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
                {text}
            </motion.h1>

            {/* Glitch Overlay Effect on Hover */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 bg-accent-cyan/10 mix-blend-overlay z-20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.5, 0, 0.3, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                />
            )}
        </div>
    );
};
