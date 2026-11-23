"use client";
import * as React from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Activity, Flame, Gauge, Info, Lightbulb, Thermometer, Waves, Wind } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { IconBubble, LiveDot, Stat } from "@/components/shared/kit";
import { Segmented } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/misc";

const SENSORS = [
  { id: "SN-01", name: "Lobby A air quality", icon: Wind, unit: "AQI", base: 62, warn: 100 },
  { id: "SN-02", name: "Pump room humidity", icon: Waves, unit: "%", base: 71, warn: 85 },
  { id: "SN-03", name: "Genset room temperature", icon: Thermometer, unit: "°C", base: 38, warn: 45 },
  { id: "SN-04", name: "Fire main pressure", icon: Gauge, unit: "bar", base: 7.2, warn: 5 },
  { id: "SN-05", name: "Basement CO", icon: Activity, unit: "ppm", base: 14, warn: 35 },
  { id: "SN-06", name: "Smoke detectors", icon: Flame, unit: "online", base: 312, warn: 0 },
];
const trend = (b: number) => Array.from({ length: 24 }, (_, h) => ({ h: `${h}:00`, v: +(b * (0.92 + 0.16 * Math.sin(h / 4) ** 2)).toFixed(1) }));

export default function SmartBuilding() {
  const [tick, setTick] = React.useState(0);
  const [sel, setSel] = React.useState(SENSORS[0].id);
  const [range, setRange] = React.useState<"24h" | "7d">("24h");
  const [lights, setLights] = React.useState({ corridors: true, parking: true, facade: false, garden: true });
  React.useEffect(() => { const t = setInterval(() => setTick((x) => x + 1), 3000); return () => clearInterval(t); }, []);
  const read = (b: number) => +(b * (0.97 + ((tick * 7 + b) % 7) / 100)).toFixed(1);
  const s = SENSORS.find((x) => x.id === sel)!;

  return (
    <>
      <AdminHeader title="Smart Building" subtitle="IoT sensor readings and trends" />
      <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-sky-200 bg-sky-50 p-3.5 text-sm text-sky-900"><Info className="mt-0.5 size-4 shrink-0" /><span><b>Simulated data.</b> This screen shows how live sensor feeds would appear. It does not connect to or control real fire, gas, electrical or safety equipment.</span></div>
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Sensors online" value="486 / 492" icon={Activity} />
        <Stat label="Active alerts" value={0} tone="lime" />
        <Stat label="Energy saved (Nov)" value="11%" sub="smart corridor lighting" icon={Lightbulb} tone="amber" />
        <Stat label="Indoor AQI · avg" value={read(62)} tone="sky" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <Panel title="Sensors">
          <div className="flex flex-col gap-2">
            {SENSORS.map((x) => { const v = x.id === "SN-06" ? x.base : read(x.base); return (
              <button key={x.id} onClick={() => setSel(x.id)} className={cn("flex items-center gap-3 rounded-xl border p-3 text-left transition", sel === x.id ? "border-pine-500 bg-pine-50/60" : "hover:bg-secondary/50")}>
                <IconBubble icon={x.icon} tone="stone" size="sm" />
                <div className="flex-1"><div className="text-sm font-medium">{x.name}</div><div className="text-xs text-muted-foreground">{x.id} · updated {3 - (tick % 3)}s ago</div></div>
                <div className="text-right"><div className="font-semibold tabular">{v} <span className="text-xs font-normal text-muted-foreground">{x.unit}</span></div><LiveDot /></div>
              </button>
            ); })}
          </div>
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title={s.name} subtitle={`Threshold ${s.warn} ${s.unit}`} action={<Segmented value={range} onChange={setRange} options={[{ value: "24h", label: "24 h" }, { value: "7d", label: "7 days" }]} />}>
            <div className="h-[230px]"><ResponsiveContainer><LineChart data={range === "24h" ? trend(s.base) : trend(s.base).slice(0, 7).map((x, i) => ({ ...x, h: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i] }))}><CartesianGrid vertical={false} stroke="#ece9e1" /><XAxis dataKey="h" fontSize={11} tickLine={false} axisLine={false} interval={range === "24h" ? 3 : 0} /><YAxis fontSize={11} tickLine={false} axisLine={false} width={34} /><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => [`${v} ${s.unit}`, ""]} /><Line dataKey="v" stroke="var(--color-pine-600)" strokeWidth={2.5} dot={false} /></LineChart></ResponsiveContainer></div>
          </Panel>
          <Panel title="Common-area lighting schedules" subtitle="Schedules only · applied by the BMS contractor">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {(Object.keys(lights) as (keyof typeof lights)[]).map((k) => (
                <label key={k} className="flex items-center justify-between rounded-xl border p-3 text-sm capitalize">
                  <span>{k}<span className="block text-xs normal-case text-muted-foreground">{k === "facade" ? "7 PM – 11 PM" : k === "garden" ? "Dusk – 12 AM" : "Motion-sensed, 24 h"}</span></span>
                  <Switch checked={lights[k]} onCheckedChange={(v) => { setLights({ ...lights, [k]: v }); toast(`${k} schedule ${v ? "enabled" : "paused"}`, { description: "Change request sent to the BMS contractor (simulated)." }); }} />
                </label>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5"><Badge variant="muted">Fire alarm panel: read-only</Badge><Badge variant="muted">Gas detection: read-only</Badge></div>
          </Panel>
        </div>
      </div>
    </>
  );
}
