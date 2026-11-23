"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { LogoMark } from "@/components/shared/logo";
import { Avatar } from "@/components/ui/misc";
import { cn } from "@/lib/utils";

export interface OpsTab { href: string; label: string; icon: LucideIcon; badge?: number }

/** Shared mobile-first shell for operational apps (guard, supervisor, provider, courier). */
export function OpsShell({ app, person, role, photo, tabs, status, children, tone = "dark" }: { app: string; person: string; role: string; photo?: string; tabs: OpsTab[]; status?: React.ReactNode; children: React.ReactNode; tone?: "dark" | "light" }) {
  const path = usePathname();
  const active = (h: string) => (h === tabs[0].href ? path === h : path.startsWith(h));
  return (
    <div className="min-h-dvh bg-background">
      <header className={cn("sticky top-0 z-30", tone === "dark" ? "bg-pine-950 text-white" : "border-b bg-card")}>
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4">
          <LogoMark className="size-8" inverted={tone === "dark"} />
          <div className="min-w-0 flex-1">
            <div className={cn("text-[11px] font-semibold uppercase tracking-[0.16em]", tone === "dark" ? "text-lime-accent" : "text-pine-600")}>{app}</div>
            <div className="truncate text-sm font-medium">{person} <span className={tone === "dark" ? "text-white/50" : "text-muted-foreground"}>· {role}</span></div>
          </div>
          {status}
          <Avatar src={photo} name={person} className="size-9" />
        </div>
        {tabs.length > 1 && <nav className="mx-auto hidden max-w-5xl gap-1 px-3 pb-2 md:flex">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className={cn("flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition", active(t.href) ? (tone === "dark" ? "bg-white/10 text-white" : "bg-secondary") : tone === "dark" ? "text-white/60 hover:text-white" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="size-4" />{t.label}{!!t.badge && <span className="rounded-full bg-lime-accent px-1.5 text-[11px] text-pine-950">{t.badge}</span>}
            </Link>
          ))}
        </nav>}
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-28 pt-5 md:pb-12">{children}</main>
      {tabs.length > 1 && <nav className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 pb-safe backdrop-blur md:hidden">
        <div className="flex">
          {tabs.map((t) => (
            <Link key={t.href} href={t.href} className={cn("relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium", active(t.href) ? "text-pine-800" : "text-muted-foreground")}>
              <t.icon className="size-5" strokeWidth={active(t.href) ? 2.2 : 1.8} />{t.label}
              {!!t.badge && <span className="absolute right-[calc(50%-18px)] top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 text-[10px] text-white">{t.badge}</span>}
            </Link>
          ))}
        </div>
      </nav>}
    </div>
  );
}

export function BigAction({ icon: Icon, label, sub, href, onClick, tone = "light" }: { icon: LucideIcon; label: string; sub?: string; href?: string; onClick?: () => void; tone?: "light" | "dark" | "lime" | "red" }) {
  const cls = cn("flex flex-col gap-3 rounded-2xl p-4 text-left shadow-soft transition active:scale-[0.98] hover:shadow-lift",
    tone === "dark" ? "bg-pine-900 text-white" : tone === "lime" ? "bg-lime-accent text-pine-950" : tone === "red" ? "bg-danger text-white" : "border border-border/70 bg-card");
  const inner = <><Icon className="size-6" strokeWidth={1.8} /><div><div className="font-semibold">{label}</div>{sub && <div className={cn("text-xs", tone === "light" ? "text-muted-foreground" : "opacity-70")}>{sub}</div>}</div></>;
  return href ? <Link href={href} className={cls}>{inner}</Link> : <button onClick={onClick} className={cls}>{inner}</button>;
}
