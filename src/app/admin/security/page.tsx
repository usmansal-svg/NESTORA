"use client";
import * as React from "react";
import { Ban, Camera, DoorOpen, MapPin, ShieldAlert, ShieldCheck, UserX } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { ago, cn, fmtTime } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Chips, IconBubble, LiveDot, Stat } from "@/components/shared/kit";
import { statusBadge } from "@/components/resident/visitors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PATROL = [
  { cp: "Basement P1 ramp", t: "2:10 PM", ok: true }, { cp: "Tower A roof door", t: "2:24 PM", ok: true }, { cp: "Pump room", t: "2:38 PM", ok: true },
  { cp: "Generator yard", t: "2:51 PM", ok: true }, { cp: "Tower C fire exit", t: "—", ok: false }, { cp: "Boundary wall (rear)", t: "—", ok: false },
];

export default function Security() {
  const visitors = useDemo((s) => s.visitors);
  const gateLog = useDemo((s) => s.gateLog);
  const incidents = useDemo((s) => s.incidents);
  const closeIncident = useDemo((s) => s.closeIncident);
  const live = useLiveUtilities();
  const [f, setF] = React.useState<"all" | "in" | "out">("all");
  const [blocked, setBlocked] = React.useState([{ name: "Unknown — CNIC 42101-xxxxxxx-3", reason: "Attempted tailgating, 2 Nov", by: "Supervisor Naveed" }, { name: "Zeeshan (ex-driver, B-1503)", reason: "Employment terminated by resident", by: "Resident B-1503" }]);
  const [nb, setNb] = React.useState("");
  const pending = visitors.filter((v) => v.status === "pending");
  const inside = visitors.filter((v) => v.status === "inside");
  const log = gateLog.filter((g) => (f === "all" ? true : g.dir === f));

  return (
    <>
      <AdminHeader title="Visitors & Security" subtitle="Live gate activity, incidents and patrols" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Inside now" value={inside.length + 23} sub="visitors & service staff" icon={DoorOpen} tone="sky" />
        <Stat label="Awaiting resident" value={pending.length} sub="walk-in requests" icon={ShieldAlert} tone="amber" />
        <Stat label="Guards on duty" value={live.guardsOnDuty} sub="3 gates · 1 roving" icon={ShieldCheck} />
        <Stat label="CCTV online" value={`${live.cctvOnline}/${live.cctvTotal}`} sub="Recording to on-site NVR" icon={Camera} tone={live.cctvOnline < live.cctvTotal ? "amber" : "lime"} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Gate log" subtitle="All gates · today" action={<Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "in", label: "Entries" }, { value: "out", label: "Exits" }]} />}>
          <Table rows={log} cols={[
            { h: "Time", c: (r) => <span className="tabular">{fmtTime(r.at)}</span> },
            { h: "Name", c: (r) => <span className="font-medium">{r.name}</span> },
            { h: "Type", c: (r) => <Badge variant="muted">{r.kind}</Badge> },
            { h: "Apt", c: (r) => r.apt },
            { h: "Dir", c: (r) => <Badge variant={r.dir === "in" ? "default" : "outline"}>{r.dir === "in" ? "In" : "Out"}</Badge> },
            { h: "Gate", c: (r) => <span className="text-muted-foreground">{r.gate}</span> },
            { h: "Vehicle", c: (r) => r.vehicle ?? "—" },
          ]} />
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Pending at the gate" subtitle="Only the resident can approve entry">
            {pending.length === 0 ? <div className="py-4 text-center text-sm text-muted-foreground">No one waiting</div> :
              <div className="flex flex-col gap-2">{pending.map((v) => <div key={v.id} className="flex items-center gap-3 rounded-xl border p-3"><LiveDot tone="amber" /><div className="flex-1 text-sm"><div className="font-medium">{v.name}</div><div className="text-xs text-muted-foreground">for {v.apt} · {v.purpose} · {ago(v.requestedAt ?? v.validFrom)}</div></div>{statusBadge(v.status)}</div>)}</div>}
          </Panel>
          <Panel title="Incidents">
            <div className="flex flex-col gap-2">
              {incidents.map((i) => (
                <div key={i.id} className="flex items-start gap-3 rounded-xl border p-3">
                  <IconBubble icon={ShieldAlert} tone={i.status === "Open" ? (i.severity === "High" ? "red" : "amber") : "stone"} size="sm" />
                  <div className="min-w-0 flex-1 text-sm"><div className="font-medium">{i.title}</div><div className="text-xs text-muted-foreground">{i.location} · {i.by} · {ago(i.at)}</div></div>
                  {i.status === "Open" ? <Button size="sm" variant="outline" onClick={() => { closeIncident(i.id); toast.success(`${i.id} closed`); }}>Close</Button> : <Badge variant="muted">Closed</Badge>}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Night patrol" subtitle="Checkpoint scans · round 3 of 6">
          <div className="flex flex-col gap-2">{PATROL.map((p) => <div key={p.cp} className="flex items-center gap-2.5 text-sm"><MapPin className={cn("size-4", p.ok ? "text-pine-600" : "text-muted-foreground/50")} /><span className={cn("flex-1", !p.ok && "text-muted-foreground")}>{p.cp}</span><span className="text-xs tabular text-muted-foreground">{p.t}</span></div>)}</div>
        </Panel>
        <Panel title="CCTV" subtitle="Status only · live feeds stay on the on-site NVR">
          <div className="grid grid-cols-3 gap-2">{Array.from({ length: 9 }, (_, i) => { const off = i === 7 && live.cctvOnline < live.cctvTotal; return <div key={i} className={cn("grid aspect-video place-items-center rounded-lg text-[10px]", off ? "bg-danger-soft text-danger" : "bg-pine-950 text-white/50")}>{off ? "Offline" : ["Gate 1", "Gate 2", "Lobby A", "Lobby B", "Lobby C", "P1", "P2", "Roof", "Pool"][i]}</div>; })}</div>
        </Panel>
        <Panel title="Blocked entry list" subtitle="Guards see this at the gate">
          <div className="flex flex-col gap-2">
            {blocked.map((b) => <div key={b.name} className="flex items-start gap-2.5 text-sm"><UserX className="mt-0.5 size-4 text-danger" /><div className="flex-1"><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.reason} · {b.by}</div></div><button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => { setBlocked(blocked.filter((x) => x !== b)); toast("Removed from blocked list"); }}>Remove</button></div>)}
            <div className="mt-1 flex gap-2"><Input value={nb} onChange={(e) => setNb(e.target.value)} placeholder="Name and reason" className="h-9" /><Button size="sm" variant="outline" disabled={!nb} onClick={() => { setBlocked([...blocked, { name: nb, reason: "Added by management", by: "Sadia Q." }]); setNb(""); toast.success("Added to blocked list"); }}><Ban /> Block</Button></div>
          </div>
        </Panel>
      </div>
    </>
  );
}
