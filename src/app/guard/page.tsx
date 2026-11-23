"use client";
import * as React from "react";
import Link from "next/link";
import { AlertOctagon, Car, CheckCircle2, Clock, KeyRound, PackagePlus, QrCode, ShieldAlert, UserPlus, Users, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { ago, cn, fmtTime } from "@/lib/utils";
import { BigAction } from "@/components/ops/shell";
import { LiveDot, Section, List, Row, IconBubble } from "@/components/shared/kit";
import { TYPE_ICON } from "@/components/resident/visitors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function GuardHome() {
  const visitors = useDemo((s) => s.visitors);
  const notes = useDemo((s) => s.notifications);
  const gateLog = useDemo((s) => s.gateLog);
  const markRead = useDemo((s) => s.markRead);
  const checkIn = useDemo((s) => s.checkIn);
  const checkOut = useDemo((s) => s.checkOut);

  const sos = notes.filter((n) => n.role === "guard" && n.kind === "emergency" && !n.read);
  const decisions = notes.filter((n) => n.role === "guard" && n.kind === "visitor" && !n.read).slice(0, 3);
  const live = visitors.filter((v) => v.createdBy === "guard" && (v.status === "pending" || v.status === "approved" || v.status === "rejected") && v.requestedAt && Date.now() - +new Date(v.requestedAt) < 3 * 3600e3);
  const expected = visitors.filter((v) => v.status === "expected" && +new Date(v.validTo) > Date.now()).sort((a, b) => +new Date(a.validFrom) - +new Date(b.validFrom));
  const inside = visitors.filter((v) => v.status === "inside");
  const entries = gateLog.filter((g) => g.dir === "in").length + 118;

  return (
    <div className="flex flex-col gap-5">
      {sos.map((n) => (
        <div key={n.id} className="animate-pulse-soft rounded-2xl bg-danger p-4 text-white shadow-lift">
          <div className="flex items-start gap-3">
            <AlertOctagon className="mt-0.5 size-6 shrink-0" />
            <div className="flex-1"><div className="text-lg font-semibold">{n.title}</div><div className="text-sm text-white/85">{n.body} · {ago(n.at)}</div></div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button className="flex-1 bg-white text-danger hover:bg-white/90" onClick={() => { markRead(n.id); toast.success("Responding", { description: "Supervisor and second guard alerted. Resident notified help is on the way." }); }}>Responding now</Button>
            <Button variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10" onClick={() => toast("Calling resident via masked line…")}>Call</Button>
          </div>
        </div>
      ))}

      {decisions.map((n) => (
        <button key={n.id} onClick={() => markRead(n.id)} className={cn("flex items-center gap-3 rounded-2xl p-4 text-left shadow-soft", n.title.startsWith("Approved") ? "bg-pine-700 text-white" : "bg-danger-soft text-danger")}>
          {n.title.startsWith("Approved") ? <CheckCircle2 className="size-6" /> : <XCircle className="size-6" />}
          <div className="flex-1"><div className="font-semibold">{n.title}</div><div className="text-sm opacity-80">{n.body}</div></div>
          <span className="text-xs opacity-70">Dismiss</span>
        </button>
      ))}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <BigAction icon={QrCode} label="Scan pass" sub="QR from resident's app" href="/guard/visitors?mode=scan" tone="dark" />
        <BigAction icon={KeyRound} label="Enter code" sub="NST-XXXX-XX" href="/guard/visitors?mode=code" />
        <BigAction icon={UserPlus} label="Walk-in visitor" sub="Ask resident to approve" href="/guard/visitors?mode=walkin" tone="lime" />
        <BigAction icon={Users} label="Household staff" sub="Verify & log in/out" href="/guard/staff" />
        <BigAction icon={PackagePlus} label="Courier / parcel" sub="Reception handover" href="/guard/parcels" />
        <BigAction icon={ShieldAlert} label="Report incident" sub="Photo + location" href="/guard/log?incident=1" />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[["Inside now", inside.length + 23], ["Entries today", entries], ["Expected", expected.length + 14]].map(([l, v]) => <div key={l} className="rounded-2xl border bg-card p-3 shadow-soft"><div className="text-2xl font-semibold tabular">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>)}
      </div>

      {live.length > 0 && (
        <Section title="Walk-in requests">
          <List>
            {live.map((v) => (
              <Row key={v.id} icon={TYPE_ICON[v.type]} tone={v.status === "approved" ? "pine" : v.status === "rejected" ? "red" : "amber"} title={v.name} subtitle={`${v.apt} · ${v.purpose ?? v.type} · ${ago(v.requestedAt!)}`}
                trailing={v.status === "pending" ? <Badge variant="warn"><LiveDot tone="amber" /> Waiting</Badge> : v.status === "approved" ? <Button size="sm" onClick={() => { checkIn(v.id); toast.success(`${v.name} checked in`); }}>Allow entry</Button> : <Badge variant="danger">Rejected</Badge>} />
            ))}
          </List>
        </Section>
      )}

      <Section title="Expected today" action={<Link href="/guard/visitors" className="text-sm font-medium text-pine-700">All</Link>}>
        <List>
          {expected.slice(0, 5).map((v) => (
            <Row key={v.id} icon={TYPE_ICON[v.type]} title={v.name} subtitle={`${v.apt} · ${fmtTime(v.validFrom)}–${fmtTime(v.validTo)}${v.vehicle ? ` · ${v.vehicle}` : ""}`} trailing={<span className="font-mono text-[11px] text-muted-foreground">{v.code}</span>} />
          ))}
          {expected.length === 0 && <div className="p-4 text-sm text-muted-foreground">No pre-approved visitors pending</div>}
        </List>
      </Section>

      <Section title="Inside now">
        <List>
          {inside.map((v) => (
            <Row key={v.id} icon={v.vehicle ? Car : TYPE_ICON[v.type]} tone="sky" title={v.name} subtitle={`${v.apt} · in since ${fmtTime(v.entryAt!)} · ${v.gate?.split(" —")[0]}`} trailing={<Button size="sm" variant="outline" onClick={() => { checkOut(v.id); toast.success(`${v.name} checked out`); }}>Check out</Button>} />
          ))}
          {inside.length === 0 && <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground"><Clock className="size-4" /> No registered visitors inside</div>}
        </List>
      </Section>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><IconBubble icon={ShieldAlert} tone="stone" size="sm" /> Gate approvals come only from residents. Guards cannot approve entry for an apartment.</div>
    </div>
  );
}
