"use client";
import * as React from "react";
import Link from "next/link";
import {
  CalendarCheck, ChevronRight, CircleParking, Droplets, 
  Package, Receipt, ShieldCheck, Siren, UserPlus, Users, Wrench, Zap,
  LayoutGrid, MapPin, Phone, Type, UserCheck, FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { APARTMENTS, RESIDENT } from "@/data/seed";
import { IMG } from "@/lib/img";
import { cn, pkr } from "@/lib/utils";
import { Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/shared/photo";
import { BellButton } from "@/components/resident/shell";
import { ApartmentSwitcher } from "@/components/resident/apartment-switcher";
import { PaySheet } from "@/components/resident/pay-sheet";
import { SosButton } from "@/components/resident/sos";
import { VisitorApprovalCard } from "@/components/resident/visitor-approval";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}


export default function ResidentHome() {
  const s = useDemo();
  const live = useLiveUtilities();
  const [payOpen, setPayOpen] = React.useState(false);
  const [big, setBig] = React.useState(false);
  React.useEffect(() => { try { setBig(localStorage.getItem("nestora-big-text") === "1"); } catch {} }, []);
  const toggleBig = () => setBig((b) => { try { localStorage.setItem("nestora-big-text", b ? "0" : "1"); } catch {} return !b; });
  const apt = APARTMENTS.find((a) => a.id === s.apartment)!;
  const pending = s.visitors.filter((v) => v.status === "pending" && v.apt === "A-1204");
  const dueBill = s.bills.find((b) => b.status !== "paid");
  const due = dueBill ? dueBill.items.reduce((a, i) => a + i.amount, 0) : 0;
  const parcels = s.parcels.filter((p) => p.apt === "A-1204" && ["awaiting", "reception"].includes(p.status));
  const openC = s.complaints.filter((c) => c.apt === "A-1204" && c.status !== "Resolved").length;
  const expectedN = s.visitors.filter((v) => v.apt === "A-1204" && ["expected", "approved"].includes(v.status)).length;
  const tiles: { href: string; label: string; sub: string; icon: typeof Zap; badge?: number }[] = [
    { href: "/resident/building/visitors", label: "Visitors", sub: `${expectedN} expected today`, icon: UserPlus, badge: pending.length || undefined },
    { href: "/resident/building/payments", label: "Payments", sub: due ? `${pkr(due)} due` : "All paid", icon: Receipt },
    { href: "/resident/building/complaints", label: "Report a problem", sub: openC ? `${openC} open` : "Leak, light, lift", icon: Wrench },
    { href: "/resident/building/parcels", label: "My parcels", sub: parcels.length ? `${parcels.length} ready` : "Smart lockers", icon: Package, badge: parcels.length || undefined },
    { href: "/resident/building/security", label: "Security", sub: "Guard desk, 24 hours", icon: ShieldCheck },
    { href: "/resident/building/staff", label: "My house staff", sub: "Maid, driver, cook passes", icon: UserCheck },
    { href: "/resident/explore/household-help", label: "Hire house help", sub: "Verified workers", icon: Users },
    { href: "/resident/building/utilities", label: "Water & power", sub: live.grid === "On" ? "All normal" : "Outage now", icon: Droplets },
    { href: "/resident/building/parking", label: "Parking", sub: "My bays, guest parking", icon: CircleParking },
    { href: "/resident/building/amenities", label: "Book a facility", sub: "Pool, gym, hall", icon: CalendarCheck },
    { href: "/resident/building/documents", label: "Documents", sub: "Bylaws, meetings", icon: FileText },
    { href: "/resident/explore", label: "More services", sub: "Food, repairs, salon", icon: LayoutGrid },
  ];

  // Residents only need to hear about building services when something affects them.
  const notices = [
    live.grid !== "On" && { text: `K-Electric outage since ${live.gridSince}. Generator is ${live.generator.toLowerCase()}.`, icon: Zap },
    live.water !== "Available" && { text: `Water supply: ${live.water.toLowerCase()}.`, icon: Droplets },
  ].filter(Boolean) as { text: string; icon: typeof Zap }[];

  return (
    <div className="pt-[max(env(safe-area-inset-top),12px)] lg:pt-8">
      {/* HERO */}
      <section className="relative -mx-4 overflow-hidden bg-pine-900 px-4 pb-6 pt-4 text-white sm:mx-0 sm:rounded-[28px] sm:px-6 sm:pt-6 lg:px-8 lg:pt-7">
        <Photo id={IMG.building} w={1400} className="absolute inset-0 opacity-[0.22] [[data-theme=emaar]_&]:opacity-50" imgClassName="mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-950/30 via-pine-900/80 to-pine-900" />
        <div className="absolute -right-24 -top-24 size-72 rounded-full bg-lime-accent/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <Link href="/resident/account"><Avatar src={RESIDENT.photo} name={RESIDENT.name} className="size-11 ring-2 ring-white/20" /></Link>
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] text-white/60">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}</div>
              <div className="mt-0.5"><ApartmentSwitcher /></div>
            </div>
            <BellButton dark />
          </div>
          <div className="mt-6 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className={cn("font-display leading-[1.05] tracking-tight", big ? "text-[40px] sm:text-[46px]" : "text-[34px] sm:text-[42px]")}>
                {greeting()}, <span className="italic text-lime-accent">{RESIDENT.first}</span>
              </h1>
              <p className={cn("mt-1.5 flex items-center gap-1.5 text-white/65", big ? "text-[16px]" : "text-[13px]")}><MapPin className="size-3.5 shrink-0" /> {apt.building}, Tower {apt.tower} · Apt {apt.unit}</p>
            </div>
            <button onClick={toggleBig} aria-pressed={big} className={cn("flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2.5 text-[15px] font-semibold ring-1 transition", big ? "bg-lime-accent text-pine-950 ring-lime-accent" : "bg-white/10 text-white ring-white/20")}>
              <Type className="size-5" /> {big ? "Normal" : "Bigger"}
            </button>
          </div>
          {notices.map((n) => (
            <Link key={n.text} href="/resident/building/utilities" className="mt-4 flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-3.5 py-2.5 text-[14px] ring-1 ring-white/10 backdrop-blur">
              <n.icon className="size-4 shrink-0 text-amber-300" />
              <span className="min-w-0 flex-1">{n.text}</span>
              <ChevronRight className="size-4 shrink-0 text-white/50" />
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-5 max-w-3xl">
        <div className="min-w-0">
          {/* Needs your attention — only what affects this home right now */}
          {(pending.length > 0 || dueBill || parcels.length > 0) && (
            <>
              <h2 className={cn("font-semibold tracking-tight", big ? "text-[23px]" : "text-[20px]")}>Needs your attention</h2>
              <div className="mt-3 space-y-3">
                {pending.map((v) => <VisitorApprovalCard key={v.id} v={v} />)}
                {dueBill && (
                  <div className="flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-soft">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-lime-soft text-pine-800"><Receipt className="size-7" strokeWidth={1.9} /></span>
                    <div className="min-w-0 flex-1">
                      <div className={cn("font-semibold tabular", big ? "text-[20px]" : "text-[17px]")}>Bill {pkr(due)}</div>
                      <div className={cn("text-muted-foreground", big ? "text-[17px]" : "text-[15px]")}>Please pay by 30 Nov</div>
                      <Link href="/resident/building/payments" className="text-[13px] font-medium text-pine-700 underline-offset-2 hover:underline">See statement</Link>
                    </div>
                    <Button size="lg" className="h-12 rounded-xl px-5 text-[17px]" onClick={() => setPayOpen(true)}>Pay</Button>
                  </div>
                )}
                {parcels.length > 0 && (
                  <Link href="/resident/building/parcels" className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-pine-800 to-pine-950 p-4 text-white shadow-soft">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-lime-accent"><Package className="size-7" strokeWidth={1.9} /></span>
                    <div className="min-w-0 flex-1">
                      <div className={cn("font-semibold", big ? "text-[20px]" : "text-[17px]")}>{parcels.length} parcel{parcels.length > 1 ? "s" : ""} waiting</div>
                      <div className={cn("text-white/65", big ? "text-[17px]" : "text-[15px]")}>Tap to see your code</div>
                    </div>
                    <span className="rounded-xl bg-lime-accent px-5 py-3 text-[17px] font-semibold text-pine-950">Open</span>
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Big, simple actions: everything that used to live in the Building tab */}
          <h2 className={cn("mt-7 font-semibold tracking-tight", big ? "text-[23px]" : "text-[20px]")}>I want to…</h2>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {tiles.map((a, i) => (
              <Link key={a.href} href={a.href} className={cn("relative flex flex-col items-center justify-center gap-1 rounded-2xl p-4 text-center text-white shadow-soft transition active:scale-[0.97]", i % 4 === 0 || i % 4 === 3 ? "bg-pine-800" : "bg-pine-700", big ? "min-h-[168px]" : "min-h-[148px]")}>
                {a.badge ? <span className="absolute right-3 top-3 grid min-w-7 place-items-center rounded-full bg-danger px-2 py-0.5 text-[14px] font-semibold text-white">{a.badge}</span> : null}
                <a.icon className={cn("text-lime-accent", big ? "size-12" : "size-11")} strokeWidth={1.9} />
                <span className={cn("mt-1.5 font-semibold leading-tight", big ? "text-[21px]" : "text-[18px]")}>{a.label}</span>
                <span className={cn("leading-snug text-white/65", big ? "text-[16px]" : "text-[14px]")}>{a.sub}</span>
              </Link>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <SosButton trigger={
              <button className={cn("flex w-full items-center justify-center gap-3 rounded-2xl bg-danger font-semibold text-white shadow-lift active:scale-[0.98]", big ? "min-h-[84px] text-[21px]" : "min-h-[76px] text-[19px]")}>
                <Siren className="size-7" strokeWidth={2.2} /> Emergency SOS
              </button>
            } />
            <button onClick={() => toast("Calling the guard desk", { description: "Demo only. No call is placed." })} className={cn("flex items-center justify-center gap-3 rounded-2xl border border-border/70 bg-card font-semibold text-pine-800 shadow-soft active:scale-[0.98]", big ? "min-h-[84px] text-[21px]" : "min-h-[76px] text-[19px]")}>
              <Phone className="size-6 text-pine-600" /> Guard desk
            </button>
          </div>


        </div>
      </div>

      {dueBill && (
        <PaySheet
          open={payOpen}
          onOpenChange={setPayOpen}
          amount={due}
          title={`Maintenance · ${dueBill.month} · ${s.apartment}`}
          lines={dueBill.items}
          onPaid={(m) => s.payBill(dueBill.id, m)}
        />
      )}
    </div>
  );
}
