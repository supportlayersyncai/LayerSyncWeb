'use client';

import { useEffect, useRef } from 'react';

export const CyberGrid = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        let time = 0;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);

        const drawGrid = () => {
            ctx.fillStyle = '#050a10'; // Match background
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1;

            const gridSize = 50;
            const perspective = 300;

            // Moving grid effect
            const offset = (time * 0.5) % gridSize;

            // Vertical lines
            for (let x = 0; x <= width; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.05 + Math.sin(x / width * Math.PI) * 0.05})`;
                ctx.stroke();
            }

            // Horizontal lines (perspective)
            for (let y = 0; y <= height; y += gridSize) {
                // Create a simple perspective grid at the bottom
                const py = y + offset;
                if (py > height) continue;

                ctx.beginPath();
                ctx.moveTo(0, py);
                ctx.lineTo(width, py);
                ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 - (py / height) * 0.05})`;
                ctx.stroke();
            }

            // Floating particles
            for (let i = 0; i < 20; i++) {
                const x = (Math.sin(time * 0.001 + i) * width / 2) + width / 2;
                const y = (Math.cos(time * 0.002 + i) * height / 2) + height / 2;
                const size = Math.random() * 2;

                ctx.fillStyle = i % 2 === 0 ? '#00f0ff' : '#f510ef';
                ctx.globalAlpha = 0.5 + Math.sin(time * 0.01) * 0.5;
                ctx.beginPath();
                ctx.arc(x, y, size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            time++;
            requestAnimationFrame(drawGrid);
        };

        const animationId = requestAnimationFrame(drawGrid);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10"
        />
    );
};
