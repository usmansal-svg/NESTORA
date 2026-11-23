"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Megaphone, CalendarCheck, Compass, Home, Sparkles, UserRound, Siren } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/lib/store";
import { Logo } from "@/components/shared/logo";
import { ApartmentSwitcher } from "./apartment-switcher";
import { SosButton } from "./sos";

export const RES_TABS = [
  { href: "/resident", label: "Home", icon: Home },
  { href: "/resident/building/announcements", label: "Notices", icon: Megaphone },
  { href: "/resident/explore", label: "Explore", icon: Compass },
  { href: "/resident/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/resident/account", label: "Account", icon: UserRound },
];

const isActive = (path: string, href: string) => (href === "/resident" ? path === "/resident" || (path.startsWith("/resident/building") && !path.startsWith("/resident/building/announcements")) : path.startsWith(href));

export function ResidentShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const unread = useDemo((s) => s.notifications.filter((n) => !n.read && (!n.role || n.role === "resident")).length);
  const bookings = useDemo((s) => s.bookings.filter((b) => ["Upcoming", "Confirmed", "In Progress"].includes(b.status)).length);

  return (
    <div className="min-h-dvh bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border/70 bg-sand-50 px-4 py-6 lg:flex">
        <Link href="/resident" className="px-2"><Logo /></Link>
        <div className="mt-6"><ApartmentSwitcher variant="sidebar" /></div>
        <nav className="mt-6 flex flex-col gap-1">
          {RES_TABS.map((t) => {
            const a = isActive(path, t.href);
            return (
              <Link key={t.href} href={t.href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-medium transition", a ? "bg-primary text-white shadow-soft" : "text-foreground/75 hover:bg-secondary")}>
                <t.icon className="size-[19px]" strokeWidth={a ? 2.2 : 1.8} />
                {t.label}
                {t.label === "Bookings" && bookings > 0 && <span className={cn("ml-auto rounded-full px-2 text-[11px]", a ? "bg-white/15" : "bg-pine-100 text-pine-800")}>{bookings}</span>}
              </Link>
            );
          })}
          <div className="my-3 h-px bg-border" />
          <Link href="/resident/notifications" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-medium transition", path.startsWith("/resident/notifications") ? "bg-primary text-white" : "text-foreground/75 hover:bg-secondary")}>
            <Bell className="size-[19px]" strokeWidth={1.8} /> Notifications
            {unread > 0 && <span className="ml-auto rounded-full bg-danger px-2 text-[11px] text-white">{unread}</span>}
          </Link>
          <Link href="/resident/assistant" className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-medium transition", path.startsWith("/resident/assistant") ? "bg-primary text-white" : "text-foreground/75 hover:bg-secondary")}>
            <Sparkles className="size-[19px]" strokeWidth={1.8} /> Nestora AI
            <span className="ml-auto rounded-full bg-lime-soft px-2 text-[10.5px] font-semibold text-pine-800">NEW</span>
          </Link>
        </nav>
        <div className="mt-auto pb-12">
          <SosButton trigger={<button className="flex w-full items-center gap-3 rounded-xl border border-danger/20 bg-danger-soft px-3 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10"><Siren className="size-[18px]" /> Emergency SOS</button>} />
        </div>
      </aside>

      <main className="lg:pl-[264px]">
        <div className="mx-auto w-full max-w-[1120px] px-4 pb-32 sm:px-6 lg:px-10 lg:pb-16">{children}</div>
      </main>

      {/* Mobile tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/90 pb-safe backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-xl grid-cols-5 px-2">
          {RES_TABS.map((t) => {
            const a = isActive(path, t.href);
            return (
              <Link key={t.href} href={t.href} className="relative flex flex-col items-center gap-1 pb-2.5 pt-2.5 text-[10.5px] font-medium">
                <span className={cn("grid h-8 w-14 place-items-center rounded-full transition-all duration-300", a ? "bg-pine-100 text-pine-800" : "text-muted-foreground")}>
                  <t.icon className="size-[21px]" strokeWidth={a ? 2.2 : 1.7} />
                </span>
                <span className={a ? "text-pine-900" : "text-muted-foreground"}>{t.label}</span>
                {t.label === "Bookings" && bookings > 0 && <span className="absolute right-[22%] top-2 grid min-w-4 place-items-center rounded-full bg-pine-700 px-1 text-[9.5px] text-white">{bookings}</span>}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function BellButton({ dark }: { dark?: boolean }) {
  const unread = useDemo((s) => s.notifications.filter((n) => !n.read && (!n.role || n.role === "resident")).length);
  return (
    <Link href="/resident/notifications" className={cn("relative grid size-10 place-items-center rounded-full transition", dark ? "bg-white/10 text-white hover:bg-white/15" : "border border-border bg-card hover:bg-secondary")} aria-label="Notifications">
      <Bell className="size-[19px]" />
      {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid min-w-[18px] place-items-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white ring-2 ring-pine-900">{unread}</span>}
    </Link>
  );
}
