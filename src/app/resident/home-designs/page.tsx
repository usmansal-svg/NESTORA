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
  { key: "visitor", en: "Let a guest in", ur: "مہمان کا اندراج", hint: "Tell the gate someone is coming", icon: UserPlus, href: "/resident/building/visitors?new=1", tone: "bg-sky-50 text-sky-800 ring-sky-200", solid: "bg-sky-700" },
  { key: "pay", en: "Pay my bill", ur: "بل ادا کریں", hint: "Maintenance charges", icon: Receipt, action: "pay", tone: "bg-emerald-50 text-emerald-800 ring-emerald-200", solid: "bg-emerald-700" },
  { key: "complaint", en: "Report a problem", ur: "شکایت درج کریں", hint: "Leak, light, lift, noise", icon: Wrench, href: "/resident/building/complaints?new=1", tone: "bg-amber-50 text-amber-800 ring-amber-200", solid: "bg-amber-700" },
  { key: "parcels", en: "My parcels", ur: "میرے پارسل", hint: "See your locker code", icon: Package, href: "/resident/building/parcels", tone: "bg-violet-50 text-violet-800 ring-violet-200", solid: "bg-violet-700" },
  { key: "help", en: "House help", ur: "گھریلو ملازم", hint: "Maid, cook, driver", icon: Users, href: "/resident/explore/household-help", tone: "bg-teal-50 text-teal-800 ring-teal-200", solid: "bg-teal-700" },
  { key: "service", en: "Repair at home", ur: "گھر کی مرمت", hint: "Plumber, electrician, AC", icon: Sparkles, href: "/resident/explore/home-services", tone: "bg-orange-50 text-orange-800 ring-orange-200", solid: "bg-orange-700" },
  { key: "food", en: "Order food", ur: "کھانا منگوائیں", hint: "Home chefs and restaurants", icon: UtensilsCrossed, href: "/resident/food", tone: "bg-rose-50 text-rose-800 ring-rose-200", solid: "bg-rose-700" },
  { key: "security", en: "Call security", ur: "سیکیورٹی", hint: "Guard desk, 24 hours", icon: ShieldCheck, href: "/resident/building/security", tone: "bg-slate-100 text-slate-800 ring-slate-300", solid: "bg-slate-700" },
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
      <button className={cn("flex w-full items-center justify-center gap-3 rounded-3xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/25 active:scale-[0.98]", cls)}>
        <Siren className="size-7" strokeWidth={2.2} /> <span>{label}</span>
      </button>
    } />
  );

  const header = (
    <div className="flex items-center gap-3">
      <Avatar src={RESIDENT.photo} name={RESIDENT.name} className="size-14" />
      <div className="min-w-0 flex-1">
        <div className={cn("font-bold leading-tight text-foreground", big ? "text-[28px]" : "text-[24px]")}>Hello, {RESIDENT.first}</div>
        <div className={cn("text-muted-foreground", big ? "text-[18px]" : "text-[16px]")}>Apartment {s.apartment}</div>
      </div>
    </div>
  );

  return (
    <div className="pb-8 pt-[max(env(safe-area-inset-top),12px)] lg:mx-auto lg:max-w-md lg:pt-8">
      {/* Design picker — only for this preview page */}
      <div className="mb-4 flex items-center gap-1 rounded-full bg-secondary p-1 text-[12.5px] font-medium">
        {DESIGNS.map((d) => (
          <button key={d.n} onClick={() => router.replace(`/resident/home-designs?v=${d.n}`)} className={cn("flex-1 rounded-full px-2 py-1.5 transition", v === d.n ? "bg-card text-foreground shadow-soft" : "text-muted-foreground")}>
            {d.n}. {d.name}
          </button>
        ))}
      </div>

      {/* ───────────── 1. BIG TILES ───────────── */}
      {v === 1 && (
        <div>
          {header}
          {dueBill && (
            <button onClick={pay} className="mt-5 flex w-full items-center gap-4 rounded-3xl bg-pine-900 p-5 text-left text-white">
              <Receipt className="size-9 shrink-0 text-lime-accent" />
              <div className="min-w-0 flex-1">
                <div className="text-[16px] text-white/75">Bill due by 30 Nov</div>
                <div className="text-[28px] font-bold leading-tight">{pkr(due)}</div>
              </div>
              <span className="rounded-2xl bg-lime-accent px-5 py-3 text-[18px] font-bold text-pine-950">Pay</span>
            </button>
          )}
          <div className="mt-6 text-[20px] font-bold">What would you like to do?</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ACTS.slice(0, 6).map((a) => (
              <Do key={a.key} a={a} className={cn("flex min-h-[132px] flex-col justify-between rounded-3xl p-4 text-left ring-2 active:scale-[0.97]", a.tone)}>
                <a.icon className="size-10" strokeWidth={2} />
                <span className="text-[19px] font-bold leading-tight">{a.en}</span>
              </Do>
            ))}
          </div>
          <Link href={MORE.href} className="mt-3 flex min-h-[72px] items-center justify-center gap-3 rounded-3xl border-2 border-border bg-card text-[19px] font-bold">
            <LayoutGrid className="size-7" /> {MORE.en}
          </Link>
          <div className="mt-6">{sos("min-h-[76px] text-[20px]", "Emergency SOS")}</div>
        </div>
      )}

      {/* ───────────── 2. SIMPLE LIST ───────────── */}
      {v === 2 && (
        <div>
          {header}
          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-border bg-card">
            {ACTS.map((a, i) => (
              <Do key={a.key} a={a} className={cn("flex min-h-[84px] w-full items-center gap-4 px-4 py-3 text-left active:bg-secondary", i > 0 && "border-t-2 border-border/70")}>
                <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl text-white", a.solid)}><a.icon className="size-8" strokeWidth={2} /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[19px] font-bold leading-tight">{a.en}</span>
                  <span className="block text-[15px] leading-snug text-muted-foreground">{a.hint}</span>
                </span>
                <ChevronRight className="size-7 shrink-0 text-foreground/40" />
              </Do>
            ))}
            <Link href={MORE.href} className="flex min-h-[72px] items-center gap-4 border-t-2 border-border/70 px-4 text-[18px] font-bold text-pine-700">
              <span className="grid size-14 place-items-center rounded-2xl bg-secondary"><LayoutGrid className="size-7" /></span> {MORE.en}
              <ChevronRight className="ml-auto size-7 text-foreground/40" />
            </Link>
          </div>
          <div className="mt-5">{sos("min-h-[76px] text-[20px]", "Emergency SOS")}</div>
        </div>
      )}

      {/* ───────────── 3. TODAY FIRST ───────────── */}
      {v === 3 && (
        <div>
          {header}
          <div className="mt-6 text-[20px] font-bold">Needs your attention</div>
          <div className="mt-3 space-y-3">
            {pending.map((x) => <VisitorApprovalCard key={x.id} v={x} />)}
            {dueBill && (
              <div className="flex items-center gap-4 rounded-3xl border-2 border-amber-300 bg-amber-50 p-4">
                <Receipt className="size-9 shrink-0 text-amber-700" />
                <div className="min-w-0 flex-1"><div className="text-[17px] font-bold">Bill {pkr(due)}</div><div className="text-[15px] text-amber-900/80">Please pay by 30 Nov</div></div>
                <button onClick={pay} className="rounded-2xl bg-amber-600 px-5 py-3.5 text-[18px] font-bold text-white">Pay</button>
              </div>
            )}
            {parcels.length > 0 && (
              <Link href="/resident/building/parcels" className="flex items-center gap-4 rounded-3xl border-2 border-violet-300 bg-violet-50 p-4">
                <Package className="size-9 shrink-0 text-violet-700" />
                <div className="min-w-0 flex-1"><div className="text-[17px] font-bold">{parcels.length} parcel{parcels.length > 1 ? "s" : ""} waiting</div><div className="text-[15px] text-violet-900/80">Tap to see your code</div></div>
                <span className="rounded-2xl bg-violet-700 px-5 py-3.5 text-[18px] font-bold text-white">Open</span>
              </Link>
            )}
          </div>
          <div className="mt-7 text-[20px] font-bold">I want to…</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {ACTS.filter((a) => ["visitor", "complaint", "help", "security"].includes(a.key)).map((a) => (
              <Do key={a.key} a={a} className={cn("flex min-h-[150px] flex-col items-center justify-center gap-3 rounded-3xl p-4 text-center text-white shadow-md active:scale-[0.97]", a.solid)}>
                <a.icon className="size-12" strokeWidth={2} />
                <span className="text-[19px] font-bold leading-tight">{a.en}</span>
              </Do>
            ))}
          </div>
          <Link href={MORE.href} className="mt-3 flex min-h-[72px] items-center justify-center gap-3 rounded-3xl border-2 border-border bg-card text-[19px] font-bold">
            <LayoutGrid className="size-7" /> Everything else
          </Link>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {sos("min-h-[76px] text-[19px]", "SOS")}
            <a href="tel:+922135340000" onClick={(e) => { e.preventDefault(); toast("Calling the guard desk", { description: "Demo only. No call is placed." }); }} className="flex min-h-[76px] items-center justify-center gap-3 rounded-3xl bg-pine-900 text-[19px] font-bold text-white">
              <Phone className="size-7" /> Guard desk
            </a>
          </div>
        </div>
      )}

      {/* ───────────── 4. BILINGUAL ───────────── */}
      {v === 4 && (
        <div>
          <div className="flex items-start justify-between gap-3">
            {header}
            <button onClick={() => setBig((b) => !b)} aria-pressed={big} className={cn("flex shrink-0 items-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-[15px] font-bold", big ? "border-pine-700 bg-pine-700 text-white" : "border-border bg-card")}>
              <Type className="size-5" /> {big ? "Normal" : "Bigger"}
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {ACTS.map((a) => (
              <Do key={a.key} a={a} className={cn("flex flex-col items-center justify-center rounded-3xl bg-card p-3 text-center ring-2 ring-border active:scale-[0.97]", big ? "min-h-[176px]" : "min-h-[156px]")}>
                <span className={cn("grid place-items-center rounded-full text-white", a.solid, big ? "size-16" : "size-14")}><a.icon className={big ? "size-9" : "size-8"} strokeWidth={2} /></span>
                <span className={cn("mt-2 font-bold leading-tight", big ? "text-[20px]" : "text-[17px]")}>{a.en}</span>
                <Urdu className={cn("text-foreground/75", big ? "text-[19px]" : "text-[16px]")}>{a.ur}</Urdu>
              </Do>
            ))}
          </div>
          <Link href={MORE.href} className="mt-3 flex min-h-[72px] items-center justify-center gap-3 rounded-3xl bg-secondary text-[18px] font-bold">
            <LayoutGrid className="size-7" /> {MORE.en} · <Urdu className="text-[17px] font-normal">{MORE.ur}</Urdu>
          </Link>
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
