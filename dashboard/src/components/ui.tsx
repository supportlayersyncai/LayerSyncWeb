/**
 * The dashboard's building blocks, in the website's language: pill buttons
 * with tracked uppercase labels, rounded-2xl inputs on a faint fill, cards
 * with hairline borders and generous radii.
 */
import { Check, Copy, Loader2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

export const cx = (...c: Array<string | false | null | undefined>) => c.filter(Boolean).join(" ");

// ── Buttons ──────────────────────────────────────────────────────────────

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({ variant = "secondary", size = "md", loading, icon, className, children, disabled, ...rest }: ButtonProps) {
  const sizes = {
    sm: "h-8 px-3.5 text-[10px] gap-1.5",
    md: "h-10 px-5 text-[11px] gap-2",
    lg: "h-12 px-7 text-[11px] gap-2.5",
  };
  const variants = {
    // The website's primary: white on dark, black on light.
    primary: "bg-ink text-bg hover:opacity-90",
    secondary: "border border-line-strong text-ink-2 hover:text-ink hover:border-ink-3",
    ghost: "text-ink-2 hover:text-ink hover:bg-surface-3",
    danger: "border border-bad/40 text-bad hover:bg-bad/10",
    accent: "bg-brand-green text-[#0b1408] hover:brightness-110",
  };
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase tracking-[0.18em] whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        sizes[size],
        variants[variant],
        className,
      )}
      {...rest}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : icon}
      {children}
    </button>
  );
}

export function IconButton({ label, className, children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx("grid h-9 w-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-surface-3 hover:text-ink", className)}
      {...rest}
    >
      {children}
    </button>
  );
}

// ── Forms ────────────────────────────────────────────────────────────────

const control =
  "w-full rounded-2xl border border-line bg-surface-2 px-4 text-[15px] text-ink placeholder:text-ink-3/70 outline-none transition-colors focus:border-brand-green focus:ring-2 focus:ring-brand-green/25 disabled:opacity-60";

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: ReactNode; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="eyebrow mb-2 block">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-[13px] text-bad">{error}</p> : hint ? <p className="mt-1.5 text-xs text-ink-3">{hint}</p> : null}
    </div>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx(control, "h-12", className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx(control, "min-h-24 py-3 leading-relaxed", className)} {...rest} />;
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cx(control, "h-12 appearance-none bg-[length:16px] bg-[right_14px_center] bg-no-repeat pr-10", className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%238f9aab' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }} {...rest}>
      {children}
    </select>
  );
}

export function Switch({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: ReactNode; disabled?: boolean }) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div>
        <label htmlFor={id} className="text-[15px] font-medium text-ink">
          {label}
        </label>
        {description && <p className="mt-0.5 text-sm text-ink-3">{description}</p>}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cx(
          "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50",
          checked ? "bg-brand-green" : "bg-surface-3 ring-1 ring-line-strong ring-inset",
        )}
      >
        <span className={cx("absolute top-0.5 left-0 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[22px]" : "translate-x-0.5")} />
      </button>
    </div>
  );
}

