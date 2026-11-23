"use client";
import { QRCodeSVG } from "qrcode.react";
import { Copy, MessageCircle, MessageSquare, Share2 } from "lucide-react";
import { toast } from "sonner";
import type { Visitor } from "@/lib/types";
import { fmtDate, fmtTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/shared/logo";

export function shareText(v: Visitor) {
  return `Assalam-o-Alaikum ${v.name.split(" ")[0]}! You're invited to Ocean Heights, DHA Phase VIII (Apt ${v.apt}).\n\nDate: ${fmtDate(v.validFrom, { weekday: "short", day: "numeric", month: "short" })}, ${fmtTime(v.validFrom)} – ${fmtTime(v.validTo)}\nGate pass: ${v.code}\n\nShow this QR at Gate 1: https://nestora.pk/p/${v.code}`;
}

export function VisitorPass({ v }: { v: Visitor }) {
  const text = shareText(v);
  return (
    <div>
      <div className="relative overflow-hidden rounded-3xl bg-pine-900 p-5 text-white">
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-lime-accent/10 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2"><LogoMark inverted className="size-7" /><span className="text-sm font-semibold tracking-[0.14em]">NESTORA</span></div>
          <span className="rounded-full bg-lime-accent px-2.5 py-0.5 text-[11px] font-semibold text-pine-950">GATE PASS</span>
        </div>
        <div className="relative mt-4 flex items-center gap-4">
          <div className="rounded-2xl bg-white p-2.5"><QRCodeSVG value={`NESTORA:${v.code}:${v.apt}`} size={112} fgColor="var(--color-pine-900)" level="M" /></div>
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-white/50">Guest</div>
            <div className="truncate text-lg font-semibold">{v.name}</div>
            <div className="mt-2 text-[11px] uppercase tracking-wider text-white/50">Valid</div>
            <div className="text-[13px] font-medium">{fmtDate(v.validFrom, { weekday: "short", day: "numeric", month: "short" })}</div>
            <div className="text-[13px] text-white/75">{fmtTime(v.validFrom)} – {fmtTime(v.validTo)}</div>
          </div>
        </div>
        <div className="relative mt-4 flex items-center justify-between border-t border-dashed border-white/20 pt-3 text-[12.5px]">
          <span className="text-white/60">Ocean Heights · {v.apt}{v.vehicle ? ` · ${v.vehicle}` : ""}</span>
          <span className="font-mono font-semibold tracking-wider text-lime-accent">{v.code}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50" asChild>
          <a href={`https://wa.me/${v.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(text)}`} target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp</a>
        </Button>
        <Button variant="outline" asChild><a href={`sms:${v.phone.replace(/\s/g, "")}?body=${encodeURIComponent(text)}`}><MessageSquare /> SMS</a></Button>
        <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(text); toast.success("Invitation copied"); }}><Copy /> Copy</Button>
      </div>
      {typeof navigator !== "undefined" && "share" in navigator && (
        <Button variant="ghost" className="mt-1 w-full" onClick={() => navigator.share({ title: "Ocean Heights gate pass", text }).catch(() => {})}><Share2 /> More sharing options</Button>
      )}
      <p className="mt-2 text-center text-xs text-muted-foreground">Unique, time-limited pass. Guards verify it automatically at the gate.</p>
    </div>
  );
}
