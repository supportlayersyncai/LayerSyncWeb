import React from 'react';
import { Logo } from './Logo';
import { Link } from 'react-router-dom';

interface FooterProps {
  isDarkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <footer className={`relative py-16 border-t border-black/5 dark:border-white/5 z-20 ${isDarkMode ? 'bg-[#050505]' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Product */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link to="/syncrm" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">SynCRM</Link></li>
              <li><Link to="/solutions/real-estate" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Real Estate</Link></li>
            </ul>
          </div>
          {/* What we build */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">What We Build</h4>
            <ul className="space-y-4">
              <li><Link to="/what-we-build" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Custom Systems</Link></li>
              <li><Link to="/solutions/web-dev" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/solutions/academy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Sync Academy</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">About</Link></li>
              <li><Link to="/work" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Work</Link></li>
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li><Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Book a diagnostic</Link></li>
              <li><a href="mailto:hello@layersync.ai" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">hello@layersync.ai</a></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Harare, Zimbabwe</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo isDarkMode={isDarkMode} className="h-8" />
          <p className="text-[9px] md:text-[10px] tracking-[0.4em] font-black uppercase text-gray-400 dark:text-dark-text-tertiary">© 2026 LAYER SYNC TECHNOLOGIES (PRIVATE) LIMITED</p>
        </div>
      </div>
    </footer>
  );
};
