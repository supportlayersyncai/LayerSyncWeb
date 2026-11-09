/** Demo build only: stands in for "@convex-dev/auth/react". */
import type { ReactNode } from "react";

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuthActions() {
  return {
    signIn: async () => {
      location.assign("/layersync");
      return { signingIn: true };
    },
    signOut: async () => location.assign("/login"),
  };
}
