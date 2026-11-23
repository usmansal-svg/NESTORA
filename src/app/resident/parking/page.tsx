"use client";
import * as React from "react";
import { BatteryCharging, Bike, CalendarDays, CarFront, CheckCircle2, Plus, ShieldCheck, Umbrella } from "lucide-react";
import { toast } from "sonner";
import { PARKING_SPOTS, type ParkingSpot } from "@/data/places";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, Section, Stars } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { combine, DateStrip, Field, Segmented } from "@/components/shared/pickers";
import { PaySheet } from "@/components/resident/pay-sheet";

type Plan = "hour" | "day" | "month";

export default function ParkingRentals() {
  const s = useDemo();
  const [sel, setSel] = React.useState<ParkingSpot | null>(null);
  const [plan, setPlan] = React.useState<Plan>("day");
  const [units, setUnits] = React.useState(1);
  const [date, setDate] = React.useState(new Date());
  const [vehicle, setVehicle] = React.useState("BKR-1204");
  const [pay, setPay] = React.useState(false);
  const [payFor, setPayFor] = React.useState<{ spot: ParkingSpot; amount: number } | null>(null);
  const [list, setList] = React.useState(false);
  const amount = sel ? sel[plan] * units : 0;

  return (
    <div>
      <PageHeader back="/resident/explore" title="Parking rentals" subtitle="Rent a neighbour's unused bay — or earn from yours" actions={<Button size="sm" variant="outline" onClick={() => setList(true)}><Plus /> List my bay</Button>} />
      <div className="grid gap-4 sm:grid-cols-2">
        {PARKING_SPOTS.map((p) => (
          <button key={p.id} onClick={() => { setSel(p); setPlan(p.suits.includes("Motorcycle") ? "day" : "day"); setUnits(1); }} className="overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-soft transition hover:shadow-lift">
            <Photo id={p.image} w={700} className="aspect-[16/8]" icon={CarFront}>
              <span className="absolute left-3 top-3 rounded-lg bg-pine-950/80 px-2.5 py-1 font-mono text-sm font-semibold text-lime-accent backdrop-blur">{p.slot}</span>
              {p.ev && <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-lime-accent px-2 py-0.5 text-[11px] font-semibold text-pine-950"><BatteryCharging className="size-3" /> EV charger</span>}
            </Photo>
            <div className="p-4">
              <div className="flex items-center justify-between"><div className="font-semibold">{p.level}</div><Stars value={p.rating} /></div>
              <div className="text-[13px] text-muted-foreground">{p.availability}</div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">{(["hour", "day", "month"] as const).map((k) => <div key={k} className="rounded-xl bg-secondary/70 py-2"><div className="font-semibold">{pkr(p[k])}</div><div className="text-muted-foreground">/{k}</div></div>)}</div>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Avatar src={p.ownerPhoto} name={p.owner} className="size-6" /> {p.owner} · {p.apt} <span className="ml-auto flex gap-1">{p.suits.map((x) => <Badge key={x} variant="outline">{x}</Badge>)}{p.covered && <Badge variant="muted"><Umbrella /> Covered</Badge>}</span></div>
            </div>
          </button>
        ))}
      </div>
      <Section title="My rentals">
        <div className="divide-y rounded-2xl border bg-card">
          {s.bookings.filter((b) => b.category === "Parking").map((b) => <div key={b.id} className="flex items-center justify-between px-4 py-3 text-sm"><div><div className="font-medium">{b.service}</div><div className="text-xs text-muted-foreground">{b.provider} · {b.duration}</div></div><Badge>{b.status}</Badge></div>)}
          {!s.bookings.some((b) => b.category === "Parking") && <div className="p-4 text-sm text-muted-foreground">No rentals yet.</div>}
        </div>
      </Section>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {sel && (
            <>
              <SheetHeader><SheetTitle>Bay {sel.slot}</SheetTitle><SheetDescription>{sel.level} · owned by {sel.owner} ({sel.apt})</SheetDescription></SheetHeader>
              <SheetBody className="space-y-5">
                <p className="rounded-2xl bg-secondary/70 p-3.5 text-sm">{sel.note}</p>
                <Field label="Rate"><Segmented value={plan} onChange={(v) => { setPlan(v); setUnits(1); }} options={[{ value: "hour", label: `Hourly · ${pkr(sel.hour)}` }, { value: "day", label: `Daily · ${pkr(sel.day)}` }, { value: "month", label: `Monthly · ${pkr(sel.month)}` }]} /></Field>
                <Field label="Start date"><DateStrip value={date} onChange={setDate} /></Field>
                <Field label={`Number of ${plan}s`}><div className="flex h-11 w-40 items-center justify-between rounded-xl border bg-card px-2"><Button variant="ghost" size="icon-sm" onClick={() => setUnits(Math.max(1, units - 1))}>−</Button><span className="font-semibold">{units}</span><Button variant="ghost" size="icon-sm" onClick={() => setUnits(units + 1)}>+</Button></div></Field>
                <Field label="Vehicle"><div className="flex flex-wrap gap-2">{s.vehicles.filter((v) => sel.suits.includes(v.type === "Motorcycle" ? "Motorcycle" : "Car")).map((v) => <button key={v.id} onClick={() => setVehicle(v.plate)} className={cn("flex items-center gap-2 rounded-xl border bg-card px-3 py-2 text-sm", vehicle === v.plate && "border-pine-600 ring-2 ring-pine-600/15")}>{v.type === "Motorcycle" ? <Bike className="size-4" /> : <CarFront className="size-4" />}{v.plate}</button>)}</div></Field>
                <div className="flex items-start gap-2 rounded-2xl bg-pine-50 p-3.5 text-[13px] text-pine-900"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> Owner approval is instant for verified residents. Barrier access for {vehicle} expires automatically at the end of your rental.</div>
              </SheetBody>
              <SheetFooter><Button size="lg" className="w-full" onClick={() => { setPayFor({ spot: sel, amount }); setPay(true); }}>Rent for {pkr(amount)}</Button></SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
      {payFor && <PaySheet open={pay} onOpenChange={setPay} amount={payFor.amount} title={`Parking bay ${payFor.spot.slot}`} payee={`${payFor.spot.owner} via NESTORA`} onPaid={(m) => {
        s.addBooking({ category: "Parking", service: `Bay ${payFor.spot.slot} · ${vehicle}`, provider: `${payFor.spot.owner} (${payFor.spot.apt})`, image: payFor.spot.image, date: combine(date, "08:00"), duration: `${units} ${plan}${units > 1 ? "s" : ""}`, price: payFor.amount, address: payFor.spot.level, paymentMethod: m });
        setSel(null);
      }} />}

      <Sheet open={list} onOpenChange={setList}>
        <SheetContent>
          <SheetHeader><SheetTitle>List your parking bay</SheetTitle><SheetDescription>Set your rates and availability. You approve every renter.</SheetDescription></SheetHeader>
          <SheetBody className="space-y-4">
            <Field label="Bay"><Segmented value="P1-043" onChange={() => {}} options={[{ value: "P1-043", label: "P1-043 (EV)" }, { value: "P1-042", label: "P1-042" }]} /></Field>
            <div className="grid grid-cols-3 gap-3"><Field label="Hourly"><Input defaultValue="200" /></Field><Field label="Daily"><Input defaultValue="1000" /></Field><Field label="Monthly"><Input defaultValue="14000" /></Field></div>
            <Field label="Available"><div className="flex items-center gap-2 rounded-xl border bg-card p-3 text-sm"><CalendarDays className="size-4" /> Weekdays 9 AM – 6 PM</div></Field>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" onClick={() => { toast.success("Bay P1-043 listed", { description: "Visible to Ocean Heights residents now." }); setList(false); }}><CheckCircle2 /> Publish listing</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
