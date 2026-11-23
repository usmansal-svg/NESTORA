"use client";
import * as React from "react";
import Link from "next/link";
import { BadgeCheck, Pause, Play, Plus, Trash2, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { StaffPermission } from "@/lib/types";
import { cn, DAYS, fmtDate, fmtTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Empty, LiveDot, PageHeader, Section } from "@/components/shared/kit";
import { StaffSheet } from "@/components/resident/staff-sheet";

const hl = (t: string) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}${m ? `:${m}` : ""} ${h < 12 ? "AM" : "PM"}`; };
const inWindow = (p: StaffPermission) => { const n = new Date(); const t = `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`; return p.days.includes(n.getDay()) && t >= p.from && t <= p.to; };

export default function StaffPage() {
  const s = useDemo();
  const [add, setAdd] = React.useState(false);
  const [sel, setSel] = React.useState<string | null>(null);
  const mine = s.staff.filter((x) => x.apt === "A-1204");
  const cur = mine.find((x) => x.id === sel);

  return (
    <div>
      <PageHeader back="/resident" title="Staff access" subtitle="Recurring permissions for household workers" actions={<Button size="sm" onClick={() => setAdd(true)}><Plus /> Add staff</Button>} />
      <div className="rounded-2xl bg-gradient-to-r from-violet-50 to-card p-4 text-sm ring-1 ring-violet-100">
        <b>How it works:</b> Guards automatically recognise staff during their schedule. Outside their window, you’ll be asked to approve. Looking for new help? <Link href="/resident/explore/household-help" className="font-medium text-pine-700 underline">Hire verified staff</Link>
      </div>
      {mine.length === 0 ? <Empty icon={Users} title="No staff registered" /> : (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {mine.map((p) => {
            const inside = p.log[0] && !p.log[0].out;
            return (
              <button key={p.id} onClick={() => setSel(p.id)} className={cn("rounded-2xl border border-border/70 bg-card p-4 text-left shadow-soft transition hover:shadow-lift", p.status !== "active" && "opacity-70")}>
                <div className="flex items-center gap-3">
                  <Avatar src={p.photo} name={p.name} className="size-12" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 font-semibold">{p.name} {p.verified && <BadgeCheck className="size-4 text-pine-600" />}</div>
                    <div className="text-[13px] text-muted-foreground">{p.role} · since {p.since}</div>
                  </div>
                  {p.status === "active" ? (inside ? <Badge variant="lime"><LiveDot className="mr-0.5" /> Inside</Badge> : inWindow(p) ? <Badge>Expected now</Badge> : <Badge variant="muted">Active</Badge>) : <Badge variant={p.status === "paused" ? "warn" : "danger"}>{p.status === "paused" ? "Paused" : "Revoked"}</Badge>}
                </div>
                <div className="mt-4 flex gap-1">{DAYS.map((d, i) => <span key={d} className={cn("grid h-7 flex-1 place-items-center rounded-md text-[11px] font-medium", p.days.includes(i) ? "bg-pine-100 text-pine-800" : "bg-secondary text-muted-foreground/50")}>{d[0]}</span>)}</div>
                <div className="mt-3 flex items-center justify-between text-[12.5px]"><span className="flex items-center gap-1.5 text-muted-foreground"><Clock className="size-3.5" /> {hl(p.from)} – {hl(p.to)}</span><span className="text-muted-foreground">{p.log[0] ? `Last in ${fmtTime(p.log[0].in)}` : "No entries yet"}</span></div>
              </button>
            );
          })}
        </div>
      )}

      <StaffSheet open={add} onOpenChange={setAdd} />

      <Sheet open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {cur && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3"><Avatar src={cur.photo} name={cur.name} className="size-14" /><div><SheetTitle>{cur.name}</SheetTitle><SheetDescription>{cur.role} · {cur.phone}</SheetDescription></div></div>
              </SheetHeader>
              <SheetBody className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl border bg-card p-3"><div className="text-xs text-muted-foreground">Schedule</div><div className="mt-1 text-sm font-semibold">{cur.days.length} days/wk</div></div>
                  <div className="rounded-2xl border bg-card p-3"><div className="text-xs text-muted-foreground">Window</div><div className="mt-1 text-sm font-semibold">{hl(cur.from)}–{hl(cur.to)}</div></div>
                  <div className="rounded-2xl border bg-card p-3"><div className="text-xs text-muted-foreground">Identity</div><div className="mt-1 text-sm font-semibold text-pine-700">{cur.consentId ? "Verified" : "Pending"}</div></div>
                </div>
                <Section title="Entry & exit history" className="mt-2">
                  <div className="divide-y rounded-2xl border bg-card">
                    {cur.log.length ? cur.log.map((l, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 text-sm"><span>{fmtDate(l.in, { weekday: "short", day: "numeric", month: "short" })}</span><span className="text-muted-foreground">In {fmtTime(l.in)} · {l.out ? `Out ${fmtTime(l.out)}` : <span className="font-medium text-pine-700">Inside</span>}</span></div>
                    )) : <div className="p-4 text-sm text-muted-foreground">No visits recorded yet.</div>}
                  </div>
                </Section>
              </SheetBody>
              <SheetFooter className="grid grid-cols-2 gap-2">
                {cur.status === "active" ? (
                  <Button variant="outline" onClick={() => { s.updateStaff(cur.id, { status: "paused" }); toast("Access paused", { description: "Guards will ask you before letting them in." }); }}><Pause /> Pause</Button>
                ) : (
                  <Button variant="outline" onClick={() => { s.updateStaff(cur.id, { status: "active" }); toast.success("Access resumed"); }}><Play /> Resume</Button>
                )}
                <Button variant="outline" className="text-danger" disabled={cur.status === "revoked"} onClick={() => { s.updateStaff(cur.id, { status: "revoked" }); toast("Access revoked", { description: `${cur.name} can no longer enter Ocean Heights.` }); }}><Trash2 /> Revoke</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
