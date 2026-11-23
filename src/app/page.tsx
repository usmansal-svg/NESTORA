"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ROLES } from "@/lib/roles";
import { IMG } from "@/lib/img";
import { Logo } from "@/components/shared/logo";
import { Photo } from "@/components/shared/photo";
import { Button } from "@/components/ui/button";
import { ThemeToggle, useBrand } from "@/components/shared/brand";

const JOURNEYS = [
  ["Register a visitor and approve entry", "/resident/building/visitors?new=1"],
  ["Hire a maid", "/resident/explore/household-help"],
  ["Book an electrician", "/resident/explore/provider/pv-farhan"],
  ["Book a barber", "/resident/explore/provider/pv-saleem"],
  ["Hire a gardener", "/resident/explore/provider/pv-greenthumb"],
  ["Purchase a plant", "/resident/explore/plants"],
  ["Book a swimming class", "/resident/explore/provider/pv-aqua"],
  ["Order food", "/resident/food"],
  ["Reserve parking", "/resident/parking"],
  ["Book an EV charger", "/resident/ev"],
  ["Deposit a courier parcel", "/courier"],
  ["Receive a locker PIN", "/resident/building/parcels"],
  ["Collect a parcel", "/locker"],
  ["Pay maintenance", "/resident/building/payments"],
  ["Raise and resolve a complaint", "/resident/building/complaints?new=1"],
];

export default function DemoHome() {
  const brand = useBrand();
  const emaar = brand.theme === "emaar";
  return (
    <div className="min-h-dvh bg-background">
      <section className="relative overflow-hidden bg-pine-950 text-white">
        {emaar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brand.hero!} alt="Emaar Oceanfront, Karachi" className="absolute inset-0 size-full object-cover opacity-60" />
        ) : (
          <Photo id={IMG.skyline} w={1800} className="absolute inset-0 opacity-30" imgClassName="mix-blend-luminosity" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-pine-950/40 via-pine-950/80 to-pine-950" />
        <div className="absolute left-1/2 top-0 size-[600px] -translate-x-1/2 rounded-full bg-pine-500/20 blur-[120px]" />
        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-6 sm:px-8 lg:pb-24">
          <div className="flex items-center justify-between">
            <Logo inverted />
            <div className="flex items-center gap-2">
            <ThemeToggle dark className="hidden sm:inline-flex" />
            <Button variant="accent" size="sm" asChild><Link href="/resident">Open resident app <ArrowRight /></Link></Button>
            </div>
          </div>
          <ThemeToggle dark className="mt-4 sm:hidden" />
          <div className="mt-16 max-w-3xl lg:mt-24">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 ring-1 ring-white/15">
              <span className="size-1.5 rounded-full bg-lime-accent" /> {emaar ? "Prepared for Emaar Pakistan · Emaar Oceanfront, Karachi" : "Interactive product demo · Ocean Heights, DHA Karachi"}
            </div>
            <h1 className="mt-5 font-display text-[44px] leading-[1.02] tracking-tight sm:text-[64px] lg:text-[76px]">
              {emaar ? <>Life at Emaar Oceanfront.<br /><span className="italic text-lime-accent">Everything connected.</span></> : <>Your community.<br /><span className="italic text-lime-accent">Everything connected.</span></>}
            </h1>
            <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/70 sm:text-lg">
              {emaar ? "One app for every Emaar Oceanfront resident and every team that serves them: community management, security, smart parcel lockers, home services, dining and EV charging, in Emaar's standard of service." : "NESTORA is the operating system for residential communities — connecting residents, management, security, couriers, smart lockers, service providers and local businesses in one platform."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="accent" size="lg" asChild><Link href="/resident">Start as Ahmed, A-1204 <ArrowRight /></Link></Button>
              <Button size="lg" className="bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15" asChild><Link href="/admin">Management portal</Link></Button>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 text-sm sm:grid-cols-4">
            {(emaar ? [["4", "Oceanfront towers in demo"], ["72", "smart locker compartments"], ["40+", "home & lifestyle services"], ["9", "connected experiences"]] : [["264", "apartments in demo"], ["72", "smart locker compartments"], ["40+", "service categories"], ["9", "connected experiences"]]).map(([a, b]) => (
              <div key={b}><div className="text-3xl font-semibold tracking-tight">{a}</div><div className="text-white/55">{b}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pine-600">Demo roles</div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Step into any seat in the building</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">Every role shares the same live data. Open the resident app and the guard app in two tabs to watch approvals, parcels and complaints flow between them.</p>
          </div>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((r) => (
            <Link key={r.id} href={r.href} className="group relative flex flex-col rounded-3xl border border-border/80 bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-pine-50 text-pine-700 transition group-hover:bg-primary group-hover:text-lime-accent"><r.icon className="size-6" strokeWidth={1.8} /></span>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{r.surface}</span>
              </div>
              <div className="mt-5 text-lg font-semibold tracking-tight">{r.label}</div>
              <div className="text-sm text-muted-foreground">{r.person}</div>
              <p className="mt-3 text-[13.5px] text-foreground/75">{r.blurb}</p>
              <ArrowUpRight className="absolute right-5 top-[88px] size-5 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-8">
        <div className="grid gap-8 rounded-[32px] bg-card p-6 shadow-soft ring-1 ring-border/70 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-pine-600">Guided journeys</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">15 end-to-end demo flows</h2>
            <p className="mt-2 text-muted-foreground">Each journey is fully interactive with simulated services, notifications and cross-role updates.</p>
            <p className="mt-6 rounded-2xl bg-pine-50 p-4 text-sm text-pine-900">
              <b>Tip:</b> The <span className="rounded-full bg-pine-950 px-2 py-0.5 text-xs text-white">Demo as…</span> button in the corner of every screen switches roles instantly.
            </p>
          </div>
          <ol className="grid gap-2 sm:grid-cols-2">
            {JOURNEYS.map(([j, href], i) => (
              <li key={j}>
                <Link href={href} className="flex items-center gap-3 rounded-2xl border border-border/70 px-3.5 py-3 text-sm font-medium transition hover:border-pine-300 hover:bg-pine-50/50">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-xs font-semibold text-muted-foreground">{i + 1}</span>
                  {j}
                  <Check className="ml-auto size-4 text-pine-500" />
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">Prototype with simulated data. No real payments, access control or hardware is operated.</p>
      </section>
    </div>
  );
}
