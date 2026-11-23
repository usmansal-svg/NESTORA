"use client";
import * as React from "react";
import { BellRing, Car, Mail, Phone, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import type { AptRow } from "@/data/admin";
import { useDemo } from "@/lib/store";
import { pkr } from "@/lib/utils";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyVal } from "@/components/shared/kit";

export function typeBadge(t: AptRow["type"]) {
  return <Badge variant={t === "Owner-occupied" ? "default" : t === "Tenant" ? "info" : "muted"}>{t}</Badge>;
}

export function AptSheet({ apt, onClose }: { apt: AptRow | null; onClose: () => void }) {
  const notify = useDemo((s) => s.notify);
  const staff = useDemo((s) => s.staff);
  const visitors = useDemo((s) => s.visitors);
  const [reveal, setReveal] = React.useState(false);
  React.useEffect(() => setReveal(false), [apt?.id]);
  if (!apt) return null;
  const mine = apt.id === "A-1204";
  const myStaff = mine ? staff.filter((s) => s.apt === "A-1204") : [];
  const masked = apt.phone.replace(/\d{3} \d{4}$/, "••• ••••");

  return (
    <Sheet open={!!apt} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="auto">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <Avatar src={apt.type === "Vacant" ? undefined : mine ? undefined : apt.photo} name={apt.owner} className="size-12" />
            <div><SheetTitle>{apt.id} · {apt.owner}</SheetTitle><SheetDescription>Tower {apt.tower}, floor {apt.floor} · {apt.sqft.toLocaleString()} sq ft</SheetDescription></div>
          </div>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-1.5">{typeBadge(apt.type)}{apt.dues > 0 ? <Badge variant="danger">Dues {pkr(apt.dues)}</Badge> : <Badge variant="muted">No dues</Badge>}</div>
          <div className="rounded-2xl border p-4">
            <KeyVal k="Owner" v={apt.owner} />
            <KeyVal k="Occupant" v={apt.occupant} />
            <KeyVal k="Residents" v={apt.residents} />
            <KeyVal k="Vehicles" v={<span className="flex items-center gap-1"><Car className="size-3.5" />{apt.vehicles}</span>} />
            <KeyVal k="Last payment" v={apt.lastPaid} />
            <KeyVal k="Phone" v={<span className="flex items-center gap-2 tabular">{reveal ? apt.phone : masked}<button className="text-xs font-medium text-pine-700" onClick={() => { setReveal(!reveal); if (!reveal) toast("Access logged", { description: "Viewing resident contact details is recorded in the audit trail." }); }}>{reveal ? "Hide" : "Reveal"}</button></span>} />
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-secondary/70 p-3 text-xs text-muted-foreground"><ShieldAlert className="mt-0.5 size-4 shrink-0" /> CNIC images and family details are visible only to the committee secretary and are not shown in this view.</div>
          {myStaff.length > 0 && (
            <div>
              <div className="mb-2 text-sm font-semibold">Registered household staff</div>
              <div className="flex flex-col gap-2">{myStaff.map((s) => <div key={s.id} className="flex items-center gap-3 rounded-xl border p-2.5"><Avatar src={s.photo} name={s.name} className="size-8" /><div className="flex-1 text-sm">{s.name}<div className="text-xs text-muted-foreground">{s.role} · {s.from}–{s.to}</div></div><Badge variant={s.status === "active" ? "default" : "muted"}>{s.status}</Badge></div>)}</div>
            </div>
          )}
          {mine && <div className="text-xs text-muted-foreground">{visitors.filter((v) => v.apt === "A-1204").length} visitor passes on record</div>}
        </SheetBody>
        <SheetFooter className="flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={() => toast("Calling via masked line…", { description: "The resident sees the management number, not yours." })}><Phone /> Call</Button>
          <Button variant="outline" className="flex-1" onClick={() => toast.success("Message sent on WhatsApp and in-app")}><Mail /> Message</Button>
          {apt.dues > 0 && (
            <Button className="flex-1" onClick={() => { if (mine) notify({ kind: "bill", title: "Payment reminder", body: `Your maintenance of ${pkr(apt.dues)} is due. Pay in the app with Raast, JazzCash, Easypaisa or card.`, href: "/resident/building/payments", channels: ["push", "whatsapp", "sms"], role: "resident" }); toast.success(`Reminder sent to ${apt.id}`, { description: "Push, WhatsApp and SMS" }); }}><BellRing /> Remind</Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
