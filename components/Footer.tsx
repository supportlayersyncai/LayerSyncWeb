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
          {/* Column 1 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Solutions</h4>
            <ul className="space-y-4">
              <li><Link to="/solutions/real-estate" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">SynCRM</Link></li>
              <li><Link to="/solutions/smb" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">SMB Automation</Link></li>
              <li><Link to="/solutions/academy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Sync Academy</Link></li>
              <li><Link to="/solutions/web-dev" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Web Development</Link></li>
              <li><Link to="/solutions/enterprise" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Enterprise AI</Link></li>
            </ul>
          </div>
          {/* Column 2 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Team</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Resources</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Case Studies</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">AI Audits</a></li>
            </ul>
          </div>
          {/* Column 4 */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-6">Contact</h4>
            <ul className="space-y-4">
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Email</a></li>
              <li><a href="/#apply" className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">Book a Call</a></li>
              <li><span className="text-sm text-gray-600 dark:text-gray-400">Office: Harare</span></li>
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
