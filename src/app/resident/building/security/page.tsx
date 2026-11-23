"use client";
import * as React from "react";
import { AlertTriangle, ArrowDownLeft, ArrowUpRight, KeyRound, MessageCircle, Phone, Send, ShieldCheck, Siren, UserCheck, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { ago, cn, fmtTime } from "@/lib/utils";
import { face } from "@/lib/img";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { Input, Textarea } from "@/components/ui/input";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Empty, List, LiveDot, PageHeader, Row, Section } from "@/components/shared/kit";
import { ChoiceGrid, Field } from "@/components/shared/pickers";
import { SosButton } from "@/components/resident/sos";
import { VisitorApprovalCard } from "@/components/resident/visitor-approval";

type Msg = { from: "me" | "guard"; text: string; at: string };
const REPLIES = [
  "Walaikum assalam sir, noted. I'll inform the gate team.",
  "Ji sir, we will check the CCTV and get back to you in 5 minutes.",
  "Sir, your visitor will be directed to Tower A visitor parking.",
  "Okay sir, patrol guard is on the way to your floor.",
];

export default function SecurityPage() {
  const s = useDemo();
  const [chat, setChat] = React.useState(false);
  const [report, setReport] = React.useState(false);
  const [msgs, setMsgs] = React.useState<Msg[]>([{ from: "guard", text: "Assalam-o-Alaikum! Gate 1 security here. How can we help?", at: new Date(Date.now() - 600000).toISOString() }]);
  const [text, setText] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const [cat, setCat] = React.useState("Suspicious person");
  const [desc, setDesc] = React.useState("");
  const pending = s.visitors.filter((v) => v.status === "pending" && v.apt === "A-1204");
  const log = s.gateLog.filter((g) => g.apt === "A-1204").slice(0, 8);

  const send = (t = text) => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: t, at: new Date().toISOString() }]);
    setText("");
    setTyping(true);
    setTimeout(() => { setTyping(false); setMsgs((m) => [...m, { from: "guard", text: REPLIES[m.length % REPLIES.length], at: new Date().toISOString() }]); }, 1400);
  };

  return (
    <div>
      <PageHeader back="/resident" title="Security" subtitle="Gate 1 · Main entrance · 6 guards on duty" />
      <div className="relative overflow-hidden rounded-3xl bg-pine-900 p-5 text-white">
        <div className="flex items-center gap-3">
          <Avatar src={face("m1")} name="Rizwan Ali" className="size-12 ring-2 ring-white/20" />
          <div className="flex-1"><div className="text-[12px] text-white/60">On duty now · Shift 2 PM – 10 PM</div><div className="text-lg font-semibold">Rizwan Ali · Gate supervisor</div></div>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-xs"><LiveDot /> All clear</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2">
          <Button variant="accent" asChild><a href="tel:+922135340000"><Phone /> Call</a></Button>
          <Button className="bg-white/10 ring-1 ring-white/15 hover:bg-white/15" onClick={() => setChat(true)}><MessageCircle /> Message</Button>
          <SosButton trigger={<Button variant="destructive"><Siren /> SOS</Button>} />
        </div>
      </div>

      <Section title="Visitor approvals" className="mt-6">
        {pending.length ? <div className="space-y-3">{pending.map((v) => <VisitorApprovalCard key={v.id} v={v} />)}</div> : <Empty icon={UserCheck} title="No one waiting" body="When an unregistered visitor arrives, you'll be asked to approve here and on WhatsApp." />}
      </Section>

      <div className="mt-2 grid gap-5 lg:grid-cols-2">
        <Section title="Recent entries & exits" href="/resident/building/visitors" action="Visitors">
          <List>
            {log.map((g) => (
              <Row key={g.id} icon={g.dir === "in" ? ArrowDownLeft : ArrowUpRight} tone={g.dir === "in" ? "pine" : "stone"} title={g.name} subtitle={`${g.kind} · ${g.gate}${g.vehicle ? ` · ${g.vehicle}` : ""}`} trailing={<span className="text-xs text-muted-foreground">{g.dir === "in" ? "In" : "Out"} · {fmtTime(g.at)}</span>} />
            ))}
          </List>
        </Section>
        <Section title="Access & safety">
          <List>
            <Row href="/resident/building/visitors?new=1" icon={UserPlus} title="Pre-register a visitor" subtitle="QR pass with time window" />
            <Row href="/resident/building/staff" icon={KeyRound} tone="violet" title="Access permissions" subtitle={`${s.staff.filter((x) => x.status === "active").length} staff · ${s.visitors.filter((v) => v.recurring).length} recurring visitors`} />
            <Row onClick={() => setReport(true)} icon={AlertTriangle} tone="amber" title="Report a security concern" subtitle="Suspicious activity, unknown vehicle, theft" />
            <Row href="/resident/building/documents" icon={ShieldCheck} tone="stone" title="Emergency procedures" subtitle="Fire exits, assembly point, contacts" />
          </List>
        </Section>
      </div>

      <Sheet open={chat} onOpenChange={setChat}>
        <SheetContent>
          <SheetHeader><SheetTitle>Gate 1 security</SheetTitle><SheetDescription>Typically replies in under 2 minutes</SheetDescription></SheetHeader>
          <SheetBody className="flex flex-col gap-2.5">
            {msgs.map((m, i) => (
              <div key={i} className={cn("max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm", m.from === "me" ? "ml-auto rounded-br-md bg-primary text-white" : "rounded-bl-md border bg-card")}>
                {m.text}<div className={cn("mt-1 text-[10.5px]", m.from === "me" ? "text-white/60" : "text-muted-foreground")}>{fmtTime(m.at)}</div>
              </div>
            ))}
            {typing && <div className="w-16 rounded-2xl rounded-bl-md border bg-card px-3 py-3"><div className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted-foreground" style={{ animationDelay: `${i * 120}ms` }} />)}</div></div>}
          </SheetBody>
          <SheetFooter className="space-y-2">
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {["My guest is arriving now", "Please send someone to my floor", "Unknown car in my parking"].map((q) => <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border bg-card px-3 py-1.5 text-xs">{q}</button>)}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex gap-2"><Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Message security…" /><Button size="icon" className="size-11 shrink-0"><Send /></Button></form>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={report} onOpenChange={setReport}>
        <SheetContent>
          <SheetHeader><SheetTitle>Report a concern</SheetTitle><SheetDescription>Goes directly to the security supervisor. You can stay anonymous to neighbours.</SheetDescription></SheetHeader>
          <SheetBody className="space-y-4">
            <ChoiceGrid value={cat} onChange={setCat} cols={2} options={["Suspicious person", "Unknown vehicle", "Theft", "Trespassing", "Fire hazard", "Other"].map((x) => ({ value: x, label: x }))} />
            <Field label="What happened?"><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Where, when, any description…" /></Field>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" onClick={() => { s.addIncident({ title: cat, type: "Resident report", by: "Resident A-1204", severity: "Medium", location: desc || "Tower A" }); toast.success("Reported to security", { description: "Supervisor Naveed will update you shortly." }); setReport(false); setDesc(""); }}>Submit report</Button></SheetFooter>
        </SheetContent>
      </Sheet>
      <p className="mt-6 text-center text-xs text-muted-foreground">Last patrol on Floor 12: {ago(new Date(Date.now() - 42 * 60000).toISOString())} <Badge variant="muted" className="ml-1">Mock data</Badge></p>
    </div>
  );
}
