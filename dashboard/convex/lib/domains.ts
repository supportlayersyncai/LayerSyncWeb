/**
 * Site domains. A site lists the hostnames its tracker may run on; events
 * from anywhere else are dropped. "example.com" also covers "www.example.com";
 * "*.example.com" covers every subdomain.
 */

const HOST_RE = /^(\*\.)?([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;

/** Normalise what an admin typed ("https://www.Example.com/path") to "example.com". */
export function normalizeDomain(input: string): string | null {
  let s = input.trim().toLowerCase();
  if (!s) return null;
  const wildcard = s.startsWith("*.");
  if (wildcard) s = s.slice(2);
  try {
    s = new URL(s.includes("://") ? s : `https://${s}`).hostname;
  } catch {
    return null;
  }
  s = s.replace(/^www\./, "").replace(/\.$/, "");
  const out = wildcard ? `*.${s}` : s;
  return HOST_RE.test(out) ? out : null;
}

/** Hostname from an Origin or URL header value. */
export function hostFromOrigin(origin: string | undefined | null): string | undefined {
  if (!origin || origin === "null") return undefined;
  try {
    return new URL(origin).hostname.toLowerCase();
  } catch {
    return undefined;
  }
}

/** Whether `host` is allowed by `domains` (see the module comment for the rules). */
export function hostAllowed(host: string | undefined, domains: string[], allowLocalhost = false): boolean {
  if (!host) return false;
  const h = host.toLowerCase().replace(/\.$/, "");
  if (allowLocalhost && (h === "localhost" || h === "127.0.0.1" || h === "[::1]")) return true;
  const bare = h.replace(/^www\./, "");
  return domains.some((d) => {
    if (d.startsWith("*.")) {
      const base = d.slice(2);
      return bare === base || bare.endsWith(`.${base}`);
    }
    return bare === d;
  });
}

/** Hosts that count as "the site itself" for referrer purposes. */
export function ownHosts(domains: string[]): string[] {
  return domains.map((d) => (d.startsWith("*.") ? d.slice(2) : d));
}
