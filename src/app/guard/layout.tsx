"use client";
import { ClipboardList, DoorOpen, PackageOpen, ShieldCheck, UserCheck, WifiOff, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { face } from "@/lib/img";
import { OpsShell } from "@/components/ops/shell";
import { cn } from "@/lib/utils";

export default function GuardLayout({ children }: { children: React.ReactNode }) {
  const pending = useDemo((s) => s.visitors.filter((v) => v.status === "pending" || v.status === "approved").length);
  const online = useDemo((s) => s.guardOnline);
  const setOnline = useDemo((s) => s.setGuardOnline);
  return (
    <OpsShell app="Gate · Security" person="Rizwan Ali" role="Gate 1 · 2 PM – 10 PM" photo={face("m1")}
      tabs={[{ href: "/guard", label: "Gate", icon: ShieldCheck }, { href: "/guard/visitors", label: "Visitors", icon: DoorOpen, badge: pending }, { href: "/guard/staff", label: "Staff", icon: UserCheck }, { href: "/guard/parcels", label: "Parcels", icon: PackageOpen }, { href: "/guard/log", label: "Log", icon: ClipboardList }]}
      status={
        <button onClick={() => { setOnline(!online); toast(online ? "Offline mode" : "Back online", { description: online ? "Entries are saved on this device and sync when the connection returns." : "3 queued entries synced." }); }}
          className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", online ? "bg-white/10 text-white/80" : "bg-amber-400 text-amber-950")}>
          {online ? <Wifi className="size-3.5" /> : <WifiOff className="size-3.5" />}{online ? "Online" : "Offline"}
        </button>
      }>
      {!online && <div className="mb-4 flex items-center gap-2 rounded-xl bg-amber-soft p-3 text-sm text-amber-900"><WifiOff className="size-4" /> Offline. Pass codes are verified against the copy cached at 1:58 PM. New walk-ins will call the resident by phone.</div>}
      {children}
    </OpsShell>
  );
}
