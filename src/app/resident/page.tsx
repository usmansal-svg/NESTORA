"use client";
import * as React from "react";
import Link from "next/link";
import {
  BatteryCharging, Bike, Building2, CalendarCheck, ChevronRight, CircleParking, Droplets, Megaphone,
  Package, Receipt, ShieldCheck, Siren, Sparkles, UserPlus, Users, UtensilsCrossed, Wrench, Zap,
  LayoutGrid, Copy, MapPin, Send, Phone, Type,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { APARTMENTS, RESIDENT } from "@/data/seed";
import { PROVIDERS } from "@/data/catalog";
import { OFFERS, SELLERS } from "@/data/places";
import { IMG } from "@/lib/img";
import { ago, cn, fmtDateTime, pkr } from "@/lib/utils";
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

// The four everyday tasks, as big bilingual tiles. Pay and parcels surface above them when they need attention.
const EASY = [
  { en: "Let a guest in", ur: "مہمان کا اندراج", icon: UserPlus, href: "/resident/building/visitors?new=1", solid: "bg-pine-800" },
  { en: "Report a problem", ur: "شکایت درج کریں", icon: Wrench, href: "/resident/building/complaints?new=1", solid: "bg-pine-700" },
  { en: "House help", ur: "گھریلو ملازم", icon: Users, href: "/resident/explore/household-help", solid: "bg-pine-700" },
  { en: "Call security", ur: "سیکیورٹی", icon: ShieldCheck, href: "/resident/building/security", solid: "bg-pine-800" },
];

function Urdu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span dir="rtl" lang="ur" className={cn("font-urdu leading-[1.9]", className)}>{children}</span>;
}

