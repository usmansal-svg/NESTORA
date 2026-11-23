"use client";
import * as React from "react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowUpDown, CalendarClock, Droplets, Fuel, Plus, Truck, Zap } from "lucide-react";
import { toast } from "sonner";
import { useLiveUtilities } from "@/lib/live";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { LiveDot, Stat } from "@/components/shared/kit";
import { Field } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const GEN = Array.from({ length: 14 }, (_, i) => ({ d: `${10 + i} Nov`, h: [2, 4, 2, 0, 6, 4, 2, 2, 4, 0, 2, 6, 4, 2.4][i] }));
const POWER = Array.from({ length: 24 }, (_, h) => ({ h: `${h}:00`, kw: 180 + Math.round(Math.sin(h / 3) * 60 + (h > 18 ? 90 : 0)) }));
const SHED = [{ day: "Mon 24 Nov", slot: "2 PM – 4 PM" }, { day: "Tue 25 Nov", slot: "No shedding scheduled" }, { day: "Wed 26 Nov", slot: "10 AM – 12 PM" }];

export default function Utilities() {
  const live = useLiveUtilities();
  const notify = useDemo((s) => s.notify);
  const [tankers, setTankers] = React.useState([
    { d: "22 Nov", n: 3, by: "Hydrant Safoora", cost: 27000, ok: true }, { d: "21 Nov", n: 6, by: "Hydrant Safoora", cost: 54000, ok: true }, { d: "19 Nov", n: 2, by: "Bahria Water", cost: 19000, ok: true },
  ]);
  const [order, setOrder] = React.useState(false);
  const [n, setN] = React.useState("4");
  const [warned, setWarned] = React.useState(false);

  return (
    <>
      <AdminHeader title="Building Utilities" subtitle="Electricity, generator, diesel, water and lifts" actions={<>
        <Button variant="outline" disabled={warned} onClick={() => { setWarned(true); notify({ kind: "utility", title: "Load-shedding tomorrow 2–4 PM", body: "Generator backup will cover lifts, water pumps and common areas. Please limit ACs to one per apartment.", href: "/resident/building/utilities", channels: ["push", "whatsapp"], role: "resident" }); toast.success("Load-shedding notice sent to residents"); }}><Zap /> {warned ? "Notice sent" : "Notify load-shedding"}</Button>
        <Button onClick={() => setOrder(true)}><Truck /> Order tankers</Button>
      </>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Supply" value={live.grid === "On" ? "K-Electric" : "Generator"} sub={<span className="flex items-center gap-1"><LiveDot /> {live.voltage} V · since {live.gridSince}</span>} icon={Zap} />
        <Stat label="Diesel" value={`${live.fuel}%`} sub="≈ 2,040 L of 3,000 L" icon={Fuel} tone="amber" />
        <Stat label="Underground tank" value={`${Math.round(live.ugTank)}%`} sub={`Next tanker ${live.nextTanker}`} icon={Droplets} tone="sky" />
        <Stat label="Lifts" value={`${live.lifts.filter((l) => l.status === "Operational").length}/${live.lifts.length}`} sub="1 under maintenance" icon={ArrowUpDown} tone="stone" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Building load today" subtitle="kW · simulated meter readings">
          <div className="h-[200px]"><ResponsiveContainer><AreaChart data={POWER}><defs><linearGradient id="pw" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--color-pine-500)" stopOpacity={0.35} /><stop offset="1" stopColor="var(--color-pine-500)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#ece9e1" /><XAxis dataKey="h" fontSize={11} tickLine={false} axisLine={false} interval={3} /><YAxis fontSize={11} tickLine={false} axisLine={false} width={32} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} kW`, "Load"]} /><Area dataKey="kw" stroke="var(--color-pine-600)" strokeWidth={2} fill="url(#pw)" /></AreaChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Generator runtime" subtitle="Hours per day · 2 × 500 kVA Cummins">
          <div className="h-[200px]"><ResponsiveContainer><BarChart data={GEN}><CartesianGrid vertical={false} stroke="#ece9e1" /><XAxis dataKey="d" fontSize={10} tickLine={false} axisLine={false} interval={1} /><YAxis fontSize={11} tickLine={false} axisLine={false} width={24} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} h`, "Runtime"]} cursor={{ fill: "var(--color-pine-50)" }} /><Bar dataKey="h" fill="#d9a441" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
          <div className="mt-2 text-xs text-muted-foreground">14-day total 42.4 h · diesel ≈ 3,400 L · Rs 9.7 lac</div>
        </Panel>
        <Panel title="Water">
          <div className="grid gap-3">
            {([["Underground", live.ugTank], ["Overhead · Tower A", live.ohTank.A], ["Overhead · Tower B", live.ohTank.B], ["Overhead · Tower C", live.ohTank.C]] as const).map(([l, v]) => (
              <div key={l}><div className="mb-1 flex justify-between text-sm"><span className="text-muted-foreground">{l}</span><span className="font-medium tabular">{Math.round(v)}%</span></div><Progress value={v} indicatorClassName="bg-sky-500" /></div>
            ))}
          </div>
          <div className="mt-4 text-sm font-semibold">Tanker log</div>
          <Table rows={tankers} cols={[{ h: "Date", c: (r) => r.d }, { h: "Tankers", c: (r) => r.n }, { h: "Supplier", c: (r) => r.by }, { h: "Cost", c: (r) => pkr(r.cost) }, { h: "Status", c: (r) => r.ok ? <Badge>Delivered</Badge> : <Badge variant="warn">Ordered</Badge> }]} />
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Lifts">
            <div className="grid grid-cols-3 gap-2">{live.lifts.map((l) => <div key={l.id} className={cn("rounded-xl border p-3 text-center", l.status !== "Operational" && "border-amber-300 bg-amber-soft")}><div className="text-xs text-muted-foreground">Lift {l.id}</div><div className="text-xl font-semibold tabular">{l.status === "Operational" ? (l.floor === 0 ? "G" : l.floor) : "—"}</div><div className="text-[11px]">{l.status}</div></div>)}</div>
            <div className="mt-2 text-xs text-muted-foreground">Status from Schindler remote monitoring (simulated). B-2 quarterly service · back by 6 PM.</div>
          </Panel>
          <Panel title="K-Electric load-shedding" subtitle="DHA Phase VIII feeder">
            <div className="flex flex-col gap-2">{SHED.map((s) => <div key={s.day} className="flex items-center gap-2 text-sm"><CalendarClock className="size-4 text-muted-foreground" /><span className="flex-1">{s.day}</span><span className="text-muted-foreground">{s.slot}</span></div>)}</div>
          </Panel>
        </div>
      </div>
      <Dialog open={order} onOpenChange={setOrder}>
        <DialogContent>
          <DialogHeader><DialogTitle>Order water tankers</DialogTitle></DialogHeader>
          <Field label="Number of tankers (6,000 gal each)"><Input value={n} onChange={(e) => setN(e.target.value.replace(/\D/g, ""))} inputMode="numeric" /></Field>
          <div className="text-sm text-muted-foreground">Hydrant Safoora · Rs 9,000 each · total {pkr(Number(n || 0) * 9000)}</div>
          <DialogFooter><Button variant="outline" onClick={() => setOrder(false)}>Cancel</Button><Button disabled={!Number(n)} onClick={() => { setTankers([{ d: "Today", n: Number(n), by: "Hydrant Safoora", cost: Number(n) * 9000, ok: false }, ...tankers]); setOrder(false); toast.success(`${n} tankers ordered`, { description: "Supervisor will record delivery at the gate." }); }}><Plus /> Place order</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
