"use client";
import * as React from "react";
import { Car, CircleParking, Plug, Ticket } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { PARKING_SPOTS } from "@/data/places";
import { cn, pkr } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Stat } from "@/components/shared/kit";
import { Segmented } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const rnd = (i: number, n: number) => ((i * 2654435761) >>> 0) % n;
const STICKERS = [
  { plate: "BKX-412", apt: "B-0904", type: "Car", req: "New sticker · Honda Civic 2024", doc: "Registration book" },
  { plate: "KHI-7781", apt: "C-1102", type: "Motorcycle", req: "Replacement (lost)", doc: "Registration book" },
  { plate: "AWR-220", apt: "A-0601", type: "EV", req: "EV bay allocation · BYD Atto 3", doc: "Registration + charger agreement" },
];

export default function Parking() {
  const incidents = useDemo((s) => s.incidents);
  const vehicles = useDemo((s) => s.vehicles);
  const [lvl, setLvl] = React.useState<"P1" | "P2">("P1");
  const [stickers, setStickers] = React.useState(STICKERS);
  const bays = Array.from({ length: 96 }, (_, i) => { const n = i + (lvl === "P1" ? 1 : 101); const k = rnd(n, 20); return { id: `${lvl}-${String(n).padStart(3, "0")}`, state: k === 0 ? "violation" : k < 3 ? "visitor" : k < 5 ? "free" : k === 5 ? "ev" : "resident" }; });
  const color: Record<string, string> = { resident: "bg-pine-600", visitor: "bg-sky-400", free: "bg-secondary", ev: "bg-lime-accent", violation: "bg-danger" };

  return (
    <>
      <AdminHeader title="Parking" subtitle="Bays, stickers, visitor parking and resident rentals" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Total bays" value={412} sub="P1 · P2 · surface · bikes" icon={CircleParking} />
        <Stat label="Occupied now" value="84%" sub="347 vehicles" icon={Car} tone="sky" />
        <Stat label="EV bays" value="12" sub="9 in use" icon={Plug} tone="lime" />
        <Stat label="Open violations" value={incidents.filter((i) => i.type === "Parking" && i.status === "Open").length + 2} icon={Ticket} tone="red" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title={`Basement ${lvl}`} subtitle="Live from ANPR cameras (simulated)" action={<Segmented value={lvl} onChange={setLvl} options={[{ value: "P1", label: "P1" }, { value: "P2", label: "P2" }]} />}>
          <div className="grid grid-cols-12 gap-1.5">
            {bays.map((b) => <button key={b.id} title={`${b.id} · ${b.state}`} onClick={() => toast(`${b.id}`, { description: b.state === "violation" ? "Unregistered vehicle. Guard notified to tag." : b.state === "free" ? "Free bay" : b.state === "visitor" ? "Visitor parking" : b.state === "ev" ? "EV bay · charging" : "Resident bay" })} className={cn("aspect-[3/5] rounded-[4px] transition hover:scale-110", color[b.state])} />)}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">{Object.entries({ resident: "Resident", visitor: "Visitor", free: "Free", ev: "EV", violation: "Violation" }).map(([k, l]) => <span key={k} className="flex items-center gap-1.5"><span className={cn("size-2.5 rounded-sm", color[k])} />{l}</span>)}</div>
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Sticker requests">
            <div className="flex flex-col gap-2">
              {stickers.length === 0 && <div className="py-4 text-center text-sm text-muted-foreground">All requests processed</div>}
              {stickers.map((s) => (
                <div key={s.plate} className="rounded-xl border p-3 text-sm">
                  <div className="flex justify-between"><span className="font-medium">{s.plate} · {s.apt}</span><Badge variant="muted">{s.type}</Badge></div>
                  <div className="text-xs text-muted-foreground">{s.req} · {s.doc} attached</div>
                  <div className="mt-2 flex gap-2"><Button size="sm" onClick={() => { setStickers(stickers.filter((x) => x !== s)); toast.success(`Sticker approved for ${s.plate}`, { description: "Resident notified to collect from reception." }); }}>Approve</Button><Button size="sm" variant="outline" onClick={() => { setStickers(stickers.filter((x) => x !== s)); toast("Request returned for documents"); }}>Return</Button></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Ahmed's vehicles (A-1204)">
            <div className="flex flex-col gap-1.5 text-sm">{vehicles.map((v) => <div key={v.id} className="flex justify-between"><span>{v.make} · {v.plate}</span><span className="text-muted-foreground">{v.slot ?? "No bay"}</span></div>)}</div>
          </Panel>
        </div>
      </div>
      <Panel title="Resident parking rentals" subtitle="Residents renting out unused bays · 5% platform fee" className="mt-4">
        <Table rows={PARKING_SPOTS} cols={[
          { h: "Bay", c: (r) => <span className="font-medium">{r.slot}</span> }, { h: "Owner", c: (r) => `${r.owner} · ${r.apt}` }, { h: "Level", c: (r) => r.level },
          { h: "Monthly", c: (r) => pkr(r.month) }, { h: "Availability", c: (r) => r.availability }, { h: "Status", c: () => <Badge>Listed</Badge> },
        ]} />
      </Panel>
    </>
  );
}
