import { useAuthActions } from "@convex-dev/auth/react";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Field, Input } from "../components/ui";
import { AuthLayout } from "./AuthLayout";

/** Convex Auth errors aren't for people; say the same thing whatever went wrong, except throttling. */
function signInError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err);
  if (/TooManyFailedAttempts|rate/i.test(msg)) return "Too many attempts. Wait a few minutes, or reset your password.";
  return "That email and password don't match. Check them, or reset your password.";
}

export function Login({ mode = "signin" }: { mode?: "signin" | "reset" }) {
  return mode === "reset" ? <Reset /> : <SignIn />;
}

function SignIn() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email: email.trim(), password, flow: "signIn" });
      const next = new URLSearchParams(location.search).get("next");
      // Same-site paths only, so a crafted ?next= can't send anyone elsewhere.
      navigate(next && /^\/[a-z0-9]/i.test(next) ? next : "/", { replace: true });
    } catch (err) {
      setError(signInError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="SyncSite"
      title={
        <>
          See who's <em className="font-extralight">visiting.</em>
        </>
      }
      sub="Your website's visitors, where they came from, and every enquiry they send, in one place. Built by LayerSync for the sites we build."
    >
      <form onSubmit={submit} noValidate className="space-y-5">
        <div>
          <p className="eyebrow">Sign in</p>
          <h2 className="display mt-3 text-[28px]">Welcome back.</h2>
        </div>
        <Field label="Email" htmlFor="email">
          <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
        </Field>
        <Field label="Password" htmlFor="password">
          <Input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        {error && (
          <p role="alert" className="rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-ink-2">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" className="w-full" loading={busy} disabled={!email || !password}>
          Sign in <ArrowRight className="h-4 w-4" />
        </Button>
        <div className="flex flex-wrap justify-between gap-2 text-sm text-ink-3">
          <Link to="/reset" className="underline-offset-4 hover:text-ink hover:underline">
            Forgot your password?
          </Link>
          <span>Accounts are by invitation.</span>
        </div>
      </form>
    </AuthLayout>
  );
}

function Reset() {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const sendCode = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email: email.trim(), flow: "reset" });
    } catch {
      // Same answer whether or not the address has an account.
    } finally {
      setBusy(false);
      setStep("code");
    }
  };

  const verify = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email: email.trim(), code: code.trim(), newPassword: password, flow: "reset-verification" });
      navigate("/", { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      setError(/password/i.test(msg) && /10|guess|long/i.test(msg) ? msg.replace(/^.*?Error: /, "").split("\n")[0] : "That code didn't work. Check it, or ask for a new one.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Password reset"
      title={
        <>
          Back in, <em className="font-extralight">quickly.</em>
        </>
      }
      sub="We'll email you an 8-digit code. It works for 15 minutes, and signing in with your new password signs you out everywhere else."
    >
      {step === "email" ? (
        <form onSubmit={sendCode} className="space-y-5">
          <h2 className="display text-[28px]">Reset your password</h2>
          <Field label="Email" htmlFor="email">
            <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
          </Field>
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={busy} disabled={!email}>
            Email me a code
          </Button>
          <Link to="/login" className="block text-sm text-ink-3 hover:text-ink">
            Back to sign in
          </Link>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-5">
          <h2 className="display text-[28px]">Check your email</h2>
          <p className="text-sm leading-relaxed text-ink-3">If {email} has a SyncSite account, a code is on its way.</p>
          <Field label="Code" htmlFor="code">
            <Input id="code" inputMode="numeric" autoComplete="one-time-code" maxLength={8} required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} className="tracking-[0.4em]" />
          </Field>
          <Field label="New password" htmlFor="new-password" hint="At least 10 characters. A short sentence works well.">
            <Input id="new-password" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && (
            <p role="alert" className="rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-ink-2">
              {error}
            </p>
          )}
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={busy} disabled={code.length !== 8 || password.length < 10}>
            Set new password
          </Button>
          <button type="button" onClick={() => setStep("email")} className="text-sm text-ink-3 hover:text-ink">
            Use a different email
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
