"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function nextDays(n = 14, start = 0) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + i + start);
    return d;
  });
}

export function DateStrip({ value, onChange, days = 14, start = 0, className }: { value: Date; onChange: (d: Date) => void; days?: number; start?: number; className?: string }) {
  return (
    <div className={cn("no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1", className)}>
      {nextDays(days, start).map((d) => {
        const sel = d.toDateString() === value.toDateString();
        const today = d.toDateString() === new Date().toDateString();
        return (
          <button key={d.toISOString()} type="button" onClick={() => onChange(d)} className={cn("flex w-[58px] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition", sel ? "border-pine-800 bg-pine-800 text-white shadow-soft" : "border-border bg-card hover:border-pine-300")}>
            <span className={cn("text-[11px] font-medium", sel ? "text-white/70" : "text-muted-foreground")}>{today ? "Today" : d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
            <span className="text-lg font-semibold leading-tight">{d.getDate()}</span>
            <span className={cn("text-[10.5px]", sel ? "text-white/60" : "text-muted-foreground")}>{d.toLocaleDateString("en-GB", { month: "short" })}</span>
          </button>
        );
      })}
    </div>
  );
}

export const DEFAULT_SLOTS = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
export const slotLabel = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
};

/** Deterministic pseudo-availability so slots feel real. */
export function TimeSlots({ value, onChange, slots = DEFAULT_SLOTS, date, seed = "x", className }: { value?: string; onChange: (s: string) => void; slots?: string[]; date: Date; seed?: string; className?: string }) {
  const isToday = date.toDateString() === new Date().toDateString();
  const nowH = new Date().getHours();
  return (
    <div className={cn("grid grid-cols-3 gap-2 sm:grid-cols-4", className)}>
      {slots.map((s, i) => {
        const h = Number(s.split(":")[0]);
        const hash = [...(seed + date.getDate() + s)].reduce((a, c) => a + c.charCodeAt(0), 0);
        const taken = hash % 5 === 0 || (isToday && h <= nowH);
        const sel = value === s;
        return (
          <button key={s + i} type="button" disabled={taken} onClick={() => onChange(s)} className={cn("h-11 rounded-xl border text-[13px] font-medium transition", sel ? "border-pine-700 bg-pine-50 text-pine-800 ring-2 ring-pine-600/20" : "border-border bg-card hover:border-pine-300", taken && "cursor-not-allowed border-dashed bg-transparent text-muted-foreground/50 line-through")}>
            {slotLabel(s)}
          </button>
        );
      })}
    </div>
  );
}

export const combine = (d: Date, slot: string) => {
  const x = new Date(d);
  const [h, m] = slot.split(":").map(Number);
  x.setHours(h, m, 0, 0);
  return x.toISOString();
};

export function Segmented<T extends string>({ value, onChange, options, className }: { value: T; onChange: (v: T) => void; options: { value: T; label: React.ReactNode }[]; className?: string }) {
  return (
    <div className={cn("flex rounded-xl bg-secondary p-1", className)}>
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} className={cn("flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition", value === o.value ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Field({ label, children, hint, className }: { label: string; children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="text-[13px] font-medium text-foreground/80">{label}</div>
      {children}
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function ChoiceGrid<T extends string>({ value, onChange, options, cols = 3 }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; icon?: React.ComponentType<{ className?: string }> }[]; cols?: number }) {
  return (
    <div className={cn("grid gap-2", cols === 2 ? "grid-cols-2" : cols === 4 ? "grid-cols-4" : "grid-cols-3")}>
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} className={cn("flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-center text-[12.5px] font-medium transition", value === o.value ? "border-pine-700 bg-pine-50 text-pine-900 ring-2 ring-pine-600/15" : "border-border bg-card hover:border-pine-300")}>
          {o.icon && <o.icon className="size-5" />}
          {o.label}
        </button>
      ))}
    </div>
  );
}
