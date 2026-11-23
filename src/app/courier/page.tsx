"use client";
import * as React from "react";
import { ArrowLeft, Building2, Camera, CheckCircle2, DoorClosed, DoorOpen, HandHelping, Loader2, MapPin, PackageCheck, PackageOpen, ScanBarcode, Search, Truck } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { LockerSize } from "@/lib/types";
import { APTS } from "@/data/admin";
import { BUILDINGS } from "@/data/admin";
import { face } from "@/lib/img";
import { cn, fmtTime } from "@/lib/utils";
import { OpsShell } from "@/components/ops/shell";
import { COURIERS, CourierMark } from "@/components/shared/courier";
import { KeyVal } from "@/components/shared/kit";
import { Field } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";

const STEPS = ["Building", "Tracking", "Recipient", "Verify", "Locker", "Open", "Deposit", "Close", "Confirm"];
const SIZES: { s: LockerSize; label: string; dim: string }[] = [{ s: "S", label: "Small", dim: "Up to 35 × 25 × 10 cm" }, { s: "M", label: "Medium", dim: "Up to 45 × 35 × 20 cm" }, { s: "L", label: "Large", dim: "Up to 60 × 45 × 35 cm" }, { s: "XL", label: "Extra large", dim: "Up to 70 × 50 × 60 cm" }];
const RECIP: Record<string, string> = { "A-1204": "Ahmed Raza" };

