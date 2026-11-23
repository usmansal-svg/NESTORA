"use client";
import * as React from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { SlidersHorizontal, Baby } from "lucide-react";
import { CATEGORIES, providersFor } from "@/data/catalog";
import { useQuery } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Chips, Empty, PageHeader } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { ProviderCard, priceFrom } from "@/components/resident/provider-card";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const cat = CATEGORIES.find((c) => c.slug === slug);
  const qsub = useQuery("sub");
  const [sub, setSub] = React.useState("All");
  const [sort, setSort] = React.useState<"rating" | "price" | "jobs">("rating");
  const [verified, setVerified] = React.useState(false);
  const [kids, setKids] = React.useState(false);
  React.useEffect(() => { if (qsub) setSub(qsub); }, [qsub]);
  if (!cat) return notFound();
  let list = providersFor(slug).filter((p) => sub === "All" || p.tags.includes(sub) || p.services.some((s) => s.sub === sub));
  if (verified) list = list.filter((p) => p.rating >= 4.8);
  if (kids) list = list.filter((p) => p.kids);
  list = [...list].sort((a, b) => (sort === "rating" ? b.rating - a.rating : sort === "price" ? priceFrom(a) - priceFrom(b) : b.jobs - a.jobs));

  return (
    <div>
      <PageHeader back="/resident/explore" title={cat.title} subtitle={cat.blurb} />
      <div className="relative mb-5 h-36 overflow-hidden rounded-3xl sm:h-44">
        <Photo id={cat.image} w={1400} className="absolute inset-0" icon={cat.icon} />
        <div className="absolute inset-0 bg-gradient-to-r from-pine-950/85 to-transparent" />
        <div className="absolute inset-y-0 left-0 flex flex-col justify-center p-6 text-white"><cat.icon className="size-7 text-lime-accent" /><div className="mt-2 max-w-sm text-xl font-semibold leading-tight">{providersFor(slug).length} verified pros serving Ocean Heights</div><div className="text-sm text-white/70">Background-checked · Gate pass issued automatically</div></div>
      </div>
      {cat.subs.length > 0 && <Chips value={sub} onChange={setSub} options={["All", ...cat.subs].map((s) => ({ value: s, label: s }))} />}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[13px]">
        <SlidersHorizontal className="size-4 text-muted-foreground" />
        {(["rating", "price", "jobs"] as const).map((s) => <button key={s} onClick={() => setSort(s)} className={cn("rounded-lg px-2.5 py-1", sort === s ? "bg-secondary font-medium" : "text-muted-foreground")}>{s === "rating" ? "Top rated" : s === "price" ? "Lowest price" : "Most booked"}</button>)}
        <button onClick={() => setVerified(!verified)} className={cn("rounded-lg border px-2.5 py-1", verified && "border-pine-600 bg-pine-50 text-pine-800")}>4.8★ +</button>
        {slug === "fitness" && <button onClick={() => setKids(!kids)} className={cn("flex items-center gap-1 rounded-lg border px-2.5 py-1", kids && "border-pine-600 bg-pine-50 text-pine-800")}><Baby className="size-3.5" /> Kids' classes</button>}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.length ? list.map((p) => <ProviderCard key={p.id} p={p} />) : <div className="sm:col-span-2 lg:col-span-3"><Empty icon={cat.icon} title="No providers match" body="Try another filter — new providers join every week." /></div>}
      </div>
    </div>
  );
}
