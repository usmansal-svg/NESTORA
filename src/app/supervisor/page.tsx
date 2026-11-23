"use client";
import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ClipboardList, Fuel, ShieldAlert, Truck, Users, Wrench } from "lucide-react";
import { useDemo } from "@/lib/store";
import { useLiveUtilities } from "@/lib/live";
import { STAFF } from "@/data/admin";
import { ago, fmtTime } from "@/lib/utils";
import { BigAction } from "@/components/ops/shell";
import { List, Row, Section, Stat } from "@/components/shared/kit";
import { prioVariant } from "@/components/admin/complaint-sheet";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";

export default function SupervisorHome() {
  const complaints = useDemo((s) => s.complaints);
  const tasks = useDemo((s) => s.tasks);
  const incidents = useDemo((s) => s.incidents);
  const notes = useDemo((s) => s.notifications);
  const live = useLiveUtilities();
  const needs = complaints.filter((c) => c.status === "Submitted" || c.status === "Reopened" || c.status === "Acknowledged");
  const alerts = notes.filter((n) => n.role === "supervisor" && !n.read).slice(0, 3);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Good afternoon, Naveed</h1>
        <p className="text-sm text-muted-foreground">{needs.length} complaints need action · {tasks.filter((t) => t.status !== "Done").length} open tasks · {incidents.filter((i) => i.status === "Open").length} open incident</p>
      </div>
      {alerts.map((n) => <Link key={n.id} href={n.href ?? "/supervisor/complaints"} className="flex items-start gap-3 rounded-2xl bg-amber-soft p-4 text-amber-950"><AlertTriangle className="mt-0.5 size-5" /><div className="flex-1"><div className="font-semibold">{n.title}</div><div className="text-sm opacity-80">{n.body} · {ago(n.at)}</div></div></Link>)}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Staff present" value="37 / 40" icon={Users} />
        <Stat label="Diesel" value={`${live.fuel}%`} icon={Fuel} tone="amber" />
        <Stat label="UG tank" value={`${Math.round(live.ugTank)}%`} sub={`Tanker ${live.nextTanker}`} icon={Truck} tone="sky" />
        <Stat label="Lifts" value={`${live.lifts.filter((l) => l.status === "Operational").length}/6`} sub="B-2 in service" tone="stone" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <BigAction icon={Wrench} label="Complaints" sub={`${needs.length} need action`} href="/supervisor/complaints" tone="dark" />
        <BigAction icon={ClipboardList} label="Tasks" href="/supervisor/tasks" />
        <BigAction icon={Fuel} label="Log diesel / tanker" href="/supervisor/utilities" tone="lime" />
        <BigAction icon={ShieldAlert} label="Inspection round" href="/supervisor/inspections" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Section title="Needs action" action={<Link href="/supervisor/complaints" className="text-sm font-medium text-pine-700">All</Link>}>
          <List>{needs.slice(0, 5).map((c) => <Row key={c.id} href={`/supervisor/complaints?id=${c.id}`} icon={Wrench} tone="amber" title={c.title} subtitle={`${c.apt} · ${c.status} · ${ago(c.createdAt)}`} trailing={<Badge variant={prioVariant(c.priority)}>{c.priority}</Badge>} />)}{needs.length === 0 && <div className="p-4 text-sm text-muted-foreground">All caught up</div>}</List>
        </Section>
        <Section title="On duty now">
          <List>{STAFF.filter((s) => s.status !== "Off shift").slice(0, 6).map((s) => <Row key={s.name} leading={<Avatar src={s.photo} name={s.name} className="size-9" />} title={s.name} subtitle={`${s.role} · in ${s.in}`} trailing={<Badge variant={s.status === "Absent" ? "danger" : s.status === "On break" ? "warn" : "muted"}>{s.status}</Badge>} />)}</List>
        </Section>
      </div>
      <Section title="Due today">
        <List>{tasks.filter((t) => t.status !== "Done").map((t) => <Row key={t.id} href="/supervisor/tasks" icon={ClipboardList} title={t.title} subtitle={`${t.assignee} · ${t.area} · due ${fmtTime(t.due)}`} trailing={<Badge variant={t.status === "In Progress" ? "info" : "muted"}>{t.status}</Badge>} />)}</List>
      </Section>
    </div>
  );
}
