import React from 'react';
import { Logo } from './Logo';

interface FooterProps {
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5";

  return (
    <footer className={`relative py-20 border-t ${borderSubtle} opacity-30 text-center z-20`}>
      <Logo isDarkMode={isDarkMode} className="h-12 mx-auto mb-8" />
      <p className="text-[10px] tracking-[0.4em] font-black uppercase">© 2025 LayerSync AI • Zimbabwe Regional Launch</p>
    </footer>
  );
};
