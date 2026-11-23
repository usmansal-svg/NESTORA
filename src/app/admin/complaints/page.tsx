"use client";
import * as React from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { Clock, Paperclip, UserCheck } from "lucide-react";

import { useDemo } from "@/lib/store";
import type { Complaint, ComplaintStatus } from "@/lib/types";
import { COMPLAINT_TREND } from "@/data/admin";
import { ago } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { ComplaintSheet, prioVariant } from "@/components/admin/complaint-sheet";
import { Stat, Stars } from "@/components/shared/kit";

import { Badge } from "@/components/ui/badge";





const COLS: { key: string; label: string; match: (c: Complaint) => boolean }[] = [
  { key: "new", label: "New", match: (c) => c.status === "Submitted" || c.status === "Reopened" },
  { key: "ack", label: "Acknowledged", match: (c) => c.status === "Acknowledged" },
  { key: "work", label: "Assigned / In progress", match: (c) => c.status === "Assigned" || c.status === "In Progress" },
  { key: "done", label: "Resolved", match: (c) => c.status === "Resolved" },
];

export default function Complaints() {
  const complaints = useDemo((s) => s.complaints);
  const [sel, setSel] = React.useState<string | null>(null);
  const c = complaints.find((x) => x.id === sel) ?? null;

  return (
    <>
      <AdminHeader title="Complaints" subtitle="Track every request from submission to resident sign-off" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Open" value={complaints.filter((c) => c.status !== "Resolved").length} tone="amber" />
        <Stat label="Avg. first response" value="42 min" sub="target 2 h" trend={{ v: "18%", up: false, good: true }} />
        <Stat label="Avg. resolution" value="19 h" sub="target 48 h" />
        <Stat label="Satisfaction" value="4.4 / 5" sub="last 30 days" tone="lime" />
      </div>
      <div className="grid gap-3 lg:grid-cols-4">
        {COLS.map((col) => {
          const items = complaints.filter(col.match);
          return (
            <div key={col.key} className="rounded-2xl bg-secondary/50 p-2.5">
              <div className="flex items-center justify-between px-1.5 pb-2 text-[13px] font-semibold">{col.label}<span className="rounded-full bg-card px-2 text-xs text-muted-foreground">{items.length}</span></div>
              <div className="flex flex-col gap-2">
                {items.map((x) => (
                  <button key={x.id} onClick={() => setSel(x.id)} className="rounded-xl border border-border/70 bg-card p-3 text-left shadow-soft transition hover:shadow-lift">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground"><span className="font-mono">{x.id}</span><Badge variant={prioVariant(x.priority)}>{x.priority}</Badge></div>
                    <div className="mt-1.5 text-[13.5px] font-medium leading-snug">{x.title}</div>
                    <div className="mt-2 flex items-center gap-2 text-[11.5px] text-muted-foreground"><span>{x.apt}</span>·<span>{x.category}</span>{x.attachments > 0 && <span className="flex items-center gap-0.5"><Paperclip className="size-3" />{x.attachments}</span>}<span className="ml-auto flex items-center gap-1"><Clock className="size-3" />{ago(x.createdAt)}</span></div>
                    {x.assignee && <div className="mt-2 flex items-center gap-1 text-[11.5px] text-pine-700"><UserCheck className="size-3" />{x.assignee}</div>}
                    {x.status === "Reopened" && <Badge variant="danger" className="mt-2">Reopened by resident</Badge>}
                    {x.rating && <Stars value={x.rating} className="mt-2" />}
                  </button>
                ))}
                {items.length === 0 && <div className="py-6 text-center text-xs text-muted-foreground">Nothing here</div>}
              </div>
            </div>
          );
        })}
      </div>
      <Panel title="Weekly trend" subtitle="Opened vs resolved" className="mt-4">
        <div className="h-[160px]"><ResponsiveContainer><BarChart data={COMPLAINT_TREND}><XAxis dataKey="w" fontSize={12} tickLine={false} axisLine={false} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} cursor={{ fill: "var(--color-pine-50)" }} /><Bar dataKey="opened" name="Opened" fill="#d9a441" radius={[6, 6, 0, 0]} /><Bar dataKey="resolved" name="Resolved" fill="var(--color-pine-600)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Panel>
      <ComplaintSheet c={c} onClose={() => setSel(null)} by="Sadia Q. (Admin)" />
    </>
  );
}

