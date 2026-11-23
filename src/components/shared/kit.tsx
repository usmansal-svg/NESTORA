"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sticky page header used across mobile-first apps. */
export function PageHeader({
  title,
  subtitle,
  back,
  actions,
  className,
  large = true,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  back?: string | boolean;
  actions?: React.ReactNode;
  className?: string;
  large?: boolean;
}) {
  const router = useRouter();
  return (
    <header className={cn("sticky top-0 z-30 -mx-4 mb-4 bg-background/85 px-4 pb-3 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur-xl sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:bg-transparent lg:px-0 lg:pt-8 lg:backdrop-blur-none", className)}>
      <div className="flex items-center gap-2">
        {back && (
          <button
            onClick={() => (typeof back === "string" ? router.push(back) : router.back())}
            className="-ml-1.5 grid size-9 shrink-0 place-items-center rounded-full text-foreground transition hover:bg-secondary"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <h1 className={cn("truncate font-semibold tracking-tight", large ? "text-[22px] lg:text-[28px]" : "text-[17px]")}>{title}</h1>
          {subtitle && <p className="truncate text-[13px] text-muted-foreground lg:text-sm">{subtitle}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
      </div>
    </header>
  );
}

export function Section({ title, action, href, children, className, subtitle }: { title: React.ReactNode; action?: React.ReactNode; href?: string; children: React.ReactNode; className?: string; subtitle?: string }) {
  return (
    <section className={cn("mt-7 first:mt-0", className)}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <h2 className="text-[15.5px] font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="text-[12.5px] text-muted-foreground">{subtitle}</p>}
        </div>
        {href ? (
          <Link href={href} className="flex shrink-0 items-center text-[13px] font-medium text-pine-600 hover:text-pine-800">
            {action ?? "See all"} <ChevronRight className="size-4" />
          </Link>
        ) : (
          action
        )}
      </div>
      {children}
    </section>
  );
}

export function IconBubble({ icon: Icon, tone = "pine", className, size = "md" }: { icon: LucideIcon; tone?: Tone; className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span className={cn("grid shrink-0 place-items-center", size === "sm" ? "size-8 rounded-lg [&_svg]:size-4" : size === "lg" ? "size-12 rounded-2xl [&_svg]:size-6" : "size-10 rounded-xl [&_svg]:size-5", toneCls[tone], className)}>
      <Icon strokeWidth={1.9} />
    </span>
  );
}

export type Tone = "pine" | "lime" | "amber" | "red" | "sky" | "violet" | "stone" | "dark" | "rose" | "teal";
export const toneCls: Record<Tone, string> = {
  pine: "bg-pine-50 text-pine-700",
  lime: "bg-lime-soft text-pine-800",
  amber: "bg-amber-soft text-amber-700",
  red: "bg-danger-soft text-danger",
  sky: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  stone: "bg-secondary text-foreground/70",
  dark: "bg-pine-900 text-lime-accent",
  rose: "bg-rose-50 text-rose-700",
  teal: "bg-teal-50 text-teal-700",
};

export function Row({
  icon,
  tone,
  leading,
  title,
  subtitle,
  meta,
  trailing,
  href,
  onClick,
  className,
  chevron = true,
}: {
  icon?: LucideIcon;
  tone?: Tone;
  leading?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  meta?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  chevron?: boolean;
}) {
  const inner = (
    <>
      {leading ?? (icon && <IconBubble icon={icon} tone={tone} />)}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-medium">{title}</div>
        {subtitle && <div className="truncate text-[12.5px] text-muted-foreground">{subtitle}</div>}
        {meta}
      </div>
      {trailing}
      {(href || onClick) && chevron && <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />}
    </>
  );
  const cls = cn("flex w-full items-center gap-3 px-4 py-3 text-left transition", (href || onClick) && "hover:bg-sand-50 active:bg-secondary", className);
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  if (onClick) return <button onClick={onClick} className={cls}>{inner}</button>;
  return <div className={cls}>{inner}</div>;
}

export function List({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft", className)}>{children}</div>;
}

export function Chips<T extends string>({ value, onChange, options, className }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number }[]; className?: string }) {
  return (
    <div className={cn("no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition",
            value === o.value ? "border-pine-800 bg-pine-800 text-white" : "border-border bg-card text-foreground/80 hover:border-pine-300"
          )}
        >
          {o.label}
          {o.count !== undefined && <span className={cn("rounded-full px-1.5 text-[11px]", value === o.value ? "bg-white/15" : "bg-secondary")}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function SearchBar({ value, onChange, placeholder = "Search", className, autoFocus }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string; autoFocus?: boolean }) {
  return (
    <label className={cn("flex h-12 items-center gap-2.5 rounded-2xl border border-border bg-card px-4 shadow-soft focus-within:border-pine-400 focus-within:ring-[3px] focus-within:ring-ring/15", className)}>
      <Search className="size-[18px] text-muted-foreground" />
      <input autoFocus={autoFocus} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-full flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70" />
    </label>
  );
}

export function Empty({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-10 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-secondary text-muted-foreground"><Icon className="size-6" /></span>
      <div className="mt-3 font-medium">{title}</div>
      {body && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Timeline({ items }: { items: { label: React.ReactNode; at?: string; note?: React.ReactNode; done?: boolean; active?: boolean }[] }) {
  return (
    <ol className="relative">
      {items.map((it, i) => (
        <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
          {i < items.length - 1 && <span className={cn("absolute left-[9px] top-5 h-[calc(100%-12px)] w-0.5 rounded-full", it.done ? "bg-pine-500" : "bg-border")} />}
          <span className={cn("relative z-10 mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2", it.done ? "border-pine-500 bg-pine-500" : it.active ? "border-pine-500 bg-card" : "border-border bg-card")}>
            {it.done && <svg viewBox="0 0 12 12" className="size-2.5 text-white"><path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            {it.active && <span className="size-2 animate-pulse-soft rounded-full bg-pine-500" />}
          </span>
          <div className="min-w-0 flex-1">
            <div className={cn("text-sm font-medium", !it.done && !it.active && "text-muted-foreground")}>{it.label}</div>
            {it.at && <div className="text-xs text-muted-foreground">{it.at}</div>}
            {it.note && <div className="mt-1 rounded-xl bg-secondary/70 px-3 py-2 text-[13px] text-foreground/80">{it.note}</div>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Stat({ label, value, sub, icon: Icon, tone = "pine", className, trend }: { label: string; value: React.ReactNode; sub?: React.ReactNode; icon?: LucideIcon; tone?: Tone; className?: string; trend?: { v: string; up?: boolean; good?: boolean } }) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[12.5px] font-medium text-muted-foreground">{label}</span>
        {Icon && <IconBubble icon={Icon} tone={tone} size="sm" />}
      </div>
      <div className="mt-2 text-[22px] font-semibold tracking-tight tabular">{value}</div>
      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        {trend && <span className={cn("rounded-md px-1.5 py-px font-medium", trend.good ? "bg-pine-50 text-pine-700" : "bg-danger-soft text-danger")}>{trend.up ? "▲" : "▼"} {trend.v}</span>}
        {sub}
      </div>
    </div>
  );
}

/** A small live-dot indicator. */
export function LiveDot({ tone = "pine", className }: { tone?: "pine" | "amber" | "red" | "stone"; className?: string }) {
  const c = { pine: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500", stone: "bg-stone-400" }[tone];
  return (
    <span className={cn("relative inline-flex size-2", className)}>
      {tone !== "stone" && <span className={cn("absolute inline-flex size-full animate-ping rounded-full opacity-50", c)} />}
      <span className={cn("relative inline-flex size-2 rounded-full", c)} />
    </span>
  );
}

export function KeyVal({ k, v, className }: { k: React.ReactNode; v: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 py-2 text-sm", className)}>
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}

export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-[12.5px] font-medium", className)}>
      <svg viewBox="0 0 20 20" className="size-3.5 fill-amber-400"><path d="M10 1.5l2.6 5.5 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.7l6-.7z" /></svg>
      {value.toFixed(1)}
    </span>
  );
}
