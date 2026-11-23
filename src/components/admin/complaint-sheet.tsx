"use client";
import * as React from "react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Complaint, ComplaintStatus } from "@/lib/types";
import { cn, fmtDateTime } from "@/lib/utils";
import { Timeline, Stars } from "@/components/shared/kit";
import { Field } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select } from "@/components/ui/misc";
import { Textarea } from "@/components/ui/input";

export const TEAM = ["Rashid (Plumbing)", "Jamil (Electrical)", "Imtiaz (Genset)", "Supervisor Naveed", "SparkClean team", "Schindler (Lifts)"];
export const prioVariant = (p: Complaint["priority"]) => (p === "Urgent" ? "danger" : p === "High" ? "warn" : p === "Medium" ? "info" : "muted") as "danger" | "warn" | "info" | "muted";

export function ComplaintSheet({ c, onClose, by }: { c: Complaint | null; onClose: () => void; by: string }) {
  const advance = useDemo((s) => s.advanceComplaint);
  const addTask = useDemo((s) => s.addTask);
  const [assignee, setAssignee] = React.useState(TEAM[0]);
  const [note, setNote] = React.useState("");
  React.useEffect(() => { setNote(""); if (c?.assignee && TEAM.includes(c.assignee)) setAssignee(c.assignee); }, [c?.id, c?.assignee]);
  if (!c) return null;
  const go = (s: ComplaintStatus, msg: string, extra?: string) => { advance(c.id, s, by, note || undefined, extra); setNote(""); toast.success(msg, { description: "The resident sees this update instantly." }); };
  const next: { s: ComplaintStatus; label: string }[] =
    c.status === "Submitted" || c.status === "Reopened" ? [{ s: "Acknowledged", label: "Acknowledge" }] :
    c.status === "Acknowledged" ? [] :
    c.status === "Assigned" ? [{ s: "In Progress", label: "Mark in progress" }] :
    c.status === "In Progress" ? [{ s: "Resolved", label: "Mark resolved" }] : [];

  return (
    <Sheet open={!!c} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="auto">
        <SheetHeader><SheetTitle>{c.title}</SheetTitle><SheetDescription>{c.id} · {c.apt} · {c.category} · SLA {c.sla}</SheetDescription></SheetHeader>
        <SheetBody className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-1.5"><Badge variant={prioVariant(c.priority)}>{c.priority}</Badge><Badge variant="outline">{c.status}</Badge>{c.preferredTime && <Badge variant="muted">Prefers {c.preferredTime}</Badge>}</div>
          <p className="rounded-xl bg-secondary/60 p-3 text-sm">{c.description}</p>
          {c.status !== "Resolved" && (
            <div className="grid gap-3 rounded-2xl border p-4">
              <Field label="Assign to"><Select value={assignee} onValueChange={setAssignee} options={TEAM.map((t) => ({ value: t, label: t }))} /></Field>
              <Field label="Note to resident (optional)"><Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Plumber will visit at 11 AM" /></Field>
              <div className="flex flex-wrap gap-2">
                {next.map((n) => <Button key={n.s} variant={n.s === "Resolved" ? "default" : "outline"} onClick={() => go(n.s, `${c.id}: ${n.label.toLowerCase()}`)}>{n.label}</Button>)}
                {c.status !== "Assigned" && c.status !== "In Progress" && (
                  <Button onClick={() => { go("Assigned", `${c.id} assigned to ${assignee}`, assignee); addTask({ title: c.title, area: c.apt, assignee, due: new Date(Date.now() + 6 * 3600e3).toISOString(), priority: c.priority === "Low" ? "Low" : c.priority === "Medium" ? "Medium" : "High", complaintId: c.id }); }}>Assign {assignee.split(" ")[0]}</Button>
                )}
              </div>
            </div>
          )}
          {c.rating && <div className="flex items-center gap-2 text-sm">Resident rating <Stars value={c.rating} /></div>}
          <div><div className="mb-2 text-sm font-semibold">History</div>
            <Timeline items={[...c.timeline].reverse().map((t, i) => ({ label: <span className={cn(i === 0 && "font-semibold")}>{t.status}</span>, at: `${fmtDateTime(t.at)} · ${t.by}`, note: t.note, done: true, active: i === 0 }))} />
          </div>
        </SheetBody>
        <SheetFooter><Button variant="outline" onClick={onClose}>Close</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
