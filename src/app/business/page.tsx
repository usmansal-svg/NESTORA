"use client";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { BadgePercent, Building2, ChefHat, Eye, Megaphone, Plus, ShoppingBag, Star, Ticket, Truck } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { OFFERS, type Offer } from "@/data/places";
import { ago, cn, pkr } from "@/lib/utils";
import { LogoMark } from "@/components/shared/logo";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Stat, Stars } from "@/components/shared/kit";
import { Field, Segmented } from "@/components/shared/pickers";
import { Photo } from "@/components/shared/photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Checkbox, Slider, Switch } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const BIZ = "Kolachi Grill";
const TRAFFIC = Array.from({ length: 14 }, (_, i) => ({ d: `${10 + i} Nov`, views: 320 + Math.round(140 * Math.sin(i / 2) ** 2 + i * 12), claims: 18 + Math.round(10 * Math.sin(i / 3) ** 2 + i) }));
const NEXT: Record<string, string> = { Placed: "Preparing", Preparing: "On the way", "On the way": "Delivered" };

export default function Business() {
  const orders = useDemo((s) => s.orders);
  const bookings = useDemo((s) => s.bookings);
  const setBookingStatus = useDemo((s) => s.setBookingStatus);
  const notify = useDemo((s) => s.notify);
  const [offers, setOffers] = React.useState<(Offer & { live: boolean })[]>(OFFERS.filter((o) => o.business === BIZ).map((o) => ({ ...o, live: true })));
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [redeemed, setRedeemed] = React.useState<{ code: string; at: string }[]>([]);
  const mine = orders.filter((o) => o.seller === BIZ);

  const advance = (id: string, status: string) => {
    useDemo.setState((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: status as typeof o.status } : o)) }));
    const bk = bookings.find((b) => b.category === "Food orders" && b.provider === BIZ && b.status === "In Progress");
    if (bk && status === "Delivered") setBookingStatus(bk.id, "Completed", "Delivered");
    notify({ kind: "order", title: `${BIZ}: ${status}`, body: status === "On the way" ? "Rider is on the way to Ocean Heights. Guard has been pre-notified." : status === "Delivered" ? "Enjoy your meal! Rate your order in Bookings." : "The kitchen has started your order.", href: "/resident/bookings", channels: ["push"], role: "resident" });
    toast.success(`Order marked ${status.toLowerCase()}`);
  };

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-20 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <LogoMark className="size-8" />
          <div className="flex-1"><div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-pine-600">NESTORA for Business</div><div className="text-sm font-medium">{BIZ} <span className="text-muted-foreground">· Do Darya, DHA Phase VIII</span></div></div>
          <Badge variant="lime" className="hidden sm:inline-flex">Verified partner</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <AdminHeader title="Business dashboard" subtitle="Reach residents of 12 buildings within 5 km" actions={<Button onClick={() => setOpen(true)}><Plus /> New offer</Button>} />
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Profile views (14 d)" value="6,214" icon={Eye} trend={{ v: "18%", up: true, good: true }} />
          <Stat label="Coupons claimed" value={offers.reduce((a, o) => a + (o.claimed ?? 0), 0) + redeemed.length} icon={Ticket} tone="lime" />
          <Stat label="Orders via NESTORA" value={mine.length + 87} sub="this month" icon={ShoppingBag} tone="sky" />
          <Stat label="Rating" value="4.6" sub="3,200 reviews" icon={Star} tone="amber" />
        </div>
        <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
          <Panel title="Live orders" subtitle="From residents in the NESTORA app">
            {mine.length === 0 ? <div className="flex flex-col items-center gap-2 py-8 text-center text-sm text-muted-foreground"><ChefHat className="size-8" />No live orders. Place one from the resident app (Order food → Kolachi Grill) to see it here.</div> : (
              <div className="flex flex-col gap-2.5">
                {mine.map((o) => (
                  <div key={o.id} className="rounded-xl border p-3.5">
                    <div className="flex items-start justify-between gap-2"><div><div className="font-medium">{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</div><div className="text-xs text-muted-foreground">{o.id} · A-1204 Ahmed R. · {o.mode} · {ago(o.at)}</div></div><div className="text-right"><div className="font-semibold">{pkr(o.total)}</div><Badge variant={o.status === "Delivered" ? "default" : "warn"}>{o.status}</Badge></div></div>
                    {NEXT[o.status] && <Button size="sm" className="mt-2.5" onClick={() => advance(o.id, NEXT[o.status])}>{o.status === "Placed" ? <ChefHat /> : <Truck />} Mark {NEXT[o.status].toLowerCase()}</Button>}
                  </div>
                ))}
              </div>
            )}
          </Panel>
          <Panel title="Redeem a coupon" subtitle="Enter the code shown on the customer's phone">
            <div className="flex gap-2"><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="NEST20" className="font-mono" /><Button disabled={!code} onClick={() => { const o = offers.find((x) => x.code === code && x.live); if (o) { setRedeemed([{ code, at: new Date().toISOString() }, ...redeemed]); toast.success(`${o.title} applied`, { description: "Redemption recorded" }); } else toast.error("Code not valid for an active offer"); setCode(""); }}><BadgePercent /> Redeem</Button></div>
            <div className="mt-3 flex flex-col gap-1.5 text-sm">{redeemed.map((r, i) => <div key={i} className="flex justify-between"><span className="font-mono">{r.code}</span><span className="text-muted-foreground">{ago(r.at)}</span></div>)}{redeemed.length === 0 && <span className="text-xs text-muted-foreground">Today's redemptions appear here.</span>}</div>
          </Panel>
        </div>
        <Panel title="Reach and engagement" subtitle="Views and coupon claims · last 14 days" className="mt-4">
          <div className="h-[220px]"><ResponsiveContainer><AreaChart data={TRAFFIC}><defs><linearGradient id="bv" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--color-pine-500)" stopOpacity={0.3} /><stop offset="1" stopColor="var(--color-pine-500)" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#ece9e1" /><XAxis dataKey="d" fontSize={11} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} width={34} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} /><Area dataKey="views" name="Views" stroke="var(--color-pine-600)" strokeWidth={2} fill="url(#bv)" /><Area dataKey="claims" name="Claims" stroke="#d9a441" strokeWidth={2} fill="transparent" /></AreaChart></ResponsiveContainer></div>
        </Panel>
        <Panel title="Your offers" className="mt-4">
          <Table rows={offers} cols={[
            { h: "Offer", c: (o) => <div className="flex items-center gap-3"><Photo id={o.image} w={160} className="size-11 shrink-0 rounded-lg" /><div><div className="font-medium">{o.title}</div><div className="text-xs text-muted-foreground">Code {o.code} · until {o.validTill}</div></div></div> },
            { h: "Type", c: (o) => <Badge variant="muted">{o.deal}</Badge> },
            { h: "Placement", c: (o) => o.sponsored ? <Badge variant="lime"><Megaphone className="size-3" /> Sponsored</Badge> : "Standard" },
            { h: "Claims", c: (o) => o.claimed ?? 0 },
            { h: "Live", c: (o) => <Switch checked={o.live} onCheckedChange={(v) => { setOffers(offers.map((x) => (x.id === o.id ? { ...x, live: v } : x))); toast(v ? "Offer is live" : "Offer paused"); }} /> },
          ]} />
        </Panel>
        <Panel title="Recent reviews" className="mt-4">
          <div className="grid gap-3 md:grid-cols-3">{[["Bilal S. · Ocean Heights", 5, "Family platter was perfect for 6. Coupon worked first try."], ["Nadia H. · Clifton Crest", 4, "Great malai boti, delivery took 50 min."], ["Kamran A. · Ocean Heights", 5, "Seekh kebabs as good as at the seaside!"]].map(([n, r, t]) => <div key={n as string} className="rounded-xl border p-3.5 text-sm"><Stars value={r as number} /><p className="mt-1.5">{t}</p><div className="mt-2 text-xs text-muted-foreground">{n}</div></div>)}</div>
        </Panel>
      </main>
      <NewOffer open={open} onClose={() => setOpen(false)} onCreate={(o) => setOffers([{ ...o, live: true }, ...offers])} />
    </div>
  );
}

