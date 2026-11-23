"use client";
import * as React from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download, FileBarChart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { COLLECTIONS, COMPLAINT_TREND, PARCEL_DAILY } from "@/data/admin";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { Segmented } from "@/components/shared/pickers";
import { Button } from "@/components/ui/button";

const ADOPTION = [{ m: "Jun", v: 41 }, { m: "Jul", v: 55 }, { m: "Aug", v: 63 }, { m: "Sep", v: 71 }, { m: "Oct", v: 79 }, { m: "Nov", v: 86 }];
const CATS = [{ c: "Plumbing", n: 31 }, { c: "Electrical", n: 22 }, { c: "Lifts", n: 9 }, { c: "Cleaning", n: 14 }, { c: "Noise", n: 7 }, { c: "Parking", n: 11 }];
const tip = { contentStyle: { borderRadius: 12, fontSize: 12 } };

export default function Reports() {
  const [p, setP] = React.useState<"month" | "quarter" | "year">("month");
  return (
    <>
      <AdminHeader title="Reports & Analytics" subtitle="Ocean Heights performance" actions={<>
        <Segmented value={p} onChange={setP} options={[{ value: "month", label: "Month" }, { value: "quarter", label: "Quarter" }, { value: "year", label: "Year" }]} />
        <Button onClick={() => toast.success("Committee report generated", { description: "ocean-heights-nov-2026.pdf · 14 pages" })}><Download /> Committee pack</Button>
      </>} />
      <div className="mb-4 flex items-start gap-3 rounded-2xl bg-pine-950 p-4 text-sm text-white">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-lime-accent" />
        <div><div className="font-medium">Nestora AI summary</div><p className="mt-1 text-white/75">Collections are 4% behind October, mainly from 11 units in Tower B. Plumbing remains the top complaint category (31) but resolution time improved to 19 h. Generator runtime rose 22% with heavier load-shedding, pushing diesel to 21% of spend. Parcel volume peaks on Fridays; consider a fourth locker bank for Tower C.</p><p className="mt-2 text-xs text-white/50">AI-generated from building data. Verify figures before sharing with residents.</p></div>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Collection rate" subtitle="% of billed">
          <div className="h-[200px]"><ResponsiveContainer><LineChart data={COLLECTIONS.map((c) => ({ m: c.m, r: Math.round((c.collected / c.billed) * 100) }))}><CartesianGrid vertical={false} stroke="#ece9e1" /><XAxis dataKey="m" fontSize={12} tickLine={false} axisLine={false} /><YAxis domain={[70, 100]} fontSize={11} tickLine={false} axisLine={false} width={28} /><Tooltip {...tip} formatter={(v) => [`${v}%`, "Collected"]} /><Line dataKey="r" stroke="var(--color-pine-600)" strokeWidth={2.5} /></LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Resident app adoption" subtitle="% of households active monthly">
          <div className="h-[200px]"><ResponsiveContainer><AreaChart data={ADOPTION}><defs><linearGradient id="ad" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--color-lime-accent)" stopOpacity={0.6} /><stop offset="1" stopColor="var(--color-lime-accent)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#ece9e1" /><XAxis dataKey="m" fontSize={12} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} width={28} /><Tooltip {...tip} formatter={(v) => [`${v}%`, "Active"]} /><Area dataKey="v" stroke="var(--color-pine-700)" strokeWidth={2} fill="url(#ad)" /></AreaChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Complaints by category">
          <div className="h-[200px]"><ResponsiveContainer><BarChart data={CATS} layout="vertical"><XAxis type="number" hide /><YAxis type="category" dataKey="c" fontSize={12} tickLine={false} axisLine={false} width={80} /><Tooltip {...tip} cursor={{ fill: "var(--color-pine-50)" }} /><Bar dataKey="n" fill="var(--color-pine-500)" radius={[0, 6, 6, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Complaints opened vs resolved">
          <div className="h-[200px]"><ResponsiveContainer><BarChart data={COMPLAINT_TREND}><XAxis dataKey="w" fontSize={12} tickLine={false} axisLine={false} /><Tooltip {...tip} cursor={{ fill: "var(--color-pine-50)" }} /><Bar dataKey="opened" fill="#d9a441" radius={[5, 5, 0, 0]} /><Bar dataKey="resolved" fill="var(--color-pine-600)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Parcels per day">
          <div className="h-[200px]"><ResponsiveContainer><BarChart data={PARCEL_DAILY}><XAxis dataKey="d" fontSize={12} tickLine={false} axisLine={false} /><Tooltip {...tip} cursor={{ fill: "var(--color-pine-50)" }} /><Bar dataKey="n" fill="var(--color-pine-400)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Scheduled reports">
          <div className="flex flex-col gap-2">{[["Monthly committee pack", "1st of month · PDF · committee"], ["Weekly security summary", "Mondays · email · Sadia, Naveed"], ["Daily collections", "9 PM · WhatsApp · Tariq"], ["Quarterly AGM financials", "Quarter end · PDF · all owners"]].map(([a, b]) => <div key={a} className="flex items-center gap-3 rounded-xl border p-3 text-sm"><FileBarChart className="size-4 text-pine-600" /><div className="flex-1"><div className="font-medium">{a}</div><div className="text-xs text-muted-foreground">{b}</div></div><Button size="sm" variant="ghost" onClick={() => toast.success(`${a} sent now`)}>Run now</Button></div>)}</div>
        </Panel>
      </div>
    </>
  );
}
