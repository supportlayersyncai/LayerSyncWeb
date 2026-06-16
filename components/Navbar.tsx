import React, { useState } from 'react';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowRight, Calendar } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

const navLinks = [
    { name: 'SynCRM', href: '/syncrm' },
    { name: 'What We Build', href: '/what-we-build' },
    { name: 'Work', href: '/work' },
    { name: 'About', href: '/about' },
];

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, setIsDarkMode }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 py-3 sm:py-6 px-4 sm:px-14 flex items-center justify-between ${isScrolled || isMobileMenuOpen ? 'nav-scrolled bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm dark:shadow-none' : 'bg-transparent'
                }`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer z-[101]" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <Logo isDarkMode={isDarkMode || isMobileMenuOpen} className={`transition-all duration-500 ${isScrolled ? 'h-6 sm:h-7' : 'h-8 sm:h-10'}`} />
                    <span className={`font-medium tracking-widest uppercase transition-all duration-500 ${isScrolled ? 'text-sm sm:text-lg' : 'text-lg sm:text-2xl'} ${isMobileMenuOpen ? 'text-white' : 'text-gray-900 dark:text-white'}`}>LayerSync</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-10 text-[10px] uppercase tracking-[0.3em] font-medium text-gray-500 dark:text-white/50">
                    {navLinks.map((link, i) => (
                        <NavLink
                            key={i}
                            to={link.href}
                            className={({ isActive }) =>
                                `transition-colors cursor-pointer hover:text-black dark:hover:text-white ${isActive ? 'text-black dark:text-white' : ''}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </div>

                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center gap-6">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
                    </button>
                    <Link to="/contact" className={`btn-glow px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black`}>
                        <Calendar className="w-3.5 h-3.5" /> Book a diagnostic
                    </Link>
                </div>

                {/* Mobile Controls */}
                <div className="flex lg:hidden items-center gap-4 z-[101]">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode || isMobileMenuOpen ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
                        aria-label="Toggle theme"
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode || isMobileMenuOpen ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[90] bg-[#050505] flex flex-col items-center justify-center p-6"
                    >
                        <div className="w-full max-w-sm space-y-6 text-center">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                >
                                    <Link
                                        to={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-2xl font-light text-white hover:text-brand-orange transition-colors mx-auto"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <div className="w-full h-[1px] bg-white/10 my-8" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <Link
                                    to="/contact"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full btn-glow py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                >
                                    <Calendar className="w-4 h-4" /> Book a diagnostic <ArrowRight className="w-4 h-4" />
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