export default function ResidentHome() {
  const s = useDemo();
  const live = useLiveUtilities();
  const [payOpen, setPayOpen] = React.useState(false);
  const [ask, setAsk] = React.useState("");
  const [big, setBig] = React.useState(false);
  React.useEffect(() => { try { setBig(localStorage.getItem("nestora-big-text") === "1"); } catch {} }, []);
  const toggleBig = () => setBig((b) => { try { localStorage.setItem("nestora-big-text", b ? "0" : "1"); } catch {} return !b; });
  const apt = APARTMENTS.find((a) => a.id === s.apartment)!;
  const pending = s.visitors.filter((v) => v.status === "pending" && v.apt === "A-1204");
  const expected = s.visitors.filter((v) => v.apt === "A-1204" && ["expected", "approved"].includes(v.status)).slice(0, 3);
  const dueBill = s.bills.find((b) => b.status !== "paid");
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
      <section className="relative -mx-4 overflow-hidden bg-pine-900 px-4 pb-6 pt-4 text-white sm:mx-0 sm:rounded-[28px] sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
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
          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className={cn("font-display leading-[1.05] tracking-tight", big ? "text-[40px] sm:text-[46px]" : "text-[34px] sm:text-[42px]")}>
                {greeting()}, <span className="italic text-lime-accent">{RESIDENT.first}</span>
              </h1>
              <p className={cn("mt-1.5 flex items-center gap-1.5 text-white/65", big ? "text-[16px]" : "text-[13px]")}><MapPin className="size-3.5 shrink-0" /> {apt.building}, Tower {apt.tower} · Apt {apt.unit}</p>
            </div>
            <button onClick={toggleBig} aria-pressed={big} className={cn("flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2.5 text-[15px] font-semibold ring-1 transition", big ? "bg-lime-accent text-pine-950 ring-lime-accent" : "bg-white/10 text-white ring-white/20")}>
              <Type className="size-5" /> {big ? "Normal" : "Bigger"}
            </button>
          </div>
          {notices.map((n) => (
            <Link key={n.text} href="/resident/building/utilities" className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-3.5 py-2.5 text-[14px] ring-1 ring-white/10 backdrop-blur">
              <n.icon className="size-4 shrink-0 text-amber-300" />
              <span className="min-w-0 flex-1">{n.text}</span>
              <ChevronRight className="size-4 shrink-0 text-white/50" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px] lg:gap-7">
        <div className="min-w-0">
          {/* Needs your attention — only what affects this home right now */}
          {(pending.length > 0 || dueBill || parcels.length > 0) && (
            <>
              <h2 className={cn("font-semibold tracking-tight", big ? "text-[23px]" : "text-[20px]")}>Needs your attention <Urdu className={cn("ml-1 font-normal text-muted-foreground", big ? "text-[19px]" : "text-[16px]")}>توجہ طلب</Urdu></h2>
              <div className="mt-3 space-y-3">
                {pending.map((v) => <VisitorApprovalCard key={v.id} v={v} />)}
                {dueBill && (
                  <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-lime-soft text-pine-800"><Receipt className="size-7" strokeWidth={1.9} /></span>
                    <div className="min-w-0 flex-1">
                      <div className={cn("font-semibold tabular", big ? "text-[20px]" : "text-[17px]")}>Bill {pkr(due)}</div>
                      <div className={cn("text-muted-foreground", big ? "text-[17px]" : "text-[15px]")}>Please pay by 30 Nov</div>
                      <Link href="/resident/building/payments" className="text-[13px] font-medium text-pine-700 underline-offset-2 hover:underline">See statement</Link>
                    </div>
                    <Button size="lg" className="h-12 rounded-xl px-5 text-[17px]" onClick={() => setPayOpen(true)}>Pay</Button>
                  </div>
                )}
                {parcels.length > 0 && (
                  <Link href="/resident/building/parcels" className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-pine-800 to-pine-950 p-4 text-white shadow-soft">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-lime-accent"><Package className="size-7" strokeWidth={1.9} /></span>
                    <div className="min-w-0 flex-1">
                      <div className={cn("font-semibold", big ? "text-[20px]" : "text-[17px]")}>{parcels.length} parcel{parcels.length > 1 ? "s" : ""} waiting</div>
                      <div className={cn("text-white/65", big ? "text-[17px]" : "text-[15px]")}>Tap to see your code</div>
                    </div>
                    <span className="rounded-xl bg-lime-accent px-5 py-3 text-[17px] font-semibold text-pine-950">Open</span>
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Big, simple actions */}
          <h2 className={cn("mt-7 font-semibold tracking-tight", big ? "text-[23px]" : "text-[20px]")}>I want to… <Urdu className={cn("ml-1 font-normal text-muted-foreground", big ? "text-[19px]" : "text-[16px]")}>میں چاہتا ہوں</Urdu></h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {EASY.map((a) => (
              <Link key={a.en} href={a.href} className={cn("flex flex-col items-center justify-center gap-1.5 rounded-2xl p-4 text-center text-white shadow-soft transition active:scale-[0.97]", a.solid, big ? "min-h-[176px]" : "min-h-[156px]")}>
                <a.icon className={cn("text-lime-accent", big ? "size-12" : "size-11")} strokeWidth={1.9} />
                <span className={cn("mt-1 font-semibold leading-tight", big ? "text-[21px]" : "text-[18px]")}>{a.en}</span>
                <Urdu className={cn("text-white/75", big ? "text-[19px]" : "text-[16px]")}>{a.ur}</Urdu>
              </Link>
            ))}
          </div>
          <Link href="/resident/explore" className={cn("mt-3 flex items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card font-semibold text-pine-800 shadow-soft transition active:scale-[0.98]", big ? "min-h-[80px] text-[21px]" : "min-h-[72px] text-[18px]")}>
            <LayoutGrid className="size-6 text-pine-600" /> Everything else · <Urdu className={cn("font-normal", big ? "text-[19px]" : "text-[16px]")}>باقی سب</Urdu>
          </Link>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SosButton trigger={
              <button className={cn("flex w-full items-center justify-center gap-3 rounded-2xl bg-danger font-semibold text-white shadow-lift active:scale-[0.98]", big ? "min-h-[84px] text-[21px]" : "min-h-[76px] text-[19px]")}>
                <Siren className="size-7" strokeWidth={2.2} /> SOS <Urdu className="text-[16px] font-normal text-white/85">ایمرجنسی</Urdu>
              </button>
            } />
            <button onClick={() => toast("Calling the guard desk", { description: "Demo only. No call is placed." })} className={cn("flex items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card font-semibold text-pine-800 shadow-soft active:scale-[0.98]", big ? "min-h-[84px] text-[21px]" : "min-h-[76px] text-[19px]")}>
              <Phone className="size-6 text-pine-600" /> Guard desk
            </button>
          </div>

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
