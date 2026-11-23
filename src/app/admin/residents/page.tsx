"use client";
import * as React from "react";
import { Download, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { APTS, type AptRow } from "@/data/admin";
import { pkr } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { AptSheet, typeBadge } from "@/components/admin/apt-sheet";
import { Chips, SearchBar, Stat } from "@/components/shared/kit";
import { Avatar } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";
import { Checkbox } from "@/components/ui/misc";

export default function Residents() {
  const [q, setQ] = React.useState("");
  const [f, setF] = React.useState<"all" | "Owner-occupied" | "Tenant" | "dues">("all");
  const [tower, setTower] = React.useState("all");
  const [sel, setSel] = React.useState<AptRow | null>(null);
  const [add, setAdd] = React.useState(false);
  const [page, setPage] = React.useState(0);

  const rows = APTS.filter((r) => r.type !== "Vacant")
    .filter((r) => (tower === "all" ? true : r.tower === tower))
    .filter((r) => (f === "all" ? true : f === "dues" ? r.dues > 0 : r.type === f))
    .filter((r) => !q || `${r.id} ${r.owner} ${r.occupant}`.toLowerCase().includes(q.toLowerCase()));
  const per = 15;
  const shown = rows.slice(page * per, page * per + per);
  React.useEffect(() => setPage(0), [q, f, tower]);

  return (
    <>
      <AdminHeader title="Residents" subtitle="Owners, tenants and household members" actions={<>
        <Button variant="outline" onClick={() => toast.success("residents-ocean-heights.csv exported", { description: `${rows.length} rows · contact numbers masked` })}><Download /> Export</Button>
        <Button onClick={() => setAdd(true)}><UserPlus /> Invite resident</Button>
      </>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Residents" value={APTS.reduce((a, r) => a + r.residents, 0)} sub="across 248 households" />
        <Stat label="Owner-occupied" value={APTS.filter((r) => r.type === "Owner-occupied").length} />
        <Stat label="Tenanted" value={APTS.filter((r) => r.type === "Tenant").length} tone="sky" />
        <Stat label="App adoption" value="86%" sub="213 households active" tone="lime" />
      </div>
      <Panel>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchBar value={q} onChange={setQ} placeholder="Search name or apartment" className="w-full sm:w-72" />
          <Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "Owner-occupied", label: "Owners" }, { value: "Tenant", label: "Tenants" }, { value: "dues", label: "With dues" }]} />
          <Select value={tower} onValueChange={setTower} className="h-9 w-36" options={[{ value: "all", label: "All towers" }, { value: "A", label: "Tower A" }, { value: "B", label: "Tower B" }, { value: "C", label: "Tower C" }]} />
        </div>
        <Table rows={shown} onRow={setSel} cols={[
          { h: "Apartment", c: (r) => <span className="font-medium">{r.id}</span> },
          { h: "Resident", c: (r) => <div className="flex items-center gap-2.5"><Avatar src={r.id === "A-1204" ? undefined : r.photo} name={r.occupant} className="size-8" /><div><div className="font-medium">{r.occupant}</div>{r.type === "Tenant" && <div className="text-xs text-muted-foreground">Owner: {r.owner}</div>}</div></div> },
          { h: "Type", c: (r) => typeBadge(r.type) },
          { h: "Members", c: (r) => r.residents },
          { h: "Dues", c: (r) => r.dues ? <span className="font-medium text-danger tabular">{pkr(r.dues)}</span> : <span className="text-muted-foreground">—</span> },
          { h: "Last paid", c: (r) => r.lastPaid },
        ]} />
        <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
          <span>{rows.length ? `${page * per + 1}–${Math.min(rows.length, page * per + per)} of ${rows.length}` : "0 results"}</span>
          <div className="flex gap-2"><Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button><Button size="sm" variant="outline" disabled={(page + 1) * per >= rows.length} onClick={() => setPage(page + 1)}>Next</Button></div>
        </div>
      </Panel>
      <AptSheet apt={sel} onClose={() => setSel(null)} />
      <InviteDialog open={add} onClose={() => setAdd(false)} />
    </>
  );
}

function InviteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = React.useState("");
  const [apt, setApt] = React.useState("");
  const [role, setRole] = React.useState("Tenant");
  const [verified, setVerified] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Invite a resident</DialogTitle><DialogDescription>They receive an SMS link to join NESTORA for their apartment.</DialogDescription></DialogHeader>
        <div className="grid gap-3">
          <div><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sara Khan" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Apartment</Label><Input value={apt} onChange={(e) => setApt(e.target.value.toUpperCase())} placeholder="B-0702" /></div>
            <div><Label>Role</Label><Select value={role} onValueChange={setRole} options={["Owner", "Tenant", "Family member", "Authorised representative", "Property manager"].map((x) => ({ value: x, label: x }))} /></div>
          </div>
          <div><Label>Mobile number</Label><Input placeholder="+92 3xx xxx xxxx" inputMode="tel" /></div>
          <label className="flex items-start gap-2.5 text-sm"><Checkbox checked={verified} onCheckedChange={(v) => setVerified(!!v)} /> I have verified the ownership deed or tenancy agreement for this apartment.</label>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!name || !apt || !verified} onClick={() => { toast.success(`Invite sent to ${name}`, { description: `${role} · ${apt}` }); setName(""); setApt(""); setVerified(false); onClose(); }}>Send invite</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
