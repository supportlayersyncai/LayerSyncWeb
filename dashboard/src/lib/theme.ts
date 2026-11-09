import { useEffect, useState } from "react";

export function useTheme() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#050505" : "#f5f5f7");
    try {
      localStorage.setItem("syncsite-theme", dark ? "dark" : "light");
    } catch {
      // private mode: theme lasts for this visit
    }
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}
