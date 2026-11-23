"use client";
import { Check, Clock, Phone, X, Bike, Car, User } from "lucide-react";
import { toast } from "sonner";
import type { Visitor } from "@/lib/types";
import { useDemo } from "@/lib/store";
import { ago } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LiveDot } from "@/components/shared/kit";

export function VisitorApprovalCard({ v, compact }: { v: Visitor; compact?: boolean }) {
  const decide = useDemo((s) => s.decideVisitor);
  const Icon = v.type === "delivery" ? Bike : v.vehicle ? Car : User;
  return (
    <div className="relative overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-soft to-card p-4 shadow-soft">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-500/15 text-amber-700"><Icon className="size-5" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[11.5px] font-semibold uppercase tracking-wider text-amber-700"><LiveDot tone="amber" /> Waiting at {v.gate?.split(" —")[0] ?? "gate"} · {ago(v.requestedAt ?? v.validFrom)}</div>
          <div className="mt-1 text-[15.5px] font-semibold">{v.name}</div>
          <div className="text-[13px] text-muted-foreground">{v.purpose ?? "Visit"} · {v.phone}{v.vehicle ? ` · ${v.vehicle}` : ""}</div>
        </div>
      </div>
      {!compact && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="size-3.5" /> Not pre-registered. Guard Rizwan is waiting for your decision.</p>}
      <div className="mt-3 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 border-danger/30 text-danger hover:bg-danger-soft" onClick={() => { decide(v.id, false); toast("Entry rejected", { description: `Guard notified — ${v.name} will not be allowed in.` }); }}><X /> Reject</Button>
        <Button size="sm" className="flex-[1.4]" onClick={() => { decide(v.id, true); toast.success("Entry approved", { description: `Guard notified. You'll get an alert when ${v.name.split(" ")[0]} enters.` }); }}><Check /> Approve entry</Button>
        <Button variant="outline" size="icon-sm" asChild><a href={`tel:${v.phone.replace(/\s/g, "")}`} aria-label="Call"><Phone /></a></Button>
      </div>
    </div>
  );
}
