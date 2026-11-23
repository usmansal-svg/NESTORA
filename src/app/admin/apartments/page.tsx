"use client";
import * as React from "react";
import { APTS, type AptRow } from "@/data/admin";
import { cn } from "@/lib/utils";
import { AdminHeader, Panel } from "@/components/admin/shell";
import { AptSheet } from "@/components/admin/apt-sheet";
import { Stat } from "@/components/shared/kit";
import { Segmented } from "@/components/shared/pickers";

export default function Apartments() {
  const [tower, setTower] = React.useState<"A" | "B" | "C">("A");
  const [sel, setSel] = React.useState<AptRow | null>(null);
  const t = APTS.filter((r) => r.tower === tower);
  const floors = Array.from({ length: 22 }, (_, i) => 22 - i);
  const cls = (r: AptRow) => r.type === "Vacant" ? "bg-secondary text-muted-foreground" : r.dues > 30000 ? "bg-danger text-white" : r.dues > 0 ? "bg-amber-300 text-amber-950" : r.type === "Tenant" ? "bg-sky-200 text-sky-950" : "bg-pine-600 text-white";

  return (
    <>
      <AdminHeader title="Apartments" subtitle="Unit map with occupancy and dues status" actions={<Segmented value={tower} onChange={setTower} options={[{ value: "A", label: "Tower A" }, { value: "B", label: "Tower B" }, { value: "C", label: "Tower C" }]} />} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={`Tower ${tower} units`} value={t.length} sub="22 floors × 4" />
        <Stat label="Occupied" value={t.filter((r) => r.type !== "Vacant").length} tone="lime" />
        <Stat label="Tenanted" value={t.filter((r) => r.type === "Tenant").length} tone="sky" />
        <Stat label="With dues" value={t.filter((r) => r.dues > 0).length} tone="amber" />
      </div>
      <Panel title={`Tower ${tower}`} subtitle="Select a unit to see its details" action={
        <div className="hidden flex-wrap gap-3 text-xs text-muted-foreground sm:flex">
          {[["bg-pine-600", "Owner, paid"], ["bg-sky-200", "Tenant, paid"], ["bg-amber-300", "Dues 1 month"], ["bg-danger", "Dues 2+ months"], ["bg-secondary", "Vacant"]].map(([c, l]) => <span key={l} className="flex items-center gap-1.5"><span className={cn("size-2.5 rounded-sm", c)} />{l}</span>)}
        </div>
      }>
        <div className="mx-auto max-w-xl">
          {floors.map((f) => (
            <div key={f} className="flex items-center gap-2 py-[3px]">
              <span className="w-8 text-right text-[11px] text-muted-foreground tabular">F{f}</span>
              <div className="grid flex-1 grid-cols-4 gap-1.5">
                {t.filter((r) => r.floor === f).map((r) => (
                  <button key={r.id} onClick={() => setSel(r)} className={cn("h-7 rounded-md text-[11px] font-medium tabular transition hover:scale-[1.04] hover:shadow-lift", cls(r), r.id === "A-1204" && "ring-2 ring-lime-accent ring-offset-1")}>{r.unit}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 ml-10 rounded-md bg-pine-950 py-1.5 text-center text-[11px] text-white/70">Lobby · Parcel lockers · Reception</div>
        </div>
      </Panel>
      <AptSheet apt={sel} onClose={() => setSel(null)} />
    </>
  );
}
