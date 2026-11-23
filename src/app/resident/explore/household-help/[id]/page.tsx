"use client";
import * as React from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { BadgeCheck, Briefcase, Calendar, CheckCircle2, Circle, FileCheck, HeartPulse, KeyRound, Languages, MapPin, Phone, ShieldCheck, UserCheck, Video, Users } from "lucide-react";
import { toast } from "sonner";
import { CANDIDATES } from "@/data/catalog";
import { useDemo } from "@/lib/store";
import type { StaffRole } from "@/lib/types";
import { cn, fmtDateTime, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, Section, Stars } from "@/components/shared/kit";
import { combine, DateStrip, Field, Segmented, TimeSlots } from "@/components/shared/pickers";
import { StaffSheet } from "@/components/resident/staff-sheet";

const ROLE_MAP: Record<string, StaffRole> = { Maid: "Maid", Cook: "Cook", Driver: "Driver", Nanny: "Nanny", Caregiver: "Caregiver", Gardener: "Gardener", "Household helper": "Cleaner" };

export default function CandidatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const c = CANDIDATES.find((x) => x.id === id);
  const s = useDemo();
  const h = s.hiring[id];
  const [interview, setInterview] = React.useState(false);
  const [offer, setOffer] = React.useState(false);
  const [access, setAccess] = React.useState(false);
  const [date, setDate] = React.useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [slot, setSlot] = React.useState<string>();
  const [mode, setMode] = React.useState<"In person" | "Video call">("In person");
  const [salary, setSalary] = React.useState("");
  const [empType, setEmpType] = React.useState<string>("");
  if (!c) return notFound();

  const stage = h?.stage;
  const steps = [
    { l: "Browse & shortlist", done: true },
    { l: "Interview", done: !!stage, sub: stage ? h.detail : undefined },
    { l: "Hiring request", done: stage === "offer" || stage === "hired" },
    { l: "Register & set gate access", done: stage === "hired" },
  ];

  const book = () => {
    if (!slot) return toast.error("Pick an interview time");
    const iso = combine(date, slot);
    s.addBooking({ category: "Domestic staff interviews", service: `Interview — ${c.name} (${c.role})`, provider: c.name, providerPhoto: c.photo, date: iso, duration: "30 min", price: 0, address: mode === "In person" ? "A-1204, Ocean Heights" : "Video call", notes: mode });
    if (mode === "In person") s.addVisitor({ apt: "A-1204", name: `${c.name} (interview)`, phone: "+92 300 000 0000", type: "service", purpose: `${c.role} interview`, validFrom: iso, validTo: new Date(new Date(iso).getTime() + 2 * 3600000).toISOString() });
    s.setHiring(c.id, "interview", `${mode} · ${fmtDateTime(iso)}`);
    toast.success("Interview requested", { description: `${c.name.split(" ")[0]} confirmed via the NESTORA worker app. ${mode === "In person" ? "Gate pass created." : ""}` });
    setInterview(false);
  };

  return (
    <div>
      <PageHeader back="/resident/explore/household-help" title={c.name} subtitle={`${c.role} · ${c.experience} years experience`} large={false} />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0">
          <div className="flex items-center gap-4 rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
            <Avatar src={c.photo} name={c.name} className="size-24 rounded-3xl" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xl font-semibold">{c.name} <BadgeCheck className="size-5 text-pine-600" /></div>
              <div className="text-sm text-muted-foreground">{c.role} · {c.age} years · {c.area}</div>
              <div className="mt-2 flex items-center gap-2"><Stars value={c.rating} /><span className="text-xs text-muted-foreground">{c.reviews} employer reviews</span></div>
              <div className="mt-2 flex flex-wrap gap-1">{c.types.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}</div>
            </div>
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-foreground/80">{c.about}</p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[[Briefcase, `${c.experience} yrs`, "Experience"], [Languages, c.languages.join(", "), "Languages"], [Calendar, c.availability, "Availability"], [MapPin, c.area, "Lives in"]].map(([I, v, l], k) => {
              const Icon = I as typeof Briefcase;
              return <div key={k} className="rounded-2xl border bg-card p-3"><Icon className="size-4 text-pine-600" /><div className="mt-2 text-[13px] font-semibold leading-tight">{v as string}</div><div className="text-[11px] text-muted-foreground">{l as string}</div></div>;
            })}
          </div>
          <Section title="Skills"><div className="flex flex-wrap gap-2">{c.skills.map((s) => <span key={s} className="rounded-full border bg-card px-3 py-1.5 text-sm">{s}</span>)}</div></Section>
          <Section title="Verification">
            <div className="grid gap-2 sm:grid-cols-2">
              {[[ShieldCheck, "CNIC verified with NADRA", c.verified.cnic], [FileCheck, "Police character certificate", c.verified.police], [Users, "References checked", c.verified.references], [HeartPulse, "Medical (Hepatitis B/C, TB)", !!c.verified.medical]].map(([I, l, ok], k) => {
                const Icon = I as typeof ShieldCheck;
                return <div key={k} className={cn("flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm", ok ? "bg-card" : "border-dashed bg-transparent text-muted-foreground")}><Icon className={cn("size-4", ok ? "text-pine-600" : "")} />{l as string}<span className="ml-auto text-xs font-medium">{ok ? "Verified" : "Pending"}</span></div>;
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">CNIC numbers and documents are visible only to you after you submit a hiring request, with the worker's consent.</p>
          </Section>
          <Section title="References">
            {c.references.length ? <div className="space-y-2">{c.references.map((r) => <div key={r.name} className="flex items-center gap-3 rounded-2xl border bg-card p-3.5"><UserCheck className="size-5 text-pine-600" /><div className="flex-1"><div className="text-sm font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.relation} · {r.years}</div></div><span className="font-mono text-xs text-muted-foreground">{r.phone}</span></div>)}</div> : <p className="text-sm text-muted-foreground">No references yet.</p>}
          </Section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="text-sm text-muted-foreground">Expected salary</div>
            <div className="text-3xl font-semibold tracking-tight">{pkr(c.salary)}<span className="text-base font-normal text-muted-foreground">/{c.salaryUnit}</span></div>
            <ol className="mt-5 space-y-3">
              {steps.map((st) => (
                <li key={st.l} className="flex gap-3 text-sm">{st.done ? <CheckCircle2 className="size-5 shrink-0 text-pine-600" /> : <Circle className="size-5 shrink-0 text-sand-300" />}<div><div className={cn("font-medium", !st.done && "text-muted-foreground")}>{st.l}</div>{st.sub && <div className="text-xs text-muted-foreground">{st.sub}</div>}</div></li>
              ))}
            </ol>
            <div className="mt-5 space-y-2">
              {!stage && <Button size="lg" className="w-full" onClick={() => setInterview(true)}><Calendar /> Request interview</Button>}
              {stage === "interview" && <Button size="lg" className="w-full" onClick={() => { setSalary(String(c.salary)); setEmpType(c.types[0]); setOffer(true); }}><Briefcase /> Submit hiring request</Button>}
              {stage === "offer" && <Button size="lg" className="w-full" onClick={() => setAccess(true)}><KeyRound /> Register & set gate access</Button>}
              {stage === "hired" && <div className="rounded-2xl bg-pine-50 p-4 text-sm text-pine-900"><b>{c.name.split(" ")[0]} is part of your household.</b> Guards will recognise them during their schedule. Manage in Building → Staff access.</div>}
              <Button variant="outline" className="w-full" asChild><a href="tel:+923000000000"><Phone /> Call via NESTORA (masked)</a></Button>
            </div>
          </div>
        </aside>
      </div>

      <Sheet open={interview} onOpenChange={setInterview}>
        <SheetContent>
          <SheetHeader><SheetTitle>Interview {c.name.split(" ")[0]}</SheetTitle><SheetDescription>Free · 30 minutes · NESTORA confirms with the worker</SheetDescription></SheetHeader>
          <SheetBody className="space-y-5">
            <Field label="Format"><Segmented value={mode} onChange={setMode} options={[{ value: "In person", label: "In person" }, { value: "Video call", label: <span className="flex items-center justify-center gap-1.5"><Video className="size-4" /> Video</span> }]} /></Field>
            <Field label="Date"><DateStrip value={date} onChange={setDate} days={7} start={1} /></Field>
            <Field label="Time"><TimeSlots value={slot} onChange={setSlot} date={date} seed={c.id} slots={["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"]} /></Field>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" onClick={book}>Request interview</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={offer} onOpenChange={setOffer}>
        <SheetContent>
          <SheetHeader><SheetTitle>Hiring request</SheetTitle><SheetDescription>Sent to {c.name} through the NESTORA worker app.</SheetDescription></SheetHeader>
          <SheetBody className="space-y-5">
            <Field label="Employment type"><div className="flex flex-wrap gap-2">{c.types.map((t) => <button key={t} onClick={() => setEmpType(t)} className={cn("rounded-xl border px-3 py-2 text-sm", empType === t && "border-pine-600 bg-pine-50")}>{t}</button>)}</div></Field>
            <Field label={`Salary offer (PKR per ${c.salaryUnit})`}><Input value={salary} onChange={(e) => setSalary(e.target.value.replace(/\D/g, ""))} inputMode="numeric" /></Field>
            <Field label="Start date"><DateStrip value={date} onChange={setDate} days={10} start={1} /></Field>
            <div className="rounded-2xl bg-secondary/70 p-4 text-[13px] text-muted-foreground">Includes a standard NESTORA employment agreement: working hours, weekly off, leave and notice period. Salary can be paid through NESTORA with digital payslips.</div>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" onClick={() => { s.setHiring(c.id, "offer", `${empType} · ${pkr(+salary)}/${c.salaryUnit}`); toast.success("Hiring request sent", { description: `${c.name.split(" ")[0]} accepted your offer (demo). Next: set gate access.` }); setOffer(false); }}>Send hiring request</Button></SheetFooter>
        </SheetContent>
      </Sheet>

      <StaffSheet open={access} onOpenChange={(o) => { setAccess(o); if (!o && useDemo.getState().staff.some((x) => x.name === c.name)) s.setHiring(c.id, "hired"); }} preset={{ name: c.name, role: ROLE_MAP[c.role] ?? "Maid", phone: "+92 3xx xxx xxxx", photo: c.photo }} />
    </div>
  );
}
