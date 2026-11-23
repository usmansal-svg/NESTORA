"use client";
import * as React from "react";
import { Brush, Droplets, Home, Layers, PaintRoller, Ruler, Wallpaper, Hammer, Paintbrush } from "lucide-react";
import { CATEGORIES, providersFor } from "@/data/catalog";
import { IMG } from "@/lib/img";
import { Button } from "@/components/ui/button";
import { PageHeader, Section } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { ProviderCard } from "@/components/resident/provider-card";
import { QuoteSheet } from "@/components/resident/quote-sheet";

const ICONS = [Home, PaintRoller, Paintbrush, Brush, Droplets, Wallpaper, Hammer, Layers];

export default function PaintingPage() {
  const cat = CATEGORIES.find((c) => c.slug === "painting")!;
  const [svc, setSvc] = React.useState<string | null>(null);
  return (
    <div>
      <PageHeader back="/resident/explore" title="Painting & renovation" subtitle="Quotes from apartment size and photos" />
      <div className="relative overflow-hidden rounded-3xl">
        <Photo id={IMG.painting} w={1400} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2b1f15]/95 via-[#2b1f15]/70 to-transparent" />
        <div className="relative max-w-lg p-6 text-white sm:p-8">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">Instant estimate</div>
          <div className="mt-2 font-display text-4xl leading-tight">A fresh home in <i>4 days</i></div>
          <p className="mt-2 text-sm text-white/75">Your A-1204 floor plan (2,150 sq ft) is on file. Upload a few photos and compare quotes from verified painters — renovation permit requested from management automatically.</p>
          <Button variant="accent" size="lg" className="mt-5" onClick={() => setSvc("Full apartment painting")}><Ruler /> Estimate my apartment</Button>
        </div>
      </div>
      <Section title="What do you need?">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cat.subs.map((s, i) => { const I = ICONS[i % ICONS.length]; return (
            <button key={s} onClick={() => setSvc(s)} className="flex flex-col items-start gap-3 rounded-2xl border border-border/70 bg-card p-4 text-left shadow-soft transition hover:shadow-lift"><span className="grid size-10 place-items-center rounded-xl bg-amber-soft text-amber-700"><I className="size-5" /></span><span className="text-sm font-semibold leading-tight">{s}</span></button>
          ); })}
        </div>
      </Section>
      <Section title="Top painters"><div className="grid gap-4 sm:grid-cols-2">{providersFor("painting").map((p) => <ProviderCard key={p.id} p={p} />)}</div></Section>
      <QuoteSheet open={!!svc} onOpenChange={(o) => !o && setSvc(null)} category="painting" service={svc ?? ""} />
    </div>
  );
}
