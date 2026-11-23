"use client";
import * as React from "react";
import { FileSignature, Handshake, Plus, Star } from "lucide-react";
import { toast } from "sonner";
import { VENDORS } from "@/data/admin";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Chips, Stat } from "@/components/shared/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ONBOARD = [
  { name: "Karachi Pest Busters", type: "Pest control", docs: "NTN, SECP, 3 references", applied: "2 days ago" },
  { name: "Ustad Hanif Carpentry", type: "Marketplace · Carpenter", docs: "CNIC, police verification", applied: "5 hours ago" },
];

export default function Vendors() {
  const [f, setF] = React.useState<"all" | "contract" | "market" | "courier">("all");
  const [queue, setQueue] = React.useState(ONBOARD);
  const rows = VENDORS.filter((v) => f === "all" ? true : f === "market" ? v.type.startsWith("Marketplace") : f === "courier" ? v.type === "Courier" : !v.type.startsWith("Marketplace") && v.type !== "Courier");
  return (
    <>
      <AdminHeader title="Vendors" subtitle="Contracts, service partners and marketplace providers" actions={<Button onClick={() => toast("Vendor invite link copied", { description: "Share with the vendor to start onboarding." })}><Plus /> Invite vendor</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active vendors" value={VENDORS.length + 27} icon={Handshake} />
        <Stat label="Annual contract value" value="Rs 1.9 cr" icon={FileSignature} tone="stone" />
        <Stat label="Renewals in 60 days" value={2} tone="amber" />
        <Stat label="Avg. vendor rating" value="4.4" icon={Star} tone="lime" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Panel title="Directory" action={<Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "contract", label: "Contracts" }, { value: "market", label: "Marketplace" }, { value: "courier", label: "Couriers" }]} />}>
          <Table rows={rows} cols={[
            { h: "Vendor", c: (r) => <span className="font-medium">{r.name}</span> }, { h: "Type", c: (r) => r.type }, { h: "Terms", c: (r) => r.contract },
            { h: "Rating", c: (r) => <span className="flex items-center gap-1"><Star className="size-3.5 fill-amber-400 text-amber-400" />{r.rating}</span> },
            { h: "Status", c: (r) => <Badge variant={r.status === "Review due" ? "warn" : r.status === "Manual" ? "muted" : "default"}>{r.status}</Badge> },
            { h: "Renews", c: (r) => r.renews },
          ]} onRow={(r) => toast(r.name, { description: `${r.type} · ${r.contract}` })} />
        </Panel>
        <Panel title="Onboarding queue" subtitle="Background checks before going live">
          <div className="flex flex-col gap-2.5">
            {queue.length === 0 && <div className="py-6 text-center text-sm text-muted-foreground">No pending applications</div>}
            {queue.map((q) => (
              <div key={q.name} className="rounded-xl border p-3.5 text-sm">
                <div className="font-medium">{q.name}</div><div className="text-xs text-muted-foreground">{q.type} · applied {q.applied}</div><div className="mt-1 text-xs">Documents: {q.docs}</div>
                <div className="mt-2.5 flex gap-2"><Button size="sm" onClick={() => { setQueue(queue.filter((x) => x !== q)); toast.success(`${q.name} approved`, { description: "Now visible to residents in Explore." }); }}>Approve</Button><Button size="sm" variant="outline" onClick={() => { setQueue(queue.filter((x) => x !== q)); toast("Application declined"); }}>Decline</Button></div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
