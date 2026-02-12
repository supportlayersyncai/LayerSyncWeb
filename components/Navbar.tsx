import React, { useState, useRef, useEffect } from 'react';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'framer-motion';
import { Sun, Moon, Menu, X, ArrowRight, ChevronDown, Building2, Cpu, Globe, Phone } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isDarkMode, setIsDarkMode }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
    const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const navigate = useNavigate();
    const location = useLocation();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsSolutionsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const solutionLinks = [
        { name: "Real Estate AI", href: "/solutions/real-estate", icon: <Building2 className="w-4 h-4" />, desc: "Virtual staging & lead gen" },
        { name: "SMB Automation", href: "/solutions/smb", icon: <Cpu className="w-4 h-4" />, desc: "Workflow & process automation" },
        { name: "Web Development", href: "/solutions/web-dev", icon: <Globe className="w-4 h-4" />, desc: "Premium digital experiences" },
    ];

    const sectionLinks = [
        { name: "Why Us", href: "#why-layersync" },
        { name: "Systems", href: "#pricing" },
        { name: "FAQ", href: "#faq" },
    ];

    const scrollToSection = (hash: string) => {
        setIsMobileMenuOpen(false);
        setIsSolutionsOpen(false);
        if (location.pathname !== '/') {
            navigate('/' + hash);
        } else {
            const el = document.querySelector(hash);
            el?.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                    {/* Solutions Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <button
                            onClick={() => setIsSolutionsOpen(!isSolutionsOpen)}
                            className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        >
                            Solutions <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isSolutionsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isSolutionsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[280px] z-[200] border rounded-2xl p-2 shadow-2xl transition-colors duration-200 ${isDarkMode ? 'bg-[#111111] border-white/30' : 'bg-white border-black/10'}`}
                                >
                                    {solutionLinks.map((s, i) => (
                                        <Link
                                            key={i}
                                            to={s.href}
                                            onClick={() => setIsSolutionsOpen(false)}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-colors group/item ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                                        >
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${isDarkMode ? 'bg-white/10 text-white group-hover/item:bg-white/20' : 'bg-black/5 text-black group-hover/item:bg-black/10'}`}>
                                                {s.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className={`text-[11px] font-bold tracking-wider normal-case ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{s.name}</div>
                                                <div className={`text-[9px] tracking-wider normal-case mt-0.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{s.desc}</div>
                                            </div>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Section Links */}
                    {sectionLinks.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => scrollToSection(link.href)}
                            className="hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                        >
                            {link.name}
                        </button>
                    ))}
                </div>

                {/* Desktop Controls */}
                <div className="hidden lg:flex items-center gap-6">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
                    >
                        {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
                    </button>
                    <a href="/#apply" className={`btn-glow px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] inline-flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black`}>
                        <Phone className="w-3.5 h-3.5" /> Book a Call
                    </a>
                </div>

                {/* Mobile Controls */}
                <div className="flex lg:hidden items-center gap-4 z-[101]">
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode || isMobileMenuOpen ? 'bg-white/10 text-white' : 'bg-black/5 text-black'}`}
                    >
                        {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${isDarkMode || isMobileMenuOpen ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
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
                            {/* Solutions Accordion */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <button
                                    onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                                    className="text-2xl font-light text-white hover:text-blue-500 transition-colors flex items-center justify-center gap-2 mx-auto"
                                >
                                    Solutions <ChevronDown className={`w-5 h-5 transition-transform ${isMobileSolutionsOpen ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {isMobileSolutionsOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden mt-4 space-y-2"
                                        >
                                            {solutionLinks.map((s, i) => (
                                                <Link
                                                    key={i}
                                                    to={s.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors mx-auto max-w-xs"
                                                >
                                                    <div className="text-white/60">{s.icon}</div>
                                                    <div className="text-left">
                                                        <div className="text-sm font-medium text-white">{s.name}</div>
                                                        <div className="text-[10px] text-gray-300">{s.desc}</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Section links */}
                            {sectionLinks.map((link, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                >
                                    <button
                                        onClick={() => scrollToSection(link.href)}
                                        className="block text-2xl font-light text-white hover:text-blue-500 transition-colors mx-auto"
                                    >
                                        {link.name}
                                    </button>
                                </motion.div>
                            ))}

                            <div className="w-full h-[1px] bg-white/10 my-8" />

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <a
                                    href="/#apply"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full btn-glow py-4 rounded-full bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3"
                                >
                                    <Phone className="w-4 h-4" /> Book a Call <ArrowRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
