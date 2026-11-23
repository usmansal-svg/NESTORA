"use client";
import { useDemo } from "@/lib/store";
import { EmaarLogo } from "./brand";
import { cn } from "@/lib/utils";

export function LogoMark({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8 shrink-0", className)} aria-hidden>
      <rect width="32" height="32" rx="9.5" fill={inverted ? "var(--background)" : "var(--color-pine-800)"} />
      <path d="M8.5 15.2 16 9.2l7.5 6" stroke="var(--color-lime-accent)" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.6 18.4c1.7 2.9 3.8 4.4 6.4 4.4s4.7-1.5 6.4-4.4" stroke={inverted ? "var(--color-pine-800)" : "var(--background)"} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <circle cx="16" cy="16.6" r="1.6" fill={inverted ? "var(--color-pine-800)" : "var(--background)"} />
    </svg>
  );
}

export function Logo({ className, inverted, tagline }: { className?: string; inverted?: boolean; tagline?: boolean }) {
  const emaar = useDemo((s) => s.theme) === "emaar";
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark inverted={inverted} />
      <div className="leading-none">
        <div className={cn("text-[17px] font-semibold tracking-[0.14em]", inverted ? "text-white" : "text-pine-900")}>NESTORA</div>
        {tagline && <div className={cn("mt-1 text-[10.5px] tracking-wide", inverted ? "text-white/60" : "text-muted-foreground")}>{emaar ? "Emaar Oceanfront community app" : "Your Community. Everything Connected."}</div>}
      </div>
      {emaar && <><span className={cn("mx-0.5 h-6 w-px", inverted ? "bg-white/25" : "bg-border")} /><EmaarLogo inverted={inverted} className="h-6" /></>}
    </div>
  );
}
