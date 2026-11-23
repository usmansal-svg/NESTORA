"use client";
import * as React from "react";
import { Bike, Car, Check, Clock, HardHat, ShieldCheck, Truck, User, Users, Camera } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";

import type { Visitor, VisitorType } from "@/lib/types";
import { cn, DAYS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Switch } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { ChoiceGrid, combine, DateStrip, Field } from "@/components/shared/pickers";
import { Select } from "@/components/ui/misc";



export const TYPE_ICON: Record<VisitorType, typeof User> = { guest: User, family: Users, contractor: HardHat, delivery: Bike, service: Truck, cab: Car };
const TYPES: { value: VisitorType; label: string; icon: typeof User }[] = [
  { value: "guest", label: "Guest", icon: User }, { value: "family", label: "Family", icon: Users }, { value: "contractor", label: "Contractor", icon: HardHat },
  { value: "cab", label: "Cab / ride", icon: Car }, { value: "delivery", label: "Delivery", icon: Bike }, { value: "service", label: "Service", icon: Truck },
];
const TIMES = Array.from({ length: 34 }, (_, i) => { const h = 7 + Math.floor(i / 2); const m = i % 2 ? "30" : "00"; return `${String(h).padStart(2, "0")}:${m}`; }).filter((t) => t <= "23:30");
const tl = (t: string) => { const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };

export const statusBadge = (s: Visitor["status"]) => {
  const map: Record<Visitor["status"], [string, "default" | "warn" | "danger" | "muted" | "lime" | "info"]> = {
    expected: ["Expected", "info"], approved: ["Approved", "default"], pending: ["Awaiting you", "warn"], rejected: ["Rejected", "danger"],
    inside: ["Inside", "lime"], exited: ["Exited", "muted"], expired: ["Expired", "muted"], cancelled: ["Cancelled", "muted"],
  };
  const [l, v] = map[s];
  return <Badge variant={v}>{l}</Badge>;
};

export function NewVisitorSheet({ open, onOpenChange, onCreated }: { open: boolean; onOpenChange: (o: boolean) => void; onCreated: (v: Visitor) => void }) {
  const add = useDemo((s) => s.addVisitor);
  const [type, setType] = React.useState<VisitorType>("guest");
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("+92 3");
  const [vehicle, setVehicle] = React.useState("");
  const [guests, setGuests] = React.useState(1);
  const [date, setDate] = React.useState(new Date());
  const [from, setFrom] = React.useState("18:00");
  const [to, setTo] = React.useState("22:00");
  const [recurring, setRecurring] = React.useState(false);
  const [days, setDays] = React.useState<number[]>([0]);
  const [photo, setPhoto] = React.useState(false);
  const [note, setNote] = React.useState("");

  const submit = () => {
    if (name.trim().length < 2 || phone.replace(/\D/g, "").length < 11) { toast.error("Add a name and a valid mobile number"); return; }
    const v = add({
      apt: "A-1204", name: name.trim(), phone, type, vehicle: vehicle || undefined, guests, purpose: note || TYPES.find((t) => t.value === type)!.label + " visit",
      validFrom: combine(date, from), validTo: combine(date, to), recurring: recurring ? `Every ${days.map((d) => DAYS[d]).join(", ")}` : undefined, photo: photo ? "yes" : undefined,
    });
    toast.success("Gate pass created", { description: `Security at Gate 1 has been notified to expect ${v.name}.` });
    onOpenChange(false);
    setName(""); setPhone("+92 3"); setVehicle(""); setNote("");
    setTimeout(() => onCreated(v), 250);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle>Invite a visitor</SheetTitle><SheetDescription>They'll get a unique QR pass. Guards verify it automatically.</SheetDescription></SheetHeader>
        <SheetBody className="space-y-5">
          <Field label="Visitor type"><ChoiceGrid value={type} onChange={setType} options={TYPES} /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Bilal Siddiqui" /></Field>
            <Field label="Mobile number"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 3xx xxx xxxx" inputMode="tel" /></Field>
            <Field label="Vehicle registration (optional)"><Input value={vehicle} onChange={(e) => setVehicle(e.target.value.toUpperCase())} placeholder="e.g. BKZ-482" /></Field>
            <Field label="Number of people">
              <div className="flex h-11 items-center justify-between rounded-xl border bg-card px-2">
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setGuests(Math.max(1, guests - 1))}>−</Button>
                <span className="font-semibold">{guests}</span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => setGuests(guests + 1)}>+</Button>
              </div>
            </Field>
          </div>
          <button type="button" onClick={() => setPhoto(!photo)} className={cn("flex w-full items-center gap-3 rounded-2xl border border-dashed p-3 text-left text-sm transition", photo ? "border-pine-500 bg-pine-50" : "border-border")}>
            <span className="grid size-10 place-items-center rounded-xl bg-secondary">{photo ? <Check className="size-5 text-pine-700" /> : <Camera className="size-5 text-muted-foreground" />}</span>
            <span><span className="block font-medium">{photo ? "Photo attached" : "Add a photo (optional)"}</span><span className="block text-xs text-muted-foreground">Helps guards identify your visitor faster</span></span>
          </button>
          <Field label="Date"><DateStrip value={date} onChange={setDate} days={10} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Arrives after"><Select value={from} onValueChange={setFrom} options={TIMES.map((t) => ({ value: t, label: tl(t) }))} /></Field>
            <Field label="Access expires"><Select value={to} onValueChange={setTo} options={TIMES.filter((t) => t > from).map((t) => ({ value: t, label: tl(t) }))} /></Field>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <div className="flex items-center justify-between"><div><div className="text-sm font-medium">Recurring visitor</div><div className="text-xs text-muted-foreground">Tutor, physio, family — same time every week</div></div><Switch checked={recurring} onCheckedChange={setRecurring} /></div>
            {recurring && (
              <div className="mt-3 flex gap-1.5">
                {DAYS.map((d, i) => (
                  <button type="button" key={d} onClick={() => setDays(days.includes(i) ? days.filter((x) => x !== i) : [...days, i])} className={cn("h-9 flex-1 rounded-lg border text-xs font-medium", days.includes(i) ? "border-pine-700 bg-pine-800 text-white" : "bg-card")}>{d[0]}</button>
                ))}
              </div>
            )}
          </div>
          <Field label="Note for security (optional)"><Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please direct to Tower A visitor parking" className="min-h-20" /></Field>
          <div className="flex items-start gap-2 rounded-xl bg-pine-50 p-3 text-xs text-pine-900"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> Visitor details are shared only with on-duty security for this visit and deleted from guard devices after 30 days.</div>
        </SheetBody>
        <SheetFooter><Button size="lg" className="w-full" onClick={submit}><Clock /> Create gate pass</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

