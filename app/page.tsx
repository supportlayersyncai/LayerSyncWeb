import { CyberGrid } from "@/app/components/CyberGrid";
import { FuturisticText } from "@/app/components/FuturisticText";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <CyberGrid />

      <div className="z-10 flex flex-col items-center gap-12">
        <div className="relative">
          <FuturisticText text="COMING SOON" />
          <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent animate-pulse" />
        </div>

        <p className="text-xl md:text-2xl font-rajdhani text-gray-400 max-w-lg text-center tracking-wider">
          Reimagining the future of synchronization.
          <br />
          <span className="text-accent-cyan">Wait for the signal.</span>
        </p>

        <form className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4 mt-8">
          <input
            type="email"
            placeholder="ENTER YOUR EMAIL"
            className="flex-1 bg-black/50 border border-accent-cyan/30 rounded px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan transition-all backdrop-blur-sm font-rajdhani tracking-wider text-lg"
          />
          <button
            type="submit"
            className="px-8 py-3 bg-accent-cyan/10 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-black transition-all duration-300 font-orbitron font-bold tracking-wider rounded uppercase relative overflow-hidden group"
          >
            <span className="relative z-10">Notify Me</span>
            <div className="absolute inset-0 bg-accent-cyan transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left -z-0" />
          </button>
        </form>
      </div>

      <div className="absolute bottom-8 text-xs text-gray-600 font-rajdhani tracking-[0.2em]">
        © 2026 LAYERSYNC SYSTEMS. ALL RIGHTS RESERVED.
      </div>
    </main>
  );
}