/** A row of pill options (date presets, tabs). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  size = "md",
}: {
  value: T;
  onChange: (v: T) => void;
  options: Array<{ value: T; label: ReactNode; title?: string }>;
  label: string;
  size?: "sm" | "md";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-line bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          title={o.title}
          onClick={() => onChange(o.value)}
          className={cx(
            "shrink-0 rounded-full font-semibold whitespace-nowrap transition-colors",
            size === "sm" ? "px-3 py-1 text-xs" : "px-3.5 py-1.5 text-[13px]",
            value === o.value ? "bg-ink text-bg" : "text-ink-3 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Surfaces ─────────────────────────────────────────────────────────────

export function Card({ className, children, as: As = "section" }: { className?: string; children: ReactNode; as?: "section" | "div" | "article" }) {
  return <As className={cx("relative min-w-0 rounded-[28px] border border-line bg-surface", className)}>{children}</As>;
}

export function CardHeader({ title, eyebrow, action, icon, className }: { title: ReactNode; eyebrow?: ReactNode; action?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cx("flex items-start justify-between gap-4 px-6 pt-6", className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h2 className="flex items-center gap-2 text-[15px] font-semibold text-ink">
          {icon && <span className="text-ink-3">{icon}</span>}
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2 rounded-full border border-line bg-surface-3/60 px-4 py-1.5 text-[10px] font-bold tracking-[0.3em] text-ink-3 uppercase", className)}>
      {children}
    </span>
  );
}

export function PageHeader({ eyebrow, title, description, actions }: { eyebrow?: ReactNode; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="display text-[34px] md:text-[44px]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-[15px] leading-relaxed font-light text-ink-2">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-label="Loading" className={cx("h-5 w-5 animate-spin text-ink-3", className)} />;
}

export function PageLoading() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <Spinner />
    </div>
  );
}

export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      {icon && <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface-2 text-ink-3">{icon}</div>}
      <p className="text-[15px] font-medium text-ink">{title}</p>
      {children && <div className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-3">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Status ───────────────────────────────────────────────────────────────

export type ContactStatus = "new" | "contacted" | "qualified" | "won" | "lost" | "spam";
export const STATUS_LABEL: Record<ContactStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  won: "Won",
  lost: "Lost",
  spam: "Spam",
};
const STATUS_STYLE: Record<ContactStatus, string> = {
  new: "bg-brand-orange/12 text-brand-orange ring-brand-orange/25",
  contacted: "bg-[var(--series-2)]/12 text-ink-2 ring-[var(--series-2)]/30",
  qualified: "bg-[var(--series-6)]/12 text-ink-2 ring-[var(--series-6)]/30",
  won: "bg-brand-green/15 text-good ring-brand-green/30",
  lost: "bg-surface-3 text-ink-3 ring-line-strong",
  spam: "bg-surface-3 text-ink-3 ring-line-strong",
};
const STATUS_DOT: Record<ContactStatus, string> = {
  new: "bg-brand-orange",
  contacted: "bg-[var(--series-2)]",
  qualified: "bg-[var(--series-6)]",
  won: "bg-brand-green",
  lost: "bg-ink-3",
  spam: "bg-ink-3",
};

/** Status is always a label plus a dot, never colour alone. */
export function StatusPill({ status, className }: { status: ContactStatus; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", STATUS_STYLE[status], className)}>
      <span className={cx("h-1.5 w-1.5 rounded-full", STATUS_DOT[status])} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "orange" | "green" | "warn"; className?: string }) {
  const tones = {
    neutral: "bg-surface-3 text-ink-2 ring-line-strong",
    orange: "bg-brand-orange/12 text-brand-orange ring-brand-orange/25",
    green: "bg-brand-green/15 text-good ring-brand-green/30",
    warn: "bg-warn/12 text-warn ring-warn/30",
  };
  return <span className={cx("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", tones[tone], className)}>{children}</span>;
}

// ── Overlays ─────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>("input, textarea, select, button")?.focus(), 30);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, select, textarea");
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cx("fade-up relative max-h-[calc(100svh-24px)] w-full overflow-y-auto rounded-[28px] border border-line bg-surface p-6 shadow-2xl sm:p-8", wide ? "max-w-2xl" : "max-w-md")}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2 className="display text-[26px]">{title}</h2>
          <IconButton label="Close" onClick={onClose} className="-mt-1 -mr-2">
            <X className="h-4 w-4" />
          </IconButton>
        </div>
        {children}
        {footer && <div className="mt-7 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function CopyButton({ text, label = "Copy", className }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      variant="secondary"
      className={className}
      icon={done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          // Clipboard blocked: the text is selectable on screen anyway.
        }
      }}
    >
      {done ? "Copied" : label}
    </Button>
  );
}

export function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <span className="eyebrow">{label ?? "Code"}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto px-4 py-3 text-[12.5px] leading-relaxed text-ink-2">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ── Toasts ───────────────────────────────────────────────────────────────

type Toast = { id: number; title: string; body?: string; tone: "info" | "error" | "success"; action?: { label: string; onClick: () => void } };
const ToastContext = createContext<(t: Omit<Toast, "id">) => void>(() => undefined);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((all) => [...all.slice(-3), { ...t, id }]);
    setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), t.tone === "error" ? 7000 : 5000);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed right-4 bottom-4 left-4 z-[60] flex flex-col items-end gap-2 sm:left-auto">
        {toasts.map((t) => (
          <div key={t.id} role="status" className="fade-up pointer-events-auto w-full max-w-sm rounded-2xl border border-line bg-surface p-4 shadow-xl">
            <div className="flex items-start gap-3">
              <span className={cx("mt-1.5 h-2 w-2 shrink-0 rounded-full", t.tone === "error" ? "bg-bad" : t.tone === "success" ? "bg-brand-green" : "bg-brand-orange")} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">{t.title}</p>
                {t.body && <p className="mt-0.5 text-sm text-ink-3">{t.body}</p>}
                {t.action && (
                  <button type="button" className="mt-2 text-xs font-bold tracking-[0.15em] text-ink uppercase underline underline-offset-4" onClick={t.action.onClick}>
                    {t.action.label}
                  </button>
                )}
              </div>
              <button type="button" aria-label="Dismiss" className="text-ink-3 hover:text-ink" onClick={() => setToasts((all) => all.filter((x) => x.id !== t.id))}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** A Convex error's message for people: ConvexError data, else something generic. */
export function errorMessage(err: unknown): string {
  if (err && typeof err === "object" && "data" in err && typeof (err as { data: unknown }).data === "string") return (err as { data: string }).data;
  if (err instanceof Error) {
    const m = err.message.match(/Uncaught (?:ConvexError|Error): (.*?)(?:\n|$)/);
    if (m) return m[1];
  }
  return "Something went wrong. Please try again.";
}
