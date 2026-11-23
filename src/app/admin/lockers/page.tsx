"use client";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { BatteryMedium, KeyRound, PackageOpen, Plus, RefreshCw, ShieldAlert, Wifi, WifiOff, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Compartment, LockerSize } from "@/lib/types";
import { PARCEL_DAILY } from "@/data/admin";
import { ago, cn, fmtDateTime } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { KeyVal, LiveDot, Stat } from "@/components/shared/kit";
import { Field, Segmented } from "@/components/shared/pickers";
import { CourierMark } from "@/components/shared/courier";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const SIZE_CLS: Record<LockerSize, string> = { S: "row-span-1", M: "row-span-2", L: "row-span-3", XL: "row-span-4" };
const ST_CLS: Record<Compartment["status"], string> = { available: "bg-pine-50 text-pine-800 border-pine-200", occupied: "bg-pine-700 text-white border-pine-700", faulty: "bg-danger-soft text-danger border-danger/40", disabled: "bg-secondary text-muted-foreground border-border [background-image:repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,.04)_4px,rgba(0,0,0,.04)_8px)]" };

export default function Lockers() {
  const banks = useDemo((s) => s.banks);
  const comps = useDemo((s) => s.compartments);
  const parcels = useDemo((s) => s.parcels);
  const setCompartment = useDemo((s) => s.setCompartment);
  const regeneratePin = useDemo((s) => s.regeneratePin);
  const [bank, setBank] = React.useState("LB-A");
  const [sel, setSel] = React.useState<string | null>(null);
  const [add, setAdd] = React.useState(false);
  const [extra, setExtra] = React.useState<{ name: string; loc: string; n: number }[]>([]);
  const [fault, setFault] = React.useState("Door sensor not closing");
  const c = comps.find((x) => x.id === sel);
  const cp = c?.parcelId ? parcels.find((p) => p.id === c.parcelId) : undefined;
  const bc = comps.filter((x) => x.bank === bank);
  const occ = comps.filter((x) => x.status === "occupied").length;
  const overdue = parcels.filter((p) => p.status === "overdue" || (p.status === "awaiting" && p.expiresAt && +new Date(p.expiresAt) < Date.now()));
  const awaiting = parcels.filter((p) => p.status === "awaiting");

  return (
    <>
      <AdminHeader title="Parcel Lockers" subtitle="Smart locker banks, compartments, overdue parcels and hardware health" actions={<Button onClick={() => setAdd(true)}><Plus /> Add locker bank</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Compartments" value={comps.length + extra.reduce((a, e) => a + e.n, 0)} sub={`${banks.length + extra.length} banks`} icon={PackageOpen} />
        <Stat label="Occupied" value={occ} sub={`${Math.round((occ / comps.length) * 100)}% utilisation`} tone="sky" />
        <Stat label="Awaiting pickup" value={awaiting.length} sub={`${overdue.length} overdue (> 48 h)`} tone="amber" />
        <Stat label="Faulty / disabled" value={comps.filter((x) => x.status === "faulty" || x.status === "disabled").length} icon={Wrench} tone="red" />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[1.35fr_1fr]">
        <Panel title="Compartments" subtitle="Select a compartment to manage it" action={<Segmented value={bank} onChange={setBank} options={banks.map((b) => ({ value: b.id, label: b.id.replace("LB-", "Bank ") }))} />}>
          <div className="rounded-2xl bg-pine-950 p-3">
            <div className="grid grid-flow-col grid-rows-[repeat(10,22px)] gap-1.5">
              {bc.map((x) => (
                <button key={x.id} onClick={() => setSel(x.id)} className={cn("flex items-center justify-between rounded-md border px-1.5 text-[10px] font-semibold transition hover:brightness-95", SIZE_CLS[x.size], ST_CLS[x.status], sel === x.id && "ring-2 ring-lime-accent")}>
                  <span>{x.id}</span><span className="opacity-60">{x.size}</span>
                </button>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-md bg-white/5 py-1.5 text-[10px] text-white/60"><span className="size-1.5 rounded-full bg-lime-accent" /> Touchscreen · camera · QR reader</div>
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">{(["available", "occupied", "faulty", "disabled"] as const).map((k) => <span key={k} className="flex items-center gap-1.5 capitalize"><span className={cn("size-2.5 rounded-sm border", ST_CLS[k])} />{k}</span>)}</div>
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Hardware health">
            <div className="flex flex-col gap-2.5">
              {banks.map((b) => (
                <div key={b.id} className="flex items-center gap-3 rounded-xl border p-3 text-sm">
                  {b.online ? <Wifi className="size-4 text-pine-600" /> : <WifiOff className="size-4 text-danger" />}
                  <div className="flex-1"><div className="font-medium">{b.name}</div><div className="text-xs text-muted-foreground">Ping {ago(b.lastPing)} · {b.location}</div></div>
                  <div className="flex items-center gap-1 text-xs"><BatteryMedium className={cn("size-4", b.battery < 90 ? "text-amber-600" : "text-pine-600")} />{b.battery}%</div>
                  {b.tamper ? <Badge variant="danger">Tamper</Badge> : <LiveDot />}
                </div>
              ))}
              {extra.map((e) => <div key={e.name} className="flex items-center gap-3 rounded-xl border border-dashed p-3 text-sm"><RefreshCw className="size-4 animate-spin text-muted-foreground" /><div className="flex-1"><div className="font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.loc} · {e.n} compartments · pairing</div></div><Badge variant="warn">Provisioning</Badge></div>)}
              <div className="text-xs text-muted-foreground">Bank C is on UPS backup power since 1:40 PM. Battery-backed locks stay closed during outages.</div>
            </div>
          </Panel>
          <Panel title="Deliveries this week">
            <div className="h-[140px]"><ResponsiveContainer><BarChart data={PARCEL_DAILY}><XAxis dataKey="d" fontSize={11} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} cursor={{ fill: "var(--color-pine-50)" }} formatter={(v) => [`${v} parcels`, ""]} /><Bar dataKey="n" fill="var(--color-pine-500)" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></div>
            <div className="mt-2 grid grid-cols-3 text-center text-xs"><div><div className="text-base font-semibold">6.2 h</div><div className="text-muted-foreground">avg. pickup</div></div><div><div className="text-base font-semibold">94%</div><div className="text-muted-foreground">within 24 h</div></div><div><div className="text-base font-semibold">2%</div><div className="text-muted-foreground">to reception</div></div></div>
          </Panel>
        </div>
      </div>

      <Panel title="Parcels needing attention" subtitle="Overdue items and reception handovers" className="mt-4">
        <Table rows={parcels.filter((p) => ["awaiting", "overdue", "reception"].includes(p.status))} cols={[
          { h: "Parcel", c: (r) => <div className="flex items-center gap-2"><CourierMark name={r.courier} /><div><div className="font-medium">{r.id}</div><div className="text-xs text-muted-foreground">{r.courier} · {r.tracking}</div></div></div> },
          { h: "For", c: (r) => `${r.recipient} · ${r.apt}` },
          { h: "Location", c: (r) => r.status === "reception" ? "Reception" : `${r.compartment ?? "—"}` },
          { h: "Arrived", c: (r) => r.arrivedAt ? ago(r.arrivedAt) : "—" },
          { h: "Status", c: (r) => <Badge variant={r.status === "overdue" ? "danger" : r.status === "reception" ? "info" : "muted"}>{r.status === "awaiting" ? "In locker" : r.status === "overdue" ? "Overdue" : "At reception"}</Badge> },
          { h: "", c: (r) => r.status !== "reception" ? <Button size="sm" variant="outline" onClick={() => { regeneratePin(r.id); toast.success(`New PIN sent to ${r.apt}`, { description: "Previous PIN is now invalid · valid 48 h" }); }}><KeyRound /> Reissue PIN</Button> : <Button size="sm" variant="ghost" onClick={() => toast("Resident reminded to collect from reception")}>Remind</Button> },
        ]} />
      </Panel>

      <Dialog open={!!c} onOpenChange={(o) => !o && setSel(null)}>
        {c && (
          <DialogContent>
            <DialogHeader><DialogTitle>Compartment {c.id}</DialogTitle><DialogDescription>{banks.find((b) => b.id === c.bank)?.name} · size {c.size}</DialogDescription></DialogHeader>
            <div className="rounded-xl border p-3.5">
              <KeyVal k="Status" v={<Badge variant={c.status === "available" ? "default" : c.status === "occupied" ? "info" : "danger"}>{c.status}</Badge>} />
              {c.fault && <KeyVal k="Fault" v={c.fault} />}
              {cp && <><KeyVal k="Parcel" v={`${cp.id} · ${cp.courier}`} /><KeyVal k="For" v={`${cp.recipient}, ${cp.apt}`} /><KeyVal k="Deposited" v={cp.arrivedAt ? fmtDateTime(cp.arrivedAt) : "—"} /><KeyVal k="PIN expires" v={cp.expiresAt ? fmtDateTime(cp.expiresAt) : "—"} /></>}
            </div>
            {c.status === "occupied" ? (
              <div className="flex items-start gap-2 rounded-xl bg-amber-soft p-3 text-xs text-amber-900"><ShieldAlert className="mt-0.5 size-4 shrink-0" /> Occupied compartments can't be disabled. Remote door opening is not available in this demo — the guard must open it on site with supervisor authorisation.</div>
            ) : (
              <div className="grid gap-3">
                {c.status === "available" && <Field label="Fault description"><Input value={fault} onChange={(e) => setFault(e.target.value)} /></Field>}
                <div className="flex flex-wrap gap-2">
                  {c.status !== "available" && <Button onClick={() => { setCompartment(c.id, "available"); toast.success(`${c.id} back in service`); setSel(null); }}>Return to service</Button>}
                  {c.status === "available" && <Button variant="destructive" onClick={() => { setCompartment(c.id, "faulty", fault); toast(`${c.id} marked faulty`, { description: "Maintenance ticket raised with the locker vendor." }); setSel(null); }}>Mark faulty</Button>}
                  {c.status === "available" && <Button variant="outline" onClick={() => { setCompartment(c.id, "disabled"); toast(`${c.id} disabled`); setSel(null); }}>Disable</Button>}
                </div>
              </div>
            )}
          </DialogContent>
        )}
      </Dialog>
      <AddBank open={add} onClose={() => setAdd(false)} onAdd={(e) => setExtra([...extra, e])} />
    </>
  );
}

function AddBank({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (e: { name: string; loc: string; n: number }) => void }) {
  const [name, setName] = React.useState("Bank D · Tower C Lobby");
  const [loc, setLoc] = React.useState("Ground floor, Tower C reception");
  const [mix, setMix] = React.useState("standard");
  const n = mix === "standard" ? 24 : mix === "large" ? 16 : 36;
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add a locker bank</DialogTitle><DialogDescription>Register a new unit. It joins the network after the installer scans its pairing code.</DialogDescription></DialogHeader>
        <div className="grid gap-3">
          <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Location"><Input value={loc} onChange={(e) => setLoc(e.target.value)} /></Field>
          <Field label="Size configuration"><Select value={mix} onValueChange={setMix} options={[{ value: "standard", label: "Standard · 24 (8 S, 8 M, 6 L, 2 XL)" }, { value: "large", label: "Bulky · 16 (4 M, 8 L, 4 XL)" }, { value: "dense", label: "Dense · 36 (24 S, 12 M)" }]} /></Field>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => { onAdd({ name, loc, n }); toast.success(`${name} registered`, { description: "Waiting for on-site pairing." }); onClose(); }}>Register</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
