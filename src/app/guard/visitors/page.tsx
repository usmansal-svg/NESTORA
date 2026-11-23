"use client";
import * as React from "react";
import { AlertTriangle, Camera, CheckCircle2, KeyRound, Loader2, Phone, QrCode, UserPlus, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Visitor, VisitorType } from "@/lib/types";
import { useQuery } from "@/lib/hooks";
import { ago, cn, fmtDateTime, fmtTime } from "@/lib/utils";
import { Segmented, Field, ChoiceGrid } from "@/components/shared/pickers";
import { KeyVal, List, Row } from "@/components/shared/kit";
import { TYPE_ICON, statusBadge } from "@/components/resident/visitors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";

type Mode = "scan" | "code" | "walkin" | "list";

export default function GuardVisitors() {
  const q = useQuery("mode");
  const [mode, setMode] = React.useState<Mode>("scan");
  React.useEffect(() => { if (q === "scan" || q === "code" || q === "walkin" || q === "list") setMode(q); }, [q]);
  return (
    <div className="flex flex-col gap-5">
      <Segmented value={mode} onChange={setMode} options={[{ value: "scan", label: "Scan" }, { value: "code", label: "Code" }, { value: "walkin", label: "Walk-in" }, { value: "list", label: "Today" }]} />
      {mode === "scan" && <Scan />}
      {mode === "code" && <Code />}
      {mode === "walkin" && <WalkIn />}
      {mode === "list" && <Today />}
    </div>
  );
}

function verdict(v: Visitor) {
  const now = Date.now();
  if (v.status === "inside") return { ok: false, msg: "Already inside — checked in " + ago(v.entryAt!) };
  if (v.status === "cancelled" || v.status === "rejected") return { ok: false, msg: "Pass was cancelled by the resident" };
  if (v.status === "exited" || +new Date(v.validTo) < now) return { ok: false, msg: "Pass has expired" };
  if (+new Date(v.validFrom) - now > 60 * 60e3) return { ok: false, msg: `Too early · valid from ${fmtDateTime(v.validFrom)}` };
  return { ok: true, msg: "Valid pass · resident pre-approved" };
}

function PassResult({ v, onDone }: { v: Visitor; onDone: () => void }) {
  const checkIn = useDemo((s) => s.checkIn);
  const live = useDemo((s) => s.visitors.find((x) => x.id === v.id)) ?? v;
  const r = verdict(live);
  const Icon = TYPE_ICON[live.type];
  return (
    <div className={cn("animate-rise overflow-hidden rounded-3xl border-2 bg-card shadow-lift", r.ok ? "border-pine-500" : "border-danger")}>
      <div className={cn("flex items-center gap-3 p-4 text-white", r.ok ? "bg-pine-700" : "bg-danger")}>{r.ok ? <CheckCircle2 className="size-7" /> : <XCircle className="size-7" />}<div className="text-lg font-semibold">{r.msg}</div></div>
      <div className="p-4">
        <div className="flex items-center gap-3"><span className="grid size-12 place-items-center rounded-2xl bg-secondary"><Icon className="size-6" /></span><div><div className="text-lg font-semibold">{live.name}</div><div className="text-sm text-muted-foreground">Visiting {live.apt} · {live.purpose ?? live.type}</div></div></div>
        <div className="mt-3 rounded-xl border p-3">
          <KeyVal k="Pass" v={<span className="font-mono">{live.code}</span>} />
          <KeyVal k="Valid" v={`${fmtTime(live.validFrom)} – ${fmtTime(live.validTo)}`} />
          {live.vehicle && <KeyVal k="Vehicle" v={live.vehicle} />}
          {live.guests && <KeyVal k="Guests" v={live.guests} />}
          <KeyVal k="Phone" v={live.phone.replace(/\d{3} \d{4}$/, "••• ••••")} />
        </div>
        <div className="mt-4 flex gap-2">
          {r.ok && <Button size="lg" className="flex-1" onClick={() => { checkIn(live.id); toast.success(`${live.name} checked in`, { description: `${live.apt} has been notified.` }); onDone(); }}>Check in</Button>}
          <Button size="lg" variant="outline" className={r.ok ? "" : "flex-1"} onClick={onDone}>{r.ok ? "Cancel" : "Back"}</Button>
        </div>
      </div>
    </div>
  );
}

