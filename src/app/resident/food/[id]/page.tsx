"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { BadgeCheck, Bike, Clock, Leaf, MapPin, Plus, Store, Minus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { getSeller } from "@/data/places";
import { useDemo } from "@/lib/store";
import { pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { PageHeader, Section, Stars } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { CartBar } from "@/components/resident/cart-bar";

export default function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const x = getSeller(id);
  const s = useDemo();
  if (!x) return notFound();
  const qty = (mid: string) => s.cart.find((c) => c.id === `${x.id}-${mid}`)?.qty ?? 0;
  const add = (m: (typeof x.menu)[number]) => {
    if (s.cart.length && s.cart[0].sellerId !== x.id) toast("Started a new cart", { description: "Orders are placed with one seller at a time." });
    s.addToCart({ id: `${x.id}-${m.id}`, sellerId: x.id, name: m.name, price: m.price });
  };
  return (
    <div>
      <PageHeader back="/resident/food" title={x.name} subtitle={`${x.kind}${x.apt ? ` · ${x.apt}` : ""} · ${x.distance}`} large={false} />
      <Photo id={x.cover} w={1400} className="h-48 rounded-3xl sm:h-64" icon={UtensilsCrossed} />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        {x.owner && <div className="flex items-center gap-2"><Avatar src={x.ownerPhoto} name={x.owner} className="size-9" /><div className="text-sm"><div className="font-medium">{x.owner}</div><div className="text-xs text-muted-foreground">Your neighbour in {x.apt}</div></div></div>}
        <div className="flex flex-wrap gap-2 sm:ml-auto">
          <Badge variant="muted"><Stars value={x.rating} /> {x.reviews} reviews</Badge>
          <Badge variant="muted"><Clock /> {x.hours}</Badge>
          {x.delivery && <Badge variant="muted"><Bike /> Delivery</Badge>}
          {x.pickup && <Badge variant="muted"><Store /> Pickup</Badge>}
          {x.hygiene && <Badge><BadgeCheck /> Kitchen hygiene checked</Badge>}
          <Badge variant="outline"><MapPin /> Min {pkr(x.minOrder)}</Badge>
        </div>
      </div>
      <Section title="Menu">
        <div className="grid gap-3 md:grid-cols-2">
          {x.menu.map((m) => (
            <div key={m.id} className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-soft">
              <div className="min-w-0 flex-1 p-1">
                <div className="flex items-center gap-1.5 font-semibold">{m.name}{m.veg && <Leaf className="size-3.5 text-emerald-600" />}</div>
                {m.bestseller && <Badge variant="lime" className="mt-1">Bestseller</Badge>}
                <p className="mt-1 text-[13px] text-muted-foreground">{m.desc}</p>
                {m.allergens && <div className="mt-1.5 text-[11.5px] text-amber-700">Contains: {m.allergens.join(", ")}</div>}
                <div className="mt-2 font-semibold">{pkr(m.price)}</div>
              </div>
              <div className="relative shrink-0">
                <Photo id={m.image} w={240} className="size-28 rounded-xl" icon={UtensilsCrossed} seed={m.name} />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                  {qty(m.id) ? (
                    <div className="flex items-center gap-1 rounded-xl bg-primary text-white shadow-lift"><button className="grid size-8 place-items-center" onClick={() => s.decCart(`${x.id}-${m.id}`)}><Minus className="size-3.5" /></button><span className="w-4 text-center text-sm font-semibold">{qty(m.id)}</span><button className="grid size-8 place-items-center" onClick={() => add(m)}><Plus className="size-3.5" /></button></div>
                  ) : <Button size="sm" variant="outline" className="shadow-lift" onClick={() => add(m)}><Plus /> Add</Button>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">Allergen information is provided by the seller. Ask the seller directly if you have a severe allergy.</p>
      </Section>
      <CartBar />
    </div>
  );
}
