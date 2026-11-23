"use client";
import * as React from "react";
import { Camera, Check, Loader2, Ruler } from "lucide-react";
import { toast } from "sonner";
import { PROVIDERS, type Provider } from "@/data/catalog";
import { useDemo } from "@/lib/store";
import { cn, pkr, sleep } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, Slider } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Field, Segmented } from "@/components/shared/pickers";
import { Stars } from "@/components/shared/kit";

export function QuoteSheet({ open, onOpenChange, category, service, preferred }: { open: boolean; onOpenChange: (o: boolean) => void; category: string; service: string; preferred?: Provider }) {
  const addBooking = useDemo((s) => s.addBooking);
  const [sqft, setSqft] = React.useState([2150]);
  const [rooms, setRooms] = React.useState("3");
  const [grade, setGrade] = React.useState<"Economy" | "Premium" | "Luxury">("Premium");
  const [photos, setPhotos] = React.useState(2);
  const [stage, setStage] = React.useState<"form" | "loading" | "quotes" | "done">("form");
  React.useEffect(() => { if (open) setStage("form"); }, [open]);
  const rate = { Economy: 32, Premium: 45, Luxury: 68 }[grade];
  const est = Math.round((sqft[0] * 2.6 * rate) / 1000) * 1000;
  const pros = [preferred, ...PROVIDERS.filter((p) => p.category === category && p.id !== preferred?.id)].filter(Boolean).slice(0, 3) as Provider[];
  const quotes = pros.map((p, i) => ({ p, price: Math.round((est * [0.97, 1.08, 0.91][i]) / 500) * 500, days: [4, 3, 5][i], note: ["Includes crack filling & 2 coats", "Free furniture covering & cleanup", "Weekend work available"][i] }));

  const request = async () => { setStage("loading"); await sleep(1800); setStage("quotes"); };
  const accept = (q: (typeof quotes)[number]) => {
    const d = new Date(); d.setDate(d.getDate() + 3); d.setHours(10, 0, 0, 0);
    addBooking({ category: "Painting", service: `${service} — ${sqft[0]} sq ft, ${grade}`, provider: q.p.name, providerPhoto: q.p.photo, image: q.p.cover, date: d.toISOString(), duration: `${q.days} days`, price: q.price, address: "A-1204, Ocean Heights", notes: q.note });
    toast.success(`Quote accepted — ${q.p.name}`, { description: "Site survey booked. Renovation permit request sent to management." });
    setStage("done"); onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle>Get quotes · {service}</SheetTitle><SheetDescription>Based on your apartment size and photos. Free, no obligation.</SheetDescription></SheetHeader>
        {stage === "quotes" ? (
          <SheetBody className="space-y-3">
            <div className="rounded-2xl bg-pine-50 p-4 text-sm text-pine-900">{quotes.length} quotes received in under 2 hours (simulated). Prices include materials ({grade.toLowerCase()} paint).</div>
            {quotes.map((q, i) => (
              <div key={q.p.id} className={cn("rounded-2xl border bg-card p-4", i === 0 && "border-pine-500 ring-2 ring-pine-500/10")}>
                <div className="flex items-center gap-3"><Avatar src={q.p.photo} name={q.p.name} /><div className="flex-1"><div className="font-semibold">{q.p.name}</div><div className="flex items-center gap-2 text-xs text-muted-foreground"><Stars value={q.p.rating} /> {q.p.jobs} jobs</div></div><div className="text-right"><div className="text-lg font-semibold">{pkr(q.price)}</div><div className="text-xs text-muted-foreground">{q.days} days</div></div></div>
                <div className="mt-2 text-[13px] text-muted-foreground">{q.note}</div>
                <Button size="sm" className="mt-3 w-full" variant={i === 0 ? "default" : "outline"} onClick={() => accept(q)}>Accept & book survey</Button>
              </div>
            ))}
          </SheetBody>
        ) : (
          <>
            <SheetBody className="space-y-5">
              <Field label={`Covered area · ${sqft[0].toLocaleString()} sq ft`} hint="Pre-filled from A-1204 records"><Slider value={sqft} onValueChange={setSqft} min={400} max={5000} step={50} /></Field>
              <Field label="Rooms"><Segmented value={rooms} onChange={setRooms} options={["1", "2", "3", "4", "5+"].map((r) => ({ value: r, label: r }))} /></Field>
              <Field label="Finish"><Segmented value={grade} onChange={setGrade} options={(["Economy", "Premium", "Luxury"] as const).map((g) => ({ value: g, label: g }))} /></Field>
              <Field label="Photos of walls">
                <div className="flex gap-2">
                  {Array.from({ length: photos }).map((_, i) => <div key={i} className="grid size-16 place-items-center rounded-xl bg-gradient-to-br from-stone-200 to-stone-300 text-stone-600"><Check className="size-5" /></div>)}
                  <button onClick={() => setPhotos(photos + 1)} className="grid size-16 place-items-center rounded-xl border border-dashed text-muted-foreground"><Camera className="size-5" /></button>
                </div>
              </Field>
              <div className="flex items-center gap-3 rounded-2xl bg-lime-soft p-4"><Ruler className="size-6 text-pine-700" /><div><div className="text-xs text-pine-900/70">Instant estimate</div><div className="text-xl font-semibold text-pine-950">{pkr(est * 0.9)} – {pkr(est * 1.1)}</div></div></div>
            </SheetBody>
            <SheetFooter><Button size="lg" className="w-full" onClick={request} disabled={stage === "loading"}>{stage === "loading" ? <><Loader2 className="animate-spin" /> Sending to {pros.length} providers…</> : "Request quotes"}</Button></SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