export default function CourierApp() {
  const parcels = useDemo((s) => s.parcels);
  const comps = useDemo((s) => s.compartments);
  const banks = useDemo((s) => s.banks);
  const deposit = useDemo((s) => s.depositParcel);
  const handover = useDemo((s) => s.receptionHandover);
  const [step, setStep] = React.useState(-1);
  const [d, setD] = React.useState({ building: "oh", courier: "TCS", tracking: "", apt: "", recipient: "", size: "S" as LockerSize, bank: "LB-A", desc: "" });
  const [q, setQ] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [photo, setPhoto] = React.useState(false);
  const [result, setResult] = React.useState<{ comp: string; pin: string } | null>(null);
  const [rec, setRec] = React.useState<string | null>(null);

  const order: LockerSize[] = ["S", "M", "L", "XL"];
  const fit = order.slice(order.indexOf(d.size));
  const avail = comps.filter((c) => c.status === "available" && fit.includes(c.size));
  const preview = avail.find((c) => c.bank === d.bank) ?? avail[0];
  const mine = parcels.filter((p) => p.courierAgent === "Kashif (TCS)").slice(0, 5);
  const matches = q.length >= 1 ? APTS.filter((a) => a.type !== "Vacant" && `${a.id} ${a.occupant}`.toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [];
  const next = () => setStep((s) => s + 1);
  const restart = () => { setStep(-1); setD({ ...d, tracking: "", apt: "", recipient: "", desc: "", size: "S" }); setQ(""); setPhoto(false); setResult(null); setRec(null); };
  const sim = (ms: number, fn: () => void) => { setBusy(true); setTimeout(() => { setBusy(false); fn(); }, ms); };

  return (
    <OpsShell app="Courier · Deliveries" person="Kashif Mehmood" role="TCS Express · verified agent" photo={face("m6")} tone="light"
      tabs={[{ href: "/courier", label: "Deliver", icon: Truck }]}>
      {step === -1 ? (
        <div className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-3xl bg-pine-950 p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-accent">NESTORA locker network</div>
            <div className="mt-2 text-2xl font-semibold">Deliver to a smart locker</div>
            <p className="mt-1 text-sm text-white/65">No waiting at reception. Residents get their PIN the moment the door closes.</p>
            <Button variant="accent" size="lg" className="mt-5" onClick={() => setStep(0)}><PackageOpen /> Start a delivery</Button>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">{[["Today", mine.length + 11], ["Lockers free", comps.filter((c) => c.status === "available").length], ["Avg. drop", "48 s"]].map(([a, b]) => <div key={a} className="rounded-2xl border bg-card p-3 shadow-soft"><div className="text-xl font-semibold">{b}</div><div className="text-xs text-muted-foreground">{a}</div></div>)}</div>
          <div>
            <div className="mb-2 text-sm font-semibold">Recent drops</div>
            <div className="flex flex-col gap-2">
              {mine.map((p) => <div key={p.id} className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-sm"><CourierMark name={p.courier} className="size-10" /><div className="flex-1"><div className="font-medium">{p.apt} · {p.tracking}</div><div className="text-xs text-muted-foreground">{p.compartment ? `Locker ${p.compartment}` : "Reception"} · {p.arrivedAt && fmtTime(p.arrivedAt)}</div></div><Badge>{p.status === "collected" ? "Collected" : "Delivered"}</Badge></div>)}
              {mine.length === 0 && <div className="rounded-2xl border border-dashed p-4 text-center text-sm text-muted-foreground">No drops yet today</div>}
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex max-w-lg flex-col gap-5">
          <div className="flex items-center gap-3">
            <button onClick={() => (step === 0 || step >= 5 ? (step >= 5 && step < 8 ? toast("Finish closing the door first") : restart()) : setStep(step - 1))} className="grid size-10 place-items-center rounded-full border bg-card"><ArrowLeft className="size-4" /></button>
            <div className="flex-1"><div className="text-xs text-muted-foreground">Step {Math.min(step + 1, 9)} of 9</div><div className="font-semibold">{STEPS[Math.min(step, 8)]}</div></div>
          </div>
          <div className="flex gap-1">{STEPS.map((_, i) => <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-pine-600" : "bg-secondary")} />)}</div>

          {rec ? (
            <Card icon={HandHelping} title="Handed to reception" tone="amber">
              <p className="text-sm text-muted-foreground">No suitable locker was free. The parcel is logged with reception and {d.recipient} has been notified with a collection PIN.</p>
              <KeyVal k="Reference" v={rec} /><Button size="lg" className="mt-2 w-full" onClick={restart}>Next delivery</Button>
            </Card>
          ) : (
            <>
              {step === 0 && (
                <Card icon={Building2} title="Select building">
                  {BUILDINGS.map((b) => <button key={b.id} onClick={() => setD({ ...d, building: b.id })} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left", d.building === b.id && "border-pine-600 bg-pine-50")}><MapPin className="size-4 text-pine-700" /><div className="flex-1"><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.area}</div></div>{b.id === "oh" && <Badge variant="lime">You're here</Badge>}</button>)}
                  <Button size="lg" className="mt-1 w-full" disabled={d.building !== "oh"} onClick={next}>{d.building === "oh" ? "Continue" : "Only Ocean Heights in this demo"}</Button>
                </Card>
              )}
              {step === 1 && (
                <Card icon={ScanBarcode} title="Enter tracking number">
                  <Field label="Courier"><Select value={d.courier} onValueChange={(c) => setD({ ...d, courier: c })} options={Object.keys(COURIERS).map((c) => ({ value: c, label: c === "Other" ? "Other courier" : c }))} /></Field>
                  <Field label="Tracking number"><Input value={d.tracking} onChange={(e) => setD({ ...d, tracking: e.target.value.toUpperCase() })} placeholder="e.g. 7781 5522 9001" className="font-mono" /></Field>
                  <Button variant="outline" className="w-full" onClick={() => sim(800, () => setD((x) => ({ ...x, tracking: `${x.courier === "TCS" ? "TCS" : x.courier.slice(0, 3).toUpperCase()} 7781 ${Math.floor(1000 + Math.random() * 8999)} ${Math.floor(1000 + Math.random() * 8999)}`, desc: "Daraz order · Electronics" })))}>{busy ? <Loader2 className="animate-spin" /> : <ScanBarcode />} Scan barcode</Button>
                  <Button size="lg" className="w-full" disabled={d.tracking.length < 4} onClick={next}>Continue</Button>
                </Card>
              )}
              {step === 2 && (
                <Card icon={Search} title="Search recipient apartment">
                  <Input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Apartment (A-1204) or name" />
                  <div className="flex flex-col gap-1.5">
                    {matches.map((a) => <button key={a.id} onClick={() => { setD({ ...d, apt: a.id, recipient: RECIP[a.id] ?? a.occupant }); next(); }} className="flex items-center justify-between rounded-xl border p-3 text-left text-sm hover:border-pine-400"><span className="font-medium">{a.id}</span><span className="text-muted-foreground">{(RECIP[a.id] ?? a.occupant).replace(/(\w)\w+$/, "$1.")}</span></button>)}
                    {q && matches.length === 0 && <div className="text-sm text-muted-foreground">No apartment found. Check the label or contact security.</div>}
                    {!q && <button onClick={() => setQ("A-1204")} className="text-left text-xs text-pine-700 underline">Try A-1204</button>}
                  </div>
                </Card>
              )}
              {step === 3 && (
                <Card icon={PackageCheck} title="Verify parcel details">
                  <div className="rounded-xl border p-3"><KeyVal k="Courier" v={d.courier} /><KeyVal k="Tracking" v={<span className="font-mono">{d.tracking}</span>} /><KeyVal k="Apartment" v={d.apt} /><KeyVal k="Recipient" v={d.recipient} /></div>
                  <Field label="Parcel size">
                    <div className="grid grid-cols-2 gap-2">{SIZES.map((s) => <button key={s.s} onClick={() => setD({ ...d, size: s.s })} className={cn("rounded-xl border p-3 text-left", d.size === s.s && "border-pine-600 bg-pine-50 ring-2 ring-pine-600/15")}><div className="font-semibold">{s.label}</div><div className="text-[11px] text-muted-foreground">{s.dim}</div></button>)}</div>
                  </Field>
                  <button onClick={() => setPhoto(true)} className={cn("flex h-12 items-center justify-center gap-2 rounded-xl border text-sm", photo ? "border-pine-400 bg-pine-50 text-pine-800" : "border-dashed text-muted-foreground")}><Camera className="size-4" />{photo ? "Parcel photo captured" : "Take parcel photo"}</button>
                  <Button size="lg" className="w-full" disabled={!photo} onClick={next}>Details are correct</Button>
                </Card>
              )}
              {step === 4 && (
                <Card icon={PackageOpen} title="Select locker">
                  {banks.map((b) => { const n = comps.filter((c) => c.bank === b.id && c.status === "available" && fit.includes(c.size)).length; return (
                    <button key={b.id} disabled={!n} onClick={() => setD({ ...d, bank: b.id })} className={cn("flex w-full items-center gap-3 rounded-xl border p-3 text-left disabled:opacity-50", d.bank === b.id && "border-pine-600 bg-pine-50")}><div className="flex-1"><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">{b.location}</div></div><Badge variant={n ? "default" : "danger"}>{n ? `${n} free` : "Full"}</Badge></button>
                  ); })}
                  {preview ? (
                    <div className="rounded-xl bg-pine-50 p-3 text-sm text-pine-900">Compartment <b>{preview.id}</b> ({SIZES.find((s) => s.s === preview.size)?.label}) will be assigned{preview.bank !== d.bank ? ` in ${preview.bank}` : ""}.</div>
                  ) : (
                    <div className="rounded-xl bg-amber-soft p-3 text-sm text-amber-900">All {SIZES.find((s) => s.s === d.size)?.label.toLowerCase()}+ compartments are occupied. Hand the parcel to reception instead.</div>
                  )}
                  {preview ? <Button size="lg" className="w-full" onClick={next}>Use {preview.id}</Button> : <Button size="lg" className="w-full" onClick={() => { const p = handover({ apt: d.apt, recipient: d.recipient, courier: d.courier, tracking: d.tracking, by: "Reception (Nasir M.)" }); setRec(p.id); }}><HandHelping /> Hand over to reception</Button>}
                </Card>
              )}
              {step === 5 && preview && (
                <Card icon={DoorOpen} title={`Open compartment ${preview.id}`}>
                  <LockerArt id={preview.id} open={false} />
                  <p className="text-center text-sm text-muted-foreground">Stand in front of {banks.find((b) => b.id === preview.bank)?.name}. The door will unlock for 60 seconds.</p>
                  <Button size="lg" className="w-full" onClick={() => sim(1200, next)} disabled={busy}>{busy ? <><Loader2 className="animate-spin" /> Unlocking…</> : <><DoorOpen /> Open door</>}</Button>
                </Card>
              )}
              {step === 6 && preview && (
                <Card icon={PackageOpen} title="Deposit parcel">
                  <LockerArt id={preview.id} open />
                  <p className="text-center text-sm text-muted-foreground">Door <b>{preview.id}</b> is open. Place the parcel inside with the label facing out.</p>
                  <Button size="lg" className="w-full" onClick={next}>Parcel is inside</Button>
                </Card>
              )}
              {step === 7 && preview && (
                <Card icon={DoorClosed} title="Close compartment">
                  <LockerArt id={preview.id} open />
                  <p className="text-center text-sm text-muted-foreground">Push the door firmly until it clicks. The door sensor confirms closure.</p>
                  <Button size="lg" className="w-full" disabled={busy} onClick={() => sim(1100, () => { const p = deposit({ apt: d.apt, recipient: d.recipient, courier: d.courier, tracking: d.tracking, size: d.size, bank: preview.bank, agent: "Kashif (TCS)", description: d.desc || undefined }); if (!p) { toast.error("Compartment no longer available"); setStep(4); return; } setResult({ comp: p.compartment!, pin: p.pin! }); next(); })}>{busy ? <><Loader2 className="animate-spin" /> Checking door sensor…</> : "I've closed the door"}</Button>
                </Card>
              )}
              {step === 8 && result && (
                <Card icon={CheckCircle2} title="Delivery confirmed" tone="pine">
                  <LockerArt id={result.comp} open={false} done />
                  <div className="rounded-xl border p-3"><KeyVal k="Locker" v={result.comp} /><KeyVal k="Apartment" v={d.apt} /><KeyVal k="Proof" v="Door-closed sensor + photo" /><KeyVal k="Resident notified" v="App, WhatsApp, SMS" /></div>
                  <p className="text-xs text-muted-foreground">The resident received a single-use PIN and QR valid for 48 hours. Couriers never see the collection PIN.</p>
                  <Button size="lg" className="w-full" onClick={restart}>Next delivery</Button>
                </Card>
              )}
            </>
          )}
        </div>
      )}
    </OpsShell>
  );
}

function Card({ icon: Icon, title, children, tone }: { icon: typeof Truck; title: string; children: React.ReactNode; tone?: "pine" | "amber" }) {
  return (
    <div className="animate-rise grid gap-3 rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2.5"><span className={cn("grid size-10 place-items-center rounded-xl", tone === "pine" ? "bg-pine-700 text-white" : tone === "amber" ? "bg-amber-soft text-amber-700" : "bg-pine-50 text-pine-700")}><Icon className="size-5" /></span><div className="text-lg font-semibold">{title}</div></div>
      {children}
    </div>
  );
}

function LockerArt({ id, open, done }: { id: string; open: boolean; done?: boolean }) {
  return (
    <div className="mx-auto grid w-48 grid-cols-3 gap-1 rounded-2xl bg-pine-950 p-2">
      {Array.from({ length: 9 }, (_, i) => i === 4 ? (
        <div key={i} className={cn("relative grid aspect-square place-items-center rounded-md text-[10px] font-bold transition-all duration-500", open ? "bg-lime-accent text-pine-950 [transform:perspective(200px)_rotateY(-28deg)]" : done ? "bg-pine-500 text-white" : "animate-pulse-soft bg-lime-accent/70 text-pine-950")}>{id}</div>
      ) : <div key={i} className="aspect-square rounded-md bg-white/10" />)}
    </div>
  );
}
