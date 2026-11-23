"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building, Wallet, Wrench, ShieldCheck, UserCog, CircleParking, CalendarDays, Megaphone, Gavel, Handshake, Store, PackageOpen, Truck, Droplets, Cpu, BarChart3, Settings, Bell, Search, Sparkles, ChevronsUpDown, Menu, Check,
} from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { BUILDINGS } from "@/data/admin";
import { face } from "@/lib/img";
import { ago, cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Avatar, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, Popover, PopoverContent, PopoverTrigger } from "@/components/ui/misc";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Assistant } from "@/components/shared/assistant";

export const ADMIN_NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Overview", icon: LayoutDashboard }] },
  { group: "Community", items: [
    { href: "/admin/residents", label: "Residents", icon: Users }, { href: "/admin/apartments", label: "Apartments", icon: Building },
    { href: "/admin/billing", label: "Billing & Accounting", icon: Wallet }, { href: "/admin/complaints", label: "Complaints", icon: Wrench },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone }, { href: "/admin/governance", label: "Governance", icon: Gavel },
  ] },
  { group: "Operations", items: [
    { href: "/admin/security", label: "Visitors & Security", icon: ShieldCheck }, { href: "/admin/staff", label: "Staff Management", icon: UserCog },
    { href: "/admin/parking", label: "Parking", icon: CircleParking }, { href: "/admin/facilities", label: "Facilities", icon: CalendarDays },
    { href: "/admin/vendors", label: "Vendors", icon: Handshake }, { href: "/admin/marketplace", label: "Marketplace", icon: Store },
  ] },
  { group: "Logistics & infrastructure", items: [
    { href: "/admin/lockers", label: "Parcel Lockers", icon: PackageOpen }, { href: "/admin/couriers", label: "Courier Management", icon: Truck },
    { href: "/admin/utilities", label: "Building Utilities", icon: Droplets }, { href: "/admin/smart-building", label: "Smart Building", icon: Cpu },
  ] },
  { group: "Insights", items: [{ href: "/admin/reports", label: "Reports & Analytics", icon: BarChart3 }, { href: "/admin/settings", label: "Settings", icon: Settings }] },
];

