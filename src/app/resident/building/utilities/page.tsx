"use client";
import { ArrowUpDown, CalendarClock, Droplets, Fuel, Gauge, Truck, Zap, Power } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useLiveUtilities } from "@/lib/live";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { List, LiveDot, PageHeader, Row, Section, Stat } from "@/components/shared/kit";

const supply = Array.from({ length: 24 }, (_, h) => ({ h: `${h}:00`, grid: h >= 14 && h < 16 ? 0 : 1, gen: h >= 14 && h < 16 ? 1 : 0, kw: 180 + Math.round(Math.sin(h / 3) * 60 + (h > 18 ? 90 : 0)) }));

function Tank({ label, pct, cap }: { label: string; pct: number; cap: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-36 w-20 overflow-hidden rounded-2xl border-2 border-pine-200 bg-pine-50">
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-pine-600 to-pine-400 transition-all duration-1000" style={{ height: `${pct}%` }}>
        </div>
        <div className="absolute inset-0 grid place-items-center text-lg font-semibold text-white mix-blend-difference">{Math.round(pct)}%</div>
      </div>
      <div className="text-center"><div className="text-[13px] font-medium">{label}</div><div className="text-[11.5px] text-muted-foreground">{cap}</div></div>
    </div>
  );
}

export default function UtilitiesPage() {
  const u = useLiveUtilities();
  return (
    <div>
      <PageHeader back="/resident" title="Water & electricity" subtitle={<span className="flex items-center gap-1.5"><LiveDot /> Live from building sensors · updated just now</span>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="K-Electric grid" value={u.grid === "On" ? "On" : "Outage"} sub={`${u.voltage} V · since ${u.gridSince}`} icon={Zap} tone="lime" />
        <Stat label="Generator" value={u.generator} sub={`${u.genRuntimeToday} h today`} icon={Power} tone="pine" />
        <Stat label="Diesel" value={`${u.fuel}%`} sub="≈ 1,360 L · 31 h backup" icon={Fuel} tone="amber" />
        <Stat label="Water supply" value={u.water} sub="Pressure 2.4 bar" icon={Droplets} tone="sky" />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between"><div className="font-semibold">Water tanks</div><Badge variant="default">Auto-pump on</Badge></div>
          <div className="mt-5 flex flex-wrap justify-around gap-4">
            <Tank label="Underground" pct={u.ugTank} cap="120,000 L" />
            <Tank label="Overhead A" pct={u.ohTank.A} cap="25,000 L" />
            <Tank label="Overhead B" pct={u.ohTank.B} cap="25,000 L" />
            <Tank label="Overhead C" pct={u.ohTank.C} cap="25,000 L" />
          </div>
        </div>
        <div className="space-y-3">
          <List>
            <Row icon={Truck} tone="sky" title="Next tanker arrival" subtitle={`${u.nextTanker} · 12,000 L`} />
            <Row icon={Truck} tone="stone" title="Last tanker" subtitle="Today, 11:20 AM · 12,000 L · Hydrant Safoora" />
            <Row icon={CalendarClock} tone="amber" title="Scheduled load-shedding" subtitle={`${u.nextShedding} · generator backup ready`} />
            <Row icon={Gauge} tone="pine" title="Generator maintenance" subtitle="Oil & filter change — Sat 30 Nov, 10 AM" />
          </List>
        </div>
      </div>
      <Section title="Power today">
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="h-48">
            <ResponsiveContainer><AreaChart data={supply}><defs><linearGradient id="g" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--color-pine-500)" stopOpacity={0.35} /><stop offset="1" stopColor="var(--color-pine-500)" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="h" fontSize={11} tickLine={false} axisLine={false} interval={3} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} kW`, "Building load"]} /><Area dataKey="kw" stroke="var(--color-pine-600)" strokeWidth={2} fill="url(#g)" /></AreaChart></ResponsiveContainer>
          </div>
          <div className="mt-2 flex gap-1">{supply.map((x) => <div key={x.h} className={cn("h-2 flex-1 rounded-sm", x.grid ? "bg-pine-500" : "bg-amber-500")} title={x.h} />)}</div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-pine-500" /> Grid</span><span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-amber-500" /> Generator (planned 2–4 PM)</span></div>
        </div>
      </Section>
      <Section title="Lifts">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {u.lifts.map((l) => (
            <div key={l.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between"><ArrowUpDown className="size-4 text-pine-600" /><span className={cn("size-2 rounded-full", l.status === "Operational" ? "bg-emerald-500" : "bg-amber-500")} /></div>
              <div className="mt-3 font-semibold">Lift {l.id}</div>
              <div className="text-xs text-muted-foreground">{l.status === "Operational" ? `Floor ${l.floor}` : "Scheduled service"}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
