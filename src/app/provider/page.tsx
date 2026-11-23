"use client";
import * as React from "react";
import { Banknote, CalendarDays, CheckCircle2, Clock, MapPin, Navigation, Phone, Play, QrCode, Star, Wrench, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Booking } from "@/lib/types";
import { PROVIDERS } from "@/data/catalog";
import { cn, fmtDateTime, fmtTime, pkr, DAYS } from "@/lib/utils";
import { OpsShell } from "@/components/ops/shell";
import { Chips, Stars } from "@/components/shared/kit";
import { Segmented } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, Switch } from "@/components/ui/misc";

const EXTERNAL = (provider: string): Booking[] => [
  { id: `EX-1-${provider}`, category: "Home services", service: "Service visit", provider, date: new Date(Date.now() + 26 * 3600e3).toISOString(), price: 3500, status: "Upcoming", address: "B-0904, Ocean Heights", ref: "NST-EX-1", timeline: [{ label: "Booked", at: new Date().toISOString(), done: true }] },
  { id: `EX-2-${provider}`, category: "Home services", service: "Follow-up check", provider, date: new Date(Date.now() - 50 * 3600e3).toISOString(), price: 1500, status: "Completed", address: "C-0702, Ocean Heights", ref: "NST-EX-2", timeline: [{ label: "Completed", at: new Date().toISOString(), done: true }] },
];

