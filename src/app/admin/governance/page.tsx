"use client";
import * as React from "react";
import { CalendarClock, FileText, Gavel, Lock, ScrollText, Users, Vote } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { ago, fmtDate } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { IconBubble, Stat } from "@/components/shared/kit";
import { Avatar, Progress } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { face } from "@/lib/img";

const COMMITTEE = [
  { name: "Brig. (R) Khalid Mehmood", role: "Chairperson", apt: "B-2201", photo: face("m5") },
  { name: "Sadia Qureshi", role: "General Secretary", apt: "A-0703", photo: face("w2") },
  { name: "Tariq Mehmood", role: "Treasurer", apt: "C-1404", photo: face("m3") },
  { name: "Dr. Farah Siddiqui", role: "Member · Health & safety", apt: "A-1801", photo: face("w4") },
  { name: "Ahmed Raza", role: "Member · Technology", apt: "A-1204", photo: face("m2") },
];
const RESOLUTIONS = [
  { id: "RES-26/14", title: "Approve rooftop solar feasibility study (Rs 3.5 lac)", date: "12 Nov 2026", result: "Passed 4–1" },
  { id: "RES-26/13", title: "Revise maintenance to Rs 12.5 / sq ft from January", date: "12 Nov 2026", result: "Passed 5–0" },
  { id: "RES-26/12", title: "Renew Phoenix Security contract for 12 months", date: "28 Oct 2026", result: "Passed 3–2" },
  { id: "RES-26/11", title: "Ban on renovation work after 7 PM", date: "28 Oct 2026", result: "Passed 5–0" },
];

export default function Governance() {
  const anns = useDemo((s) => s.announcements);
  const polls = anns.filter((a) => a.poll);
  const [rsvps, setRsvps] = React.useState(0);
  const [closed, setClosed] = React.useState<string[]>([]);
  return (
    <>
      <AdminHeader title="Governance" subtitle="Committee, formal votes, meetings and minutes" actions={<Button onClick={() => { setRsvps(1); toast.success("AGM notice sent to 196 owners", { description: "Proxy forms attached · RSVP tracking on" }); }}><CalendarClock /> Call AGM</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active polls" value={polls.filter((p) => !closed.includes(p.id)).length} icon={Vote} tone="violet" />
        <Stat label="Resolutions (2026)" value={14} icon={Gavel} />
        <Stat label="Next meeting" value="10 Dec" sub="Committee · 8 PM" icon={CalendarClock} tone="sky" />
        <Stat label="AGM quorum" value={rsvps ? "42%" : "—"} sub="owners confirmed" icon={Users} tone="lime" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Polls and formal votes" subtitle="Formal votes are one per apartment, owners only, and auditable">
          <div className="flex flex-col gap-3">
            {polls.map((p) => {
              const tot = p.poll!.options.reduce((a, o) => a + o.votes, 0);
              const isClosed = closed.includes(p.id);
              return (
                <div key={p.id} className="rounded-xl border p-3.5">
                  <div className="flex items-start justify-between gap-2"><div className="font-medium">{p.title}</div>{p.poll!.formal ? <Badge variant="violet"><Lock className="size-3" /> Formal</Badge> : <Badge variant="muted">Informal</Badge>}</div>
                  <div className="mt-2.5 flex flex-col gap-1.5">{p.poll!.options.map((o) => <div key={o.label} className="text-xs"><div className="mb-0.5 flex justify-between"><span>{o.label}</span><span className="tabular">{o.votes} · {Math.round((o.votes / (tot || 1)) * 100)}%</span></div><Progress value={(o.votes / (tot || 1)) * 100} className="h-1.5" /></div>)}</div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground"><span>{tot} votes · {isClosed ? "closed" : `closes ${fmtDate(p.poll!.closes)}`}</span>
                    {!isClosed ? <Button size="sm" variant="outline" onClick={() => { setClosed([...closed, p.id]); toast.success("Poll closed", { description: "Result certificate generated with the vote audit log." }); }}>Close & certify</Button> : <Badge>Certified</Badge>}
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Management committee" subtitle="Elected March 2026 · term 2 years">
            <div className="flex flex-col gap-2.5">{COMMITTEE.map((m) => <div key={m.name} className="flex items-center gap-3"><Avatar src={m.photo} name={m.name} className="size-9" /><div className="flex-1"><div className="text-sm font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.role} · {m.apt}</div></div></div>)}</div>
          </Panel>
          <Panel title="Resolutions">
            <div className="flex flex-col divide-y">{RESOLUTIONS.map((r) => <div key={r.id} className="flex items-center gap-3 py-2.5 first:pt-0"><IconBubble icon={ScrollText} tone="stone" size="sm" /><div className="min-w-0 flex-1"><div className="truncate text-sm">{r.title}</div><div className="text-xs text-muted-foreground">{r.id} · {r.date}</div></div><Badge variant="default">{r.result}</Badge></div>)}</div>
          </Panel>
          <Panel title="Minutes & bylaws">
            <div className="grid gap-2 sm:grid-cols-2">{["Minutes — 12 Nov 2026", "Minutes — 28 Oct 2026", "Ocean Heights bylaws (2024)", "AGM 2026 report"].map((d) => <button key={d} onClick={() => toast.success(`${d}.pdf opened`)} className="flex items-center gap-2 rounded-xl border p-3 text-left text-sm hover:bg-secondary/50"><FileText className="size-4 text-pine-600" />{d}</button>)}</div>
            <div className="mt-2 text-xs text-muted-foreground">Last updated {ago(new Date(Date.now() - 864e5 * 9).toISOString())}</div>
          </Panel>
        </div>
      </div>
    </>
  );
}
