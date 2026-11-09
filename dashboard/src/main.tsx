import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { ToastProvider } from "./components/ui";
import "./styles.css";

const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
const root = createRoot(document.getElementById("root")!);

if (!url) {
  root.render(
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <p className="eyebrow mb-3">Setup</p>
        <h1 className="display text-3xl">Set VITE_CONVEX_URL</h1>
        <p className="mt-2 text-ink-3">Copy .env.example to .env.local and point it at your Convex deployment.</p>
      </div>
    </div>,
  );
} else {
  const convex = new ConvexReactClient(url);
  root.render(
    <StrictMode>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <ToastProvider>
            <App />
          </ToastProvider>
        </BrowserRouter>
      </ConvexAuthProvider>
    </StrictMode>,
  );
}
