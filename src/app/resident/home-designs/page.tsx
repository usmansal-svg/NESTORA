"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronRight, LayoutGrid, Package, Phone, Receipt, ShieldCheck, Siren, Sparkles, UserPlus, Users, UtensilsCrossed, Wrench, Type,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { RESIDENT } from "@/data/seed";
import { cn, pkr } from "@/lib/utils";
import { Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Photo } from "@/components/shared/photo";
import { IMG } from "@/lib/img";
import { PaySheet } from "@/components/resident/pay-sheet";
import { SosButton } from "@/components/resident/sos";
import { VisitorApprovalCard } from "@/components/resident/visitor-approval";

/**
 * Design study: four ways to make the resident home's actions easy for
 * residents who are not comfortable with apps (e.g. mothers up to 70).
 * Shared principles: big targets (≥ 72px), plain words, labels always visible,
 * high contrast, few choices, emergency kept separate from everyday actions.
 */

type Act = { key: string; en: string; ur: string; hint: string; icon: typeof UserPlus; href?: string; action?: "pay" | "sos"; tone: string; solid: string };

const ACTS: Act[] = [
  { key: "visitor", en: "Let a guest in", ur: "مہمان کا اندراج", hint: "Tell the gate someone is coming", icon: UserPlus, href: "/resident/building/visitors?new=1", tone: "bg-pine-50 text-pine-700", solid: "bg-pine-800" },
  { key: "pay", en: "Pay my bill", ur: "بل ادا کریں", hint: "Maintenance charges", icon: Receipt, action: "pay", tone: "bg-lime-soft text-pine-800", solid: "bg-pine-700" },
  { key: "complaint", en: "Report a problem", ur: "شکایت درج کریں", hint: "Leak, light, lift, noise", icon: Wrench, href: "/resident/building/complaints?new=1", tone: "bg-amber-soft text-amber-700", solid: "bg-pine-800" },
  { key: "parcels", en: "My parcels", ur: "میرے پارسل", hint: "See your locker code", icon: Package, href: "/resident/building/parcels", tone: "bg-sky-50 text-sky-700", solid: "bg-pine-700" },
  { key: "help", en: "House help", ur: "گھریلو ملازم", hint: "Maid, cook, driver", icon: Users, href: "/resident/explore/household-help", tone: "bg-violet-50 text-violet-700", solid: "bg-pine-700" },
  { key: "service", en: "Repair at home", ur: "گھر کی مرمت", hint: "Plumber, electrician, AC", icon: Sparkles, href: "/resident/explore/home-services", tone: "bg-teal-50 text-teal-700", solid: "bg-pine-800" },
  { key: "food", en: "Order food", ur: "کھانا منگوائیں", hint: "Home chefs and restaurants", icon: UtensilsCrossed, href: "/resident/food", tone: "bg-rose-50 text-rose-700", solid: "bg-pine-800" },
  { key: "security", en: "Call security", ur: "سیکیورٹی", hint: "Guard desk, 24 hours", icon: ShieldCheck, href: "/resident/building/security", tone: "bg-pine-50 text-pine-700", solid: "bg-pine-700" },
];
const MORE = { en: "More services", ur: "مزید سہولیات", href: "/resident/explore" };

const DESIGNS = [
  { n: 1, name: "Tiles" },
  { n: 2, name: "List" },
  { n: 3, name: "Today" },
  { n: 4, name: "Urdu" },
];

