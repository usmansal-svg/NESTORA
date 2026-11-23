"use client";
import * as React from "react";
import { Camera, Check, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { StaffRole } from "@/lib/types";
import { cn, DAYS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox, Select } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Field } from "@/components/shared/pickers";

export const STAFF_ROLES: StaffRole[] = ["Maid", "Driver", "Cook", "Nanny", "Cleaner", "Gardener", "Caregiver", "Personal Trainer", "Tutor", "Service Provider"];
const HOURS = Array.from({ length: 18 }, (_, i) => `${String(6 + i).padStart(2, "0")}:00`);
const hl = (t: string) => { const h = +t.slice(0, 2); return `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`; };

export function StaffSheet({ open, onOpenChange, preset }: { open: boolean; onOpenChange: (o: boolean) => void; preset?: { name: string; role: StaffRole; phone: string; photo?: string } }) {
  const add = useDemo((s) => s.addStaff);
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState<StaffRole>("Maid");
  const [phone, setPhone] = React.useState("+92 3");
  const [days, setDays] = React.useState([1, 2, 3, 4, 5, 6]);
  const [from, setFrom] = React.useState("08:00");
  const [to, setTo] = React.useState("12:00");
  const [photo, setPhoto] = React.useState(false);
  const [consent, setConsent] = React.useState(false);
  React.useEffect(() => { if (open && preset) { setName(preset.name); setRole(preset.role); setPhone(preset.phone); setPhoto(!!preset.photo); } }, [open, preset]);

  const save = () => {
    if (!name || !consent) { toast.error(!name ? "Enter the worker's name" : "Please confirm worker consent"); return; }
    add({ name, role, phone, days, from, to, verified: !!preset, photo: preset?.photo, consentId: consent });
    toast.success(`${name} can now enter`, { description: `${days.map((d) => DAYS[d]).join(", ")} · ${hl(from)} – ${hl(to)}. Guards recognise them automatically.` });
    onOpenChange(false);
    setName(""); setPhone("+92 3"); setConsent(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader><SheetTitle>{preset ? "Set gate access" : "Register household staff"}</SheetTitle><SheetDescription>Recurring access — guards see them on the expected list only within their window.</SheetDescription></SheetHeader>
        <SheetBody className="space-y-4">
          <button type="button" onClick={() => setPhoto(!photo)} className={cn("flex w-full items-center gap-3 rounded-2xl border border-dashed p-3 text-left text-sm", photo ? "border-pine-500 bg-pine-50" : "")}>
            <span className="grid size-12 place-items-center rounded-full bg-secondary">{photo ? <Check className="size-5 text-pine-700" /> : <Camera className="size-5 text-muted-foreground" />}</span>
            <span><span className="block font-medium">{photo ? "Photo added" : "Upload photograph"}</span><span className="block text-xs text-muted-foreground">Shown to guards at entry</span></span>
          </button>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" /></Field>
            <Field label="Mobile"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          </div>
          <Field label="Role"><Select value={role} onValueChange={(v) => setRole(v as StaffRole)} options={STAFF_ROLES.map((r) => ({ value: r, label: r }))} /></Field>
          <Field label="Days allowed">
            <div className="flex gap-1.5">{DAYS.map((d, i) => <button key={d} type="button" onClick={() => setDays(days.includes(i) ? days.filter((x) => x !== i) : [...days, i].sort())} className={cn("h-10 flex-1 rounded-xl border text-xs font-medium", days.includes(i) ? "border-pine-700 bg-pine-800 text-white" : "bg-card")}>{d}</button>)}</div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="From"><Select value={from} onValueChange={setFrom} options={HOURS.map((h) => ({ value: h, label: hl(h) }))} /></Field>
            <Field label="Until"><Select value={to} onValueChange={setTo} options={HOURS.filter((h) => h > from).map((h) => ({ value: h, label: hl(h) }))} /></Field>
          </div>
          <label className="flex items-start gap-3 rounded-2xl bg-secondary/70 p-3.5 text-[13px]">
            <Checkbox checked={consent} onCheckedChange={(c) => setConsent(!!c)} className="mt-0.5" />
            <span>I confirm the worker has consented to sharing their photo and CNIC with building security. CNIC is verified once by management and never shown to other residents.</span>
          </label>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-3.5 text-pine-600" /> Sensitive identity data is access-controlled and encrypted.</p>
        </SheetBody>
        <SheetFooter><Button size="lg" className="w-full" onClick={save}>Grant access</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
