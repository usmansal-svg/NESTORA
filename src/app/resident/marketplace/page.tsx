"use client";
import * as React from "react";
import { Camera, Flag, MessageCircle, Phone, Plus, Store, Tag } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import type { Listing } from "@/lib/types";
import { IMG } from "@/lib/img";
import { ago, cn, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, PageHeader, SearchBar } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { Field, Segmented } from "@/components/shared/pickers";

const CATS = ["All", "Furniture", "Electronics", "Appliances", "Clothing", "Shoes", "Toys", "Baby products", "Books", "Sports", "Household"];

export default function Marketplace() {
  const s = useDemo();
  const qid = useQuery("id");
  const [q, setQ] = React.useState("");
  const [cat, setCat] = React.useState("All");
  const [scope, setScope] = React.useState<"Building" | "Neighbourhood">("Building");
  const [sel, setSel] = React.useState<string | null>(null);
  const [sell, setSell] = React.useState(false);
  const [form, setForm] = React.useState({ title: "", price: "", category: "Furniture", condition: "Good" as Listing["condition"], description: "", scope: "Building" as Listing["scope"] });
  React.useEffect(() => { if (qid) setSel(qid); }, [qid]);
  const list = s.listings.filter((l) => (scope === "Neighbourhood" || l.scope === "Building") && (cat === "All" || l.category === cat) && l.title.toLowerCase().includes(q.toLowerCase()));
  const cur = s.listings.find((l) => l.id === sel);

  return (
    <div>
      <PageHeader back="/resident/explore" title="Buy & sell" subtitle="Pre-loved items from verified neighbours" actions={<Button size="sm" onClick={() => setSell(true)}><Plus /> Sell</Button>} />
      <div className="flex flex-col gap-3 sm:flex-row"><SearchBar value={q} onChange={setQ} placeholder="Search sofas, strollers, TVs…" className="flex-1" /><Segmented className="sm:w-80" value={scope} onChange={setScope} options={[{ value: "Building", label: "Ocean Heights" }, { value: "Neighbourhood", label: "DHA & Clifton" }]} /></div>
      <Chips className="mt-4" value={cat} onChange={setCat} options={CATS.map((c) => ({ value: c, label: c }))} />
      <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((l) => (
          <button key={l.id} onClick={() => setSel(l.id)} className="text-left">
            <Photo id={l.image} w={500} className="aspect-square rounded-2xl" icon={Store}>
              {l.sold && <div className="absolute inset-0 grid place-items-center bg-black/50 text-lg font-semibold tracking-widest text-white">SOLD</div>}
              {l.mine && <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold">Your listing</span>}
              <span className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[10.5px] text-white backdrop-blur">{l.scope === "Building" ? "In building" : "Nearby"}</span>
            </Photo>
            <div className="mt-2 font-semibold">{pkr(l.price)}{l.negotiable && <span className="ml-1 text-xs font-normal text-muted-foreground">· negotiable</span>}</div>
            <div className="truncate text-sm">{l.title}</div>
            <div className="text-xs text-muted-foreground">{l.condition} · {l.sellerApt} · {ago(l.at)}</div>
          </button>
        ))}
      </div>

      <Sheet open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {cur && (
            <>
              <Photo id={cur.image} w={900} className="h-60 shrink-0" icon={Store} />
              <SheetHeader><SheetTitle>{cur.title}</SheetTitle><SheetDescription className="text-xl font-semibold text-foreground">{pkr(cur.price)}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-4">
                <div className="flex flex-wrap gap-2"><Badge variant="muted"><Tag /> {cur.category}</Badge><Badge variant="muted">{cur.condition}</Badge><Badge variant="outline">{cur.scope === "Building" ? "Ocean Heights only" : "Neighbourhood"}</Badge>{cur.sold && <Badge variant="danger">Sold</Badge>}</div>
                <p className="text-sm leading-relaxed text-foreground/80">{cur.description}</p>
                <div className="flex items-center gap-3 rounded-2xl border bg-card p-3.5"><span className="grid size-10 place-items-center rounded-full bg-pine-100 text-sm font-semibold text-pine-800">{cur.seller.split(" ").map((x) => x[0]).join("")}</span><div className="flex-1"><div className="text-sm font-medium">{cur.seller}</div><div className="text-xs text-muted-foreground">{cur.sellerApt} · verified resident · listed {ago(cur.at)}</div></div></div>
                {!cur.mine && <button onClick={() => toast("Listing reported", { description: "Our moderators will review it within 24 hours." })} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-danger"><Flag className="size-3.5" /> Report listing</button>}
              </SheetBody>
              <SheetFooter className="grid grid-cols-2 gap-2">
                {cur.mine ? (
                  <Button className="col-span-2" disabled={cur.sold} onClick={() => { s.markSold(cur.id); toast.success("Marked as sold"); }}>{cur.sold ? "Sold" : "Mark as sold"}</Button>
                ) : (
                  <>
                    <Button variant="outline" asChild><a href="tel:+923001234567"><Phone /> Call</a></Button>
                    <Button disabled={cur.sold} onClick={() => toast.success(`Message sent to ${cur.seller.split(" ")[0]}`, { description: "“Is this still available?”" })}><MessageCircle /> Message</Button>
                  </>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Sheet open={sell} onOpenChange={setSell}>
        <SheetContent>
          <SheetHeader><SheetTitle>Sell an item</SheetTitle><SheetDescription>Listed under your verified apartment. No fees.</SheetDescription></SheetHeader>
          <SheetBody className="space-y-4">
            <div className="grid h-28 place-items-center rounded-2xl border border-dashed text-sm text-muted-foreground"><div className="flex flex-col items-center gap-1"><Camera className="size-6" /> Add up to 6 photos</div></div>
            <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Dining table with 6 chairs" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (PKR)"><Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/\D/g, "") })} inputMode="numeric" /></Field>
              <Field label="Category"><Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })} options={CATS.slice(1).map((c) => ({ value: c, label: c }))} /></Field>
            </div>
            <Field label="Condition"><Segmented value={form.condition} onChange={(v) => setForm({ ...form, condition: v })} options={(["New", "Like new", "Good", "Fair"] as const).map((c) => ({ value: c, label: c }))} /></Field>
            <Field label="Description"><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            <Field label="Who can see it"><Segmented value={form.scope} onChange={(v) => setForm({ ...form, scope: v })} options={[{ value: "Building", label: "Building only" }, { value: "Neighbourhood", label: "Neighbourhood" }]} /></Field>
          </SheetBody>
          <SheetFooter><Button size="lg" className="w-full" onClick={() => { if (!form.title || !form.price) return toast.error("Add a title and price"); s.addListing({ title: form.title, price: +form.price, category: form.category, condition: form.condition, image: IMG.chair, scope: form.scope, description: form.description || "—" }); toast.success("Listing published"); setSell(false); setForm({ ...form, title: "", price: "", description: "" }); }}>Publish listing</Button></SheetFooter>
        </SheetContent>
      </Sheet>
      <div className={cn("hidden")} />
    </div>
  );
}
