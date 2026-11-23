"use client";
import * as React from "react";
import { Toaster } from "sonner";
import { enableCrossTabSync, useDemo } from "@/lib/store";
import { TooltipProvider } from "@/components/ui/misc";
import { DemoSwitcher } from "./demo-switcher";
import { LogoMark } from "./logo";
import { BrandText, LOCKED_THEME } from "./brand";

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const r = useDemo.persist.rehydrate();
    Promise.resolve(r).then(() => setReady(true));
    return enableCrossTabSync();
  }, []);
  const theme = useDemo((s) => s.theme);
  const setTheme = useDemo((s) => s.setTheme);
  React.useEffect(() => {
    if (!ready) return;
    if (LOCKED_THEME) return setTheme(LOCKED_THEME);
    const q = new URLSearchParams(window.location.search).get("theme");
    if (q === "emaar" || q === "nestora") setTheme(q);
  }, [ready, setTheme]);
  React.useEffect(() => {
    if (!ready) return;
    if (theme === "emaar") document.documentElement.dataset.theme = "emaar";
    else delete document.documentElement.dataset.theme;
    document.title = theme === "emaar" ? "NESTORA × EMAAR — Emaar Oceanfront community app" : "NESTORA — Your Community. Everything Connected.";
  }, [theme, ready]);
  return (
    <TooltipProvider>
      {ready ? (
        <>
          <BrandText />
          {children}
          <DemoSwitcher />
        </>
      ) : (
        <div className="grid min-h-dvh place-items-center bg-background">
          <LogoMark className="size-12 animate-pulse-soft" />
        </div>
      )}
      <Toaster position="top-center" toastOptions={{ classNames: { toast: "!rounded-2xl !border-border !shadow-lift !font-sans", title: "!font-medium" } }} />
    </TooltipProvider>
  );
}
