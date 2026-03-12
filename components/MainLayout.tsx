import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
    // Initialize with localStorage or default to true
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved === 'dark';
        }
        return true;
    });

    const { pathname } = useLocation();

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDarkMode) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    return (
        <main className={`relative transition-colors duration-700 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-black'}`}>

            {/* Background Ambience */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className={`ambient-glow absolute top-[5%] left-[5%] w-[40vw] h-[40vw] blur-[150px] ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/10'}`} />
                <div className={`ambient-glow absolute bottom-[5%] right-[5%] w-[45vw] h-[45vw] blur-[150px] ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-400/10'}`} />
            </div>

            <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

            <Outlet context={{ isDarkMode, setIsDarkMode }} />

            <Footer isDarkMode={isDarkMode} />
        </main>
    );
};
