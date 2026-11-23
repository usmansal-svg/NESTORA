"use client";
import * as React from "react";

/** Read a query param on the client (all app screens render client-side after hydration). */
export function useQuery(key: string) {
  const [v, setV] = React.useState<string | null>(() => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get(key)));
  React.useEffect(() => {
    setV(new URLSearchParams(window.location.search).get(key));
  }, [key]);
  return v;
}

export function useTick(ms = 1000) {
  const [, set] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => set((x) => x + 1), ms);
    return () => clearInterval(t);
  }, [ms]);
}
