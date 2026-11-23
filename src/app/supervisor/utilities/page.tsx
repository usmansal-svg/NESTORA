"use client";
import * as React from "react";
import { Fuel, Gauge, Truck } from "lucide-react";
import { toast } from "sonner";
import { useLiveUtilities } from "@/lib/live";
import { pkr } from "@/lib/utils";
import { Field, Segmented } from "@/components/shared/pickers";
import { List, Row, Section } from "@/components/shared/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/misc";

type Entry = { kind: "Diesel" | "Tanker" | "Meter"; text: string; at: string };

export default function SupUtilities() {
  const live = useLiveUtilities();
  const [kind, setKind] = React.useState<Entry["kind"]>("Diesel");
  const [a, setA] = React.useState("");
  const [b, setB] = React.useState("");
  const [log, setLog] = React.useState<Entry[]>([
    { kind: "Tanker", text: "3 tankers · Hydrant Safoora · slip #4471–73", at: "Today 7:40 AM" },
    { kind: "Meter", text: "Genset hour meter 4,812.6 h", at: "Today 8:05 AM" },
    { kind: "Diesel", text: "1,000 L · PSO · Rs 285,000 · gauge 31% → 64%", at: "Yesterday 4:15 PM" },
  ]);
  const save = () => {
    const text = kind === "Diesel" ? `${a} L received · Rs ${Number(b || 0).toLocaleString()}` : kind === "Tanker" ? `${a} tankers · slip #${b || "—"}` : `Genset hour meter ${a} h`;
    setLog([{ kind, text, at: "Just now" }, ...log]); setA(""); setB("");
    toast.success(`${kind} entry saved`, { description: "Visible to the treasurer for reconciliation." });
  };
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 sm:grid-cols-2">
        {([["Diesel", live.fuel], ["Underground tank", live.ugTank], ["Overhead A", live.ohTank.A], ["Overhead C", live.ohTank.C]] as const).map(([l, v]) => <div key={l} className="rounded-2xl border bg-card p-4 shadow-soft"><div className="mb-2 flex justify-between text-sm"><span className="text-muted-foreground">{l}</span><span className="font-semibold tabular">{Math.round(v)}%</span></div><Progress value={v} indicatorClassName={l === "Diesel" ? "bg-amber-500" : "bg-sky-500"} /></div>)}
      </div>
      <Section title="New entry">
        <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft">
          <Segmented value={kind} onChange={(k) => { setKind(k); setA(""); setB(""); }} options={[{ value: "Diesel", label: "Diesel" }, { value: "Tanker", label: "Water tanker" }, { value: "Meter", label: "Meter reading" }]} />
          <div className="grid grid-cols-2 gap-3">
            <Field label={kind === "Diesel" ? "Litres" : kind === "Tanker" ? "No. of tankers" : "Hour meter"}><Input value={a} onChange={(e) => setA(e.target.value.replace(/[^\d.]/g, ""))} inputMode="decimal" /></Field>
            {kind !== "Meter" && <Field label={kind === "Diesel" ? "Amount (Rs)" : "Slip number"}><Input value={b} onChange={(e) => setB(e.target.value)} inputMode="numeric" /></Field>}
          </div>
          {kind === "Diesel" && a && <div className="text-xs text-muted-foreground">≈ {pkr(Number(a) * 285)} at Rs 285/L</div>}
          <Button disabled={!a} onClick={save}>Save entry</Button>
        </div>
      </Section>
      <Section title="Recent records">
        <List>{log.map((e, i) => <Row key={i} icon={e.kind === "Diesel" ? Fuel : e.kind === "Tanker" ? Truck : Gauge} tone={e.kind === "Diesel" ? "amber" : e.kind === "Tanker" ? "sky" : "stone"} title={e.text} subtitle={`${e.kind} · ${e.at} · Naveed A.`} />)}</List>
      </Section>
    </div>
  );
}
