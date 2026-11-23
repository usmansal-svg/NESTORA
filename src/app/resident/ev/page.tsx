"use client";
import * as React from "react";
import dynamic from "next/dynamic";
import { BatteryCharging, Clock, Gauge, History, MapPin, Plug, PlugZap, Square, Star, Zap, Navigation, Cpu } from "lucide-react";
import { toast } from "sonner";
import { STATIONS, type Charger } from "@/data/places";
import { useDemo } from "@/lib/store";
import { cn, fmtDateTime, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, PageHeader, Section, Stat } from "@/components/shared/kit";
import { combine, DateStrip, Field, TimeSlots } from "@/components/shared/pickers";
import { PaySheet } from "@/components/resident/pay-sheet";

const EvMap = dynamic(() => import("@/components/resident/ev-map"), { ssr: false, loading: () => <div className="grid h-full place-items-center bg-secondary text-sm text-muted-foreground">Loading map…</div> });

export default function EvPage() {
  const s = useDemo();
  const [filter, setFilter] = React.useState<"all" | "fast" | "building" | "available">("all");
  const [sel, setSel] = React.useState<string>("st-oh");
  const [reserve, setReserve] = React.useState<Charger | null>(null);
  const [date, setDate] = React.useState(new Date());
  const [slot, setSlot] = React.useState<string>();
  const [pay, setPay] = React.useState<{ id: string; cost: number } | null>(null);
  const active = s.evSessions.find((e) => e.status === "Charging");
  const reserved = s.evSessions.filter((e) => e.status === "Reserved");
  const st = STATIONS.find((x) => x.id === sel)!;
  const list = STATIONS.filter((x) => filter === "all" || (filter === "fast" ? x.chargers.some((c) => c.kind === "DC") : filter === "building" ? x.network !== "Public" : x.chargers.some((c) => c.status === "Available")));

  // live charging simulation
  React.useEffect(() => {
    if (!active) return;
    const t = setInterval(() => {
      const cur = useDemo.getState().evSessions.find((e) => e.id === active.id);
      if (!cur || cur.status !== "Charging") return;
      const kwh = +(cur.kwh + 0.18).toFixed(2);
      const rate = STATIONS.find((x) => x.name === cur.station)?.price ?? 70;
      useDemo.getState().updateEvSession(cur.id, { kwh, cost: Math.round(kwh * rate) });
    }, 1000);
    return () => clearInterval(t);
  }, [active?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const startNow = (c: Charger) => {
    s.addEvSession({ station: st.name, charger: `${c.id} · ${c.power} kW ${c.kind}`, start: new Date().toISOString(), kwh: 0, cost: 0, status: "Charging" });
    toast.success(`Charging started on ${c.id}`, { description: "Connector unlocked via OCPP (simulated)." });
  };

  return (
    <div>
      <PageHeader back="/resident/explore" title="EV charging" subtitle="Your building chargers + public network across Karachi" />
      {active && (
        <div className="mb-5 overflow-hidden rounded-3xl bg-pine-900 p-5 text-white">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-sm text-white/70"><BatteryCharging className="size-4 animate-pulse text-lime-accent" /> Charging · {active.charger}</div><Badge variant="lime">Live</Badge></div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            <div><div className="text-3xl font-semibold tabular">{active.kwh.toFixed(1)}</div><div className="text-xs text-white/60">kWh delivered</div></div>
            <div><div className="text-3xl font-semibold tabular">{pkr(active.cost)}</div><div className="text-xs text-white/60">cost so far</div></div>
            <div><div className="text-3xl font-semibold tabular">{Math.min(100, 42 + Math.round(active.kwh * 1.6))}%</div><div className="text-xs text-white/60">MG ZS EV battery</div></div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-lime-accent transition-all" style={{ width: `${Math.min(100, 42 + active.kwh * 1.6)}%` }} /></div>
          <Button className="mt-4 bg-white text-pine-900 hover:bg-white/90" onClick={() => { s.updateEvSession(active.id, { status: "Completed", end: new Date().toISOString() }); setPay({ id: active.id, cost: Math.max(active.cost, 50) }); }}><Square className="fill-current" /> Stop & pay</Button>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative h-[320px] overflow-hidden rounded-3xl border border-border/70 shadow-soft sm:h-[420px]">
          <EvMap stations={list} selected={sel} onSelect={setSel} />
          <div className="pointer-events-none absolute bottom-3 left-3 z-[400] flex gap-2 text-[11px]"><span className="rounded-full bg-white/95 px-2 py-1 shadow-soft"><span className="mr-1 inline-block size-2 rounded-full bg-lime-accent ring-1 ring-pine-800" />Building</span><span className="rounded-full bg-white/95 px-2 py-1 shadow-soft"><span className="mr-1 inline-block size-2 rounded-full bg-white ring-1 ring-pine-800" />Public</span></div>
        </div>
        <div>
          <Chips value={filter} onChange={setFilter} options={[{ value: "all", label: "All" }, { value: "available", label: "Available now" }, { value: "fast", label: "DC fast" }, { value: "building", label: "My building" }]} />
          <div className="mt-3 space-y-2">
            {list.map((x) => {
              const free = x.chargers.filter((c) => c.status === "Available").length;
              return (
                <button key={x.id} onClick={() => setSel(x.id)} className={cn("flex w-full items-center gap-3 rounded-2xl border bg-card p-3.5 text-left transition", sel === x.id ? "border-pine-600 ring-2 ring-pine-600/10" : "border-border/70")}>
                  <span className={cn("grid size-11 place-items-center rounded-xl", x.network === "Public" ? "bg-secondary text-pine-800" : "bg-lime-soft text-pine-800")}><Zap className="size-5" /></span>
                  <div className="min-w-0 flex-1"><div className="truncate font-semibold">{x.name}</div><div className="text-xs text-muted-foreground">{x.distance} · {pkr(x.price)}/kWh · {x.hours}</div></div>
                  <div className="text-right"><div className={cn("text-sm font-semibold", free ? "text-pine-700" : "text-amber-700")}>{free}/{x.chargers.length}</div><div className="text-[11px] text-muted-foreground">free</div></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Section title={st.name} subtitle={st.address} action={<Button variant="outline" size="sm" asChild><a href={`https://maps.google.com/?q=${st.lat},${st.lng}`} target="_blank" rel="noreferrer"><Navigation /> Directions</a></Button>}>
        <div className="mb-3 flex flex-wrap gap-2"><Badge variant={st.network === "Public" ? "muted" : "lime"}>{st.network}{st.residentsOnly ? " · residents only" : " · open to everyone"}</Badge><Badge variant="muted"><Clock /> {st.hours}</Badge><Badge variant="muted"><Star /> {st.rating}</Badge><Badge variant="outline"><Cpu /> {st.ocpp}</Badge>{st.amenities.map((a) => <Badge key={a} variant="outline">{a}</Badge>)}</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {st.chargers.map((c) => (
            <div key={c.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
              <div className="flex items-center justify-between"><span className="font-mono text-xs text-muted-foreground">{c.id}</span><Badge variant={c.status === "Available" ? "default" : c.status === "Offline" ? "danger" : c.status === "Reserved" ? "warn" : "info"}>{c.status}</Badge></div>
              <div className="mt-3 flex items-center gap-2"><Plug className="size-5 text-pine-600" /><div><div className="font-semibold">{c.connector}</div><div className="text-xs text-muted-foreground">{c.power} kW {c.kind} · {c.power >= 50 ? "≈ 45 min to 80%" : "≈ 3 h to 80%"}</div></div></div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" disabled={c.status === "Offline"} onClick={() => { setReserve(c); setSlot(undefined); }}>Reserve</Button>
                <Button size="sm" disabled={c.status !== "Available" || !!active} onClick={() => startNow(c)}><PlugZap /> Start</Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-2 grid gap-5 lg:grid-cols-2">
        <Section title="Consumption this month">
          <div className="grid grid-cols-3 gap-3"><Stat label="Energy" value="186 kWh" icon={Gauge} /><Stat label="Spent" value={pkr(14980)} icon={Zap} tone="lime" /><Stat label="Saved vs petrol" value={pkr(31200)} icon={BatteryCharging} tone="sky" /></div>
        </Section>
        <Section title="Sessions & reservations">
          <div className="divide-y rounded-2xl border bg-card">
            {[...reserved, ...s.evSessions.filter((e) => e.status === "Completed")].slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-3 text-sm"><History className="size-4 text-muted-foreground" /><div className="flex-1"><div className="font-medium">{e.station}</div><div className="text-xs text-muted-foreground">{e.charger} · {fmtDateTime(e.start)}</div></div><div className="text-right">{e.status === "Reserved" ? <Badge variant="warn">Reserved {e.slot}</Badge> : <><div className="font-semibold">{pkr(e.cost)}</div><div className="text-xs text-muted-foreground">{e.kwh.toFixed(1)} kWh</div></>}</div></div>
            ))}
          </div>
        </Section>
      </div>
      <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground"><MapPin className="size-3.5" /> Public stations are open to non-residents via the NESTORA app. Chargers integrate over OCPP 1.6J / 2.0.1 — controls here are simulated.</p>

      <Sheet open={!!reserve} onOpenChange={(o) => !o && setReserve(null)}>
        <SheetContent>
          {reserve && (
            <>
              <SheetHeader><SheetTitle>Reserve {reserve.id}</SheetTitle><SheetDescription>{st.name} · {reserve.connector} · {reserve.power} kW · {pkr(st.price)}/kWh</SheetDescription></SheetHeader>
              <SheetBody className="space-y-5">
                <Field label="Date"><DateStrip value={date} onChange={setDate} days={7} /></Field>
                <Field label="Start time (bay held for 15 min)"><TimeSlots value={slot} onChange={setSlot} date={date} seed={reserve.id} slots={["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"]} /></Field>
                <div className="rounded-2xl bg-secondary/70 p-4 text-sm">Reservation fee {pkr(100)}, deducted from your charging bill. Free cancellation up to 30 min before.</div>
              </SheetBody>
              <SheetFooter><Button size="lg" className="w-full" disabled={!slot} onClick={() => {
                const iso = combine(date, slot!);
                s.addEvSession({ station: st.name, charger: `${reserve.id} · ${reserve.power} kW ${reserve.kind}`, start: iso, kwh: 0, cost: 0, status: "Reserved", slot: new Date(iso).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" }) });
                s.addBooking({ category: "EV charging", service: `${reserve.connector} ${reserve.power} kW · ${reserve.id}`, provider: st.name, date: iso, duration: "Up to 3 h", price: 100, address: st.address });
                toast.success("Charger reserved", { description: `${reserve.id} held for you at ${slot}.` });
                setReserve(null);
              }}>Reserve charger</Button></SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      {pay && <PaySheet open={!!pay} onOpenChange={(o) => !o && setPay(null)} amount={pay.cost} title="EV charging session" payee={st.name} onPaid={() => {}} />}
    </div>
  );
}
