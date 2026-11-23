"use client";
import * as React from "react";
import Link from "next/link";
import { BadgeCheck, Check, ChefHat, Clock, HandPlatter, Loader2, MessageSquarePlus, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { FOOD_CATS, SELLERS } from "@/data/places";
import { face } from "@/lib/img";
import { useDemo } from "@/lib/store";
import { ago, cn, pkr, uid } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Avatar } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, SearchBar, Section, Stars } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { Field, Segmented } from "@/components/shared/pickers";
import { CartBar } from "@/components/resident/cart-bar";

const RESPONDERS = [
  { seller: "Ammi's Kitchen (C-0905)", price: 1650, eta: "Ready by 8:00 PM", note: "Sindhi biryani, aloo included, free raita.", rating: 4.9 },
  { seller: "Nani's Handi (B-0210)", price: 1500, eta: "Ready by 8:30 PM", note: "Karachi-style, less spicy available.", rating: 4.7 },
  { seller: "Biryani Point Phase VIII", price: 1380, eta: "Delivered by 8:15 PM", note: "Restaurant — 10% resident discount.", rating: 4.4 },
];

export default function FoodPage() {
  const s = useDemo();
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState<string | null>(null);
  const [req, setReq] = React.useState(false);
  const [text, setText] = React.useState("I need three portions of chicken biryani today.");
  const [portions, setPortions] = React.useState("3");
  const [when, setWhen] = React.useState("Tonight");
  const [budget, setBudget] = React.useState("2000");
  const list = SELLERS.filter((x) => (!cat || x.cuisines.includes(cat)) && [x.name, ...x.cuisines, ...x.menu.map((m) => m.name)].join(" ").toLowerCase().includes(q.toLowerCase()));

  const post = () => {
    const r = s.addFoodRequest({ text, portions: +portions, when, budget: +budget || undefined });
    toast.success("Request posted to 14 home chefs nearby", { description: "You'll be notified as they respond." });
    setReq(false);
    RESPONDERS.forEach((x, i) => setTimeout(() => {
      useDemo.setState((st) => ({ foodRequests: st.foodRequests.map((f) => (f.id === r.id ? { ...f, responses: [...f.responses, { ...x, id: uid("R-"), price: Math.round((x.price * +portions) / 3 / 10) * 10 }] } : f)) }));
      if (i === 0) useDemo.getState().notify({ kind: "order", title: "A chef responded to your food request", body: `${x.seller}: ${x.eta}`, href: "/resident/food", role: "resident" });
    }, 2500 + i * 2200));
  };

  return (
    <div>
      <PageHeader back="/resident/explore" title="Food" subtitle="Home chefs in your building, bakers & restaurants nearby" />
      <SearchBar value={q} onChange={setQ} placeholder="Search biryani, cakes, Chinese…" />

      {s.foodRequests.length > 0 && (
        <Section title="Your food requests" className="mt-5">
          {s.foodRequests.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3"><div><div className="font-medium">“{r.text}”</div><div className="text-xs text-muted-foreground">{r.portions} portions · {r.when} · posted {ago(r.at)}</div></div><Badge variant={r.status === "accepted" ? "default" : "warn"}>{r.status === "accepted" ? "Accepted" : `${r.responses.length} offers`}</Badge></div>
              <div className="mt-3 space-y-2">
                {r.responses.map((x) => (
                  <div key={x.id} className={cn("flex items-center gap-3 rounded-xl border p-3", x.accepted && "border-pine-500 bg-pine-50")}>
                    <ChefHat className="size-5 text-pine-600" />
                    <div className="min-w-0 flex-1"><div className="flex items-center gap-2 text-sm font-medium">{x.seller} <Stars value={x.rating} /></div><div className="text-xs text-muted-foreground">{x.eta} · {x.note}</div></div>
                    <div className="text-sm font-semibold">{pkr(x.price)}</div>
                    {r.status === "open" ? <Button size="sm" onClick={() => { s.acceptFoodResponse(r.id, x.id); s.addBooking({ category: "Food orders", service: r.text, provider: x.seller, date: new Date(Date.now() + 2 * 3600000).toISOString(), price: x.price, address: "A-1204, Ocean Heights" }); toast.success(`Order confirmed with ${x.seller}`); }}>Accept</Button> : x.accepted && <Check className="size-5 text-pine-600" />}
                  </div>
                ))}
                {r.status === "open" && r.responses.length < 3 && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-3.5 animate-spin" /> Waiting for more chefs to respond…</div>}
              </div>
            </div>
          ))}
        </Section>
      )}

      <button onClick={() => setReq(true)} className="mt-5 flex w-full items-center gap-4 rounded-3xl bg-gradient-to-r from-[#6b2d2d] to-[#a34b32] p-5 text-left text-white shadow-soft">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15"><HandPlatter className="size-7" /></span>
        <span className="flex-1"><span className="block text-lg font-semibold">Request Food</span><span className="block text-sm text-white/75">“I need three portions of chicken biryani today.” Let chefs come to you with offers.</span></span>
        <MessageSquarePlus className="size-5 shrink-0" />
      </button>

      <div className="no-scrollbar -mx-4 mt-6 flex gap-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {FOOD_CATS.map((c) => (
          <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)} className="flex w-[72px] shrink-0 flex-col items-center gap-1.5">
            <Photo id={c.image} w={200} className={cn("size-[68px] rounded-full ring-2 ring-offset-2 ring-offset-background transition", cat === c.id ? "ring-pine-600" : "ring-transparent")} icon={UtensilsCrossed} seed={c.id} />
            <span className={cn("text-center text-[11.5px] font-medium", cat === c.id && "text-pine-700")}>{c.id}</span>
          </button>
        ))}
      </div>

      <Section title="From your building" subtitle="Resident home chefs & bakers · hygiene-checked">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.filter((x) => x.apt).map((x) => <SellerCard key={x.id} x={x} />)}</div>
      </Section>
      <Section title="Restaurants & vendors nearby">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.filter((x) => !x.apt).map((x) => <SellerCard key={x.id} x={x} />)}</div>
      </Section>
      {s.orders.length > 0 && (
        <Section title="Recent orders">
          <div className="divide-y rounded-2xl border bg-card">{s.orders.slice(0, 3).map((o) => <div key={o.id} className="flex items-center justify-between px-4 py-3 text-sm"><div><div className="font-medium">{o.seller}</div><div className="text-xs text-muted-foreground">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</div></div><div className="text-right"><div className="font-semibold">{pkr(o.total)}</div><div className="text-xs text-muted-foreground">{o.status}</div></div></div>)}</div>
        </Section>
      )}

      <CartBar />

      <Sheet open={req} onOpenChange={setReq}>
        <SheetContent>
          <SheetHeader><SheetTitle>Request food</SheetTitle><SheetDescription>Home chefs within 3 km will respond with price and time.</SheetDescription></SheetHeader>
          <SheetBody className="space-y-4">
            <Field label="What would you like?"><Textarea value={text} onChange={(e) => setText(e.target.value)} /></Field>
            <div className="flex flex-wrap gap-2">{["Chicken karahi for 6", "Birthday cake, 2 lb", "Lunch boxes for the week", "Iftar platter for 10"].map((x) => <button key={x} onClick={() => setText(x)} className="rounded-full border bg-card px-3 py-1.5 text-xs">{x}</button>)}</div>
            <div className="grid grid-cols-2 gap-3"><Field label="Portions"><Input value={portions} onChange={(e) => setPortions(e.target.value.replace(/\D/g, ""))} /></Field><Field label="Budget (PKR)"><Input value={budget} onChange={(e) => setBudget(e.target.value.replace(/\D/g, ""))} /></Field></div>
            <Field label="When"><Segmented value={when} onChange={setWhen} options={["Lunch today", "Tonight", "Tomorrow"].map((x) => ({ value: x, label: x }))} /></Field>
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><div className="flex -space-x-2">{(["w3", "w6", "m2", "w1"] as const).map((k) => <Avatar key={k} src={face(k)} name={k} className="size-6 ring-2 ring-background" />)}</div> 14 chefs active right now</div>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" onClick={post}>Post request</Button></SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SellerCard({ x }: { x: (typeof SELLERS)[number] }) {
  return (
    <Link href={`/resident/food/${x.id}`} className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <Photo id={x.cover} w={600} className="aspect-[16/9]" icon={UtensilsCrossed}>
        {x.offer && <span className="absolute left-3 top-3 rounded-full bg-lime-accent px-2.5 py-0.5 text-[11px] font-semibold text-pine-950">{x.offer}</span>}
        <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold"><Clock className="size-3" /> {x.eta}</span>
      </Photo>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1.5 truncate font-semibold">{x.name}{x.hygiene && <BadgeCheck className="size-4 text-pine-600" />}</span><Stars value={x.rating} /></div>
        <div className="truncate text-[12.5px] text-muted-foreground">{x.kind} · {x.cuisines.join(", ")} · {x.distance}</div>
        <div className="mt-1 text-[12.5px] text-muted-foreground">{x.tagline}</div>
      </div>
    </Link>
  );
}
