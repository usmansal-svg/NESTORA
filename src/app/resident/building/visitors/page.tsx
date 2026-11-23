"use client";
import * as React from "react";
import { Plus, Repeat, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import type { Visitor, VisitorType } from "@/lib/types";
import { ago, fmtDateTime, fmtTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";



import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, Empty, List, PageHeader, Row, Timeline } from "@/components/shared/kit";


import { VisitorPass } from "@/components/resident/visitor-pass";
import { VisitorApprovalCard } from "@/components/resident/visitor-approval";
import { NewVisitorSheet, statusBadge, TYPE_ICON } from "@/components/resident/visitors";

export default function VisitorsPage() {
  const s = useDemo();
  const q = useQuery("new");
  const [tab, setTab] = React.useState<"upcoming" | "requests" | "inside" | "history" | "recurring">("upcoming");
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<Visitor | null>(null);
  React.useEffect(() => { if (q) setOpen(true); }, [q]);

  const mine = s.visitors.filter((v) => v.apt === "A-1204");
  const groups = {
    upcoming: mine.filter((v) => ["expected", "approved"].includes(v.status)),
    requests: mine.filter((v) => v.status === "pending"),
    inside: mine.filter((v) => v.status === "inside"),
    history: mine.filter((v) => ["exited", "rejected", "cancelled", "expired"].includes(v.status)),
    recurring: mine.filter((v) => v.recurring),
  };
  const list = groups[tab];
  const live = view ? s.visitors.find((x) => x.id === view.id) ?? view : null;

  return (
    <div>
      <PageHeader back="/resident/building" title="Visitors" subtitle="Pre-register guests and approve entry" actions={<Button size="sm" onClick={() => setOpen(true)}><Plus /> Invite</Button>} />

      <div className="grid gap-3 sm:grid-cols-3">
        {[["Expected today", groups.upcoming.filter((v) => new Date(v.validFrom).toDateString() === new Date().toDateString()).length], ["Inside now", groups.inside.length], ["This month", mine.length + 18]].map(([l, n]) => (
          <div key={l as string} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft"><div className="text-[12.5px] text-muted-foreground">{l}</div><div className="mt-1 text-2xl font-semibold">{n}</div></div>
        ))}
      </div>

      {groups.requests.length > 0 && <div className="mt-5 space-y-3">{groups.requests.map((v) => <VisitorApprovalCard key={v.id} v={v} />)}</div>}

      <Chips className="mt-5" value={tab} onChange={setTab} options={[
        { value: "upcoming", label: "Upcoming", count: groups.upcoming.length }, { value: "requests", label: "Requests", count: groups.requests.length },
        { value: "inside", label: "Inside", count: groups.inside.length }, { value: "recurring", label: "Recurring", count: groups.recurring.length }, { value: "history", label: "History" },
      ]} />

      <div className="mt-4">
        {list.length === 0 ? (
          <Empty icon={UserPlus} title="Nothing here" body="Invite a guest and we'll generate a secure QR pass they can show at the gate." action={<Button onClick={() => setOpen(true)}><Plus /> Invite visitor</Button>} />
        ) : (
          <List>
            {list.map((v) => {
              const I = TYPE_ICON[v.type];
              return (
                <Row key={v.id} onClick={() => setView(v)} icon={I} tone={v.status === "pending" ? "amber" : v.status === "inside" ? "lime" : "pine"}
                  title={<span className="flex items-center gap-2">{v.name} {v.recurring && <Repeat className="size-3.5 text-muted-foreground" />}</span>}
                  subtitle={`${v.purpose ?? v.type} · ${v.status === "exited" ? `Left ${ago(v.exitAt!)}` : v.status === "inside" ? `Entered ${ago(v.entryAt!)}` : fmtDateTime(v.validFrom)}${v.vehicle ? ` · ${v.vehicle}` : ""}`}
                  trailing={statusBadge(v.status)} />
              );
            })}
          </List>
        )}
      </div>

      <NewVisitorSheet open={open} onOpenChange={setOpen} onCreated={(v) => setView(v)} />

      <Sheet open={!!live} onOpenChange={(o) => !o && setView(null)}>
        <SheetContent>
          {live && (
            <>
              <SheetHeader><SheetTitle>{live.name}</SheetTitle><SheetDescription className="flex items-center gap-2">{statusBadge(live.status)} {live.purpose} · {live.phone}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-5">
                {["expected", "approved"].includes(live.status) && <VisitorPass v={live} />}
                {live.status === "pending" && <VisitorApprovalCard v={live} compact />}
                <div className="rounded-2xl border bg-card p-4">
                  <div className="mb-3 text-sm font-semibold">Access log</div>
                  <Timeline items={[
                    { label: live.createdBy === "guard" ? "Walk-in request by guard" : "Pass created by you", at: live.requestedAt ? fmtDateTime(live.requestedAt) : `Valid ${fmtDateTime(live.validFrom)} – ${fmtTime(live.validTo)}`, done: true },
                    ...(live.decidedAt ? [{ label: live.status === "rejected" ? "Rejected by you" : "Approved by you", at: fmtDateTime(live.decidedAt), done: true }] : []),
                    { label: "Entered building", at: live.entryAt ? `${fmtDateTime(live.entryAt)} · ${live.gate ?? "Gate 1"}` : "Waiting", done: !!live.entryAt, active: ["approved", "expected"].includes(live.status) },
                    { label: "Exited building", at: live.exitAt ? fmtDateTime(live.exitAt) : "—", done: !!live.exitAt, active: live.status === "inside" },
                  ]} />
                </div>
              </SheetBody>
              {["expected", "approved"].includes(live.status) && (
                <SheetFooter><Button variant="outline" className="w-full text-danger" onClick={() => { s.cancelVisitor(live.id); toast("Pass cancelled", { description: "The QR code no longer works at the gate." }); setView(null); }}><X /> Cancel pass</Button></SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

