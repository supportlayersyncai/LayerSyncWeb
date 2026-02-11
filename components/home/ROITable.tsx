import React from 'react';
import { motion } from 'framer-motion';

interface ROITableProps {
  isDarkMode: boolean;
}

export const ROITable: React.FC<ROITableProps> = ({ isDarkMode }) => {
  const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5";

  const marketROI = [
    { name: "Virtual Staging", traditional: "$500 - $1,500", layerSync: "$2.00 / Image", savings: "98% Reduction" },
    { name: "Content Copywriting", traditional: "$30 - $80 / Pack", layerSync: "$5.00 / Listing", savings: "94% Reduction" },
    { name: "Lead Qual Receptionist", traditional: "$800 - $1,500 / Mo", layerSync: "$150 / Month", savings: "85% Reduction" },
    { name: "Transaction Coord", traditional: "$300 - $500 / Deal", layerSync: "$15 / Deal", savings: "96% Reduction" },
    { name: "Video Production", traditional: "$200 - $500 / Video", layerSync: "$8.00 / Video", savings: "97% Reduction" }
  ];

  return (
    <section id="roi" className={`relative py-32 sm:py-60 px-6 max-w-7xl mx-auto border-t ${borderSubtle} z-20`}>
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
        <div className="inline-flex items-center gap-3 mb-8 py-1.5 px-5 rounded-full border border-green-500/20 text-green-500 text-[10px] uppercase tracking-[0.3em] font-medium">Regional ROI</div>
        <h2 className="hero-heading mb-10">Market *Efficiency*</h2>
        <p className="sub-heading max-w-2xl mx-auto">Traditional costs in Zimbabwe shouldn't stop you from scaling. We deliver world-class automation at local scale.</p>
      </motion.div>

      <div className={`glass-card overflow-hidden rounded-[48px] border ${borderSubtle}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className={`border-b ${borderSubtle} bg-current opacity-[0.02]`}>
                <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30">Service Layer</th>
                <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30">Traditional Cost</th>
                <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30 text-blue-500">LayerSync AI</th>
                <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30">Savings</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${borderSubtle}`}>
              {marketROI.map((row, i) => (
                <tr key={i} className="hover:bg-current hover:opacity-[0.01] transition-colors group">
                  <td className="p-10 font-medium group-hover:text-blue-500">{row.name}</td>
                  <td className="p-10 opacity-50">{row.traditional}</td>
                  <td className="p-10 font-bold text-blue-500">{row.layerSync}</td>
                  <td className="p-10 text-green-500 font-bold">{row.savings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
