"use client";
import * as React from "react";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Brand context for the two demo themes.
 * "nestora" — the general NESTORA product (demo building: Ocean Heights).
 * "emaar"   — a co-branded pitch edition for Emaar Pakistan (Emaar Oceanfront, Karachi).
 */
export const BRANDS = {
  nestora: { building: "Ocean Heights", community: "DHA Phase VIII", area: "DHA, Karachi", short: "OH", partner: null as string | null, hero: null as string | null },
  emaar: { building: "Panorama", community: "Emaar Oceanfront", area: "Emaar Oceanfront, DHA Phase VIII, Karachi", short: "PN", partner: "EMAAR", hero: "/brand/emaar-oceanfront.jpg" },
};

export function useBrand() {
  const theme = useDemo((s) => s.theme);
  return { theme, ...BRANDS[theme] };
}

// Demo data is written for Ocean Heights. In the Emaar edition we re-label it on screen
// so the same live data reads as Emaar Oceanfront without forking the data set.
const MAP: [RegExp, string][] = [
  [/Ocean Heights/g, "Panorama"],
  [/Clifton Crest/g, "The Views"],
  [/Emerald Towers/g, "Park Edge"],
  [/Clifton Block 4|Shahrah-e-Faisal/g, "Emaar Oceanfront"],
];
function relabel(node: Node) {
  const walk = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  let n: Node | null = node.nodeType === Node.TEXT_NODE ? node : walk.nextNode();
  while (n) {
    const v = n.nodeValue ?? "";
    if (/Ocean Heights|Clifton Crest|Emerald Towers|Clifton Block 4|Shahrah-e-Faisal/.test(v)) {
      let out = v;
      for (const [r, s] of MAP) out = out.replace(r, s);
      if (out !== v) n.nodeValue = out;
    }
    n = node.nodeType === Node.TEXT_NODE ? null : walk.nextNode();
  }
}

export function BrandText() {
  const theme = useDemo((s) => s.theme);
  React.useEffect(() => {
    if (theme !== "emaar") return;
    relabel(document.body);
    const mo = new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === "characterData") relabel(m.target);
        else m.addedNodes.forEach((a) => relabel(a));
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => mo.disconnect();
  }, [theme]);
  return null;
}

export function EmaarLogo({ className, inverted }: { className?: string; inverted?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/emaar-logo.png" alt="Emaar Pakistan" className={cn("h-7 w-auto", inverted && "brightness-0 invert", className)} />;
}

/** Switch between the general NESTORA theme and the Emaar edition. Reloads so every label re-renders cleanly. */
export function ThemeToggle({ className, dark }: { className?: string; dark?: boolean }) {
  const theme = useDemo((s) => s.theme);
  const setTheme = useDemo((s) => s.setTheme);
  const pick = (t: "nestora" | "emaar") => {
    if (t === theme) return;
    setTheme(t);
    const u = new URL(window.location.href);
    u.searchParams.delete("theme");
    setTimeout(() => window.location.replace(u.toString()), 60);
  };
  return (
    <div className={cn("inline-flex rounded-full p-1 text-xs font-medium", dark ? "bg-white/10 ring-1 ring-white/15" : "bg-secondary", className)}>
      {(["nestora", "emaar"] as const).map((t) => (
        <button key={t} onClick={() => pick(t)} className={cn("rounded-full px-3 py-1.5 transition", theme === t ? (dark ? "bg-white text-pine-950" : "bg-card text-foreground shadow-soft") : dark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground")}>
          {t === "nestora" ? "NESTORA" : "Emaar edition"}
        </button>
      ))}
    </div>
  );
}
