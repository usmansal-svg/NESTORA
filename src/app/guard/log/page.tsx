"use client";
import * as React from "react";
import { Camera, ClipboardCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import { ago, cn, fmtTime } from "@/lib/utils";
import { Field, Segmented } from "@/components/shared/pickers";
import { List, Row, Section } from "@/components/shared/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Checkbox, Select } from "@/components/ui/misc";

export default function GuardLog() {
  const q = useQuery("incident");
  const [tab, setTab] = React.useState<"log" | "incident" | "handover">("log");
  React.useEffect(() => { if (q) setTab("incident"); }, [q]);
  return (
    <div className="flex flex-col gap-5">
      <Segmented value={tab} onChange={setTab} options={[{ value: "log", label: "Gate log" }, { value: "incident", label: "Incident" }, { value: "handover", label: "Shift handover" }]} />
      {tab === "log" && <GateLog />}
      {tab === "incident" && <Incident />}
      {tab === "handover" && <Handover />}
    </div>
  );
}

function GateLog() {
  const log = useDemo((s) => s.gateLog);
  return (
    <List>
      {log.map((g) => <Row key={g.id} title={g.name} subtitle={`${g.kind} · ${g.apt} · ${g.gate}${g.vehicle ? ` · ${g.vehicle}` : ""}`} trailing={<div className="text-right"><Badge variant={g.dir === "in" ? "default" : "outline"}>{g.dir === "in" ? "IN" : "OUT"}</Badge><div className="mt-1 text-[11px] tabular text-muted-foreground">{fmtTime(g.at)}</div></div>} />)}
    </List>
  );
}

function Incident() {
  const add = useDemo((s) => s.addIncident);
  const incidents = useDemo((s) => s.incidents);
  const [f, setF] = React.useState({ title: "", type: "Suspicious activity", location: "Gate 1", severity: "Medium" as "Low" | "Medium" | "High" });
  const [photos, setPhotos] = React.useState(0);
  return (
    <>
      <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft">
        <div className="flex items-center gap-2 font-semibold"><ShieldAlert className="size-5 text-danger" /> Report an incident</div>
        <Field label="What happened?"><Textarea rows={3} value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="e.g. Person tried to enter behind a resident's car" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type"><Select value={f.type} onValueChange={(t) => setF({ ...f, type: t })} options={["Suspicious activity", "Parking", "Equipment", "Fire / smoke", "Medical", "Theft", "Other"].map((x) => ({ value: x, label: x }))} /></Field>
          <Field label="Location"><Input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} /></Field>
        </div>
        <Segmented value={f.severity} onChange={(s) => setF({ ...f, severity: s })} options={[{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }]} />
        <button onClick={() => setPhotos(photos + 1)} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-dashed text-sm text-muted-foreground"><Camera className="size-4" />{photos ? `${photos} photo${photos > 1 ? "s" : ""} attached · add more` : "Add photo"}</button>
        <Button disabled={!f.title} variant={f.severity === "High" ? "destructive" : "default"} onClick={() => { add({ title: f.title, type: f.type, location: f.location, severity: f.severity, by: "Guard Rizwan" }); toast.success("Incident reported", { description: f.severity === "High" ? "Supervisor and management alerted immediately." : "Supervisor notified." }); setF({ ...f, title: "" }); setPhotos(0); }}>Submit report</Button>
      </div>
      <Section title="Recent incidents">
        <List>{incidents.map((i) => <Row key={i.id} icon={ShieldAlert} tone={i.status === "Open" ? "amber" : "stone"} title={i.title} subtitle={`${i.location} · ${i.by} · ${ago(i.at)}`} trailing={<Badge variant={i.status === "Open" ? "warn" : "muted"}>{i.status}</Badge>} />)}</List>
      </Section>
    </>
  );
}

const CHECKS = ["Keys and radio handed over", "Visitor register reconciled", "Pending walk-ins briefed", "Parcels at reception counted", "CCTV monitors checked", "Boom barrier and gate locks tested"];
function Handover() {
  const [c, setC] = React.useState<string[]>([]);
  const [note, setNote] = React.useState("");
  const [done, setDone] = React.useState(false);
  if (done) return <div className="rounded-2xl bg-pine-700 p-6 text-center text-white"><ClipboardCheck className="mx-auto size-10" /><div className="mt-2 text-lg font-semibold">Shift handed over to Waqar Shah</div><div className="text-sm text-white/75">10:00 PM shift · report sent to Supervisor Naveed</div><Button variant="outline" className="mt-4 border-white/30 bg-transparent text-white hover:bg-white/10" onClick={() => { setDone(false); setC([]); }}>Back</Button></div>;
  return (
    <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft">
      <div className="font-semibold">Handover to night shift · Waqar Shah</div>
      <div className="grid grid-cols-3 gap-2 text-center text-sm">{[["Entries", 141], ["Walk-ins", 23], ["Incidents", 1]].map(([a, b]) => <div key={a} className="rounded-xl bg-secondary/60 p-2"><div className="font-semibold">{b}</div><div className="text-xs text-muted-foreground">{a}</div></div>)}</div>
      {CHECKS.map((x) => <label key={x} className={cn("flex items-center gap-3 rounded-xl border p-3 text-sm", c.includes(x) && "border-pine-300 bg-pine-50/60")}><Checkbox checked={c.includes(x)} onCheckedChange={(v) => setC(v ? [...c, x] : c.filter((y) => y !== x))} />{x}</label>)}
      <Field label="Notes for next shift"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Car in P2-118 still unclaimed" /></Field>
      <Button disabled={c.length < CHECKS.length} onClick={() => { setDone(true); toast.success("Shift handover complete"); }}>Complete handover ({c.length}/{CHECKS.length})</Button>
    </div>
  );
}
