"use client";
import * as React from "react";
import { Copy, MapPin, Megaphone, QrCode, Tag, Ticket } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { OFFERS, type Offer } from "@/data/places";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, PageHeader } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";

const KINDS = ["All", "Restaurant", "Café", "Bakery", "Grocery", "Salon", "Gym", "Pharmacy"];
const DEALS = ["All deals", "Discount", "BOGO", "Family deal", "Coupon"];

export default function OffersPage() {
  const [k, setK] = React.useState("All");
  const [d, setD] = React.useState("All deals");
  const [sel, setSel] = React.useState<Offer | null>(null);
  const [claimed, setClaimed] = React.useState<string[]>([]);
  const list = OFFERS.filter((o) => (k === "All" || o.kind === k) && (d === "All deals" || o.deal === d));
  const featured = OFFERS.filter((o) => o.sponsored);

  return (
    <div>
      <PageHeader back="/resident/explore" title="Offers around you" subtitle="Exclusive deals for Ocean Heights residents" />
      <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:px-0">
        {featured.map((o) => (
          <button key={o.id} onClick={() => setSel(o)} className="relative h-48 w-[85%] shrink-0 snap-start overflow-hidden rounded-3xl text-left sm:w-auto">
            <Photo id={o.image} w={900} className="absolute inset-0" icon={Tag} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10.5px] font-semibold"><Megaphone className="size-3" /> Sponsored</span>
            <div className="absolute inset-x-0 bottom-0 p-5 text-white"><div className="text-sm text-white/75">{o.business} · {o.area}</div><div className="text-2xl font-semibold">{o.title}</div></div>
          </button>
        ))}
      </div>
      <Chips className="mt-5" value={k} onChange={setK} options={KINDS.map((x) => ({ value: x, label: x }))} />
      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto text-[12.5px]">{DEALS.map((x) => <button key={x} onClick={() => setD(x)} className={cn("shrink-0 rounded-lg px-2.5 py-1", d === x ? "bg-secondary font-semibold" : "text-muted-foreground")}>{x}</button>)}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((o) => (
          <button key={o.id} onClick={() => setSel(o)} className="flex overflow-hidden rounded-2xl border border-border/70 bg-card text-left shadow-soft transition hover:shadow-lift">
            <Photo id={o.image} w={300} className="w-28 shrink-0" icon={Tag} />
            <div className="relative flex-1 border-l border-dashed p-4">
              <span className="absolute -left-2 -top-2 size-4 rounded-full bg-background" /><span className="absolute -bottom-2 -left-2 size-4 rounded-full bg-background" />
              <div className="flex items-center gap-2"><Badge variant="lime">{o.discount}</Badge><span className="text-[11px] text-muted-foreground">{o.deal}</span></div>
              <div className="mt-1.5 font-semibold leading-snug">{o.title}</div>
              <div className="text-xs text-muted-foreground">{o.business} · {o.distance}</div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground"><span>Valid till {o.validTill}</span>{claimed.includes(o.id) && <span className="font-semibold text-pine-700">Claimed</span>}</div>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-8 rounded-3xl bg-pine-900 p-6 text-white"><div className="flex items-center gap-2 text-sm text-lime-accent"><Ticket className="size-4" /> For businesses</div><div className="mt-1 text-xl font-semibold">Reach 1,100+ verified residents in DHA</div><p className="mt-1 text-sm text-white/65">Local businesses get an offers dashboard with coupons, sponsored listings and redemption analytics.</p><Button variant="accent" className="mt-4" asChild><a href="/business">See business dashboard</a></Button></div>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {sel && (
            <>
              <Photo id={sel.image} w={900} className="h-44 shrink-0" icon={Tag} />
              <SheetHeader><SheetTitle>{sel.title}</SheetTitle><SheetDescription className="flex items-center gap-1"><MapPin className="size-3.5" /> {sel.business} · {sel.area} · {sel.distance}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-4">
                <p className="text-sm text-foreground/80">{sel.desc}</p>
                <div className="flex flex-col items-center rounded-3xl border-2 border-dashed border-pine-300 bg-pine-50 p-5">
                  <QRCodeSVG value={`NESTORA-OFFER:${sel.code}:A-1204`} size={120} fgColor="var(--color-pine-900)" bgColor="transparent" />
                  <div className="mt-3 font-mono text-2xl font-bold tracking-[0.2em] text-pine-900">{sel.code}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Show at counter or enter at checkout · valid till {sel.validTill}</div>
                </div>
                <div className="text-center text-xs text-muted-foreground">{sel.claimed} residents claimed this offer</div>
              </SheetBody>
              <SheetFooter className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(sel.code); toast.success("Code copied"); }}><Copy /> Copy code</Button>
                <Button onClick={() => { setClaimed([...claimed, sel.id]); toast.success("Offer saved to your wallet", { description: `${sel.business} · ${sel.code}` }); }}><QrCode /> Claim offer</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
