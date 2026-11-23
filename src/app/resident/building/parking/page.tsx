"use client";
import * as React from "react";
import Link from "next/link";
import { AlertTriangle, BatteryCharging, Bike, Car, CarFront, Plus, Ticket, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Vehicle } from "@/lib/types";
import { cn, fmtTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { List, PageHeader, Row, Section, Stat } from "@/components/shared/kit";
import { ChoiceGrid, Field } from "@/components/shared/pickers";

const LEVELS = [
  { name: "P1", total: 110, free: 14, ev: 4, evFree: 2 },
  { name: "P2", total: 140, free: 31, ev: 0, evFree: 0 },
  { name: "Visitor (Ground)", total: 24, free: 9, ev: 0, evFree: 0 },
];

export default function ParkingPage() {
  const s = useDemo();
  const [add, setAdd] = React.useState(false);
  const [type, setType] = React.useState<Vehicle["type"]>("Car");
  const [make, setMake] = React.useState("");
  const [plate, setPlate] = React.useState("");
  const visitorVehicles = s.visitors.filter((v) => v.apt === "A-1204" && v.vehicle).slice(0, 5);

  return (
    <div>
      <PageHeader back="/resident/building" title="Parking" subtitle="Your bays, vehicles and guest parking" actions={<Button size="sm" variant="outline" onClick={() => setAdd(true)}><Plus /> Vehicle</Button>} />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Your bays" value="P1-042, 043" sub="+ bike bay M-17" icon={Ticket} />
        <Stat label="Visitor bays free" value="9 / 24" sub="Ground level" icon={Car} tone="sky" />
        <Stat label="EV bays free" value="2 / 4" sub="P1 · 22 kW" icon={BatteryCharging} tone="lime" />
        <Stat label="Violations" value="0" sub="Clean record" icon={AlertTriangle} tone="amber" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Section title="My vehicles" className="mt-0">
          <List>
            {s.vehicles.map((v) => (
              <Row key={v.id} icon={v.type === "Motorcycle" ? Bike : v.type === "EV" ? BatteryCharging : CarFront} tone={v.type === "EV" ? "lime" : "pine"} title={v.make} subtitle={`${v.plate} · ${v.color}`} trailing={<Badge variant="outline">{v.slot ?? "No bay"}</Badge>} />
            ))}
          </List>
          <div className="mt-3 rounded-2xl bg-pine-50 p-4 text-[13px] text-pine-900">RFID stickers let boom barriers open automatically for registered vehicles.</div>
        </Section>
        <Section title="Live availability" className="mt-0">
          <div className="space-y-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
            {LEVELS.map((l) => (
              <div key={l.name}>
                <div className="flex justify-between text-sm"><span className="font-medium">{l.name}</span><span className="text-muted-foreground">{l.free} free of {l.total}</span></div>
                <div className="mt-1.5 flex h-6 gap-[2px]">{Array.from({ length: 40 }).map((_, i) => <span key={i} className={cn("flex-1 rounded-[3px]", i < Math.round((l.free / l.total) * 40) ? "bg-pine-400" : "bg-sand-300")} />)}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="mt-2 grid gap-5 lg:grid-cols-2">
        <Section title="Guest parking">
          <List>
            <Row href="/resident/building/visitors?new=1" icon={Car} title="Reserve a visitor bay" subtitle="Add vehicle number when inviting a guest" />
            <Row href="/resident/parking" icon={Ticket} tone="lime" title="Rent a neighbour's bay" subtitle="Hourly, daily or monthly from 4 residents" />
            <Row href="/resident/ev" icon={BatteryCharging} tone="teal" title="EV parking & charging" subtitle="Reserve a charger at P1" />
          </List>
        </Section>
        <Section title="Visitor vehicle log">
          <List>
            {visitorVehicles.map((v) => <Row key={v.id} icon={Car} tone="stone" title={v.vehicle!} subtitle={`${v.name} · ${v.status === "exited" ? `left ${fmtTime(v.exitAt!)}` : v.status === "inside" ? "inside now" : "expected"}`} />)}
          </List>
        </Section>
      </div>
      <Link href="/resident/parking" className="mt-6 flex items-center justify-between rounded-2xl bg-primary p-5 text-white"><div><div className="font-semibold">Not using bay P1-043 this month?</div><div className="text-sm text-white/65">List it and earn up to Rs 12,000/month from neighbours.</div></div><ArrowRight /></Link>

      <Sheet open={add} onOpenChange={setAdd}>
        <SheetContent>
          <SheetHeader><SheetTitle>Register a vehicle</SheetTitle><SheetDescription>Management will issue an RFID sticker within 48 hours.</SheetDescription></SheetHeader>
          <SheetBody className="space-y-4">
            <ChoiceGrid value={type} onChange={setType} options={[{ value: "Car", label: "Car", icon: CarFront }, { value: "EV", label: "Electric", icon: BatteryCharging }, { value: "Motorcycle", label: "Motorcycle", icon: Bike }]} />
            <Field label="Make & model"><Input value={make} onChange={(e) => setMake(e.target.value)} placeholder="e.g. Honda Civic" /></Field>
            <Field label="Registration number"><Input value={plate} onChange={(e) => setPlate(e.target.value.toUpperCase())} placeholder="e.g. BKR-1204" /></Field>
          </SheetBody>
          <SheetFooter><Button className="w-full" size="lg" onClick={() => { if (!plate) return toast.error("Enter a registration number"); s.addVehicle({ make: make || type, plate, color: "—", type }); toast.success("Vehicle registered", { description: "Sticker request sent to management." }); setAdd(false); setMake(""); setPlate(""); }}>Register vehicle</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
