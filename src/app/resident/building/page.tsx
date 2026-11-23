"use client";
import Link from "next/link";
import {
  ArrowUpDown, Calendar, CircleParking, Droplets, FileText, Megaphone, Package, Receipt, ShieldCheck, UserCheck, UserPlus, Wrench, Zap,
} from "lucide-react";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { BUILDING } from "@/data/seed";
import { IMG } from "@/lib/img";
import { cn, pkr } from "@/lib/utils";
import { PageHeader, LiveDot, IconBubble, type Tone } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { BellButton } from "@/components/resident/shell";
import { VisitorApprovalCard } from "@/components/resident/visitor-approval";

export default function BuildingHub() {
  const s = useDemo();
  const live = useLiveUtilities();
  const pending = s.visitors.filter((v) => v.status === "pending" && v.apt === "A-1204");
  const due = s.bills.filter((b) => b.status !== "paid").reduce((a, b) => a + b.items.reduce((x, i) => x + i.amount, 0), 0);
  const parcels = s.parcels.filter((p) => p.apt === "A-1204" && ["awaiting", "reception"].includes(p.status)).length;
  const openC = s.complaints.filter((c) => c.apt === "A-1204" && c.status !== "Resolved").length;
  const expected = s.visitors.filter((v) => v.apt === "A-1204" && ["expected", "approved"].includes(v.status)).length;

  const modules: { href: string; label: string; sub: string; icon: typeof Zap; tone: Tone; badge?: string | number }[] = [
    { href: "/resident/building/visitors", label: "Visitors", sub: `${expected} expected · QR passes`, icon: UserPlus, tone: "pine", badge: pending.length || undefined },
    { href: "/resident/building/security", label: "Security", sub: "Approvals, guard chat, SOS", icon: ShieldCheck, tone: "dark" },
    { href: "/resident/building/staff", label: "Staff access", sub: `${s.staff.filter((x) => x.status === "active").length} active permissions`, icon: UserCheck, tone: "violet" },
    { href: "/resident/building/parcels", label: "My parcels", sub: parcels ? `${parcels} ready to collect` : "Smart lockers", icon: Package, tone: "sky", badge: parcels || undefined },
    { href: "/resident/building/payments", label: "Payments", sub: due ? `${pkr(due)} outstanding` : "All paid", icon: Receipt, tone: "lime" },
    { href: "/resident/building/complaints", label: "Complaints", sub: `${openC} open request${openC === 1 ? "" : "s"}`, icon: Wrench, tone: "amber" },
    { href: "/resident/building/announcements", label: "Notices & polls", sub: "Announcements, votes, events", icon: Megaphone, tone: "rose" },
    { href: "/resident/building/utilities", label: "Water & power", sub: `Tank ${Math.round(live.ugTank)}% · Grid ${live.grid.toLowerCase()}`, icon: Droplets, tone: "teal" },
    { href: "/resident/building/parking", label: "Parking", sub: "Bays, guests, EV spaces", icon: CircleParking, tone: "stone" },
    { href: "/resident/building/amenities", label: "Amenities", sub: "Pool, gym, hall, rooftop", icon: Calendar, tone: "pine" },
    { href: "/resident/building/documents", label: "Documents & governance", sub: "Bylaws, AGM, committee", icon: FileText, tone: "stone" },
  ];

  return (
    <div>
      <PageHeader title="Building" subtitle={`${BUILDING.name} · ${BUILDING.area}`} actions={<BellButton />} />
      <div className="relative h-40 overflow-hidden rounded-3xl sm:h-52">
        <Photo id={IMG.building} w={1400} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-pine-950/90 via-pine-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5 text-white">
          <div>
            <div className="text-xl font-semibold tracking-tight sm:text-2xl">Ocean Heights</div>
            <div className="text-[13px] text-white/70">3 towers · 22 floors · {BUILDING.apartments} apartments · Managed by OHOA</div>
          </div>
          <div className="flex gap-2 text-[12px]">
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur"><LiveDot /> Grid on</span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur"><ArrowUpDown className="size-3" /> 5/6 lifts</span>
          </div>
        </div>
      </div>

      {pending.length > 0 && <div className="mt-5 space-y-3">{pending.map((v) => <VisitorApprovalCard key={v.id} v={v} />)}</div>}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {modules.map((m) => (
          <Link key={m.href} href={m.href} className="group relative flex flex-col rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <IconBubble icon={m.icon} tone={m.tone} size="lg" />
            <div className="mt-4 font-semibold leading-tight">{m.label}</div>
            <div className="mt-0.5 text-[12.5px] text-muted-foreground">{m.sub}</div>
            {m.badge && <span className={cn("absolute right-3 top-3 grid min-w-6 place-items-center rounded-full bg-danger px-1.5 text-xs font-semibold text-white")}>{m.badge}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}
