"use client";
import * as React from "react";
import Link from "next/link";
import {
  ArrowRight, BatteryCharging, Bike, Building2, CalendarCheck, ChevronRight, CircleParking, Droplets, Megaphone,
  Package, PlugZap, Receipt, Scissors, ShieldCheck, Siren, Sparkles, UserPlus, Users, UtensilsCrossed, Wrench, Zap,
  LayoutGrid, Copy, MapPin, Send,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { APARTMENTS, RESIDENT } from "@/data/seed";
import { PROVIDERS } from "@/data/catalog";
import { OFFERS, SELLERS } from "@/data/places";
import { IMG } from "@/lib/img";
import { ago, cn, fmtDate, fmtDateTime, pkr } from "@/lib/utils";
import { Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Photo } from "@/components/shared/photo";
import { LiveDot, Section, Stars } from "@/components/shared/kit";
import { BellButton } from "@/components/resident/shell";
import { ApartmentSwitcher } from "@/components/resident/apartment-switcher";
import { PaySheet } from "@/components/resident/pay-sheet";
import { SosButton } from "@/components/resident/sos";
import { VisitorApprovalCard } from "@/components/resident/visitor-approval";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

const QUICK = [
  { label: "Register visitor", icon: UserPlus, href: "/resident/building/visitors?new=1", tone: "bg-pine-50 text-pine-700" },
  { label: "Pay bill", icon: Receipt, action: "pay", tone: "bg-lime-soft text-pine-800" },
  { label: "Raise complaint", icon: Wrench, href: "/resident/building/complaints?new=1", tone: "bg-amber-soft text-amber-700" },
  { label: "My parcels", icon: Package, href: "/resident/building/parcels", tone: "bg-sky-50 text-sky-700" },
  { label: "Hire house help", icon: Users, href: "/resident/explore/household-help", tone: "bg-violet-50 text-violet-700" },
  { label: "Home service", icon: Sparkles, href: "/resident/explore/home-services", tone: "bg-teal-50 text-teal-700" },
  { label: "Order food", icon: UtensilsCrossed, href: "/resident/food", tone: "bg-rose-50 text-rose-700" },
  { label: "Book EV charger", icon: PlugZap, href: "/resident/ev", tone: "bg-emerald-50 text-emerald-700" },
  { label: "Book my barber", icon: Scissors, href: "/resident/explore/salon?sub=Men's%20haircut", tone: "bg-stone-100 text-stone-700" },
  { label: "Contact security", icon: ShieldCheck, href: "/resident/building/security", tone: "bg-pine-50 text-pine-700" },
  { label: "Emergency SOS", icon: Siren, action: "sos", tone: "bg-danger-soft text-danger" },
  { label: "All services", icon: LayoutGrid, href: "/resident/explore", tone: "bg-secondary text-foreground/70" },
];

export default function ResidentHome() {
  const s = useDemo();
  const live = useLiveUtilities();
  const [payOpen, setPayOpen] = React.useState(false);
  const [ask, setAsk] = React.useState("");
  const apt = APARTMENTS.find((a) => a.id === s.apartment)!;
  const pending = s.visitors.filter((v) => v.status === "pending" && v.apt === "A-1204");
  const expected = s.visitors.filter((v) => v.apt === "A-1204" && ["expected", "approved"].includes(v.status)).slice(0, 3);
  const dueBill = s.bills.find((b) => b.status !== "paid");
  const lastPaid = s.bills.find((b) => b.status === "paid");
  const due = dueBill ? dueBill.items.reduce((a, i) => a + i.amount, 0) : 0;
  const parcels = s.parcels.filter((p) => p.apt === "A-1204" && ["awaiting", "reception"].includes(p.status));
  const upcoming = s.bookings.filter((b) => ["Upcoming", "Confirmed", "In Progress"].includes(b.status)).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const ann = s.announcements.slice(0, 3);
  const staffIn = s.staff.filter((x) => x.status === "active" && x.log[0] && !x.log[0].out);

  // Residents only need to hear about building services when something affects them.
  const notices = [
    live.grid !== "On" && { text: `K-Electric outage since ${live.gridSince}. Generator is ${live.generator.toLowerCase()}.`, icon: Zap },
    live.water !== "Available" && { text: `Water supply: ${live.water.toLowerCase()}.`, icon: Droplets },
  ].filter(Boolean) as { text: string; icon: typeof Zap }[];

  return (
    <div className="pt-[max(env(safe-area-inset-top),12px)] lg:pt-8">
      {/* HERO */}
      <section className="relative -mx-4 overflow-hidden bg-pine-900 px-4 pb-5 pt-4 text-white sm:mx-0 sm:rounded-[28px] sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
        <Photo id={IMG.building} w={1400} className="absolute inset-0 opacity-[0.22] [[data-theme=emaar]_&]:opacity-50" imgClassName="mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-950/30 via-pine-900/80 to-pine-900" />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-lime-accent/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <Link href="/resident/account"><Avatar src={RESIDENT.photo} name={RESIDENT.name} className="size-11 ring-2 ring-white/20" /></Link>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-white/60">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="mt-0.5"><ApartmentSwitcher /></div>
            </div>
            <Link href="/resident/assistant" className="grid size-10 place-items-center rounded-full bg-white/10 text-lime-accent transition hover:bg-white/15" aria-label="Nestora AI"><Sparkles className="size-[19px]" /></Link>
            <BellButton dark />
          </div>
          <h1 className="mt-6 font-display text-[34px] leading-[1.05] tracking-tight sm:text-[42px]">
            {greeting()}, <span className="italic text-lime-accent">{RESIDENT.first}</span>
          </h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-white/65"><MapPin className="size-3.5" /> {apt.building}, Tower {apt.tower} · Apt {apt.unit} · {apt.area}, Karachi</p>

          {notices.map((n) => (
            <Link key={n.text} href="/resident/building/utilities" className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-3.5 py-2.5 text-[13px] ring-1 ring-white/10 backdrop-blur">
              <n.icon className="size-4 shrink-0 text-amber-300" />
              <span className="min-w-0 flex-1">{n.text}</span>
              <ChevronRight className="size-4 shrink-0 text-white/50" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px] lg:gap-7">
        <div className="min-w-0">
          {/* Pending approvals */}
          {pending.length > 0 && (
            <div className="mb-5 space-y-3">
              {pending.map((v) => <VisitorApprovalCard key={v.id} v={v} />)}
            </div>
          )}

          {/* Finance */}
          <div className="grid gap-3 sm:grid-cols-[1.25fr_1fr]">
            <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-medium text-muted-foreground">Outstanding maintenance</span>
                {dueBill ? <Badge variant="warn">Due {fmtDate(dueBill.dueDate)}</Badge> : <Badge>All paid</Badge>}
              </div>
              <div className="mt-2 text-[32px] font-semibold tracking-tight tabular">{pkr(due)}</div>
              <div className="mt-1 text-[12.5px] text-muted-foreground">
                {dueBill ? `${dueBill.month} · includes Rs 500 late fee` : "You're all settled. Next bill on the 1st."}
              </div>
              <div className="mt-4 flex gap-2">
                <Button className="flex-1" disabled={!dueBill} onClick={() => setPayOpen(true)}><Zap /> Quick Pay</Button>
                <Button variant="outline" asChild><Link href="/resident/building/payments">Statement</Link></Button>
              </div>
              <div className="mt-4 flex items-center justify-between border-t pt-3 text-[12.5px]">
                <span className="text-muted-foreground">Last payment</span>
                <span className="font-medium">{lastPaid ? `${pkr(lastPaid.items.reduce((a, i) => a + i.amount, 0))} · ${fmtDate(lastPaid.paidAt!)} · ${lastPaid.method}` : "—"}</span>
              </div>
            </div>

            {/* Parcels */}
            <Link href="/resident/building/parcels" className="group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-pine-800 to-pine-950 p-5 text-white shadow-soft">
              <div className="absolute -bottom-10 -right-8 size-40 rounded-full border-[18px] border-white/[0.04]" />
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[13px] font-medium text-white/70"><Package className="size-4 text-lime-accent" /> Smart lockers</span>
                <ArrowRight className="size-4 text-white/50 transition group-hover:translate-x-0.5" />
              </div>
              {parcels.length ? (
                <>
                  <div className="mt-2 text-[28px] font-semibold tracking-tight">{parcels.length} parcel{parcels.length > 1 ? "s" : ""} ready</div>
                  <div className="mt-auto space-y-1.5 pt-3">
                    {parcels.slice(0, 2).map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-xl bg-white/[0.08] px-3 py-2 text-[12.5px] ring-1 ring-white/10">
                        <span className="truncate">{p.courier} · {p.compartment ? `Locker ${p.compartment}` : "Reception"}</span>
                        <span className="font-mono text-[13px] font-semibold tracking-wider text-lime-accent">{p.pin}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="mt-2 text-lg font-semibold">No parcels waiting</div>
              )}
            </Link>
          </div>

          {/* Quick actions */}
          <Section title="Quick actions" className="mt-7">
            <div className="grid grid-cols-4 gap-x-2 gap-y-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft sm:grid-cols-6">
              {QUICK.map((q) => {
                const inner = (
                  <>
                    <span className={cn("grid size-12 place-items-center rounded-2xl transition group-hover:scale-105 group-active:scale-95", q.tone)}><q.icon className="size-[22px]" strokeWidth={1.8} /></span>
                    <span className="text-center text-[11.5px] font-medium leading-tight text-foreground/80">{q.label}</span>
                  </>
                );
                const cls = "group flex flex-col items-center gap-1.5";
                if (q.action === "sos") return <SosButton key={q.label} trigger={<button className={cls}>{inner}</button>} />;
                if (q.action === "pay") return <button key={q.label} className={cls} onClick={() => (dueBill ? setPayOpen(true) : toast("No dues right now", { description: "Your account is fully paid." }))}>{inner}</button>;
                return <Link key={q.label} href={q.href!} className={cls}>{inner}</Link>;
              })}
            </div>
          </Section>

          {/* Nestora AI bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); window.location.href = `/resident/assistant?q=${encodeURIComponent(ask || "How much maintenance do I owe?")}`; }}
            className="mt-5 flex items-center gap-3 rounded-2xl border border-pine-200 bg-gradient-to-r from-pine-50 to-lime-soft/60 p-2 pl-4"
          >
            <Sparkles className="size-5 shrink-0 text-pine-600" />
            <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Ask Nestora AI — “Is my parcel ready?”, “Find me a cook”" className="h-10 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-pine-900/45" />
            <Button size="icon" type="submit" aria-label="Ask"><Send /></Button>
          </form>

          {/* Upcoming */}
          <Section title="Upcoming" href="/resident/bookings">
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0 xl:grid-cols-3">
              {expected.map((v) => (
                <Link key={v.id} href="/resident/building/visitors" className="w-[250px] shrink-0 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift sm:w-auto">
                  <div className="flex items-center justify-between"><Badge variant="info"><UserPlus /> Visitor</Badge><span className="text-xs text-muted-foreground">{fmtDateTime(v.validFrom)}</span></div>
                  <div className="mt-3 font-semibold">{v.name}</div>
                  <div className="text-[13px] text-muted-foreground">{v.purpose}{v.recurring ? ` · ${v.recurring}` : ""}</div>
                  <div className="mt-3 flex items-center gap-1.5 font-mono text-xs text-pine-700"><ShieldCheck className="size-3.5" /> Pass {v.code}</div>
                </Link>
              ))}
              {upcoming.slice(0, 3).map((b) => (
                <Link key={b.id} href={`/resident/bookings?id=${b.id}`} className="w-[250px] shrink-0 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift sm:w-auto">
                  <div className="flex items-center justify-between"><Badge variant={b.status === "In Progress" ? "lime" : "default"}><CalendarCheck /> {b.status}</Badge><span className="text-xs text-muted-foreground">{fmtDateTime(b.date)}</span></div>
                  <div className="mt-3 truncate font-semibold">{b.service}</div>
                  <div className="truncate text-[13px] text-muted-foreground">{b.provider}</div>
                  <div className="mt-3 text-xs font-medium text-foreground/70">{b.price ? pkr(b.price) : "Free"}{b.recurring ? ` · ${b.recurring}` : ""}</div>
                </Link>
              ))}
            </div>
          </Section>

          {/* Recommended services */}
          <Section title="Recommended for your home" href="/resident/explore" subtitle="Trusted by neighbours at Ocean Heights">
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
              {PROVIDERS.filter((p) => ["pv-cooltech", "pv-safaipro", "pv-saleem", "pv-greenthumb", "pv-aqua", "pv-pestaway"].includes(p.id)).map((p) => (
                <Link key={p.id} href={`/resident/explore/provider/${p.id}`} className="group w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition hover:shadow-lift sm:w-auto">
                  <Photo id={p.cover} w={500} className="aspect-[16/10]" icon={Wrench}>
                    {p.verified && <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-pine-800 backdrop-blur"><ShieldCheck className="size-3" /> Verified</span>}
                  </Photo>
                  <div className="p-3.5">
                    <div className="flex items-center justify-between gap-2"><span className="truncate font-semibold">{p.name}</span><Stars value={p.rating} /></div>
                    <div className="truncate text-[12.5px] text-muted-foreground">{p.tagline}</div>
                    <div className="mt-2 text-[12.5px]"><span className="text-muted-foreground">from </span><span className="font-semibold">{pkr(Math.min(...p.services.filter((x) => x.price > 0).map((x) => x.price)))}</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          {/* Restaurant offers */}
          <Section title="Offers around you" href="/resident/offers">
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0">
              {OFFERS.slice(0, 4).map((o) => (
                <button key={o.id} onClick={() => { navigator.clipboard?.writeText(o.code); toast.success(`Code ${o.code} copied`, { description: `${o.business} · ${o.title}` }); }} className="group relative flex h-[132px] w-[290px] shrink-0 overflow-hidden rounded-2xl text-left shadow-soft sm:w-auto">
                  <Photo id={o.image} w={600} className="absolute inset-0" icon={UtensilsCrossed} />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-transparent" />
                  <div className="relative flex flex-col justify-between p-4 text-white">
                    <div>
                      <div className="text-[11.5px] font-medium text-white/70">{o.business} · {o.distance}{o.sponsored ? " · Sponsored" : ""}</div>
                      <div className="mt-1 max-w-[200px] text-lg font-semibold leading-tight">{o.title}</div>
                    </div>
                    <span className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-white/50 px-2 py-1 font-mono text-xs">{o.code} <Copy className="size-3" /></span>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Home chefs */}
          <Section title="Cooking in your building tonight" href="/resident/food">
            <div className="grid gap-3 sm:grid-cols-3">
              {SELLERS.filter((x) => x.apt).map((f) => (
                <Link key={f.id} href={`/resident/food/${f.id}`} className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft transition hover:shadow-lift sm:flex-col sm:items-stretch sm:p-0">
                  <Photo id={f.cover} w={500} className="size-20 shrink-0 rounded-xl sm:aspect-[16/9] sm:size-auto sm:rounded-none" icon={UtensilsCrossed} />
                  <div className="min-w-0 sm:p-3.5 sm:pt-0">
                    <div className="truncate font-semibold">{f.name}</div>
                    <div className="truncate text-[12.5px] text-muted-foreground">{f.kind} · {f.apt} · {f.eta}</div>
                    <div className="mt-1 flex items-center gap-2"><Stars value={f.rating} /><span className="text-xs text-muted-foreground">({f.reviews})</span></div>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          {/* Marketplace picks */}
          <Section title="From your neighbours" href="/resident/marketplace" subtitle="Buy & sell within Ocean Heights">
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0">
              {s.listings.filter((l) => !l.mine && !l.sold).slice(0, 4).map((l) => (
                <Link key={l.id} href={`/resident/marketplace?id=${l.id}`} className="w-[160px] shrink-0 sm:w-auto">
                  <Photo id={l.image} w={400} className="aspect-square rounded-2xl" icon={LayoutGrid} />
                  <div className="mt-2 truncate text-[13.5px] font-medium">{l.title}</div>
                  <div className="text-[13px] font-semibold text-pine-700">{pkr(l.price)}</div>
                  <div className="text-[11.5px] text-muted-foreground">{l.sellerApt} · {l.condition}</div>
                </Link>
              ))}
            </div>
          </Section>
        </div>

        {/* RIGHT RAIL */}
        <aside className="min-w-0 space-y-5">
          <Section title="Announcements" href="/resident/building/announcements" className="mt-0 lg:mt-0">
            <div className="space-y-2.5">
              {ann.map((a) => (
                <Link key={a.id} href="/resident/building/announcements" className="block rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift">
                  <div className="flex items-center gap-2">
                    <Badge variant={a.category === "Maintenance" ? "warn" : a.category === "Poll" ? "violet" : a.category === "Event" ? "lime" : "muted"}>{a.category === "Poll" ? (a.poll?.formal ? "Formal vote" : "Poll") : a.category}</Badge>
                    {a.pinned && <Badge variant="outline">Pinned</Badge>}
                    <span className="ml-auto text-[11.5px] text-muted-foreground">{ago(a.at)}</span>
                  </div>
                  <div className="mt-2 font-semibold leading-snug">{a.title}</div>
                  <div className="mt-1 line-clamp-2 text-[13px] text-muted-foreground">{a.body}</div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Home activity">
            <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
              <div className="space-y-3.5">
                {staffIn.map((st) => (
                  <div key={st.id} className="flex items-center gap-3">
                    <Avatar src={st.photo} name={st.name} className="size-9" />
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{st.name} is inside</div><div className="text-xs text-muted-foreground">{st.role} · arrived {ago(st.log[0].in)}</div></div>
                    <LiveDot />
                  </div>
                ))}
                {s.notifications.filter((n) => !n.role || n.role === "resident").slice(0, 4).map((n) => (
                  <Link key={n.id} href={n.href ?? "/resident/notifications"} className="flex items-start gap-3">
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", n.read ? "bg-sand-300" : "bg-pine-500")} />
                    <div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{n.title}</div><div className="line-clamp-1 text-xs text-muted-foreground">{n.body}</div></div>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{ago(n.at)}</span>
                  </Link>
                ))}
              </div>
              <Button variant="soft" size="sm" className="mt-4 w-full" asChild><Link href="/resident/notifications">All notifications</Link></Button>
            </div>
          </Section>

          <Section title="Community">
            <Link href="/resident/building/announcements" className="group relative block h-44 overflow-hidden rounded-2xl shadow-soft">
              <Photo id={IMG.rooftop} w={700} className="absolute inset-0 transition duration-700 group-hover:scale-105" icon={Megaphone} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <Badge variant="lime">Saturday · 7 PM</Badge>
                <div className="mt-2 text-lg font-semibold leading-tight">Community Iftar & Family Night</div>
                <div className="text-[12.5px] text-white/70">Rooftop terrace · 86 neighbours going</div>
              </div>
            </Link>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Link href="/resident/building/amenities" className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift">
                <Building2 className="size-5 text-pine-600" />
                <div className="mt-2 text-sm font-semibold">Book amenities</div>
                <div className="text-xs text-muted-foreground">Pool, gym, hall</div>
              </Link>
              <Link href="/resident/parking" className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift">
                <CircleParking className="size-5 text-pine-600" />
                <div className="mt-2 text-sm font-semibold">Guest parking</div>
                <div className="text-xs text-muted-foreground">4 bays to rent</div>
              </Link>
              <Link href="/resident/ev" className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift">
                <BatteryCharging className="size-5 text-pine-600" />
                <div className="mt-2 text-sm font-semibold">EV chargers</div>
                <div className="text-xs text-muted-foreground">2 free at P1</div>
              </Link>
              <Link href="/resident/building/staff" className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift">
                <Bike className="size-5 text-pine-600" />
                <div className="mt-2 text-sm font-semibold">Staff access</div>
                <div className="text-xs text-muted-foreground">{s.staff.filter((x) => x.status === "active").length} active passes</div>
              </Link>
            </div>
          </Section>
        </aside>
      </div>

      {dueBill && (
        <PaySheet
          open={payOpen}
          onOpenChange={setPayOpen}
          amount={due}
          title={`Maintenance · ${dueBill.month} · ${s.apartment}`}
          lines={dueBill.items}
          onPaid={(m) => s.payBill(dueBill.id, m)}
        />
      )}
    </div>
  );
}