function Nav({ onNav }: { onNav?: () => void }) {
  const path = usePathname();
  const openC = useDemo((s) => s.complaints.filter((c) => c.status !== "Resolved").length);
  return (
    <nav className="flex flex-col gap-5">
      {ADMIN_NAV.map((g) => (
        <div key={g.group}>
          <div className="mb-1.5 px-3 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/35">{g.group}</div>
          <div className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const a = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
              return (
                <Link key={it.href} href={it.href} onClick={onNav} className={cn("flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13.5px] font-medium transition", a ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white")}>
                  <it.icon className={cn("size-4", a && "text-lime-accent")} /> {it.label}
                  {it.label === "Complaints" && <span className="ml-auto rounded-full bg-amber-500/20 px-1.5 text-[11px] text-amber-300">{openC}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const treasurer = path.startsWith("/admin/billing");
  const [bld, setBld] = React.useState("oh");
  const [ai, setAi] = React.useState(false);
  const [mnav, setMnav] = React.useState(false);
  const allNotes = useDemo((s) => s.notifications);
  const notes = React.useMemo(() => allNotes.filter((n) => n.role === "admin" || n.role === "supervisor" || n.role === "guard" || n.kind === "complaint").slice(0, 8), [allNotes]);
  const b = BUILDINGS.find((x) => x.id === bld)!;
  const theme = useDemo((s) => s.theme);

  return (
    <div className="min-h-dvh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col overflow-y-auto bg-pine-950 px-3 py-5 lg:flex">
        <Link href="/admin" className="px-3"><Logo inverted /></Link>
        <div className="mt-1 px-3 text-[11px] text-white/40">Management Portal</div>
        <div className="mt-6 flex-1 pb-16"><Nav /></div>
      </aside>
      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border/70 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <button className="grid size-9 place-items-center rounded-lg border bg-card lg:hidden" onClick={() => setMnav(true)}><Menu className="size-4" /></button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-xl border bg-card py-1.5 pl-1.5 pr-3 text-left shadow-soft">
                <span className="grid size-8 place-items-center rounded-lg bg-primary text-[11px] font-bold text-lime-accent">{(theme === "emaar" ? ({ oh: "PN", cc: "TV", et: "PE" } as Record<string, string>)[b.id] : b.name.split(" ").map((x) => x[0]).join(""))}</span>
                <span className="hidden sm:block"><span className="block text-[13px] font-semibold leading-tight">{b.name}</span><span className="block text-[11px] text-muted-foreground">{b.area} · {b.apts} apts</span></span>
                <ChevronsUpDown className="size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel>Your portfolio · 3 buildings</DropdownMenuLabel>
              {BUILDINGS.map((x) => <DropdownMenuItem key={x.id} onSelect={() => { setBld(x.id); toast.success(`Switched to ${x.name}`, { description: x.id === "oh" ? undefined : "Demo data shows Ocean Heights; data is isolated per building." }); }}><span className="flex-1"><span className="block font-medium">{x.name}</span><span className="block text-xs text-muted-foreground">{x.area} · {x.apts} apartments</span></span>{x.id === bld && <Check className="!text-pine-600" />}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          <label className="ml-2 hidden h-10 max-w-sm flex-1 items-center gap-2 rounded-xl border bg-card px-3 text-sm text-muted-foreground md:flex"><Search className="size-4" /><input placeholder="Search apartments, residents, receipts…" className="flex-1 bg-transparent outline-none" onKeyDown={(e) => { if (e.key === "Enter") toast(`Searching “${(e.target as HTMLInputElement).value}”`, { description: "Try Residents or Apartments for filters." }); }} /><kbd className="rounded border px-1.5 text-[10px]">⌘K</kbd></label>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setAi(true)} className="flex h-10 items-center gap-2 rounded-xl bg-primary px-3 text-sm font-medium text-white"><Sparkles className="size-4 text-lime-accent" /><span className="hidden sm:inline">Nestora AI</span></button>
            <Popover>
              <PopoverTrigger asChild><button className="relative grid size-10 place-items-center rounded-xl border bg-card"><Bell className="size-4" />{notes.length > 0 && <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />}</button></PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-2">
                <div className="px-2 py-1.5 text-sm font-semibold">Operations alerts</div>
                {notes.map((n) => <div key={n.id} className="rounded-xl px-2 py-2 hover:bg-secondary"><div className="text-[13px] font-medium">{n.title}</div><div className="text-xs text-muted-foreground">{n.body} · {ago(n.at)}</div></div>)}
              </PopoverContent>
            </Popover>
            <div className="flex items-center gap-2 rounded-xl border bg-card py-1 pl-1 pr-3">
              <Avatar src={treasurer ? face("m2") : face("w1")} name={treasurer ? "Tariq Mehmood" : "Sadia Qureshi"} className="size-8" />
              <div className="hidden text-left leading-tight sm:block"><div className="text-[13px] font-semibold">{treasurer ? "Tariq Mehmood" : "Sadia Qureshi"}</div><div className="text-[11px] text-muted-foreground">{treasurer ? "Treasurer" : "Administrator"}</div></div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      <Sheet open={mnav} onOpenChange={setMnav}>
        <SheetContent side="left" className="w-[280px] bg-pine-950 p-4"><SheetHeader className="px-1"><SheetTitle className="text-white"><Logo inverted /></SheetTitle><SheetDescription className="sr-only">Navigation</SheetDescription></SheetHeader><div className="overflow-y-auto pb-16"><Nav onNav={() => setMnav(false)} /></div></SheetContent>
      </Sheet>
      <Sheet open={ai} onOpenChange={setAi}>
        <SheetContent side="right" className="sm:w-[560px]">
          <SheetHeader><SheetTitle className="flex items-center gap-2"><Sparkles className="size-5 text-pine-600" /> Nestora AI · Management</SheetTitle><SheetDescription>Reads live building data. Financial and access decisions require human approval.</SheetDescription></SheetHeader>
          <div className="flex min-h-0 flex-1 flex-col px-6 pb-6"><Assistant mode="admin" className="flex-1" /></div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function AdminHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div><h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>{subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}</div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, subtitle }: { title?: React.ReactNode; action?: React.ReactNode; children: React.ReactNode; className?: string; subtitle?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-card shadow-soft", className)}>
      {title && <div className="flex items-center justify-between gap-2 px-5 pb-2 pt-4"><div><div className="text-[14.5px] font-semibold">{title}</div>{subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}</div>{action}</div>}
      <div className={title ? "px-5 pb-5" : "p-5"}>{children}</div>
    </div>
  );
}

export function Table<T>({ rows, cols, onRow, empty = "No records" }: { rows: T[]; cols: { h: string; c: (r: T) => React.ReactNode; className?: string }[]; onRow?: (r: T) => void; empty?: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-[13.5px]">
        <thead><tr className="border-b text-[11.5px] uppercase tracking-wider text-muted-foreground">{cols.map((c) => <th key={c.h} className={cn("px-3 py-2.5 font-medium first:pl-0", c.className)}>{c.h}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><td colSpan={cols.length} className="py-8 text-center text-muted-foreground">{empty}</td></tr>}
          {rows.map((r, i) => <tr key={i} onClick={() => onRow?.(r)} className={cn("border-b border-border/50 last:border-0", onRow && "cursor-pointer hover:bg-sand-50")}>{cols.map((c) => <td key={c.h} className={cn("px-3 py-3 first:pl-0", c.className)}>{c.c(r)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