function NewOffer({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (o: Offer) => void }) {
  const [title, setTitle] = React.useState("");
  const [deal, setDeal] = React.useState<Offer["deal"]>("Discount");
  const [pct, setPct] = React.useState([15]);
  const [code, setCode] = React.useState("KOLACHI15");
  const [desc, setDesc] = React.useState("");
  const [sponsor, setSponsor] = React.useState(false);
  const [blds, setBlds] = React.useState(["Ocean Heights", "Clifton Crest"]);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Create an offer</DialogTitle><DialogDescription>Shown to residents under Offers Around You.</DialogDescription></DialogHeader>
        <div className="grid gap-3">
          <Field label="Headline"><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 15% off weekday dinners" /></Field>
          <Segmented value={deal} onChange={setDeal} options={[{ value: "Discount", label: "Discount" }, { value: "BOGO", label: "BOGO" }, { value: "Family deal", label: "Family deal" }, { value: "Coupon", label: "Coupon" }]} />
          {deal === "Discount" && <Field label={`Discount · ${pct[0]}%`}><Slider value={pct} onValueChange={setPct} min={5} max={50} step={5} /></Field>}
          <div className="grid grid-cols-2 gap-3"><Field label="Coupon code"><Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} className="font-mono" /></Field><Field label="Details"><Textarea rows={1} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Dine-in only" /></Field></div>
          <Field label="Show to buildings"><div className="flex flex-wrap gap-3 text-sm">{["Ocean Heights", "Clifton Crest", "Emerald Towers"].map((b) => <label key={b} className="flex items-center gap-2"><Checkbox checked={blds.includes(b)} onCheckedChange={(v) => setBlds(v ? [...blds, b] : blds.filter((x) => x !== b))} /><Building2 className="size-3.5 text-muted-foreground" />{b}</label>)}</div></Field>
          <label className={cn("flex items-center justify-between rounded-xl border p-3 text-sm", sponsor && "border-pine-400 bg-pine-50")}><span><b>Sponsor this offer</b><span className="block text-xs text-muted-foreground">Top of Explore and Home · Rs 4,000 / week</span></span><Switch checked={sponsor} onCheckedChange={setSponsor} /></label>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!title || !code || blds.length === 0} onClick={() => { onCreate({ id: `of-${Date.now()}`, business: BIZ, kind: "Restaurant", title, desc: desc || title, code, image: OFFERS[0].image, distance: "2.8 km", area: "Do Darya", discount: deal === "Discount" ? `${pct[0]}%` : deal, validTill: "31 Dec", sponsored: sponsor, deal, claimed: 0 }); toast.success("Offer published", { description: `${blds.join(", ")}${sponsor ? " · sponsored" : ""}` }); setTitle(""); onClose(); }}>Publish offer</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
