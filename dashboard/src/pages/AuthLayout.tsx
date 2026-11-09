import type { ReactNode } from "react";
import { Logo } from "../components/Logo";

/** The website's /contact layout: a big light headline on the left, the form card on the right. */
export function AuthLayout({ eyebrow, title, sub, children }: { eyebrow: string; title: ReactNode; sub: ReactNode; children: ReactNode }) {
  return (
    <div className="ambient relative min-h-screen overflow-hidden">
      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-12 px-5 py-10 lg:grid-cols-[1.1fr_1fr] lg:px-10">
        <div className="fade-up">
          <Logo />
          <p className="eyebrow mt-14 mb-5">{eyebrow}</p>
          <h1 className="display bg-gradient-to-r from-ink via-ink to-ink-3 bg-clip-text pb-1 text-[44px] text-transparent sm:text-[64px]">{title}</h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed font-light text-ink-2">{sub}</p>
        </div>
        <div className="fade-up w-full rounded-[32px] border border-line bg-surface/90 p-7 shadow-2xl backdrop-blur sm:p-9" style={{ animationDelay: "80ms" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
