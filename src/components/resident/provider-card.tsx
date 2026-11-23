"use client";
import Link from "next/link";
import { BadgeCheck, Clock, Heart, Wrench } from "lucide-react";
import type { Provider } from "@/data/catalog";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { Avatar } from "@/components/ui/misc";
import { Photo } from "@/components/shared/photo";
import { Stars } from "@/components/shared/kit";

export const priceFrom = (p: Provider) => { const ps = p.services.filter((x) => x.price > 0).map((x) => x.price); return ps.length ? Math.min(...ps) : 0; };

export function ProviderCard({ p }: { p: Provider }) {
  const saved = useDemo((s) => s.savedProviders.includes(p.id));
  const toggle = useDemo((s) => s.toggleSaved);
  return (
    <Link href={`/resident/explore/provider/${p.id}`} className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <Photo id={p.cover} w={600} className="aspect-[16/9]" icon={Wrench}>
        <button onClick={(e) => { e.preventDefault(); toggle(p.id); }} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-105" aria-label="Save">
          <Heart className={cn("size-[18px]", saved ? "fill-rose-500 text-rose-500" : "text-foreground/70")} />
        </button>
        {p.eta && <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-pine-900 backdrop-blur"><Clock className="size-3" /> {p.eta}</span>}
      </Photo>
      <div className="flex gap-3 p-4">
        <Avatar src={p.photo} name={p.name} className="-mt-9 size-12 ring-4 ring-card" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5"><span className="truncate font-semibold">{p.name}</span>{p.verified && <BadgeCheck className="size-4 shrink-0 text-pine-600" />}</div>
          <div className="truncate text-[12.5px] text-muted-foreground">{p.tagline}</div>
          <div className="mt-2 flex items-center gap-2 text-[12.5px]"><Stars value={p.rating} /><span className="text-muted-foreground">({p.reviews.toLocaleString()}) · {p.jobs.toLocaleString()} jobs</span></div>
        </div>
        <div className="text-right"><div className="text-[11px] text-muted-foreground">from</div><div className="text-sm font-semibold">{priceFrom(p) ? pkr(priceFrom(p)) : "Quote"}</div></div>
      </div>
    </Link>
  );
}
