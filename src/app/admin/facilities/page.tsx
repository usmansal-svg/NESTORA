"use client";
import * as React from "react";
import { CalendarDays, Check, X } from "lucide-react";
import { toast } from "sonner";
import { AMENITIES } from "@/data/places";
import { useDemo } from "@/lib/store";
import { cn, fmtDateTime, pkr } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { Stat } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/misc";

const REQS = [
  { id: "FB-881", am: "Community hall", apt: "B-1601", who: "Nadia Hussain", when: "Sat 29 Nov, 6 PM – 10 PM", purpose: "Mehndi function · 90 guests", fee: 15000, deposit: 20000 },
  { id: "FB-882", am: "Rooftop terrace", apt: "C-0904", who: "Faraz Malik", when: "Fri 28 Nov, 7 PM – 11 PM", purpose: "Birthday dinner · 30 guests", fee: 6000, deposit: 10000 },
  { id: "FB-883", am: "Guest suite", apt: "A-2003", who: "Saba Karim", when: "2 – 4 Dec (2 nights)", purpose: "Parents visiting from Lahore", fee: 19000, deposit: 5000 },
];
const HOURS = ["8", "10", "12", "14", "16", "18", "20", "22"];

export default function Facilities() {
  const allBookings = useDemo((s) => s.bookings);
  const bookings = allBookings.filter((b) => b.category === "Building facilities");
  const [reqs, setReqs] = React.useState(REQS);
  const [closed, setClosed] = React.useState<string[]>([]);
  const decide = (id: string, ok: boolean) => { setReqs(reqs.filter((r) => r.id !== id)); ok ? toast.success(`${id} approved`, { description: "Resident notified · fee and refundable deposit added to their account" }) : toast(`${id} declined`, { description: "Resident notified with reason" }); };

  return (
    <>
      <AdminHeader title="Facilities" subtitle="Amenity schedules, booking approvals and closures" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Bookings this month" value={186} icon={CalendarDays} />
        <Stat label="Awaiting approval" value={reqs.length} tone="amber" />
        <Stat label="Facility income (Nov)" value="Rs 1.42 lac" tone="lime" />
        <Stat label="Gym peak" value="7–9 PM" sub="avg 11 of 12" tone="sky" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr]">
        <Panel title="Approval queue" subtitle="Hall, rooftop and guest suite need management approval">
          <div className="flex flex-col gap-2.5">
            {reqs.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">All caught up</div>}
            {reqs.map((r) => (
              <div key={r.id} className="rounded-xl border p-3.5 text-sm">
                <div className="flex items-start justify-between gap-2"><div><div className="font-medium">{r.am} · {r.when}</div><div className="text-xs text-muted-foreground">{r.who}, {r.apt} · {r.purpose}</div></div><span className="font-mono text-[11px] text-muted-foreground">{r.id}</span></div>
                <div className="mt-1.5 text-xs">Fee {pkr(r.fee)} · refundable deposit {pkr(r.deposit)}</div>
                <div className="mt-2.5 flex gap-2"><Button size="sm" onClick={() => decide(r.id, true)}><Check /> Approve</Button><Button size="sm" variant="outline" onClick={() => decide(r.id, false)}><X /> Decline</Button></div>
              </div>
            ))}
            {bookings.length > 0 && <div className="mt-2 text-xs font-semibold text-muted-foreground">Recent resident bookings</div>}
            {bookings.map((b) => <div key={b.id} className="flex justify-between rounded-xl bg-secondary/60 p-3 text-sm"><span>{b.service}</span><span className="text-muted-foreground">{fmtDateTime(b.date)}</span></div>)}
          </div>
        </Panel>
        <Panel title="Today's schedule">
          <div className="overflow-x-auto">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-[120px_repeat(8,1fr)] text-[11px] text-muted-foreground">{["", ...HOURS].map((h) => <div key={h} className="pb-1.5">{h && `${+h > 12 ? +h - 12 : h}${+h >= 12 ? "p" : "a"}`}</div>)}</div>
              {AMENITIES.map((a, ai) => (
                <div key={a.id} className="grid grid-cols-[120px_repeat(8,1fr)] items-center border-t py-1.5 text-[13px]">
                  <span className={cn("truncate", closed.includes(a.id) && "text-muted-foreground line-through")}>{a.name}</span>
                  {HOURS.map((h, i) => { const busy = (ai * 3 + i * 5) % 7 < 3; return <div key={h} className="px-0.5"><div className={cn("h-6 rounded", closed.includes(a.id) ? "bg-secondary" : busy ? "bg-pine-500/80" : "bg-pine-50")} /></div>; })}
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {AMENITIES.map((a) => (
          <div key={a.id} className="overflow-hidden rounded-2xl border bg-card shadow-soft">
            <Photo id={a.image} w={500} className="h-28" />
            <div className="flex items-center gap-3 p-3.5">
              <div className="flex-1"><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.hours} · cap. {a.capacity} · {a.price ? `${pkr(a.price)} ${a.unit}` : a.unit}</div></div>
              <div className="flex flex-col items-end gap-1">
                <Switch checked={!closed.includes(a.id)} onCheckedChange={(v) => { setClosed(v ? closed.filter((x) => x !== a.id) : [...closed, a.id]); toast(v ? `${a.name} reopened` : `${a.name} closed for maintenance`, { description: v ? undefined : "Existing bookings notified · residents can't book new slots" }); }} />
                {closed.includes(a.id) ? <Badge variant="warn">Closed</Badge> : <span className="text-[11px] text-muted-foreground">Open</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
