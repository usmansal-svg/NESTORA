"use client";
import * as React from "react";
import Link from "next/link";
import { Bell, CalendarCheck, CheckCheck, Droplets, Megaphone, MessageCircle, MessageSquare, Package, Receipt, Settings2, ShieldAlert, Smartphone, UserCheck, UserPlus, Wrench, Zap, UtensilsCrossed } from "lucide-react";
import { useDemo } from "@/lib/store";
import type { Notification } from "@/lib/types";
import { ago, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chips, Empty, PageHeader, Section } from "@/components/shared/kit";

const ICON: Record<Notification["kind"], [typeof Bell, string]> = {
  visitor: [UserPlus, "bg-pine-50 text-pine-700"], parcel: [Package, "bg-sky-50 text-sky-700"], bill: [Receipt, "bg-lime-soft text-pine-800"], complaint: [Wrench, "bg-amber-soft text-amber-700"],
  announcement: [Megaphone, "bg-rose-50 text-rose-700"], booking: [CalendarCheck, "bg-violet-50 text-violet-700"], staff: [UserCheck, "bg-teal-50 text-teal-700"], utility: [Droplets, "bg-sky-50 text-sky-700"],
  emergency: [ShieldAlert, "bg-danger-soft text-danger"], order: [UtensilsCrossed, "bg-rose-50 text-rose-700"], ev: [Zap, "bg-lime-soft text-pine-800"], system: [Bell, "bg-secondary text-foreground/70"],
};

export default function NotificationsPage() {
  const s = useDemo();
  const [f, setF] = React.useState<"all" | "unread" | "read">("all");
  const [kind, setKind] = React.useState("All");
  const mine = s.notifications.filter((n) => !n.role || n.role === "resident");
  const list = mine.filter((n) => (f === "all" ? true : f === "unread" ? !n.read : n.read) && (kind === "All" || n.kind === kind.toLowerCase()));
  const sample = mine.find((n) => n.kind === "parcel") ?? mine[0];

  return (
    <div>
      <PageHeader back title="Notifications" subtitle={`${mine.filter((n) => !n.read).length} unread`} actions={<Button variant="outline" size="sm" onClick={s.markAllRead}><CheckCheck /> Mark all read</Button>} />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>
          <Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "unread", label: "Unread", count: mine.filter((n) => !n.read).length }, { value: "read", label: "Read" }]} />
          <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto text-[12.5px]">{["All", "Visitor", "Parcel", "Bill", "Complaint", "Utility", "Booking", "Announcement", "Staff"].map((k) => <button key={k} onClick={() => setKind(k)} className={cn("shrink-0 rounded-lg px-2.5 py-1", kind === k ? "bg-secondary font-semibold" : "text-muted-foreground")}>{k}</button>)}</div>
          <div className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-soft">
            {list.length === 0 && <div className="p-4"><Empty icon={Bell} title="You're all caught up" /></div>}
            {list.map((n) => {
              const [I, tone] = ICON[n.kind];
              return (
                <Link key={n.id} href={n.href ?? "#"} onClick={() => s.markRead(n.id)} className={cn("flex gap-3 border-b border-border/60 px-4 py-3.5 transition last:border-0 hover:bg-sand-50", !n.read && "bg-pine-50/40")}>
                  <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", tone)}><I className="size-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2"><span className={cn("text-[14.5px]", !n.read ? "font-semibold" : "font-medium")}>{n.title}</span><span className="shrink-0 text-[11.5px] text-muted-foreground">{ago(n.at)}</span></div>
                    <div className="text-[13px] text-muted-foreground">{n.body}</div>
                    {n.channels && <div className="mt-1.5 flex gap-2 text-[11px] text-muted-foreground">{n.channels.includes("push") && <span className="flex items-center gap-1"><Smartphone className="size-3" /> App</span>}{n.channels.includes("whatsapp") && <span className="flex items-center gap-1 text-emerald-700"><MessageCircle className="size-3" /> WhatsApp</span>}{n.channels.includes("sms") && <span className="flex items-center gap-1"><MessageSquare className="size-3" /> SMS</span>}</div>}
                  </div>
                  {!n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-pine-500" />}
                </Link>
              );
            })}
          </div>
        </div>
        <aside className="space-y-5">
          <Section title="On WhatsApp" className="mt-0">
            <div className="rounded-3xl bg-[#e9e2d6] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium text-stone-600"><span className="grid size-7 place-items-center rounded-full bg-pine-800 text-[10px] font-bold text-lime-accent">N</span> NESTORA · Verified business</div>
              {sample && (
                <div className="max-w-[92%] rounded-2xl rounded-tl-sm bg-white p-3 text-[13px] shadow-sm">
                  <div className="font-semibold">{sample.title}</div>
                  <div className="mt-1 text-stone-700">{sample.body}</div>
                  <div className="mt-2 text-right text-[10px] text-stone-400">{new Date(sample.at).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" })} ✓✓</div>
                  <div className="mt-2 grid gap-1 border-t pt-2 text-center text-[13px] font-medium text-sky-600"><span>Open in app</span><span>Get help</span></div>
                </div>
              )}
              <div className="ml-auto mt-2 w-fit rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-3 py-2 text-[13px] shadow-sm">Approve</div>
              <div className="mt-2 max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 text-[13px] shadow-sm">✅ Done — Gate 1 has been informed.</div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Reply-to-act WhatsApp templates for approvals, bills and parcels (designed for WhatsApp Business API).</p>
          </Section>
          <Link href="/resident/account?section=notifications" className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-sm font-medium shadow-soft"><Settings2 className="size-5 text-pine-600" /> Notification preferences</Link>
        </aside>
      </div>
    </div>
  );
}
