import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Button, errorMessage, Field, Input, PageLoading } from "../components/ui";
import { AuthLayout } from "./AuthLayout";

/** Read the token from the fragment once, then take it out of the address bar. */
function useInviteToken(): string {
  const [token] = useState(() => {
    const fromHash = location.hash.replace(/^#/, "");
    const saved = sessionStorage.getItem("syncsite-invite") ?? "";
    const t = fromHash || saved;
    if (t) sessionStorage.setItem("syncsite-invite", t);
    return t;
  });
  useEffect(() => {
    if (location.hash) history.replaceState(null, "", location.pathname);
  }, []);
  return token;
}

export function Invite() {
  const token = useInviteToken();
  const { isAuthenticated } = useConvexAuth();
  const peek = useQuery(api.invites.peek, token ? { token } : "skip");
  const me = useQuery(api.workspaces.me, isAuthenticated ? {} : "skip");

  if (!token) return <Dead />;
  if (peek === undefined) return <PageLoading />;
  if (!peek.valid) return <Dead />;

  const where = peek.staff ? "LayerSync staff" : peek.workspaceName ?? "SyncSite";
  return (
    <AuthLayout
      eyebrow="Invitation"
      title={
        <>
          Join <em className="font-extralight">{where}.</em>
        </>
      }
      sub={`You've been invited as ${peek.staff ? "staff" : peek.role}. Visitors, where they came from, and every enquiry your website gets, in one place.`}
    >
      {isAuthenticated ? (
        me ? <Accept token={token} email={peek.email} meEmail={me.email} /> : <PageLoading />
      ) : peek.accountExists ? (
        <SignInToAccept email={peek.email} />
      ) : (
        <CreateAccount token={token} email={peek.email} />
      )}
    </AuthLayout>
  );
}

function Dead() {
  return (
    <AuthLayout eyebrow="Invitation" title="This link has expired." sub="Invitation links work once and expire after 7 days.">
      <h2 className="display text-[26px]">Ask for a new invitation</h2>
      <p className="mt-3 text-sm leading-relaxed text-ink-3">Whoever invited you can send a fresh one from Settings, Team. Already set up?</p>
      <Link to="/login" className="mt-6 inline-block">
        <Button variant="primary">Sign in</Button>
      </Link>
    </AuthLayout>
  );
}

function CreateAccount({ token, email }: { token: string; email: string }) {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email, password, name: name.trim(), invite: token, flow: "signUp" });
      sessionStorage.removeItem("syncsite-invite");
      navigate("/", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <h2 className="display text-[28px]">Set up your account</h2>
      <Field label="Email">
        <Input value={email} disabled readOnly />
      </Field>
      <Field label="Your name" htmlFor="name">
        <Input id="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Tendai Moyo" />
      </Field>
      <Field label="Password" htmlFor="pw" hint="At least 10 characters. A short sentence works well.">
        <Input id="pw" type="password" autoComplete="new-password" required minLength={10} value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Field label="Password again" htmlFor="pw2">
        <Input id="pw2" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Field>
      {error && (
        <p role="alert" className="rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm text-ink-2">
          {error}
        </p>
      )}
      <Button type="submit" variant="primary" size="lg" className="w-full" loading={busy} disabled={name.trim().length < 2 || password.length < 10}>
        Create account <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}

function SignInToAccept({ email }: { email: string }) {
  const { signIn } = useAuthActions();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signIn("password", { email, password, flow: "signIn" });
    } catch {
      setError("That password didn't work. You can reset it from the sign-in page.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-5">
      <h2 className="display text-[28px]">Sign in to accept</h2>
      <p className="text-sm text-ink-3">You already have a SyncSite account as {email}.</p>
      <Field label="Password" htmlFor="pw">
        <Input id="pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      {error && <p className="text-sm text-bad">{error}</p>}
      <Button type="submit" variant="primary" size="lg" className="w-full" loading={busy} disabled={!password}>
        Sign in
      </Button>
    </form>
  );
}

function Accept({ token, email, meEmail }: { token: string; email: string; meEmail: string | null }) {
  const accept = useMutation(api.invites.accept);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  if (meEmail !== email) {
    return (
      <div className="space-y-4">
        <h2 className="display text-[26px]">Wrong account</h2>
        <p className="text-sm leading-relaxed text-ink-3">
          You're signed in as {meEmail}, but this invitation is for {email}.
        </p>
        <Button variant="primary" onClick={() => void signOut()}>
          Sign out
        </Button>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      <h2 className="display text-[28px]">Accept the invitation</h2>
      {error && <p className="text-sm text-bad">{error}</p>}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const { slug } = await accept({ token });
            sessionStorage.removeItem("syncsite-invite");
            navigate(slug ? `/${slug}` : "/staff", { replace: true });
          } catch (err) {
            setError(errorMessage(err));
            setBusy(false);
          }
        }}
      >
        Accept and continue <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
