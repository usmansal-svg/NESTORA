"use client";
import * as React from "react";
import { Flame, HeartPulse, ShieldAlert, Siren, Phone, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

const TYPES = [
  { id: "medical", label: "Medical", icon: HeartPulse, hint: "Alerts security & nearest first-aider. Call 1122 if critical." },
  { id: "fire", label: "Fire / smoke", icon: Flame, hint: "Alerts security & fire wardens. Use stairs, not lifts." },
  { id: "security", label: "Intruder / threat", icon: ShieldAlert, hint: "Guards dispatched to your apartment immediately." },
];

export function SosButton({ trigger }: { trigger: React.ReactNode }) {
  const [type, setType] = React.useState<string | null>(null);
  const [hold, setHold] = React.useState(0);
  const [sent, setSent] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const notify = useDemo((s) => s.notify);
  const apt = useDemo((s) => s.apartment);

  const start = () => {
    if (!type || sent) return;
    timer.current = setInterval(() => setHold((h) => {
      if (h >= 100) {
        clearInterval(timer.current!);
        setSent(true);
        notify({ kind: "emergency", title: `SOS: ${TYPES.find((t) => t.id === type)?.label} — ${apt}`, body: "Resident triggered emergency assistance. Respond immediately.", role: "guard", href: "/guard" });
        toast.error("SOS sent to building security", { description: "Guard Rizwan has been alerted. Stay on the line." });
        return 100;
      }
      return h + 5;
    }), 60);
  };
  const stop = () => { if (timer.current) clearInterval(timer.current); if (!sent) setHold(0); };

  return (
    <Dialog onOpenChange={(o) => { if (!o) { setType(null); setHold(0); setSent(false); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-danger"><Siren className="size-5" /> Emergency assistance</DialogTitle>
          <DialogDescription>Alerts on-duty guards and your emergency contacts with your location: {apt}, Ocean Heights.</DialogDescription>
        </DialogHeader>
        {sent ? (
          <div className="flex flex-col items-center py-4 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-danger-soft text-danger"><CheckCircle2 className="size-8" /></span>
            <div className="mt-3 text-lg font-semibold">Help is on the way</div>
            <p className="mt-1 text-sm text-muted-foreground">Guard Rizwan acknowledged · ETA 2 min. Your emergency contact Mariam has been notified.</p>
            <div className="mt-5 grid w-full grid-cols-2 gap-2">
              <Button variant="outline" asChild><a href="tel:+922135340000"><Phone /> Call security</a></Button>
              <Button variant="destructive" asChild><a href="tel:1122"><Phone /> Call 1122</a></Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button key={t.id} onClick={() => setType(t.id)} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-[13px] font-medium transition", type === t.id ? "border-danger bg-danger-soft text-danger" : "border-border hover:border-danger/40")}>
                  <t.icon className="size-6" /> {t.label}
                </button>
              ))}
            </div>
            {type && <p className="rounded-xl bg-secondary px-3 py-2 text-[13px] text-muted-foreground">{TYPES.find((t) => t.id === type)?.hint}</p>}
            <button
              disabled={!type}
              onPointerDown={start} onPointerUp={stop} onPointerLeave={stop}
              className="relative h-16 select-none overflow-hidden rounded-2xl bg-danger text-base font-semibold text-white disabled:opacity-40"
            >
              <span className="absolute inset-y-0 left-0 bg-black/20 transition-[width]" style={{ width: `${hold}%` }} />
              <span className="relative">{type ? "Press and hold to send SOS" : "Choose an emergency type"}</span>
            </button>
            <p className="text-center text-xs text-muted-foreground">Hold for 1 second to prevent accidental alerts.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
