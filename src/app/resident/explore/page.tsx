"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Sparkles, TrendingUp } from "lucide-react";
import { CATEGORIES, CANDIDATES, PROVIDERS, catHref } from "@/data/catalog";
import { OFFERS } from "@/data/places";
import { IMG } from "@/lib/img";
import { cn, pkr } from "@/lib/utils";
import { Avatar } from "@/components/ui/misc";
import { PageHeader, SearchBar, Section, Stars } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { BellButton } from "@/components/resident/shell";
import { ProviderCard } from "@/components/resident/provider-card";

export default function Explore() {
  const [q, setQ] = React.useState("");
  const ql = q.toLowerCase();
  const results = q.length > 1 ? {
    cats: CATEGORIES.filter((c) => c.title.toLowerCase().includes(ql) || c.subs.some((s) => s.toLowerCase().includes(ql))),
    pros: PROVIDERS.filter((p) => [p.name, p.tagline, ...p.tags, ...p.services.map((s) => s.name)].join(" ").toLowerCase().includes(ql)),
    staff: CANDIDATES.filter((c) => [c.name, c.role, ...c.roles, ...c.skills].join(" ").toLowerCase().includes(ql)),
  } : null;

  return (
    <div>
      <PageHeader title="Explore" subtitle="Everything your home needs, from people your neighbours trust" actions={<BellButton />} />
      <SearchBar value={q} onChange={setQ} placeholder="Search “AC service”, “cook”, “yoga”, “biryani”…" />

      {results ? (
        <div className="mt-5 space-y-6">
          {results.cats.length > 0 && <div className="flex flex-wrap gap-2">{results.cats.map((c) => <Link key={c.slug} href={catHref(c)} className="flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium"><c.icon className="size-4 text-pine-600" />{c.title}</Link>)}</div>}
          {results.staff.length > 0 && (
            <Section title={`Household staff (${results.staff.length})`}>
              <div className="grid gap-2 sm:grid-cols-2">{results.staff.map((c) => <Link key={c.id} href={`/resident/explore/household-help/${c.id}`} className="flex items-center gap-3 rounded-2xl border bg-card p-3"><Avatar src={c.photo} name={c.name} /><div className="flex-1"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.role} · {c.experience} yrs</div></div><Stars value={c.rating} /></Link>)}</div>
            </Section>
          )}
          <Section title={`Providers (${results.pros.length})`}><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{results.pros.map((p) => <ProviderCard key={p.id} p={p} />)}</div></Section>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-4 gap-x-2 gap-y-4 sm:grid-cols-7">
            {CATEGORIES.map((c) => (
              <Link key={c.slug} href={catHref(c)} className="group flex flex-col items-center gap-2">
                <Photo id={c.image} w={240} className="size-[68px] rounded-[22px] shadow-soft transition group-hover:scale-105 sm:size-20" icon={c.icon}>
                  <div className="absolute inset-0 bg-pine-950/30" />
                  <c.icon className="absolute bottom-2 right-2 size-4 text-white" />
                </Photo>
                <span className="text-center text-[11.5px] font-medium leading-tight">{c.short}</span>
              </Link>
            ))}
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-2">
            <Link href="/resident/explore/household-help" className="group relative h-52 overflow-hidden rounded-3xl">
              <Photo id={IMG.maid} w={900} className="absolute inset-0 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-pine-950/90 via-pine-950/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-6 text-white">
                <span className="flex w-fit items-center gap-1 rounded-full bg-lime-accent px-2.5 py-0.5 text-[11px] font-semibold text-pine-950"><BadgeCheck className="size-3" /> CNIC & police verified</span>
                <div className="mt-2 max-w-xs text-2xl font-semibold leading-tight">Hire trusted household help</div>
                <div className="mt-1 flex items-center gap-1 text-sm text-white/75">Maids, cooks, drivers, nannies & caregivers <ArrowRight className="size-4" /></div>
              </div>
            </Link>
            <Link href="/resident/explore/painting" className="group relative h-52 overflow-hidden rounded-3xl">
              <Photo id={IMG.painting} w={900} className="absolute inset-0 transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b2a1d]/90 via-[#3b2a1d]/50 to-transparent" />
              <div className="relative flex h-full flex-col justify-end p-6 text-white">
                <span className="w-fit rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur">Instant estimate</span>
                <div className="mt-2 max-w-xs text-2xl font-semibold leading-tight">Repaint your apartment before winter</div>
                <div className="mt-1 flex items-center gap-1 text-sm text-white/75">Quotes from photos in 2 hours <ArrowRight className="size-4" /></div>
              </div>
            </Link>
          </div>

          <Section title="Most booked in Ocean Heights" subtitle="This month" action={<span className="flex items-center gap-1 text-xs text-muted-foreground"><TrendingUp className="size-3.5" /> Updated daily</span>}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{PROVIDERS.filter((p) => ["pv-cooltech", "pv-saleem", "pv-safaipro", "pv-sparkwash", "pv-aqua", "pv-farhan"].includes(p.id)).map((p) => <ProviderCard key={p.id} p={p} />)}</div>
          </Section>

          <Section title="Lifestyle at home">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {CATEGORIES.filter((c) => ["salon", "fitness", "plants", "laundry"].includes(c.slug)).map((c) => (
                <Link key={c.slug} href={catHref(c)} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
                  <Photo id={c.image} w={500} className="absolute inset-0 transition duration-700 group-hover:scale-105" icon={c.icon} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white"><div className="font-semibold">{c.title}</div><div className="text-xs text-white/70">{c.blurb}</div></div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Neighbourhood" >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.filter((c) => ["food", "marketplace", "parking", "offers", "ev"].includes(c.slug)).slice(0, 4).map((c, i) => (
                <Link key={c.slug} href={catHref(c)} className={cn("flex items-center gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:shadow-lift")}>
                  <span className={cn("grid size-12 place-items-center rounded-2xl", ["bg-rose-50 text-rose-700", "bg-amber-soft text-amber-700", "bg-sky-50 text-sky-700", "bg-lime-soft text-pine-800"][i])}><c.icon className="size-6" /></span>
                  <div className="min-w-0"><div className="font-semibold">{c.title}</div><div className="truncate text-xs text-muted-foreground">{c.blurb}</div></div>
                </Link>
              ))}
            </div>
          </Section>

          <Section title="Today's deals" href="/resident/offers">
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              {OFFERS.slice(0, 6).map((o) => (
                <Link key={o.id} href="/resident/offers" className="w-[200px] shrink-0 overflow-hidden rounded-2xl border bg-card shadow-soft">
                  <Photo id={o.image} w={400} className="aspect-[16/10]" icon={Sparkles}><span className="absolute left-2 top-2 rounded-full bg-lime-accent px-2 py-0.5 text-[11px] font-bold text-pine-950">{o.discount}</span></Photo>
                  <div className="p-3"><div className="truncate text-sm font-semibold">{o.business}</div><div className="truncate text-xs text-muted-foreground">{o.title}</div></div>
                </Link>
              ))}
            </div>
          </Section>
          <p className="mt-8 text-center text-xs text-muted-foreground">All providers are verified by NESTORA. Prices start from {pkr(600)}.</p>
        </>
      )}
    </div>
  );
}
