"use client";
import * as React from "react";
import Link from "next/link";
import { Droplets, Flower2, Minus, PawPrint, Plus, ShoppingBag, Sun, Truck } from "lucide-react";
import { toast } from "sonner";
import { PLANT_CATS, PLANTS, getProvider } from "@/data/catalog";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, PageHeader, Section } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { PaySheet } from "@/components/resident/pay-sheet";
import { ProviderCard } from "@/components/resident/provider-card";

export default function PlantsPage() {
  const addBooking = useDemo((s) => s.addBooking);
  const [cat, setCat] = React.useState("All");
  const [cart, setCart] = React.useState<Record<string, number>>({});
  const [open, setOpen] = React.useState(false);
  const [install, setInstall] = React.useState(true);
  const [pay, setPay] = React.useState(false);
  const items = Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => ({ p: PLANTS.find((x) => x.id === id)!, q }));
  const count = items.reduce((a, i) => a + i.q, 0);
  const sub = items.reduce((a, i) => a + i.p.price * i.q, 0);
  const total = sub + 250 + (install ? 1500 : 0);
  const gardener = getProvider("pv-greenthumb")!;
  const inc = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  return (
    <div>
      <PageHeader back="/resident/explore" title="Plants & gardening" subtitle="Nursery-fresh plants delivered, gardeners on call" actions={<Button variant="outline" onClick={() => setOpen(true)} className="relative"><ShoppingBag /> Cart{count > 0 && <span className="grid size-5 place-items-center rounded-full bg-pine-700 text-[11px] text-white">{count}</span>}</Button>} />
      <div className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#2d4a22] to-pine-900 p-6 text-white">
        <Flower2 className="absolute -right-6 -top-6 size-40 text-white/5" />
        <div className="relative max-w-md"><Badge variant="lime">Balcony makeover</Badge><div className="mt-2 text-2xl font-semibold leading-tight">Buy plants + get them installed by a gardener in one order</div><div className="mt-1 text-sm text-white/70">Delivered to your door from Clifton & Bagh-e-Ibn-e-Qasim nurseries.</div></div>
      </div>
      <Chips value={cat} onChange={setCat} options={PLANT_CATS.map((c) => ({ value: c, label: c }))} />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PLANTS.filter((p) => cat === "All" || p.category === cat).map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
            <Photo id={p.image} w={500} className="aspect-square" icon={Flower2} seed={p.name}>{p.bestseller && <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold text-pine-900">Bestseller</span>}</Photo>
            <div className="p-3">
              <div className="truncate text-sm font-semibold">{p.name}</div>
              <div className="mt-1 flex flex-wrap gap-x-2 text-[11px] text-muted-foreground"><span className="flex items-center gap-0.5"><Sun className="size-3" />{p.light}</span><span className="flex items-center gap-0.5"><Droplets className="size-3" />{p.water}</span>{p.petSafe && <span className="flex items-center gap-0.5"><PawPrint className="size-3" />Pet-safe</span>}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="font-semibold">{pkr(p.price)}</span>
                {cart[p.id] ? (
                  <div className="flex items-center gap-1 rounded-lg bg-pine-50"><button className="grid size-7 place-items-center" onClick={() => inc(p.id, -1)}><Minus className="size-3.5" /></button><span className="w-4 text-center text-sm font-semibold">{cart[p.id]}</span><button className="grid size-7 place-items-center" onClick={() => inc(p.id, 1)}><Plus className="size-3.5" /></button></div>
                ) : <Button size="icon-sm" onClick={() => { inc(p.id, 1); toast.success(`${p.name} added`); }}><Plus /></Button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Section title="Gardening services" subtitle="One-time or recurring care">
        <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
          <ProviderCard p={gardener} />
          <div className="grid grid-cols-2 gap-2">{gardener.tags.slice(0, 8).map((t) => <Link key={t} href={`/resident/explore/provider/${gardener.id}`} className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 text-[13px] font-medium hover:border-pine-300"><Flower2 className="size-4 text-pine-600" />{t}</Link>)}</div>
        </div>
      </Section>

      {count > 0 && (
        <button onClick={() => setOpen(true)} className="fixed inset-x-4 bottom-[88px] z-30 flex items-center justify-between rounded-2xl bg-primary px-5 py-3.5 text-white shadow-lift lg:bottom-6 lg:left-auto lg:right-40 lg:w-96">
          <span className="flex items-center gap-2 text-sm font-medium"><ShoppingBag className="size-4" /> {count} item{count > 1 ? "s" : ""}</span><span className="font-semibold">{pkr(sub)} · View cart</span>
        </button>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader><SheetTitle>Your plant order</SheetTitle><SheetDescription>Delivery tomorrow, 10 AM – 1 PM</SheetDescription></SheetHeader>
          <SheetBody className="space-y-3">
            {items.length === 0 && <p className="text-sm text-muted-foreground">Your cart is empty.</p>}
            {items.map(({ p, q }) => (
              <div key={p.id} className="flex items-center gap-3 rounded-2xl border bg-card p-2.5">
                <Photo id={p.image} w={160} className="size-14 rounded-xl" icon={Flower2} seed={p.name} />
                <div className="flex-1"><div className="text-sm font-medium">{p.name}</div><div className="text-xs text-muted-foreground">{p.nursery}</div></div>
                <div className="flex items-center gap-1 rounded-lg bg-secondary"><button className="grid size-7 place-items-center" onClick={() => inc(p.id, -1)}><Minus className="size-3.5" /></button><span className="w-4 text-center text-sm">{q}</span><button className="grid size-7 place-items-center" onClick={() => inc(p.id, 1)}><Plus className="size-3.5" /></button></div>
              </div>
            ))}
            <label className="flex items-start gap-3 rounded-2xl bg-lime-soft p-4 text-sm"><Checkbox checked={install} onCheckedChange={(c) => setInstall(!!c)} className="mt-0.5" /><span><b>Add installation by GreenThumb gardener</b> — potting, placement & care tips (+{pkr(1500)})</span></label>
            <div className="rounded-2xl bg-secondary/70 p-4 text-sm">
              <div className="flex justify-between py-0.5"><span className="text-muted-foreground">Plants</span><span>{pkr(sub)}</span></div>
              <div className="flex justify-between py-0.5"><span className="text-muted-foreground flex items-center gap-1"><Truck className="size-3.5" /> Delivery</span><span>{pkr(250)}</span></div>
              {install && <div className="flex justify-between py-0.5"><span className="text-muted-foreground">Gardener installation</span><span>{pkr(1500)}</span></div>}
              <div className="mt-1 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>{pkr(total)}</span></div>
            </div>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" disabled={!items.length} onClick={() => setPay(true)}>Checkout · {pkr(total)}</Button></SheetFooter>
        </SheetContent>
      </Sheet>
      <PaySheet open={pay} onOpenChange={setPay} amount={total} title={`Plants order · ${count} items`} payee="Clifton Nursery via NESTORA" onPaid={(m) => {
        const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(11, 0, 0, 0);
        addBooking({ category: "Gardening", service: `Plant delivery${install ? " + installation" : ""} (${count} items)`, provider: install ? "GreenThumb Gardeners" : "Clifton Nursery", providerPhoto: gardener.photo, image: gardener.cover, date: d.toISOString(), price: total, address: "A-1204, Ocean Heights", paymentMethod: m });
        setCart({}); setOpen(false);
      }} />
      <div className={cn("h-0")} />
    </div>
  );
}
