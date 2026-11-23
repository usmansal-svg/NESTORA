"use client";
import * as React from "react";
import { AlertTriangle, BadgeCheck, LogIn, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { StaffPermission } from "@/lib/types";
import { DAYS, cn, fmtTime } from "@/lib/utils";
import { SearchBar } from "@/components/shared/kit";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const extra: StaffPermission[] = [
  { id: "GX-1", apt: "B-0904", name: "Naseem Akhtar", role: "Maid", phone: "", days: [1, 2, 3, 4, 5, 6], from: "09:00", to: "14:00", status: "active", verified: true, since: "2025", log: [] },
  { id: "GX-2", apt: "C-1503", name: "Abdul Ghafoor", role: "Driver", phone: "", days: [0, 1, 2, 3, 4, 5, 6], from: "08:00", to: "20:00", status: "active", verified: false, since: "2026", log: [] },
];

function windowState(s: StaffPermission) {
  const d = new Date();
  const hm = d.getHours() * 60 + d.getMinutes();
  const [fh, fm] = s.from.split(":").map(Number); const [th, tm] = s.to.split(":").map(Number);
  if (s.status !== "active") return { ok: false, msg: s.status === "paused" ? "Access paused by resident" : "Access revoked" };
  if (!s.days.includes(d.getDay())) return { ok: false, msg: `Not scheduled on ${DAYS[d.getDay()]}` };
  if (hm < fh * 60 + fm - 30 || hm > th * 60 + tm + 30) return { ok: false, msg: `Outside authorised hours (${s.from}–${s.to})` };
  return { ok: true, msg: `Authorised ${s.from}–${s.to}` };
}

export default function GuardStaff() {
  const staff = useDemo((s) => s.staff);
  const move = useDemo((s) => s.staffMove);
  const notify = useDemo((s) => s.notify);
  const [q, setQ] = React.useState("");
  const [local, setLocal] = React.useState<Record<string, boolean>>({});
  const all = [...staff, ...extra].filter((s) => !q || `${s.name} ${s.apt} ${s.role}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <SearchBar value={q} onChange={setQ} placeholder="Search name, apartment or role" />
      {all.map((s) => {
        const w = windowState(s);
        const inside = s.id.startsWith("GX") ? !!local[s.id] : !!s.log[0] && !s.log[0].out;
        return (
          <div key={s.id} className="rounded-2xl border bg-card p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <Avatar src={s.photo} name={s.name} className="size-14" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold">{s.name}{s.verified && <BadgeCheck className="size-4 text-pine-600" />}</div>
                <div className="text-sm text-muted-foreground">{s.role} · {s.apt}</div>
                <div className={cn("mt-1 text-xs font-medium", w.ok ? "text-pine-700" : "text-danger")}>{w.msg}</div>
              </div>
              {inside ? <Badge variant="info">Inside{s.log[0] && !s.id.startsWith("GX") ? ` · ${fmtTime(s.log[0].in)}` : ""}</Badge> : <Badge variant="muted">Outside</Badge>}
            </div>
            {!s.verified && <div className="mt-3 flex items-center gap-2 rounded-xl bg-amber-soft p-2.5 text-xs text-amber-900"><AlertTriangle className="size-4" /> CNIC verification pending. Check original CNIC at the gate.</div>}
            <div className="mt-3 flex gap-2">
              {!inside ? (
                <Button className="flex-1" variant={w.ok ? "default" : "outline"} onClick={() => {
                  if (!w.ok) { if (s.apt === "A-1204") notify({ kind: "staff", title: `${s.name} is at the gate`, body: `${w.msg}. Approve one-time entry?`, role: "resident", href: "/resident/building/staff", channels: ["push"] }); toast(`Resident asked to approve ${s.name}`, { description: w.msg }); return; }
                  if (s.id.startsWith("GX")) setLocal({ ...local, [s.id]: true }); else move(s.id, "in");
                  toast.success(`${s.name} checked in`, { description: `${s.apt} notified` });
                }}><LogIn /> {w.ok ? "Check in" : "Ask resident"}</Button>
              ) : (
                <Button className="flex-1" variant="outline" onClick={() => { if (s.id.startsWith("GX")) setLocal({ ...local, [s.id]: false }); else move(s.id, "out"); toast.success(`${s.name} checked out`); }}><LogOut /> Check out</Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
