"use client";
import * as React from "react";
import Link from "next/link";
import { BadgeCheck, CalendarCheck, CheckCircle2, MapPin, Repeat, ShieldCheck, Baby } from "lucide-react";
import { toast } from "sonner";
import type { Provider, Service } from "@/data/catalog";
import { useDemo } from "@/lib/store";
import { cn, pkr, fmtDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Checkbox, Avatar } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { combine, DateStrip, Field, Segmented, TimeSlots } from "@/components/shared/pickers";
import { PAY_METHODS } from "./pay-sheet";

const CAT_LABEL: Record<string, string> = {
  "home-services": "Home services", cleaning: "Cleaning", painting: "Painting", "car-care": "Car care", laundry: "Laundry", salon: "Salon & barber", plants: "Gardening", fitness: "Classes & fitness",
};

export function BookingSheet({ provider, service, open, onOpenChange }: { provider: Provider; service: Service | null; open: boolean; onOpenChange: (o: boolean) => void }) {
  const s = useDemo();
  const [date, setDate] = React.useState(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d; });
  const [slot, setSlot] = React.useState<string>();
  const [qty, setQty] = React.useState(1);
  const [freq, setFreq] = React.useState<"once" | "weekly" | "monthly">("once");
  const [where, setWhere] = React.useState(provider.category === "car-care" ? "Parking P1-042" : provider.modes?.[0] ?? "A-1204");
  const [notes, setNotes] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [pay, setPay] = React.useState("Pay after service");
  const [done, setDone] = React.useState<{ ref: string; date: string } | null>(null);
  const kids = provider.kids && /kid|junior|child|karate|tuition|art/i.test(service?.name ?? "");
  React.useEffect(() => { if (open) { setDone(null); setSlot(undefined); setQty(1); setFreq("once"); setConsent(false); } }, [open]);
  if (!service) return null;
  const perUnit = /per (unit|seat|plant|piece|kg|point|panel|pair|roll|wall|room|sq ft)/.test(service.name);
  const subtotal = service.price * qty;
  const fee = subtotal > 0 ? 99 : 0;

  const book = () => {
    if (!slot) return toast.error("Choose a time slot");
    if (kids && !consent) return toast.error("Guardian consent is required for children's activities");
    const iso = combine(date, slot);
    const b = s.addBooking({
      category: CAT_LABEL[provider.category] ?? "Home services", service: `${service.name}${qty > 1 ? ` ×${qty}` : ""}`, provider: provider.name, providerPhoto: provider.photo, image: provider.cover,
      date: iso, duration: service.duration, price: subtotal + fee, address: where === "A-1204" ? "A-1204, Ocean Heights" : where, notes, recurring: freq === "once" ? undefined : freq === "weekly" ? `Every ${new Date(iso).toLocaleDateString("en-GB", { weekday: "long" })}` : "Monthly", paymentMethod: pay,
    });
    // auto gate clearance for the provider
    s.addVisitor({ apt: "A-1204", name: `${provider.person ?? provider.name} (${provider.name})`, phone: "+92 300 000 0000", type: "service", purpose: service.name, validFrom: new Date(new Date(iso).getTime() - 30 * 60000).toISOString(), validTo: new Date(new Date(iso).getTime() + 4 * 3600000).toISOString(), recurring: freq === "weekly" ? "Weekly" : undefined });
    setDone({ ref: b.ref, date: iso });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="grid size-20 animate-rise place-items-center rounded-full bg-pine-100 text-pine-700"><CheckCircle2 className="size-10" /></span>
            <div className="mt-5 text-2xl font-semibold tracking-tight">You're booked!</div>
            <p className="mt-1 text-sm text-muted-foreground">{service.name} with {provider.name}<br />{fmtDateTime(done.date)}</p>
            <div className="mt-6 w-full max-w-sm space-y-2 text-left">
              <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-sm"><CalendarCheck className="size-5 text-pine-600" /><span>Confirmed · ref <span className="font-mono">{done.ref}</span></span></div>
              <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-sm"><ShieldCheck className="size-5 text-pine-600" /><span>Gate pass auto-issued — security will let them in on arrival</span></div>
              {freq !== "once" && <div className="flex items-center gap-3 rounded-2xl border bg-card p-3 text-sm"><Repeat className="size-5 text-pine-600" /><span>Repeats {freq} — manage in Bookings</span></div>}
            </div>
            <div className="mt-6 flex w-full max-w-sm gap-2">
              <Button variant="outline" className="flex-1" asChild><Link href="/resident/bookings">View bookings</Link></Button>
              <Button className="flex-1" onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3"><Avatar src={provider.photo} name={provider.name} className="size-11" /><div className="min-w-0"><SheetTitle className="truncate">{service.name}</SheetTitle><SheetDescription className="flex items-center gap-1">{provider.name} {provider.verified && <BadgeCheck className="size-3.5 text-pine-600" />}</SheetDescription></div></div>
            </SheetHeader>
            <SheetBody className="space-y-5">
              {perUnit && (
                <Field label="Quantity">
                  <div className="flex h-11 w-40 items-center justify-between rounded-xl border bg-card px-2"><Button variant="ghost" size="icon-sm" onClick={() => setQty(Math.max(1, qty - 1))}>−</Button><span className="font-semibold">{qty}</span><Button variant="ghost" size="icon-sm" onClick={() => setQty(qty + 1)}>+</Button></div>
                </Field>
              )}
              <Field label="Date"><DateStrip value={date} onChange={(d) => { setDate(d); setSlot(undefined); }} /></Field>
              <Field label="Time"><TimeSlots value={slot} onChange={setSlot} date={date} seed={provider.id} /></Field>
              {provider.recurring && <Field label="Frequency"><Segmented value={freq} onChange={setFreq} options={[{ value: "once", label: "One-time" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }]} /></Field>}
              <Field label={provider.category === "car-care" ? "Where is your car parked?" : "Location"}>
                <div className="grid gap-2">
                  {(provider.category === "car-care" ? ["Parking P1-042", "Parking P1-043 (EV)", "Visitor bay"] : provider.modes ? provider.modes.map((m) => (m === "Home visit" ? "A-1204" : m === "Building facility" ? "Ocean Heights facility" : m)) : ["A-1204", "C-0702 (second home)"]).map((w) => (
                    <button key={w} onClick={() => setWhere(w)} className={cn("flex items-center gap-3 rounded-xl border bg-card px-3.5 py-3 text-left text-sm", where === w ? "border-pine-600 ring-2 ring-pine-600/15" : "")}>
                      <MapPin className="size-4 text-pine-600" /><span className="flex-1">{w === "A-1204" ? "Home · A-1204, Ocean Heights" : w}</span>
                      <span className={cn("size-4 rounded-full border-2", where === w ? "border-[5px] border-pine-600" : "")} />
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Notes for provider"><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything they should know?" className="min-h-20" /></Field>
              {kids && (
                <label className="flex items-start gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-3.5 text-[13px] text-sky-950">
                  <Checkbox checked={consent} onCheckedChange={(c) => setConsent(!!c)} className="mt-0.5" />
                  <span><b className="flex items-center gap-1"><Baby className="size-4" /> Guardian consent</b>I am the parent/guardian and consent to my child's participation. Coaches are background-checked and safeguarding-trained; sessions happen in supervised building facilities and a guardian may attend.</span>
                </label>
              )}
              <Field label="Payment">
                <div className="grid gap-2 sm:grid-cols-2">
                  {["Pay after service", ...PAY_METHODS.slice(0, 3).map((m) => m.id)].map((m) => (
                    <button key={m} onClick={() => setPay(m)} className={cn("rounded-xl border bg-card px-3 py-2.5 text-left text-sm", pay === m ? "border-pine-600 ring-2 ring-pine-600/15" : "")}>{m}</button>
                  ))}
                </div>
              </Field>
              <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
                <div className="flex justify-between py-1"><span className="text-muted-foreground">{service.name}{qty > 1 ? ` × ${qty}` : ""}</span><span>{pkr(subtotal)}</span></div>
                <div className="flex justify-between py-1"><span className="text-muted-foreground">Service fee</span><span>{pkr(fee)}</span></div>
                <div className="mt-1 flex justify-between border-t pt-2 font-semibold"><span>Total{freq !== "once" ? ` per ${freq === "weekly" ? "visit" : "month"}` : ""}</span><span>{pkr(subtotal + fee)}</span></div>
              </div>
            </SheetBody>
            <SheetFooter><Button size="lg" className="w-full" onClick={book}>Confirm booking · {pkr(subtotal + fee)}</Button></SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
