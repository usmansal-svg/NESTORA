"use client";
import * as React from "react";
import Link from "next/link";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AlertTriangle, ArrowRight, Banknote, CheckCircle2, DoorOpen, Fuel, Megaphone, PackageOpen, ShieldCheck, Users, Wrench, Zap } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { COLLECTIONS, VISITORS_HOURLY, APTS } from "@/data/admin";
import { ago, cn, pkr } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { Stat, LiveDot, IconBubble } from "@/components/shared/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/misc";

const EXPENSE_REQ = [
  { id: "EXR-221", title: "Fire pump motor rewinding", vendor: "Al-Noor Electric Works", amt: 68000, by: "Naveed (Supervisor)" },
  { id: "EXR-222", title: "Tower C lobby repainting", vendor: "ColourCraft Painters", amt: 145000, by: "Naveed (Supervisor)" },
];

export default function AdminOverview() {
  const live = useLiveUtilities();
  const visitors = useDemo((s) => s.visitors);
  const complaints = useDemo((s) => s.complaints);
  const parcels = useDemo((s) => s.parcels);
  const comps = useDemo((s) => s.compartments);
  const incidents = useDemo((s) => s.incidents);
  const gateLog = useDemo((s) => s.gateLog);
  const advance = useDemo((s) => s.advanceComplaint);
  const [approved, setApproved] = React.useState<Record<string, "ok" | "no">>({});

  const inside = visitors.filter((v) => v.status === "inside").length;
  const openC = complaints.filter((c) => c.status !== "Resolved");
  const newC = complaints.filter((c) => c.status === "Submitted");
  const lockerUsed = comps.filter((c) => c.status === "occupied").length;
  const faulty = comps.filter((c) => c.status === "faulty" || c.status === "disabled").length;
  const overdue = parcels.filter((p) => p.status === "overdue").length;
  const dues = APTS.reduce((a, r) => a + r.dues, 0);
  const defaulters = APTS.filter((r) => r.dues > 30000).length;
  const occupied = APTS.filter((r) => r.type !== "Vacant").length;

  const feed = [
    ...gateLog.slice(0, 6).map((g) => ({ at: g.at, icon: DoorOpen, tone: "sky" as const, text: `${g.name} ${g.dir === "in" ? "entered" : "left"} · ${g.apt} · ${g.gate}` })),
    ...complaints.slice(0, 4).map((c) => ({ at: c.timeline[c.timeline.length - 1].at, icon: Wrench, tone: "amber" as const, text: `${c.id} ${c.title} → ${c.status}` })),
    ...parcels.filter((p) => p.arrivedAt).slice(0, 4).map((p) => ({ at: p.arrivedAt!, icon: PackageOpen, tone: "violet" as const, text: `${p.courier} parcel for ${p.apt} ${p.status === "reception" ? "at reception" : `in locker ${p.compartment}`}` })),
    ...incidents.map((i) => ({ at: i.at, icon: AlertTriangle, tone: "red" as const, text: `Incident: ${i.title} (${i.location})` })),
  ].filter((f) => +new Date(f.at) <= Date.now()).sort((a, b) => +new Date(b.at) - +new Date(a.at)).slice(0, 10);

  return (
    <>
      <AdminHeader
        title="Good afternoon, Sadia"
        subtitle="Ocean Heights · 264 apartments across Towers A, B and C"
        actions={<>
          <Button variant="outline" asChild><Link href="/admin/announcements?compose=1"><Megaphone /> New announcement</Link></Button>
          <Button asChild><Link href="/admin/reports">Monthly report <ArrowRight /></Link></Button>
        </>}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Occupancy" value={`${Math.round((occupied / APTS.length) * 100)}%`} sub={`${occupied} of ${APTS.length} occupied`} icon={Users} />
        <Stat label="Nov collections" value="Rs 48.6 lac" sub="of Rs 62.4 lac billed" icon={Banknote} tone="lime" trend={{ v: "78%", up: false, good: false }} />
        <Stat label="Open complaints" value={openC.length} sub={`${newC.length} awaiting acknowledgement`} icon={Wrench} tone="amber" />
        <Stat label="Visitors inside" value={inside + 23} sub={`${gateLog.filter((g) => g.dir === "in").length + 118} entries today`} icon={ShieldCheck} tone="sky" />
        <Stat label="Outstanding dues" value={pkr(dues, { compact: true })} sub={`${defaulters} units over 1 month`} icon={AlertTriangle} tone="red" />
        <Stat label="Locker utilisation" value={`${Math.round((lockerUsed / comps.length) * 100)}%`} sub={`${lockerUsed}/${comps.length} · ${overdue} overdue · ${faulty} faulty`} icon={PackageOpen} tone="violet" />
        <Stat label="Power" value={live.grid === "On" ? "K-Electric" : "Generator"} sub={<span className="flex items-center gap-1"><LiveDot tone={live.grid === "On" ? "pine" : "amber"} /> Gen {live.genRuntimeToday.toFixed(1)} h today</span>} icon={Zap} tone="teal" />
        <Stat label="Diesel" value={`${live.fuel}%`} sub={`≈ ${Math.round(live.fuel * 0.3)} h of backup`} icon={Fuel} tone={live.fuel < 30 ? "red" : "stone"} />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Collections vs expenses" subtitle="Rs lac · last 6 months" action={<Link href="/admin/billing" className="text-xs font-medium text-pine-700">Accounting →</Link>}>
          <div className="h-[250px]">
            <ResponsiveContainer>
              <BarChart data={COLLECTIONS} barGap={3}>
                <CartesianGrid vertical={false} stroke="#ece9e1" />
                <XAxis dataKey="m" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} width={32} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v, n) => [`Rs ${v} lac`, String(n)]} cursor={{ fill: "var(--color-pine-50)" }} />
                <Bar dataKey="billed" name="Billed" fill="var(--color-pine-200)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="collected" name="Collected" fill="var(--color-pine-600)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" name="Expenses" fill="#d9a441" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
            {[["var(--color-pine-200)", "Billed"], ["var(--color-pine-600)", "Collected"], ["#d9a441", "Expenses"]].map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className="size-2.5 rounded-sm" style={{ background: c }} />{l}</span>)}
          </div>
        </Panel>

        <Panel title="Needs your approval" subtitle="Financial approvals require a committee member">
          <div className="flex flex-col gap-2.5">
            {EXPENSE_REQ.map((e) => (
              <div key={e.id} className="rounded-xl border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div><div className="text-sm font-medium">{e.title}</div><div className="text-xs text-muted-foreground">{e.vendor} · raised by {e.by}</div></div>
                  <div className="text-sm font-semibold tabular">{pkr(e.amt)}</div>
                </div>
                {approved[e.id] ? (
                  <Badge variant={approved[e.id] === "ok" ? "default" : "danger"} className="mt-2">{approved[e.id] === "ok" ? "Approved by Sadia Q." : "Returned for revision"}</Badge>
                ) : (
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" onClick={() => { setApproved((a) => ({ ...a, [e.id]: "ok" })); toast.success(`${e.id} approved`, { description: "Treasurer notified to release payment." }); }}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => { setApproved((a) => ({ ...a, [e.id]: "no" })); toast(`${e.id} returned to supervisor`); }}>Return</Button>
                  </div>
                )}
              </div>
            ))}
            {newC.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border p-3">
                <IconBubble icon={Wrench} tone="amber" size="sm" />
                <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{c.apt} · {c.priority} · {ago(c.createdAt)}</div></div>
                <Button size="sm" variant="soft" onClick={() => { advance(c.id, "Acknowledged", "Sadia Q. (Admin)"); toast.success(`${c.id} acknowledged`, { description: "Resident has been notified." }); }}>Acknowledge</Button>
              </div>
            ))}
            {newC.length === 0 && <div className="flex items-center gap-2 rounded-xl bg-pine-50 p-3 text-sm text-pine-800"><CheckCircle2 className="size-4" /> All new complaints acknowledged</div>}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-3">
        <Panel title="Gate traffic today" subtitle="Entries per hour, all gates">
          <div className="h-[180px]">
            <ResponsiveContainer>
              <AreaChart data={VISITORS_HOURLY} margin={{ left: 10, right: 10 }}>
                <defs><linearGradient id="vh" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--color-pine-500)" stopOpacity={0.35} /><stop offset="1" stopColor="var(--color-pine-500)" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="h" fontSize={11} tickLine={false} axisLine={false} interval={3} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} entries`, ""]} />
                <Area dataKey="n" stroke="var(--color-pine-600)" strokeWidth={2} fill="url(#vh)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Building systems" action={<Link href="/admin/utilities" className="text-xs font-medium text-pine-700">Utilities →</Link>}>
          <div className="flex flex-col gap-3 text-sm">
            <Meter label="Underground tank" v={live.ugTank} />
            <Meter label="Overhead tank · A" v={live.ohTank.A} />
            <Meter label="Overhead tank · C" v={live.ohTank.C} />
            <Meter label="Diesel" v={live.fuel} />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {live.lifts.map((l) => <Badge key={l.id} variant={l.status === "Operational" ? "muted" : l.status === "Maintenance" ? "warn" : "danger"}>{l.id} · {l.status === "Operational" ? `Fl ${l.floor}` : l.status}</Badge>)}
            </div>
          </div>
        </Panel>
        <Panel title="Live activity">
          <div className="flex flex-col gap-3">
            {feed.map((f, i) => (
              <div key={i} className="flex items-start gap-2.5 text-[13px]">
                <IconBubble icon={f.icon} tone={f.tone} size="sm" />
                <div className="min-w-0 flex-1"><div className="line-clamp-2">{f.text}</div><div className="text-[11.5px] text-muted-foreground">{ago(f.at)}</div></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Meter({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[13px]"><span className="text-muted-foreground">{label}</span><span className={cn("font-medium tabular", v < 30 && "text-danger")}>{Math.round(v)}%</span></div>
      <Progress value={v} />
    </div>
  );
}
