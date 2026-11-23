"use client";
import * as React from "react";
import { Camera, CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { ago, cn } from "@/lib/utils";
import { Chips, List, Row, Section } from "@/components/shared/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ROUNDS = {
  fire: { label: "Fire safety (weekly)", items: ["Fire pump auto-start test", "Hose reels — Tower A, B, C", "Extinguisher pressure gauges", "Emergency lights on stairwells", "Fire exits unobstructed", "Alarm panel shows no faults"] },
  genset: { label: "Generator (daily)", items: ["Oil level", "Coolant level", "Battery voltage > 24 V", "No leaks around fuel line", "Log hour meter"] },
  clean: { label: "Housekeeping (daily)", items: ["Lobbies A, B, C", "Lift cabins", "Basement P1 & P2", "Garbage room", "Pool deck"] },
};
type K = keyof typeof ROUNDS;

export default function Inspections() {
  const incidents = useDemo((s) => s.incidents);
  const closeIncident = useDemo((s) => s.closeIncident);
  const addTask = useDemo((s) => s.addTask);
  const [k, setK] = React.useState<K>("fire");
  const [res, setRes] = React.useState<Record<string, "ok" | "fail">>({});
  const items = ROUNDS[k].items;
  const done = items.filter((i) => res[k + i]).length;
  return (
    <div className="flex flex-col gap-5">
      <Chips value={k} onChange={(v) => setK(v)} options={(Object.keys(ROUNDS) as K[]).map((x) => ({ value: x, label: ROUNDS[x].label }))} />
      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <div className="mb-3 flex items-center justify-between"><div className="font-semibold">{ROUNDS[k].label}</div><span className="text-sm text-muted-foreground">{done}/{items.length}</span></div>
        <div className="flex flex-col gap-2">
          {items.map((i) => { const r = res[k + i]; return (
            <div key={i} className={cn("flex items-center gap-3 rounded-xl border p-3 text-sm", r === "ok" && "border-pine-300 bg-pine-50/60", r === "fail" && "border-danger/40 bg-danger-soft/50")}>
              <span className="flex-1">{i}</span>
              <button aria-label="Pass" onClick={() => setRes({ ...res, [k + i]: "ok" })} className={cn("rounded-lg p-1.5", r === "ok" ? "bg-pine-600 text-white" : "text-muted-foreground hover:bg-secondary")}><CheckCircle2 className="size-5" /></button>
              <button aria-label="Fail" onClick={() => { setRes({ ...res, [k + i]: "fail" }); addTask({ title: `Fix: ${i}`, area: ROUNDS[k].label, assignee: k === "genset" ? "Imtiaz (Genset)" : k === "clean" ? "SparkClean team" : "Jamil (Electrical)", priority: "High", due: new Date(Date.now() + 4 * 3600e3).toISOString() }); toast("Follow-up task created"); }} className={cn("rounded-lg p-1.5", r === "fail" ? "bg-danger text-white" : "text-muted-foreground hover:bg-secondary")}><XCircle className="size-5" /></button>
            </div>
          ); })}
        </div>
        <div className="mt-3 flex gap-2"><Button variant="outline" onClick={() => toast("Photo attached to round")}><Camera /> Photo</Button><Button className="flex-1" disabled={done < items.length} onClick={() => { toast.success(`${ROUNDS[k].label} submitted`, { description: "Signed by Naveed Akhtar · visible to management" }); setRes(Object.fromEntries(Object.entries(res).filter(([x]) => !x.startsWith(k)))); }}>Submit round</Button></div>
      </div>
      <Section title="Incidents">
        <List>{incidents.map((i) => <Row key={i.id} icon={ShieldAlert} tone={i.status === "Open" ? "amber" : "stone"} title={i.title} subtitle={`${i.location} · ${i.by} · ${ago(i.at)}`} trailing={i.status === "Open" ? <Button size="sm" variant="outline" onClick={() => { closeIncident(i.id); toast.success("Incident closed"); }}>Close</Button> : <Badge variant="muted">Closed</Badge>} />)}</List>
      </Section>
    </div>
  );
}
