"use client";
import * as React from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, Baby, Briefcase, Clock, Heart, Languages, MapPin, MessageCircle, Phone, ShieldCheck, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { getProvider, type Service } from "@/data/catalog";
import { face } from "@/lib/img";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { PageHeader, Section, Stars } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { BookingSheet } from "@/components/resident/booking-sheet";
import { QuoteSheet } from "@/components/resident/quote-sheet";

const REVIEWS = [
  { n: "Mariam K.", a: "B-0904", p: face("w2"), r: 5, t: "Very professional and on time. Covered the furniture and cleaned up after. Will book again." },
  { n: "Hassan J.", a: "C-1503", p: face("m6"), r: 5, t: "Explained everything clearly, fair pricing. Guard had their pass ready so no waiting at the gate." },
  { n: "Rabia S.", a: "A-0601", p: face("w6"), r: 4, t: "Good work. Arrived 15 minutes late but informed in advance." },
];

export default function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const p = getProvider(id);
  const saved = useDemo((s) => s.savedProviders.includes(id));
  const toggle = useDemo((s) => s.toggleSaved);
  const [svc, setSvc] = React.useState<Service | null>(null);
  const [quote, setQuote] = React.useState<Service | null>(null);
  if (!p) return notFound();
  const subs = Array.from(new Set(p.services.map((s) => s.sub ?? "Services")));

  return (
    <div>
      <PageHeader back title={p.name} subtitle={p.tagline} large={false} actions={<Button variant="outline" size="icon" onClick={() => { toggle(p.id); toast(saved ? "Removed from saved" : "Saved to your providers"); }}><Heart className={cn(saved && "fill-rose-500 text-rose-500")} /></Button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="min-w-0">
          <Photo id={p.cover} w={1400} className="h-52 rounded-3xl sm:h-72" />
          <div className="flex items-end gap-4 px-4">
            <Avatar src={p.photo} name={p.name} className="-mt-10 size-20 shrink-0 ring-4 ring-background" />
            <div className="pt-3">
              <div className="flex items-center gap-1.5 text-xl font-semibold">{p.name} {p.verified && <BadgeCheck className="size-5 text-pine-600" />}</div>
              <div className="text-sm text-muted-foreground">{p.person ? `${p.person} · ` : ""}{p.area}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[[<Star key="s" className="size-4 fill-amber-400 text-amber-400" />, p.rating.toFixed(1), `${p.reviews.toLocaleString()} reviews`], [<Briefcase key="b" className="size-4" />, p.jobs.toLocaleString(), "jobs done"], [<Award key="a" className="size-4" />, p.experience, "experience"], [<Clock key="c" className="size-4" />, p.eta ?? "Flexible", "next slot"]].map(([i, v, l], k) => (
              <div key={k} className="rounded-2xl border border-border/70 bg-card p-3 text-center shadow-soft"><div className="flex items-center justify-center gap-1 text-[15px] font-semibold">{i}{v}</div><div className="text-[11px] text-muted-foreground">{l as string}</div></div>
            ))}
          </div>
          <p className="mt-5 text-[15px] leading-relaxed text-foreground/80">{p.about}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Badge variant="muted"><Languages /> {p.languages.join(", ")}</Badge>
            <Badge variant="muted"><MapPin /> {p.area}</Badge>
            {p.modes?.map((m) => <Badge key={m} variant="outline">{m}</Badge>)}
            {p.ageGroups && <Badge variant="info"><Users /> {p.ageGroups.join(" · ")}</Badge>}
          </div>

          {p.qualifications && (
            <Section title="Qualifications & certifications">
              <div className="grid gap-2 sm:grid-cols-2">{p.qualifications.map((q) => <div key={q} className="flex items-center gap-2.5 rounded-xl border bg-card px-3.5 py-3 text-sm"><Award className="size-4 text-pine-600" />{q}</div>)}</div>
              {p.kids && <div className="mt-3 flex items-start gap-2.5 rounded-2xl bg-sky-50 p-4 text-[13px] text-sky-950"><Baby className="mt-0.5 size-4 shrink-0" /> Children's safeguarding: background-checked coach, guardian consent at booking, sessions only in supervised building facilities, guardians welcome to attend.</div>}
            </Section>
          )}

          {subs.map((sub) => (
            <Section key={sub} title={sub}>
              <div className="divide-y divide-border/60 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
                {p.services.filter((s) => (s.sub ?? "Services") === sub).map((s) => (
                  <div key={s.name} className="flex items-center gap-3 px-4 py-3.5">
                    <div className="min-w-0 flex-1"><div className="text-[14.5px] font-medium">{s.name}</div><div className="text-[12.5px] text-muted-foreground">{s.duration ? `${s.duration} · ` : ""}{s.quote ? "Price after inspection or photos" : "Fixed price · pay after service"}</div></div>
                    <div className="text-right text-sm font-semibold">{s.quote ? "Quote" : pkr(s.price)}</div>
                    {s.quote ? <Button size="sm" variant="outline" onClick={() => setQuote(s)}>Get quote</Button> : <Button size="sm" onClick={() => setSvc(s)}>Book</Button>}
                  </div>
                ))}
              </div>
            </Section>
          ))}

          {p.portfolio && (
            <Section title="Portfolio">
              <div className="grid grid-cols-3 gap-2">{p.portfolio.map((i, k) => <Photo key={k} id={i} w={500} className="aspect-square rounded-2xl" />)}</div>
            </Section>
          )}

          <Section title="Reviews from residents" action={<Stars value={p.rating} className="text-sm" />}>
            <div className="space-y-3">{REVIEWS.map((r) => (
              <div key={r.n} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                <div className="flex items-center gap-3"><Avatar src={r.p} name={r.n} className="size-9" /><div className="flex-1"><div className="text-sm font-medium">{r.n}</div><div className="text-xs text-muted-foreground">{r.a} · Ocean Heights</div></div><div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("size-3.5", i < r.r ? "fill-amber-400 text-amber-400" : "text-sand-300")} />)}</div></div>
                <p className="mt-2 text-sm text-foreground/80">{r.t}</p>
              </div>
            ))}</div>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
            <div className="text-sm text-muted-foreground">Starting from</div>
            <div className="text-3xl font-semibold tracking-tight">{pkr(Math.min(...p.services.filter((s) => s.price).map((s) => s.price)))}</div>
            <Button size="lg" className="mt-4 w-full" onClick={() => { const s = p.services.find((x) => !x.quote); if (s) setSvc(s); else setQuote(p.services[0]); }}>Book now</Button>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" asChild><a href="tel:+923001234567"><Phone /> Call</a></Button>
              <Button variant="outline" onClick={() => toast.success("Message sent", { description: `${p.name} usually replies within 10 min.` })}><MessageCircle /> Chat</Button>
            </div>
            <div className="mt-4 space-y-2 border-t pt-4 text-[13px] text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-pine-600" /> CNIC & police verified by NESTORA</div>
              <div className="flex items-center gap-2"><BadgeCheck className="size-4 text-pine-600" /> Gate pass issued automatically</div>
              <div className="flex items-center gap-2"><Clock className="size-4 text-pine-600" /> Free rescheduling up to 2 h before</div>
            </div>
          </div>
        </aside>
      </div>
      <BookingSheet provider={p} service={svc} open={!!svc} onOpenChange={(o) => !o && setSvc(null)} />
      <QuoteSheet open={!!quote} onOpenChange={(o) => !o && setQuote(null)} category={p.category} service={quote?.name ?? ""} preferred={p} />
    </div>
  );
}