export default function ProviderApp() {
  const bookings = useDemo((s) => s.bookings);
  const setStatus = useDemo((s) => s.setBookingStatus);
  const notify = useDemo((s) => s.notify);
  const [pid, setPid] = React.useState("pv-cooltech");
  const [tab, setTab] = React.useState<"jobs" | "schedule" | "earnings">("jobs");
  const [f, setF] = React.useState<"active" | "done">("active");
  const [ext, setExt] = React.useState<Record<string, Booking["status"]>>({});
  const [avail, setAvail] = React.useState([true, true, true, true, true, true, false]);
  const [pass, setPass] = React.useState<string | null>(null);
  const p = PROVIDERS.find((x) => x.id === pid) ?? PROVIDERS[0];
  const jobs = [...bookings.filter((b) => b.provider === p.name), ...EXTERNAL(p.name).map((b) => ({ ...b, status: ext[b.id] ?? b.status }))];
  const rows = jobs.filter((b) => (f === "active" ? !["Completed", "Cancelled"].includes(b.status) : ["Completed", "Cancelled"].includes(b.status))).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const earned = jobs.filter((b) => b.status === "Completed").reduce((a, b) => a + b.price, 0);

  const advance = (b: Booking, s: Booking["status"], label: string) => {
    if (b.id.startsWith("EX-")) setExt({ ...ext, [b.id]: s });
    else {
      setStatus(b.id, s, label);
      notify({ kind: "booking", title: `${b.service}: ${label}`, body: `${p.name} · ${b.address}`, href: "/resident/bookings", channels: ["push", "whatsapp"], role: "resident" });
    }
    toast.success(label, { description: b.id.startsWith("EX-") ? undefined : "The resident sees this update live." });
  };

  return (
    <OpsShell app="Partner · Service provider" person={p.name} role={p.person ?? p.tagline} photo={p.photo} tone="light"
      tabs={[{ href: "/provider", label: "Jobs", icon: Wrench }]}
      status={<Select className="hidden h-9 w-44 text-xs sm:flex" value={pid} onValueChange={setPid} options={PROVIDERS.slice(0, 40).map((x) => ({ value: x.id, label: x.name }))} />}>
      <div className="flex flex-col gap-5">
        <div className="sm:hidden"><Select value={pid} onValueChange={setPid} options={PROVIDERS.slice(0, 40).map((x) => ({ value: x.id, label: x.name }))} /></div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[["Today", jobs.filter((b) => new Date(b.date).toDateString() === new Date().toDateString()).length], ["Rating", p.rating], ["This week", pkr(earned + 18400, { compact: true })]].map(([a, b]) => <div key={a as string} className="rounded-2xl border bg-card p-3 shadow-soft"><div className="text-xl font-semibold">{b}</div><div className="text-xs text-muted-foreground">{a}</div></div>)}
        </div>
        <Segmented value={tab} onChange={setTab} options={[{ value: "jobs", label: "Jobs" }, { value: "schedule", label: "Availability" }, { value: "earnings", label: "Earnings" }]} />

        {tab === "jobs" && (
          <>
            <Chips value={f} onChange={setF} options={[{ value: "active", label: "Upcoming & active", count: jobs.filter((b) => !["Completed", "Cancelled"].includes(b.status)).length }, { value: "done", label: "Completed" }]} />
            {rows.length === 0 && <div className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">No jobs here. Book {p.name} from the resident app to see it appear.</div>}
            {rows.map((b) => (
              <div key={b.id} className="rounded-2xl border bg-card p-4 shadow-soft">
                <div className="flex items-start justify-between gap-2">
                  <div><div className="font-semibold">{b.service}</div><div className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="size-3.5" />{b.address}</div></div>
                  <Badge variant={b.status === "In Progress" ? "info" : b.status === "Completed" ? "default" : b.status === "Cancelled" ? "muted" : "warn"}>{b.status}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm"><span className="flex items-center gap-1"><Clock className="size-3.5 text-muted-foreground" />{fmtDateTime(b.date)}</span><span className="flex items-center gap-1"><Banknote className="size-3.5 text-muted-foreground" />{pkr(b.price)}{b.paymentMethod ? ` · paid via ${b.paymentMethod}` : " · cash on completion"}</span>{b.recurring && <Badge variant="muted">{b.recurring}</Badge>}</div>
                {b.notes && <div className="mt-2 rounded-lg bg-secondary/60 p-2 text-xs">{b.notes}</div>}
                {!["Completed", "Cancelled"].includes(b.status) && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {b.status === "Upcoming" && <><Button size="sm" onClick={() => advance(b, "Confirmed", "Confirmed by provider")}><CheckCircle2 /> Accept</Button><Button size="sm" variant="outline" onClick={() => advance(b, "Cancelled", "Declined by provider")}><XCircle /> Decline</Button></>}
                    {b.status === "Confirmed" && <><Button size="sm" onClick={() => advance(b, "In Progress", "Provider on the way")}><Navigation /> On my way</Button><Button size="sm" variant="outline" onClick={() => setPass(b.id)}><QrCode /> Gate pass</Button></>}
                    {b.status === "In Progress" && <Button size="sm" onClick={() => advance(b, "Completed", "Service completed")}><CheckCircle2 /> Mark complete</Button>}
                    <Button size="sm" variant="ghost" onClick={() => toast("Calling resident via masked number…")}><Phone /> Call</Button>
                  </div>
                )}
                {pass === b.id && <div className="mt-3 flex items-center gap-3 rounded-xl bg-pine-950 p-3 text-white"><QrCode className="size-12 text-lime-accent" /><div className="text-sm"><div className="font-semibold">Ocean Heights service pass</div><div className="text-white/60">Show at Gate 2 · valid {fmtTime(new Date(+new Date(b.date) - 30 * 60e3).toISOString())}–{fmtTime(new Date(+new Date(b.date) + 3 * 3600e3).toISOString())}</div></div></div>}
              </div>
            ))}
          </>
        )}

        {tab === "schedule" && (
          <div className="rounded-2xl border bg-card p-4 shadow-soft">
            <div className="mb-3 flex items-center gap-2 font-semibold"><CalendarDays className="size-5" /> Weekly availability</div>
            {DAYS.map((d, i) => <label key={d} className="flex items-center justify-between border-b py-3 text-sm last:border-0"><span className={cn(!avail[i] && "text-muted-foreground")}>{d} · {avail[i] ? "9:00 AM – 7:00 PM" : "Off"}</span><Switch checked={avail[i]} onCheckedChange={(v) => { setAvail(avail.map((x, j) => (j === i ? v : x))); toast(`${d} ${v ? "open for bookings" : "marked off"}`); }} /></label>)}
            <div className="mt-3 text-xs text-muted-foreground">Residents only see slots inside these hours. Building gate passes are issued automatically for confirmed jobs.</div>
          </div>
        )}

        {tab === "earnings" && (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl bg-pine-950 p-5 text-white"><div className="text-sm text-white/60">Payout on Friday</div><div className="mt-1 text-3xl font-semibold">{pkr(earned + 18400)}</div><div className="mt-1 text-xs text-white/50">After 8% NESTORA commission · to Meezan Bank ••4471</div></div>
            <div className="rounded-2xl border bg-card p-4 shadow-soft">
              <div className="mb-2 flex items-center gap-2 font-semibold"><Star className="size-4" /> Recent reviews</div>
              {[["Ahmed R. · A-1204", 5, "On time, very professional and cleaned up after."], ["Hira S. · B-1102", 5, "Explained the issue clearly. Fair price."], ["Omer F. · C-0304", 4, "Good work, arrived 15 min late."]].map(([n, r, t]) => <div key={n as string} className="border-b py-2.5 text-sm last:border-0"><div className="flex items-center justify-between"><span className="font-medium">{n}</span><Stars value={r as number} /></div><div className="text-muted-foreground">{t}</div></div>)}
            </div>
            <Button variant="outline" onClick={() => toast.success("Statement downloaded")}><Play className="rotate-90" /> Download statement</Button>
          </div>
        )}
      </div>
    </OpsShell>
  );
}
