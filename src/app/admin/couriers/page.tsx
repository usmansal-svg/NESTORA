"use client";
import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Plug, Truck, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { ago } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Stat } from "@/components/shared/kit";
import { CourierMark } from "@/components/shared/courier";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/misc";

const PARTNERS = [
  { name: "TCS", share: 31, api: true, agents: 6, sla: "98%" }, { name: "Leopards", share: 18, api: false, agents: 4, sla: "95%" },
  { name: "M&P", share: 9, api: false, agents: 2, sla: "93%" }, { name: "Daraz", share: 22, api: true, agents: 5, sla: "96%" },
  { name: "PostEx", share: 8, api: true, agents: 3, sla: "94%" }, { name: "Trax", share: 7, api: false, agents: 2, sla: "92%" },
  { name: "BlueEX", share: 5, api: false, agents: 1, sla: "90%" },
];
const C = ["var(--color-pine-700)", "var(--color-pine-500)", "var(--color-pine-400)", "var(--color-pine-300)", "#d9a441", "#e9c46a", "#b4b0a5"];
const AGENTS = [
  { name: "Imran Siddiqui", co: "TCS", cnic: true, last: 35, n: 412 }, { name: "Waseem Abbas", co: "Leopards", cnic: true, last: 120, n: 188 },
  { name: "Adnan Khan", co: "Daraz", cnic: true, last: 300, n: 356 }, { name: "Salman Raza", co: "PostEx", cnic: false, last: 1440, n: 12 },
];

export default function Couriers() {
  const parcels = useDemo((s) => s.parcels);
  const [on, setOn] = React.useState<Record<string, boolean>>(Object.fromEntries(PARTNERS.map((p) => [p.name, true])));
  return (
    <>
      <AdminHeader title="Courier Management" subtitle="Partners, verified delivery agents and locker access" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Parcels this month" value={1284} icon={Truck} />
        <Stat label="Courier partners" value={PARTNERS.length} sub={`${PARTNERS.filter((p) => p.api).length} API-integrated`} icon={Plug} tone="lime" />
        <Stat label="Verified agents" value={23} icon={UserCheck} tone="sky" />
        <Stat label="Last deposit" value={ago(parcels.find((p) => p.arrivedAt)?.arrivedAt ?? new Date().toISOString())} tone="stone" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Partners" subtitle="Turn off to block a courier's agents from depositing">
          <Table rows={PARTNERS} cols={[
            { h: "Courier", c: (r) => <div className="flex items-center gap-2"><CourierMark name={r.name} /><span className="font-medium">{r.name}</span></div> },
            { h: "Share", c: (r) => `${r.share}%` }, { h: "Agents", c: (r) => r.agents },
            { h: "Integration", c: (r) => r.api ? <Badge>API · auto pre-alerts</Badge> : <Badge variant="muted">Manual entry</Badge> },
            { h: "On-time", c: (r) => r.sla },
            { h: "Locker access", c: (r) => <Switch checked={on[r.name]} onCheckedChange={(v) => { setOn({ ...on, [r.name]: v }); toast(v ? `${r.name} access restored` : `${r.name} access suspended`, { description: v ? undefined : "Agents will be redirected to reception." }); }} /> },
          ]} />
        </Panel>
        <Panel title="Volume by courier">
          <div className="flex items-center gap-4">
            <div className="size-[150px] shrink-0"><ResponsiveContainer><PieChart><Pie data={PARTNERS} dataKey="share" nameKey="name" innerRadius={42} outerRadius={70} paddingAngle={2}>{PARTNERS.map((_, i) => <Cell key={i} fill={C[i]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `${v}%`} /></PieChart></ResponsiveContainer></div>
            <div className="flex flex-1 flex-col gap-1 text-[13px]">{PARTNERS.map((p, i) => <div key={p.name} className="flex items-center gap-2"><span className="size-2.5 rounded-sm" style={{ background: C[i] }} /><span className="flex-1 text-muted-foreground">{p.name}</span>{p.share}%</div>)}</div>
          </div>
        </Panel>
      </div>
      <Panel title="Delivery agents" className="mt-4">
        <Table rows={AGENTS} cols={[
          { h: "Agent", c: (r) => <span className="font-medium">{r.name}</span> }, { h: "Courier", c: (r) => r.co },
          { h: "Verification", c: (r) => r.cnic ? <Badge>CNIC + selfie verified</Badge> : <Badge variant="warn">Pending verification</Badge> },
          { h: "Deliveries here", c: (r) => r.n }, { h: "Last seen", c: (r) => ago(new Date(Date.now() - r.last * 60000).toISOString()) },
        ]} />
      </Panel>
    </>
  );
}
