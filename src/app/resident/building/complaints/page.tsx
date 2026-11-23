"use client";
import * as React from "react";
import {
  ArrowUpDown, Camera, Car, Droplets, Flame, Lightbulb, Plus, RotateCcw, ShieldAlert, Sparkles, Star, Trash2, Volume2, Wrench, Zap, Building, Waves, Video,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import type { Complaint } from "@/lib/types";
import { ago, cn, fmtDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, Empty, PageHeader, Timeline } from "@/components/shared/kit";
import { ChoiceGrid, Field, Segmented } from "@/components/shared/pickers";

const COMPLAINT_CATS = [
  { value: "Lift", label: "Lift", icon: ArrowUpDown }, { value: "Water", label: "Water", icon: Droplets }, { value: "Generator", label: "Generator", icon: Flame },
  { value: "Electricity", label: "Electricity", icon: Zap }, { value: "Leakage", label: "Leakage", icon: Waves }, { value: "Plumbing", label: "Plumbing", icon: Wrench },
  { value: "Cleaning", label: "Cleaning", icon: Sparkles }, { value: "Garbage", label: "Garbage", icon: Trash2 }, { value: "Security", label: "Security", icon: ShieldAlert },
  { value: "Parking", label: "Parking", icon: Car }, { value: "Noise", label: "Noise", icon: Volume2 }, { value: "Lighting", label: "Lighting", icon: Lightbulb },
  { value: "Common area", label: "Common area", icon: Building },
];
const FLOW = ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved"];
const statusVariant = (s: string) => (s === "Resolved" ? "default" : s === "Reopened" ? "danger" : s === "In Progress" ? "lime" : s === "Submitted" ? "muted" : "info") as "default";

export default function ComplaintsPage() {
  const s = useDemo();
  const isNew = useQuery("new");
  const [filter, setFilter] = React.useState<"open" | "resolved" | "all">("open");
  const [open, setOpen] = React.useState(false);
  const [sel, setSel] = React.useState<string | null>(null);
  React.useEffect(() => { if (isNew) setOpen(true); }, [isNew]);
  const mine = s.complaints.filter((c) => c.apt === "A-1204");
  const list = mine.filter((c) => (filter === "all" ? true : filter === "open" ? c.status !== "Resolved" : c.status === "Resolved"));
  const cur = s.complaints.find((c) => c.id === sel);

  return (
    <div>
      <PageHeader back="/resident/building" title="Complaints & requests" subtitle="Track every issue from report to resolution" actions={<Button size="sm" onClick={() => setOpen(true)}><Plus /> New</Button>} />
      <Chips value={filter} onChange={setFilter} options={[{ value: "open", label: "Open", count: mine.filter((c) => c.status !== "Resolved").length }, { value: "resolved", label: "Resolved" }, { value: "all", label: "All" }]} />
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {list.length === 0 && <div className="md:col-span-2"><Empty icon={Wrench} title="No complaints here" body="Report a leak, lift issue or anything else — the supervisor is notified instantly." action={<Button onClick={() => setOpen(true)}><Plus /> Raise complaint</Button>} /></div>}
        {list.map((c) => <ComplaintCard key={c.id} c={c} onClick={() => setSel(c.id)} />)}
      </div>

      <NewComplaint open={open} onOpenChange={setOpen} onCreated={(id) => setSel(id)} />

      <Sheet open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {cur && (
            <>
              <SheetHeader><SheetTitle>{cur.title}</SheetTitle><SheetDescription className="flex flex-wrap items-center gap-2"><Badge variant={statusVariant(cur.status)}>{cur.status}</Badge> {cur.id} · {cur.category} · {cur.priority} priority</SheetDescription></SheetHeader>
              <SheetBody className="space-y-4">
                <p className="rounded-2xl bg-secondary/70 p-4 text-sm">{cur.description}</p>
                {cur.attachments > 0 && <div className="flex gap-2">{Array.from({ length: cur.attachments }).map((_, i) => <div key={i} className="grid size-20 place-items-center rounded-xl bg-gradient-to-br from-stone-300 to-stone-400 text-white"><Camera className="size-5" /></div>)}</div>}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-2xl border bg-card p-3"><div className="text-muted-foreground">Assigned to</div><div className="mt-1 font-semibold">{cur.assignee ?? "—"}</div></div>
                  <div className="rounded-2xl border bg-card p-3"><div className="text-muted-foreground">Target</div><div className="mt-1 font-semibold">{cur.sla}</div></div>
                  <div className="rounded-2xl border bg-card p-3"><div className="text-muted-foreground">Raised</div><div className="mt-1 font-semibold">{ago(cur.createdAt)}</div></div>
                </div>
                <div className="rounded-2xl border bg-card p-4">
                  <div className="mb-3 text-sm font-semibold">Tracking</div>
                  <Timeline items={[
                    ...cur.timeline.map((t) => ({ label: t.status, at: `${fmtDateTime(t.at)} · ${t.by}`, note: t.note, done: true })),
                    ...FLOW.slice(FLOW.indexOf(cur.timeline[cur.timeline.length - 1].status as string) + 1).map((st, i) => ({ label: st, done: false, active: i === 0 && cur.status !== "Resolved" })),
                  ]} />
                </div>
                {cur.status === "Resolved" && (
                  <div className="rounded-2xl border bg-card p-4">
                    <div className="text-sm font-semibold">{cur.rating ? "Thanks for your feedback" : "How was the resolution?"}</div>
                    <div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => { s.rateComplaint(cur.id, n); toast.success("Feedback shared with management"); }}><Star className={cn("size-8", (cur.rating ?? 0) >= n ? "fill-amber-400 text-amber-400" : "text-sand-300")} /></button>)}</div>
                  </div>
                )}
              </SheetBody>
              <SheetFooter className="flex gap-2">
                {cur.status === "Resolved" ? (
                  <Button variant="outline" className="flex-1" onClick={() => { s.advanceComplaint(cur.id, "Reopened", "Ahmed Raza", "Issue has come back"); toast("Complaint reopened", { description: "Supervisor has been notified." }); }}><RotateCcw /> Reopen</Button>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => toast.success("Reminder sent to supervisor")}>Send reminder</Button>
                    <Button className="flex-1" onClick={() => { s.advanceComplaint(cur.id, "Resolved", "Ahmed Raza", "Confirmed fixed by resident"); toast.success("Marked as resolved"); }}>It's fixed</Button>
                  </>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function ComplaintCard({ c, onClick }: { c: Complaint; onClick: () => void }) {
  const Icon = COMPLAINT_CATS.find((x) => x.value === c.category)?.icon ?? Wrench;
  const step = Math.max(0, FLOW.indexOf(c.status === "Reopened" ? "Submitted" : c.status));
  return (
    <button onClick={onClick} className="rounded-2xl border border-border/70 bg-card p-4 text-left shadow-soft transition hover:shadow-lift">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-soft text-amber-700"><Icon className="size-5" /></span>
        <div className="min-w-0 flex-1"><div className="truncate font-semibold">{c.title}</div><div className="text-[12.5px] text-muted-foreground">{c.id} · {c.category} · {ago(c.createdAt)}</div></div>
        <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
      </div>
      <div className="mt-4 flex gap-1">{FLOW.map((f, i) => <span key={f} className={cn("h-1.5 flex-1 rounded-full", i <= step ? (c.status === "Resolved" ? "bg-pine-500" : "bg-amber-500") : "bg-secondary")} />)}</div>
      <div className="mt-2 flex justify-between text-[11.5px] text-muted-foreground"><span>{c.assignee ? `Assigned · ${c.assignee}` : "Awaiting assignment"}</span><span>{c.priority}</span></div>
    </button>
  );
}

function NewComplaint({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (id: string) => void }) {
  const add = useDemo((s) => s.addComplaint);
  const [cat, setCat] = React.useState("Leakage");
  const [title, setTitle] = React.useState("");
  const [desc, setDesc] = React.useState("");
  const [prio, setPrio] = React.useState<Complaint["priority"]>("Medium");
  const [time, setTime] = React.useState("Anytime");
  const [files, setFiles] = React.useState(0);
  const submit = () => {
    const c = add({ category: cat, title: title || `${cat} issue in A-1204`, description: desc || "No description provided.", priority: prio, preferredTime: time, attachments: files });
    toast.success(`Complaint ${c.id} submitted`, { description: "Supervisor Naveed has been notified." });
    onOpenChange(false); setTitle(""); setDesc(""); setFiles(0);
    setTimeout(() => onCreated(c.id), 250);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle>Raise a complaint</SheetTitle><SheetDescription>Apartment A-1204 · You'll get updates on every step</SheetDescription></SheetHeader>
        <SheetBody className="space-y-5">
          <Field label="Category"><ChoiceGrid value={cat} onChange={setCat} cols={4} options={COMPLAINT_CATS} /></Field>
          <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={`e.g. ${cat === "Leakage" ? "Water dripping from kitchen ceiling" : `${cat} not working`}`} /></Field>
          <Field label="Describe the issue"><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="When did it start? Where exactly?" /></Field>
          <Field label="Photos or video">
            <div className="flex gap-2">
              {Array.from({ length: files }).map((_, i) => <div key={i} className="grid size-16 place-items-center rounded-xl bg-gradient-to-br from-stone-300 to-stone-400 text-white"><Camera className="size-5" /></div>)}
              {files < 4 && <button type="button" onClick={() => setFiles(files + 1)} className="grid size-16 place-items-center rounded-xl border border-dashed text-muted-foreground hover:border-pine-400"><div className="flex flex-col items-center gap-0.5 text-[10px]"><Camera className="size-5" />Photo</div></button>}
              {files < 4 && <button type="button" onClick={() => setFiles(files + 1)} className="grid size-16 place-items-center rounded-xl border border-dashed text-muted-foreground hover:border-pine-400"><div className="flex flex-col items-center gap-0.5 text-[10px]"><Video className="size-5" />Video</div></button>}
            </div>
          </Field>
          <Field label="Priority"><Segmented value={prio} onChange={setPrio} options={(["Low", "Medium", "High", "Urgent"] as const).map((p) => ({ value: p, label: p }))} /></Field>
          <Field label="Preferred visit time"><Segmented value={time} onChange={setTime} options={["Anytime", "Morning", "Afternoon", "Evening"].map((p) => ({ value: p, label: p }))} /></Field>
        </SheetBody>
        <SheetFooter><Button size="lg" className="w-full" onClick={submit}>Submit complaint</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
