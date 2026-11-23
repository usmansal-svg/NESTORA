"use client";
import * as React from "react";
import Link from "next/link";
import { HandHelping, KeyRound, PackageCheck, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { COURIERS, CourierMark } from "@/components/shared/courier";
import { ago } from "@/lib/utils";
import { Field } from "@/components/shared/pickers";
import { List, Row, Section } from "@/components/shared/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";

export default function GuardParcels() {
  const parcels = useDemo((s) => s.parcels);
  const comps = useDemo((s) => s.compartments);
  const handover = useDemo((s) => s.receptionHandover);
  const [f, setF] = React.useState({ apt: "A-1204", recipient: "Ahmed Raza", courier: "TCS", tracking: "" });
  const [pin, setPin] = React.useState("");
  const [, force] = React.useState(0);
  const free = comps.filter((c) => c.status === "available").length;
  const atRec = parcels.filter((p) => p.status === "reception");

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-3 text-center">
        {[["Free lockers", free], ["At reception", atRec.length], ["Delivered today", parcels.filter((p) => p.arrivedAt && Date.now() - +new Date(p.arrivedAt) < 864e5).length + 31]].map(([l, v]) => <div key={l} className="rounded-2xl border bg-card p-3 shadow-soft"><div className="text-2xl font-semibold tabular">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}
      </div>

      <Link href="/courier" className="flex items-center gap-3 rounded-2xl bg-pine-900 p-4 text-white shadow-soft"><PackageOpen className="size-6 text-lime-accent" /><div className="flex-1"><div className="font-semibold">Deposit into a smart locker</div><div className="text-xs text-white/60">For couriers without the app · same 9-step locker flow</div></div></Link>

      <Section title="Receive at reception" subtitle="Use when lockers are full or the parcel is oversized">
        <div className="grid gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:grid-cols-2">
          <Field label="Apartment"><Input value={f.apt} onChange={(e) => setF({ ...f, apt: e.target.value.toUpperCase() })} /></Field>
          <Field label="Recipient"><Input value={f.recipient} onChange={(e) => setF({ ...f, recipient: e.target.value })} /></Field>
          <Field label="Courier"><Select value={f.courier} onValueChange={(c) => setF({ ...f, courier: c })} options={Object.keys(COURIERS).map((c) => ({ value: c, label: c }))} /></Field>
          <Field label="Tracking no."><Input value={f.tracking} onChange={(e) => setF({ ...f, tracking: e.target.value })} placeholder="Scan or type" /></Field>
          <Button className="sm:col-span-2" disabled={!f.apt || !f.recipient} onClick={() => { const p = handover({ ...f, tracking: f.tracking || `MAN-${Math.floor(Math.random() * 1e6)}`, by: "Guard Rizwan (Gate 1)" }); toast.success("Parcel logged at reception", { description: `${f.apt} notified · collection PIN ${p.pin}` }); setF({ ...f, tracking: "" }); }}><HandHelping /> Log and notify resident</Button>
        </div>
      </Section>

      <Section title="Hand over from reception">
        <div className="flex gap-2 rounded-2xl border bg-card p-4 shadow-soft">
          <Input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} placeholder="Resident's 6-digit PIN" inputMode="numeric" className="font-mono tracking-widest" />
          <Button disabled={pin.length !== 6} onClick={() => {
            const p = atRec.find((x) => x.pin === pin);
            if (!p) { toast.error("PIN doesn't match any parcel at reception"); return; }
            useDemo.setState((s) => ({ parcels: s.parcels.map((x) => (x.id === p.id ? { ...x, status: "collected", collectedAt: new Date().toISOString(), pinUsed: true } : x)) }));
            useDemo.getState().notify({ kind: "parcel", title: "Parcel collected from reception", body: `${p.courier} parcel handed over by Guard Rizwan.`, role: "resident", channels: ["push"], href: "/resident/building/parcels" });
            toast.success(`Handed over to ${p.recipient}`); setPin(""); force((x) => x + 1);
          }}><KeyRound /> Verify</Button>
        </div>
      </Section>

      <Section title="At reception">
        <List>
          {atRec.map((p) => <Row key={p.id} leading={<CourierMark name={p.courier} className="size-10" />} title={`${p.recipient} · ${p.apt}`} subtitle={`${p.courier} · ${p.tracking} · ${ago(p.arrivedAt!)}`} trailing={<Badge variant="info">Shelf R-{p.id.slice(-2)}</Badge>} />)}
          {atRec.length === 0 && <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground"><PackageCheck className="size-4" /> Nothing held at reception</div>}
        </List>
      </Section>
    </div>
  );
}
