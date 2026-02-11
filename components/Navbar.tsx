import React, { useState } from 'react';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, setIsDarkMode }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    const navLinks = [
        { name: "Solutions", href: "/#services" },
        { name: "Market ROI", href: "/#roi" },
        { name: "Pricing", href: "/#pricing" }
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 py-4 sm:py-6 px-6 sm:px-14 flex items-center justify-between ${isScrolled || isMobileMenuOpen ? 'nav-scrolled bg-black/80 backdrop-blur-md' : 'bg-transparent'
                }`}>
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 sm:gap-3 group cursor-pointer z-[101]" onClick={() => { setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <Logo isDarkMode={isDarkMode || isMobileMenuOpen} className={`transition-all duration-500 ${isScrolled ? 'h-6 sm:h-7' : 'h-8 sm:h-10'}`} />
                    <span className={`font-light tracking-widest uppercase transition-all duration-500 ${isScrolled ? 'text-sm sm:text-lg' : 'text-lg sm:text-2xl'} ${isMobileMenuOpen ? 'text-white' : ''}`}>LayerSync</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-medium opacity-50">
                    {navLinks.map((link, i) => (
                        <a key={i} href={link.href} className="hover:opacity-100 transition-opacity">{link.name}</a>
                    ))}
                </div>

                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center gap-6">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <a href="/#apply" className={`btn-glow px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
                        Start Free Trial
                    </a>
                </div>

                {/* Mobile Controls */}
                <div className="flex lg:hidden items-center gap-4 z-[101]">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-full transition-colors ${isDarkMode || isMobileMenuOpen ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 rounded-full transition-colors ${isDarkMode || isMobileMenuOpen ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
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
                        <div className="w-full max-w-sm space-y-8 text-center">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 + i * 0.1 }}
                                >
                                    <a
                                        href={link.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-2xl font-light text-white hover:text-blue-500 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                </motion.div>
                            ))}

                            <div className="w-full h-[1px] bg-white/10 my-8" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <a
                                    href="/#apply"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full btn-glow py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                >
                                    Start Free Trial <ArrowRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
