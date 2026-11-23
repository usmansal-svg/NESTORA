"use client";
import * as React from "react";
import { CalendarCheck, Clock, Users } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { AMENITIES } from "@/data/places";
import { pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { combine, DateStrip, Field, TimeSlots } from "@/components/shared/pickers";
import { PaySheet } from "@/components/resident/pay-sheet";

type Am = (typeof AMENITIES)[number];

export default function AmenitiesPage() {
  const s = useDemo();
  const [sel, setSel] = React.useState<Am | null>(null);
  const [date, setDate] = React.useState(new Date());
  const [slot, setSlot] = React.useState<string>();
  const [pay, setPay] = React.useState(false);
  const [payFor, setPayFor] = React.useState<Am | null>(null);
  const mine = s.bookings.filter((b) => b.category === "Building facilities" && b.status !== "Cancelled");

  const confirm = (method?: string) => {
    if (!sel || !slot) return;
    s.addBooking({ category: "Building facilities", service: sel.name, provider: "Ocean Heights Amenities", image: sel.image, date: combine(date, slot), duration: sel.unit, price: sel.price, address: sel.name, paymentMethod: method });
    toast.success(`${sel.name} reserved`, { description: "Added to your Bookings. Entry pass sent to WhatsApp." });
    setSel(null); setSlot(undefined);
  };

  return (
    <div>
      <PageHeader back="/resident/building" title="Amenities & facilities" subtitle={`${mine.length} upcoming reservation${mine.length === 1 ? "" : "s"}`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AMENITIES.map((a) => (
          <button key={a.id} onClick={() => { setSel(a); setSlot(undefined); }} className="group overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-soft transition hover:shadow-lift">
            <Photo id={a.image} w={600} className="aspect-[4/3]" icon={CalendarCheck}><span className="absolute bottom-2.5 left-2.5 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-pine-900 backdrop-blur">{a.price ? `${pkr(a.price)} ${a.unit}` : a.unit}</span></Photo>
            <div className="p-4">
              <div className="font-semibold">{a.name}</div>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Clock className="size-3.5" /> {a.hours}</span><span className="flex items-center gap-1"><Users className="size-3.5" /> {a.capacity}</span></div>
            </div>
          </button>
        ))}
      </div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {sel && (
            <>
              <Photo id={sel.image} w={900} className="h-44 shrink-0" />
              <SheetHeader><SheetTitle>{sel.name}</SheetTitle><SheetDescription>{sel.hours} · Capacity {sel.capacity} · {sel.price ? `${pkr(sel.price)} ${sel.unit}` : sel.unit}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-5">
                <Field label="Date"><DateStrip value={date} onChange={(d) => { setDate(d); setSlot(undefined); }} /></Field>
                <Field label="Available slots"><TimeSlots value={slot} onChange={setSlot} slots={sel.slots} date={date} seed={sel.id} /></Field>
                <div className="rounded-2xl bg-secondary/70 p-3.5 text-[13px] text-muted-foreground">House rules: residents + up to {Math.min(4, sel.capacity)} guests. Cancel free up to 6 hours before. {sel.price ? "Refundable security deposit may apply for events." : ""}</div>
                {sel.price > 0 && <Badge variant="warn">Charged to your account or pay now</Badge>}
              </SheetBody>
              <SheetFooter><Button size="lg" className="w-full" disabled={!slot} onClick={() => (sel.price ? (setPayFor(sel), setPay(true)) : confirm())}>{sel.price ? `Reserve · ${pkr(sel.price)}` : "Reserve slot"}</Button></SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      {payFor && <PaySheet open={pay} onOpenChange={setPay} amount={payFor.price} title={`${payFor.name} reservation`} onPaid={(m) => { confirm(m); }} />}
    </div>
  );
}
