"use client";
import * as React from "react";
import { AlertOctagon, BarChart3, CalendarDays, Megaphone, MessageCircle, Send, Smartphone, Wrench } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Announcement } from "@/lib/types";
import { useQuery } from "@/lib/hooks";
import { ago, cn } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { ChoiceGrid, Field, Segmented } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Progress, Select, Switch } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AUD = { building: "All residents", tower: "Tower", floor: "Floor", owners: "Owners only", tenants: "Tenants only" } as const;
type Aud = keyof typeof AUD;
const COUNT: Record<Aud, number> = { building: 264, tower: 88, floor: 4, owners: 196, tenants: 52 };

export default function Announcements() {
  const anns = useDemo((s) => s.announcements);
  const addAnnouncement = useDemo((s) => s.addAnnouncement);
  const notify = useDemo((s) => s.notify);
  const compose = useQuery("compose");
  const [cat, setCat] = React.useState<Announcement["category"]>("Notice");
  const [aud, setAud] = React.useState<Aud>("building");
  const [tower, setTower] = React.useState("A");
  const [floor, setFloor] = React.useState("12");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [opts, setOpts] = React.useState(["Yes", "No"]);
  const [ch, setCh] = React.useState({ push: true, whatsapp: true, sms: false });
  const [pin, setPin] = React.useState(false);
  const [sos, setSos] = React.useState(false);
  const formRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => { if (compose) formRef.current?.scrollIntoView({ behavior: "smooth" }); }, [compose]);

  const audLabel = aud === "tower" ? `Tower ${tower}` : aud === "floor" ? `Tower ${tower}, floor ${floor}` : AUD[aud];
  const reachesAhmed = aud === "building" || aud === "owners" || (aud === "tower" && tower === "A") || (aud === "floor" && tower === "A" && floor === "12");
  const channels = (Object.keys(ch) as (keyof typeof ch)[]).filter((k) => ch[k]);

  const publish = () => {
    addAnnouncement({ title, body, category: cat, audience: audLabel, author: "Management Office", total: COUNT[aud], pinned: pin,
      poll: cat === "Poll" ? { options: opts.filter(Boolean).map((l) => ({ label: l, votes: 0 })), closes: new Date(Date.now() + 5 * 864e5).toISOString() } : undefined,
      event: cat === "Event" ? { date: new Date(Date.now() + 6 * 864e5).toISOString(), place: "Community hall", going: 0 } : undefined });
    if (reachesAhmed) notify({ kind: "announcement", title, body: body.slice(0, 120), href: "/resident/building/announcements", channels, role: "resident" });
    toast.success("Announcement published", { description: `${audLabel} · ${COUNT[aud]} households · ${channels.join(", ")}` });
    setTitle(""); setBody(""); setPin(false);
  };

  return (
    <>
      <AdminHeader title="Announcements" subtitle="Notices, events, polls and emergency broadcasts" actions={<Button variant="destructive" onClick={() => setSos(true)}><AlertOctagon /> Emergency broadcast</Button>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <div ref={formRef}>
          <Panel title="Compose">
            <div className="grid gap-4">
              <ChoiceGrid value={cat} onChange={setCat} cols={4} options={[{ value: "Notice", label: "Notice", icon: Megaphone }, { value: "Maintenance", label: "Maintenance", icon: Wrench }, { value: "Event", label: "Event", icon: CalendarDays }, { value: "Poll", label: "Poll", icon: BarChart3 }]} />
              <Field label="Audience">
                <Segmented value={aud} onChange={setAud} options={(Object.keys(AUD) as Aud[]).map((a) => ({ value: a, label: AUD[a].replace(" only", "").replace("All residents", "Building") }))} />
              </Field>
              {(aud === "tower" || aud === "floor") && (
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tower"><Select value={tower} onValueChange={setTower} options={["A", "B", "C"].map((t) => ({ value: t, label: `Tower ${t}` }))} /></Field>
                  {aud === "floor" && <Field label="Floor"><Select value={floor} onValueChange={setFloor} options={Array.from({ length: 22 }, (_, i) => ({ value: String(i + 1), label: `Floor ${i + 1}` }))} /></Field>}
                </div>
              )}
              <Field label="Title"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={cat === "Poll" ? "Should we install solar on the roof?" : "Water supply interruption on Friday"} /></Field>
              <Field label="Message"><Textarea rows={4} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write the details residents need…" /></Field>
              {cat === "Poll" && (
                <Field label="Options">
                  <div className="grid gap-2">
                    {opts.map((o, i) => <Input key={i} value={o} onChange={(e) => setOpts(opts.map((x, j) => (j === i ? e.target.value : x)))} />)}
                    {opts.length < 5 && <Button variant="ghost" size="sm" className="justify-start" onClick={() => setOpts([...opts, ""])}>+ Add option</Button>}
                  </div>
                </Field>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {([["push", "App push", Smartphone], ["whatsapp", "WhatsApp", MessageCircle], ["sms", "SMS", Send]] as const).map(([k, l, I]) => (
                  <label key={k} className="flex items-center gap-2"><Switch checked={ch[k]} onCheckedChange={(v) => setCh({ ...ch, [k]: v })} /><I className="size-4 text-muted-foreground" />{l}</label>
                ))}
                <label className="flex items-center gap-2"><Switch checked={pin} onCheckedChange={setPin} />Pin to top</label>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-secondary/60 p-3 text-sm"><span>Reaches <b>{COUNT[aud]}</b> households · {audLabel}</span><Button disabled={!title || !body || channels.length === 0} onClick={publish}><Send /> Publish</Button></div>
            </div>
          </Panel>
        </div>
        <Panel title="Published" subtitle="Read receipts update live">
          <div className="flex flex-col gap-3">
            {anns.map((a) => (
              <div key={a.id} className={cn("rounded-xl border p-3.5", a.category === "Emergency" && "border-danger/40 bg-danger-soft/40")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0"><div className="font-medium">{a.title}</div><div className="text-xs text-muted-foreground">{a.audience} · {a.author} · {ago(a.at)}</div></div>
                  <Badge variant={a.category === "Emergency" ? "danger" : a.category === "Poll" ? "violet" : a.category === "Event" ? "info" : "muted"}>{a.category}</Badge>
                </div>
                {a.poll && <div className="mt-2.5 flex flex-col gap-1.5">{a.poll.options.map((o) => { const tot = a.poll!.options.reduce((x, y) => x + y.votes, 0) || 1; return <div key={o.label} className="text-xs"><div className="mb-0.5 flex justify-between"><span>{o.label}</span><span className="tabular">{o.votes}</span></div><Progress value={(o.votes / tot) * 100} className="h-1.5" /></div>; })}</div>}
                {a.event && <div className="mt-2 text-xs text-muted-foreground">{a.event.going} going · {a.event.place}</div>}
                <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground"><Progress value={(a.reads / a.total) * 100} className="h-1.5 w-28" /> Read by {a.reads} of {a.total}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <EmergencyDialog open={sos} onClose={() => setSos(false)} onSend={(t, b) => {
        addAnnouncement({ title: t, body: b, category: "Emergency", audience: "All residents", author: "Management Office", total: 264, pinned: true });
        notify({ kind: "emergency", title: t, body: b, href: "/resident/building/announcements", channels: ["push", "whatsapp", "sms"], role: "resident" });
        notify({ kind: "emergency", title: `Broadcast: ${t}`, body: "Sent to all residents and staff.", channels: ["push"], role: "guard" });
        toast.error("Emergency broadcast sent", { description: "All 264 households, guards and staff · push, WhatsApp and SMS" });
      }} />
    </>
  );
}

function EmergencyDialog({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (t: string, b: string) => void }) {
  const PRESETS = [
    ["Fire alarm — Tower B", "Fire alarm activated on Tower B floor 9. Use stairs, not lifts. Assemble at the front lawn."],
    ["Water supply suspended", "Main line burst near the pump room. Water will be off for about 3 hours. Tankers are on the way."],
    ["Lift entrapment — Tower A", "Lift A2 has stopped between floors. Technicians are on site. Please avoid Lift A2."],
  ];
  const [t, setT] = React.useState(PRESETS[0][0]);
  const [b, setB] = React.useState(PRESETS[0][1]);
  const [confirm, setConfirm] = React.useState("");
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { onClose(); setConfirm(""); } }}>
      <DialogContent>
        <DialogHeader><DialogTitle className="flex items-center gap-2 text-danger"><AlertOctagon className="size-5" /> Emergency broadcast</DialogTitle><DialogDescription>Sends a high-priority alert to every resident, guard and staff member on all channels, overriding quiet hours.</DialogDescription></DialogHeader>
        <div className="flex flex-wrap gap-2">{PRESETS.map(([a, x]) => <button key={a} onClick={() => { setT(a); setB(x); }} className={cn("rounded-full border px-3 py-1 text-xs", t === a && "border-danger bg-danger-soft text-danger")}>{a}</button>)}</div>
        <Input value={t} onChange={(e) => setT(e.target.value)} />
        <Textarea rows={3} value={b} onChange={(e) => setB(e.target.value)} />
        <Field label='Type "SEND" to confirm'><Input value={confirm} onChange={(e) => setConfirm(e.target.value.toUpperCase())} placeholder="SEND" /></Field>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button variant="destructive" disabled={confirm !== "SEND" || !t} onClick={() => { onSend(t, b); setConfirm(""); onClose(); }}>Broadcast now</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