function Urdu({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span dir="rtl" lang="ur" className={cn("font-urdu leading-[1.9]", className)}>{children}</span>;
}

function HomeDesigns() {
  const sp = useSearchParams();
  const router = useRouter();
  const v = Math.min(4, Math.max(1, Number(sp.get("v")) || 1));
  const s = useDemo();
  const [payOpen, setPayOpen] = React.useState(false);
  const [big, setBig] = React.useState(false);
  const dueBill = s.bills.find((b) => b.status !== "paid");
  const due = dueBill ? dueBill.items.reduce((a, i) => a + i.amount, 0) : 0;
  const pending = s.visitors.filter((x) => x.status === "pending" && x.apt === "A-1204");
  const parcels = s.parcels.filter((p) => p.apt === "A-1204" && ["awaiting", "reception"].includes(p.status));

  const pay = () => (dueBill ? setPayOpen(true) : toast("No dues right now", { description: "Your account is fully paid." }));

  /** Wrap any element so it performs the action's behaviour. */
  function Do({ a, className, children }: { a: Act; className: string; children: React.ReactNode }) {
    if (a.action === "pay") return <button onClick={pay} className={className}>{children}</button>;
    return <Link href={a.href!} className={className}>{children}</Link>;
  }

  const sos = (cls: string, label = "Emergency  ·  ایمرجنسی") => (
    <SosButton trigger={
      <button className={cn("flex w-full items-center justify-center gap-3 rounded-2xl bg-danger font-semibold text-white shadow-lift active:scale-[0.98]", cls)}>
        <Siren className="size-7" strokeWidth={2.2} /> <span>{label}</span>
      </button>
    } />
  );

  const hero = (extra?: React.ReactNode) => (
    <section className="relative -mx-4 overflow-hidden bg-pine-900 px-4 pb-5 pt-5 text-white sm:mx-0 sm:rounded-[28px] sm:px-6">
      <Photo id={IMG.building} w={1000} className="absolute inset-0 opacity-[0.22] [[data-theme=emaar]_&]:opacity-50" imgClassName="mix-blend-luminosity" />
      <div className="absolute inset-0 bg-gradient-to-b from-pine-950/30 via-pine-900/80 to-pine-900" />
      <div className="absolute -right-24 -top-24 size-72 rounded-full bg-lime-accent/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-3">
          <Avatar src={RESIDENT.photo} name={RESIDENT.name} className="size-14 ring-2 ring-white/20" />
          <div className="min-w-0 flex-1">
            <h1 className={cn("font-display leading-[1.05] tracking-tight", big ? "text-[38px]" : "text-[34px]")}>Hello, <span className="italic text-lime-accent">{RESIDENT.first}</span></h1>
            <div className={cn("text-white/70", big ? "text-[18px]" : "text-[16px]")}>Apartment {s.apartment}</div>
          </div>
          {v === 4 && (
            <button onClick={() => setBig((b) => !b)} aria-pressed={big} className={cn("flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2.5 text-[15px] font-semibold ring-1", big ? "bg-lime-accent text-pine-950 ring-lime-accent" : "bg-white/10 text-white ring-white/20")}>
              <Type className="size-5" /> {big ? "Normal" : "Bigger"}
            </button>
          )}
        </div>
        {extra}
      </div>
    </section>
  );
  const billBar = dueBill && (
    <button onClick={pay} className="mt-5 flex w-full items-center gap-4 rounded-2xl bg-white/[0.08] p-4 text-left ring-1 ring-white/10 backdrop-blur">
      <Receipt className="size-8 shrink-0 text-lime-accent" />
      <div className="min-w-0 flex-1">
        <div className="text-[15px] text-white/70">Bill due by 30 Nov</div>
        <div className="text-[26px] font-semibold leading-tight tabular">{pkr(due)}</div>
      </div>
      <span className="rounded-xl bg-lime-accent px-5 py-3 text-[18px] font-semibold text-pine-950">Pay</span>
    </button>
  );
  const H2 = ({ children }: { children: React.ReactNode }) => <h2 className="mt-7 text-[20px] font-semibold tracking-tight">{children}</h2>;
  const card = "rounded-2xl border border-border/70 bg-card shadow-soft";
  const moreBtn = (label: React.ReactNode = MORE.en) => (
    <Link href={MORE.href} className={cn(card, "mt-3 flex min-h-[72px] items-center justify-center gap-3 text-[18px] font-semibold text-pine-800 active:scale-[0.98]")}>
      <LayoutGrid className="size-6 text-pine-600" /> {label}
    </Link>
  );

  return (
    <div className="pb-8 pt-[max(env(safe-area-inset-top),12px)] lg:mx-auto lg:max-w-md lg:pt-8">
      {/* Design picker — only for this preview page */}
      <div className="mb-3 flex items-center gap-1 rounded-full bg-secondary p-1 text-[12.5px] font-medium">
        {DESIGNS.map((d) => (
          <button key={d.n} onClick={() => router.replace(`/resident/home-designs?v=${d.n}`)} className={cn("flex-1 rounded-full px-2 py-1.5 transition", v === d.n ? "bg-card text-foreground shadow-soft" : "text-muted-foreground")}>
            {d.n}. {d.name}
          </button>
        ))}
      </div>

      {/* ───────────── 1. TILES ───────────── */}
      {v === 1 && (
        <div>
          {hero(billBar)}
          <H2>What would you like to do?</H2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ACTS.slice(0, 6).map((a) => (
              <Do key={a.key} a={a} className={cn(card, "flex min-h-[136px] flex-col justify-between p-4 text-left transition active:scale-[0.97]")}>
                <span className={cn("grid size-14 place-items-center rounded-2xl", a.tone)}><a.icon className="size-7" strokeWidth={1.9} /></span>
                <span className="text-[18px] font-semibold leading-tight">{a.en}</span>
              </Do>
            ))}
          </div>
          {moreBtn()}
          <div className="mt-6">{sos("min-h-[76px] text-[20px]", "Emergency SOS")}</div>
        </div>
      )}

      {/* ───────────── 2. LIST ───────────── */}
      {v === 2 && (
        <div>
          {hero()}
          <div className={cn(card, "mt-5 overflow-hidden")}>
            {ACTS.map((a, i) => (
              <Do key={a.key} a={a} className={cn("flex min-h-[84px] w-full items-center gap-4 px-4 py-3 text-left transition active:bg-secondary", i > 0 && "border-t border-border/70")}>
                <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl", a.tone)}><a.icon className="size-7" strokeWidth={1.9} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[18px] font-semibold leading-tight">{a.en}</span>
                  <span className="block text-[15px] leading-snug text-muted-foreground">{a.hint}</span>
                </span>
                <ChevronRight className="size-6 shrink-0 text-muted-foreground" />
              </Do>
            ))}
            <Link href={MORE.href} className="flex min-h-[76px] items-center gap-4 border-t border-border/70 px-4 text-[18px] font-semibold text-pine-700">
              <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-foreground/70"><LayoutGrid className="size-7" strokeWidth={1.9} /></span> {MORE.en}
              <ChevronRight className="ml-auto size-6 text-muted-foreground" />
            </Link>
          </div>
          <div className="mt-5">{sos("min-h-[76px] text-[20px]", "Emergency SOS")}</div>
        </div>
      )}

      {/* ───────────── 3. TODAY ───────────── */}
      {v === 3 && (
        <div>
          {hero()}
          <H2>Needs your attention</H2>
          <div className="mt-3 space-y-3">
            {pending.map((x) => <VisitorApprovalCard key={x.id} v={x} />)}
            {dueBill && (
              <div className={cn(card, "flex items-center gap-4 p-4")}>
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-lime-soft text-pine-800"><Receipt className="size-7" strokeWidth={1.9} /></span>
                <div className="min-w-0 flex-1"><div className="text-[17px] font-semibold">Bill {pkr(due)}</div><div className="text-[15px] text-muted-foreground">Please pay by 30 Nov</div></div>
                <Button size="lg" className="h-12 rounded-xl px-5 text-[17px]" onClick={pay}>Pay</Button>
              </div>
            )}
            {parcels.length > 0 && (
              <Link href="/resident/building/parcels" className="relative flex items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-pine-800 to-pine-950 p-4 text-white shadow-soft">
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-lime-accent"><Package className="size-7" strokeWidth={1.9} /></span>
                <div className="min-w-0 flex-1"><div className="text-[17px] font-semibold">{parcels.length} parcel{parcels.length > 1 ? "s" : ""} waiting</div><div className="text-[15px] text-white/65">Tap to see your code</div></div>
                <span className="rounded-xl bg-lime-accent px-5 py-3 text-[17px] font-semibold text-pine-950">Open</span>
              </Link>
            )}
          </div>
          <H2>I want to…</H2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ACTS.filter((a) => ["visitor", "complaint", "help", "security"].includes(a.key)).map((a) => (
              <Do key={a.key} a={a} className={cn("flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-white shadow-soft transition active:scale-[0.97]", a.solid)}>
                <a.icon className="size-11 text-lime-accent" strokeWidth={1.9} />
                <span className="text-[18px] font-semibold leading-tight">{a.en}</span>
              </Do>
            ))}
          </div>
          {moreBtn("Everything else")}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {sos("min-h-[76px] text-[19px]", "SOS")}
            <a href="tel:+922135340000" onClick={(e) => { e.preventDefault(); toast("Calling the guard desk", { description: "Demo only. No call is placed." }); }} className={cn(card, "flex min-h-[76px] items-center justify-center gap-3 text-[19px] font-semibold text-pine-800")}>
              <Phone className="size-6 text-pine-600" /> Guard desk
            </a>
          </div>
        </div>
      )}

      {/* ───────────── 4. URDU ───────────── */}
      {v === 4 && (
        <div>
          {hero()}
          <div className="mt-5 grid grid-cols-2 gap-3">
            {ACTS.map((a) => (
              <Do key={a.key} a={a} className={cn(card, "flex flex-col items-center justify-center p-3 text-center transition active:scale-[0.97]", big ? "min-h-[180px]" : "min-h-[160px]")}>
                <span className={cn("grid place-items-center rounded-2xl", a.tone, big ? "size-16" : "size-14")}><a.icon className={big ? "size-8" : "size-7"} strokeWidth={1.9} /></span>
                <span className={cn("mt-2 font-semibold leading-tight", big ? "text-[20px]" : "text-[17px]")}>{a.en}</span>
                <Urdu className={cn("text-muted-foreground", big ? "text-[19px]" : "text-[16px]")}>{a.ur}</Urdu>
              </Do>
            ))}
          </div>
          {moreBtn(<>{MORE.en} · <Urdu className="text-[16px] font-normal">{MORE.ur}</Urdu></>)}
          <div className="mt-6">{sos(cn("min-h-[80px]", big ? "text-[22px]" : "text-[20px]"))}</div>
        </div>
      )}

      <p className="mt-8 text-center text-[13px] text-muted-foreground">Design preview. The live home screen is unchanged.</p>

      {dueBill && (
        <PaySheet open={payOpen} onOpenChange={setPayOpen} amount={due} title={`Maintenance · ${dueBill.month} · ${s.apartment}`} lines={dueBill.items} onPaid={(m) => s.payBill(dueBill.id, m)} />
      )}
    </div>
  );
}

export default function Page() {
  return <React.Suspense><HomeDesigns /></React.Suspense>;
}
