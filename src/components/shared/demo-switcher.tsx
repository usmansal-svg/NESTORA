"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, RotateCcw, Sparkles, X } from "lucide-react";
import { ROLES } from "@/lib/roles";
import { useDemo } from "@/lib/store";
import { LOCKED_THEME, ThemeToggle } from "./brand";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function currentRole(path: string) {
  if (path.startsWith("/admin/billing")) return ROLES.find((r) => r.id === "treasurer")!;
  const seg = path.split("/")[1];
  return ROLES.find((r) => r.href === `/${seg}`) ?? null;
}

export function DemoSwitcher() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const reset = useDemo((s) => s.reset);
  const role = currentRole(path);
  if (path === "/") return null;
  const right = path.startsWith("/admin") || path.startsWith("/locker") || path.startsWith("/business");
  const lift = path.startsWith("/resident") || path.startsWith("/guard") || path.startsWith("/supervisor") || path.startsWith("/provider");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed z-40 flex items-center gap-2 rounded-full border border-white/10 bg-pine-950/90 py-1.5 pl-1.5 pr-3.5 text-xs font-medium text-white shadow-lift backdrop-blur transition hover:bg-pine-900",
          right ? "bottom-5 right-4" : "left-3",
          !right && (lift ? "bottom-[92px] lg:bottom-5" : "bottom-5")
        )}
      >
        <span className="grid size-6 place-items-center rounded-full bg-lime-accent text-pine-950"><Sparkles className="size-3.5" /></span>
        <span className="hidden sm:inline text-white/60">Demo as</span> {role?.label ?? "Switch role"}
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-pine-950/50 p-3 backdrop-blur-sm sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-2xl animate-rise rounded-[28px] bg-background p-5 shadow-lift sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between">
              <div>
                <div className="text-xs font-medium uppercase tracking-[0.18em] text-pine-600">Demo environment</div>
                <div className="mt-1 text-xl font-semibold tracking-tight">Switch experience</div>
                <p className="mt-1 text-sm text-muted-foreground">Ocean Heights, DHA Karachi. Open two roles in separate tabs to watch them sync live.</p>
              </div>
              <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full bg-secondary"><X className="size-4" /></button>
            </div>
            {!LOCKED_THEME && <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/60 p-3">
              <div className="text-sm"><div className="font-medium">Theme</div><div className="text-xs text-muted-foreground">General NESTORA, or the Emaar Oceanfront pitch edition</div></div>
              <ThemeToggle />
            </div>}
            <div className="grid gap-2 sm:grid-cols-2">
              {ROLES.map((r) => {
                const active = role?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => { setOpen(false); router.push(r.href); }}
                    className={cn("group flex items-center gap-3 rounded-2xl border p-3 text-left transition hover:border-pine-300 hover:bg-card", active ? "border-pine-500 bg-card ring-2 ring-pine-500/15" : "border-border/80 bg-sand-50")}
                  >
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", active ? "bg-primary text-white" : "bg-pine-50 text-pine-700")}><r.icon className="size-5" /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-semibold">{r.label}<span className="rounded-full bg-secondary px-1.5 py-px text-[10px] font-medium text-muted-foreground">{r.surface}</span></span>
                      <span className="block truncate text-xs text-muted-foreground">{r.person}</span>
                    </span>
                    <a href={r.href} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title="Open in new tab" className="grid size-7 place-items-center rounded-full text-muted-foreground opacity-0 transition group-hover:opacity-100 hover:bg-secondary">
                      <ArrowUpRight className="size-4" />
                    </a>
                  </button>
                );
              })}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <Link href="/" onClick={() => setOpen(false)} className="text-sm font-medium text-pine-700 hover:underline">Demo home</Link>
              <button onClick={() => { reset(); toast.success("Demo data reset"); }} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"><RotateCcw className="size-3.5" /> Reset demo data</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
