"use client";
import * as React from "react";
import Link from "next/link";
import { CalendarCheck, CalendarClock, MessageCircle, Phone, Repeat, Star, X, Compass } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import type { Booking } from "@/lib/types";
import { cn, fmtDate, fmtDateTime, fmtTime, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, Empty, KeyVal, PageHeader, Timeline } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { combine, DateStrip, Field, TimeSlots } from "@/components/shared/pickers";
import { BellButton } from "@/components/resident/shell";

type Tab = "upcoming" | "progress" | "completed" | "cancelled";
const tabOf = (b: Booking): Tab => (b.status === "In Progress" ? "progress" : b.status === "Completed" ? "completed" : b.status === "Cancelled" ? "cancelled" : "upcoming");
const variant = (s: Booking["status"]) => (s === "Confirmed" ? "default" : s === "Upcoming" ? "info" : s === "In Progress" ? "lime" : s === "Completed" ? "muted" : "danger") as "default";

export default function BookingsPage() {
  const s = useDemo();
  const qid = useQuery("id");
  const [tab, setTab] = React.useState<Tab>("upcoming");
  const [cat, setCat] = React.useState("All");
  const [sel, setSel] = React.useState<string | null>(null);
  const [resched, setResched] = React.useState(false);
  const [date, setDate] = React.useState(new Date());
  const [slot, setSlot] = React.useState<string>();
  const [rating, setRating] = React.useState<Record<string, number>>({});
  React.useEffect(() => { if (qid) setSel(qid); }, [qid]);

  const cats = ["All", ...Array.from(new Set(s.bookings.map((b) => b.category)))];
  const list = s.bookings.filter((b) => tabOf(b) === tab && (cat === "All" || b.category === cat)).sort((a, b) => (tab === "upcoming" ? +new Date(a.date) - +new Date(b.date) : +new Date(b.date) - +new Date(a.date)));
  const cur = s.bookings.find((b) => b.id === sel);
  const counts = (t: Tab) => s.bookings.filter((b) => tabOf(b) === t).length;

  // group by day for upcoming
  const groups = list.reduce<Record<string, Booking[]>>((acc, b) => { const k = new Date(b.date).toDateString(); (acc[k] ||= []).push(b); return acc; }, {});

  return (
    <div>
      <PageHeader title="Bookings" subtitle="Every service, class, order and reservation in one place" actions={<BellButton />} />
      <Chips value={tab} onChange={setTab} options={[{ value: "upcoming", label: "Upcoming", count: counts("upcoming") }, { value: "progress", label: "In progress", count: counts("progress") }, { value: "completed", label: "Completed" }, { value: "cancelled", label: "Cancelled" }]} />
      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto text-[12.5px]">{cats.map((c) => <button key={c} onClick={() => setCat(c)} className={cn("shrink-0 rounded-lg px-2.5 py-1", cat === c ? "bg-secondary font-semibold" : "text-muted-foreground")}>{c}</button>)}</div>

      <div className="mt-4 space-y-6">
        {list.length === 0 && <Empty icon={CalendarCheck} title="No bookings here" body="Book a service, class or facility and it'll show up here." action={<Button asChild><Link href="/resident/explore"><Compass /> Explore services</Link></Button>} />}
        {Object.entries(groups).map(([day, items]) => (
          <div key={day}>
            <div className="mb-2 text-[12.5px] font-semibold uppercase tracking-wider text-muted-foreground">{new Date(day).toDateString() === new Date().toDateString() ? "Today" : fmtDate(day, { weekday: "long", day: "numeric", month: "long" })}</div>
            <div className="grid gap-3 md:grid-cols-2">
              {items.map((b) => (
                <button key={b.id} onClick={() => setSel(b.id)} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3 text-left shadow-soft transition hover:shadow-lift">
                  <Photo id={b.image} w={200} className="size-20 shrink-0 rounded-xl" icon={CalendarCheck} seed={b.category} />
                  <div className="min-w-0 flex-1 py-0.5">
                    <div className="flex items-center gap-2"><Badge variant={variant(b.status)}>{b.status}</Badge><span className="truncate text-[11.5px] text-muted-foreground">{b.category}</span></div>
                    <div className="mt-1 truncate font-semibold">{b.service}</div>
                    <div className="truncate text-[12.5px] text-muted-foreground">{b.provider}</div>
                    <div className="mt-1 flex items-center gap-2 text-[12.5px]"><span className="font-medium">{fmtTime(b.date)}</span>{b.recurring && <span className="flex items-center gap-1 text-muted-foreground"><Repeat className="size-3" /> {b.recurring}</span>}<span className="ml-auto font-semibold">{b.price ? pkr(b.price) : "Free"}</span></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={!!cur} onOpenChange={(o) => { if (!o) { setSel(null); setResched(false); } }}>
        <SheetContent>
          {cur && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-3">{cur.providerPhoto ? <Avatar src={cur.providerPhoto} name={cur.provider} className="size-12" /> : <span className="grid size-12 place-items-center rounded-full bg-pine-50"><CalendarCheck className="size-5 text-pine-700" /></span>}<div className="min-w-0"><SheetTitle className="truncate">{cur.service}</SheetTitle><SheetDescription>{cur.provider}</SheetDescription></div></div>
              </SheetHeader>
              <SheetBody className="space-y-4">
                {resched ? (
                  <>
                    <Field label="New date"><DateStrip value={date} onChange={setDate} /></Field>
                    <Field label="New time"><TimeSlots value={slot} onChange={setSlot} date={date} seed={cur.id} /></Field>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2"><Badge variant={variant(cur.status)}>{cur.status}</Badge><span className="font-mono text-xs text-muted-foreground">{cur.ref}</span></div>
                    <div className="rounded-2xl border bg-card px-4 py-2">
                      <KeyVal k="When" v={fmtDateTime(cur.date)} />
                      {cur.duration && <KeyVal k="Duration" v={cur.duration} />}
                      <KeyVal k="Where" v={cur.address} />
                      {cur.recurring && <KeyVal k="Repeats" v={cur.recurring} />}
                      <KeyVal k="Price" v={cur.price ? pkr(cur.price) : "Free"} />
                      {cur.paymentMethod && <KeyVal k="Payment" v={cur.paymentMethod} />}
                      {cur.notes && <KeyVal k="Notes" v={cur.notes} />}
                    </div>
                    <div className="rounded-2xl border bg-card p-4"><div className="mb-3 text-sm font-semibold">Timeline</div><Timeline items={cur.timeline.map((t, i) => ({ label: t.label, at: t.done ? fmtDateTime(t.at) : undefined, done: t.done, active: !t.done && (i === 0 || cur.timeline[i - 1].done) && cur.status !== "Cancelled" }))} /></div>
                    {cur.status === "Completed" && (
                      <div className="rounded-2xl border bg-card p-4"><div className="text-sm font-semibold">Rate {cur.provider}</div><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => { setRating({ ...rating, [cur.id]: n }); toast.success("Thanks for the review!"); }}><Star className={cn("size-8", (rating[cur.id] ?? 0) >= n ? "fill-amber-400 text-amber-400" : "text-sand-300")} /></button>)}</div></div>
                    )}
                  </>
                )}
              </SheetBody>
              <SheetFooter>
                {resched ? (
                  <div className="flex gap-2"><Button variant="outline" className="flex-1" onClick={() => setResched(false)}>Back</Button><Button className="flex-1" disabled={!slot} onClick={() => { s.rescheduleBooking(cur.id, combine(date, slot!)); toast.success("Rescheduled", { description: `${cur.provider} has been notified.` }); setResched(false); }}>Confirm new time</Button></div>
                ) : ["Upcoming", "Confirmed"].includes(cur.status) ? (
                  <div className="grid grid-cols-4 gap-2">
                    <Button variant="outline" size="icon" className="w-full" asChild><a href="tel:+923001234567"><Phone /></a></Button>
                    <Button variant="outline" size="icon" className="w-full" onClick={() => toast.success("Message sent to provider")}><MessageCircle /></Button>
                    <Button variant="outline" className="w-full" onClick={() => { setResched(true); setSlot(undefined); }}><CalendarClock /> <span className="hidden sm:inline">Reschedule</span></Button>
                    <Button variant="outline" className="w-full text-danger" onClick={() => { s.setBookingStatus(cur.id, "Cancelled", "Cancelled by you"); toast("Booking cancelled", { description: "No cancellation fee applied." }); }}><X /> <span className="hidden sm:inline">Cancel</span></Button>
                  </div>
                ) : cur.status === "In Progress" ? (
                  <Button className="w-full" size="lg" onClick={() => { s.setBookingStatus(cur.id, "Completed", "Completion confirmed by you"); toast.success("Marked complete", { description: "Please rate your experience." }); }}>Confirm completion</Button>
                ) : (
                  <Button className="w-full" variant="outline" asChild><Link href="/resident/explore">Book again</Link></Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