function Scan() {
  const visitors = useDemo((s) => s.visitors);
  const [found, setFound] = React.useState<Visitor | null>(null);
  const [scanning, setScanning] = React.useState(false);
  const candidates = visitors.filter((v) => v.code.startsWith("NST")).slice(0, 6);
  const simulate = (v: Visitor) => { setScanning(true); setTimeout(() => { setScanning(false); setFound(v); }, 900); };
  if (found) return <PassResult v={found} onDone={() => setFound(null)} />;
  return (
    <>
      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl bg-pine-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#1b3b33,transparent_70%)]" />
        <div className="absolute inset-[18%] rounded-3xl border-2 border-white/25" />
        {["left-[18%] top-[18%] border-l-4 border-t-4 rounded-tl-3xl", "right-[18%] top-[18%] border-r-4 border-t-4 rounded-tr-3xl", "bottom-[18%] left-[18%] border-b-4 border-l-4 rounded-bl-3xl", "bottom-[18%] right-[18%] border-b-4 border-r-4 rounded-br-3xl"].map((c) => <div key={c} className={cn("absolute size-10 border-lime-accent", c)} />)}
        <div className="absolute inset-x-[20%] top-[20%] h-0.5 animate-scan bg-lime-accent shadow-[0_0_20px_#c4e36b]" />
        <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2 text-sm text-white/70">{scanning ? <><Loader2 className="size-4 animate-spin" /> Reading QR…</> : <><Camera className="size-4" /> Point at the visitor's QR pass</>}</div>
      </div>
      <div>
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Demo: tap a pass to simulate scanning it</div>
        <div className="grid gap-2 sm:grid-cols-2">
          {candidates.map((v) => (
            <button key={v.id} onClick={() => simulate(v)} className="flex items-center gap-3 rounded-xl border bg-card p-3 text-left text-sm hover:border-pine-300">
              <QrCode className="size-5 text-pine-700" /><div className="min-w-0 flex-1"><div className="truncate font-medium">{v.name}</div><div className="text-xs text-muted-foreground">{v.apt} · {v.code}</div></div>{statusBadge(v.status)}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function Code() {
  const visitors = useDemo((s) => s.visitors);
  const [code, setCode] = React.useState("NST-");
  const [found, setFound] = React.useState<Visitor | null>(null);
  const [err, setErr] = React.useState("");
  if (found) return <PassResult v={found} onDone={() => { setFound(null); setCode("NST-"); }} />;
  const go = () => { const v = visitors.find((x) => x.code.toUpperCase() === code.trim().toUpperCase()); if (v) { setErr(""); setFound(v); } else setErr("No pass found with this code. Ask the visitor to check the message from the resident, or register them as a walk-in."); };
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <KeyRound className="size-7 text-pine-700" />
      <div className="mt-3 text-lg font-semibold">Enter pass code</div>
      <p className="text-sm text-muted-foreground">The code is printed under the QR in the visitor's WhatsApp or SMS pass.</p>
      <Input autoFocus value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === "Enter" && go()} className="mt-4 h-14 text-center font-mono text-2xl tracking-[0.2em]" />
      {err && <div className="mt-3 flex items-start gap-2 rounded-xl bg-danger-soft p-3 text-sm text-danger"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{err}</div>}
      <Button size="lg" className="mt-4 w-full" onClick={go} disabled={code.length < 8}>Verify</Button>
      <div className="mt-3 text-xs text-muted-foreground">Try <button className="font-mono text-pine-700 underline" onClick={() => setCode("NST-8K2Q-41")}>NST-8K2Q-41</button></div>
    </div>
  );
}

function WalkIn() {
  const requestEntry = useDemo((s) => s.requestEntry);
  const checkIn = useDemo((s) => s.checkIn);
  const [f, setF] = React.useState({ name: "", phone: "", apt: "A-1204", type: "guest" as VisitorType, purpose: "", vehicle: "" });
  const [photo, setPhoto] = React.useState(false);
  const [id, setId] = React.useState<string | null>(null);
  const v = useDemo((s) => (id ? s.visitors.find((x) => x.id === id) : undefined));
  const [secs, setSecs] = React.useState(0);
  React.useEffect(() => { if (!id || v?.status !== "pending") return; const t = setInterval(() => setSecs((x) => x + 1), 1000); return () => clearInterval(t); }, [id, v?.status]);

  if (v) {
    return (
      <div className="animate-rise overflow-hidden rounded-3xl border bg-card shadow-lift">
        <div className={cn("p-5 text-white", v.status === "pending" ? "bg-amber-600" : v.status === "rejected" ? "bg-danger" : "bg-pine-700")}>
          <div className="flex items-center gap-3">
            {v.status === "pending" ? <Loader2 className="size-7 animate-spin" /> : v.status === "rejected" ? <XCircle className="size-7" /> : <CheckCircle2 className="size-7" />}
            <div><div className="text-lg font-semibold">{v.status === "pending" ? `Waiting for ${v.apt} to respond` : v.status === "rejected" ? "Entry declined by resident" : v.status === "inside" ? "Checked in" : "Approved by resident"}</div><div className="text-sm text-white/80">{v.status === "pending" ? `Sent by push and WhatsApp · ${secs}s` : v.decidedAt ? `at ${fmtTime(v.decidedAt)}` : ""}</div></div>
          </div>
        </div>
        <div className="p-5">
          <div className="text-lg font-semibold">{v.name}</div><div className="text-sm text-muted-foreground">{v.purpose ?? v.type} · {v.apt}{v.vehicle ? ` · ${v.vehicle}` : ""}</div>
          {v.status === "pending" && (
            <div className="mt-4 rounded-xl bg-secondary/60 p-3 text-sm">
              Ask the visitor to wait. In this demo, open the resident app in another tab (or use <b>Demo as… → Resident</b>) to approve or reject.
              <Button variant="outline" className="mt-3 w-full" onClick={() => toast("Calling A-1204 via masked line…", { description: "The resident sees the NESTORA gate number." })}><Phone /> Call resident</Button>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            {v.status === "approved" && <Button size="lg" className="flex-1" onClick={() => { checkIn(v.id); toast.success(`${v.name} checked in`); }}>Allow entry</Button>}
            {(v.status !== "pending") && <Button size="lg" variant="outline" className="flex-1" onClick={() => { setId(null); setSecs(0); setF({ ...f, name: "", phone: "", purpose: "", vehicle: "" }); setPhoto(false); }}>New walk-in</Button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 rounded-3xl border bg-card p-5 shadow-soft">
      <div className="flex items-center gap-2 text-lg font-semibold"><UserPlus className="size-5" /> Register walk-in</div>
      <ChoiceGrid value={f.type} onChange={(t) => setF({ ...f, type: t })} options={(["guest", "delivery", "service", "contractor", "cab", "family"] as VisitorType[]).map((t) => ({ value: t, label: t[0].toUpperCase() + t.slice(1), icon: TYPE_ICON[t] }))} />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Visitor name"><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="e.g. Kashif (Daraz rider)" /></Field>
        <Field label="Mobile"><Input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} inputMode="tel" placeholder="+92 3xx xxx xxxx" /></Field>
        <Field label="Apartment"><Select value={f.apt} onValueChange={(a) => setF({ ...f, apt: a })} options={["A-1204", "A-0802", "B-0904", "C-1503", "C-0702"].map((a) => ({ value: a, label: a === "A-1204" ? "A-1204 · Ahmed Raza" : a }))} /></Field>
        <Field label="Purpose"><Input value={f.purpose} onChange={(e) => setF({ ...f, purpose: e.target.value })} placeholder="Food delivery" /></Field>
        <Field label="Vehicle (optional)"><Input value={f.vehicle} onChange={(e) => setF({ ...f, vehicle: e.target.value.toUpperCase() })} placeholder="KHI-1234" /></Field>
        <Field label="Photo"><button onClick={() => { setPhoto(true); toast("Photo captured", { description: "Stored for 30 days, visible to the resident and security only." }); }} className={cn("flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-sm", photo ? "border-pine-400 bg-pine-50 text-pine-800" : "border-dashed text-muted-foreground")}><Camera className="size-4" />{photo ? "Photo captured" : "Capture face photo"}</button></Field>
      </div>
      <Button size="lg" disabled={!f.name} onClick={() => { const nv = requestEntry({ name: f.name, phone: f.phone || "+92 300 0000000", apt: f.apt, type: f.type, purpose: f.purpose || undefined, vehicle: f.vehicle || undefined }); setId(nv.id); }}>Request approval from {f.apt}</Button>
    </div>
  );
}

function Today() {
  const visitors = useDemo((s) => s.visitors);
  const checkOut = useDemo((s) => s.checkOut);
  return (
    <List>
      {visitors.slice(0, 20).map((v) => (
        <Row key={v.id} icon={TYPE_ICON[v.type]} title={v.name} subtitle={`${v.apt} · ${v.purpose ?? v.type} · ${fmtTime(v.validFrom)}`}
          trailing={<div className="flex items-center gap-2">{statusBadge(v.status)}{v.status === "inside" && <Button size="sm" variant="outline" onClick={() => { checkOut(v.id); toast.success(`${v.name} checked out`); }}>Out</Button>}</div>} />
      ))}
      {visitors.length === 0 && <div className="p-4 text-sm text-muted-foreground"><Users className="mr-2 inline size-4" />No visitors</div>}
    </List>
  );
}
