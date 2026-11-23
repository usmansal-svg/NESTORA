"use client";
import * as React from "react";
import { Flag, ShoppingBag, Store, Tag } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { SELLERS, OFFERS } from "@/data/places";
import { ago, pkr } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Stat } from "@/components/shared/kit";
import { Photo } from "@/components/shared/photo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const REPORTS = [
  { id: "RPT-31", item: "iPhone 13 Pro — 'urgent sale'", reason: "Suspected scam · asks for advance payment", by: "C-0702" },
  { id: "RPT-30", item: "Homemade biryani (daily)", reason: "No food safety badge", by: "B-1104" },
];

export default function Marketplace() {
  const listings = useDemo((s) => s.listings);
  const orders = useDemo((s) => s.orders);
  const [reports, setReports] = React.useState(REPORTS);
  const [hidden, setHidden] = React.useState<string[]>([]);
  return (
    <>
      <AdminHeader title="Marketplace" subtitle="Community listings, home kitchens, local businesses and offers" />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Active listings" value={listings.filter((l) => !l.sold).length + 41} icon={Tag} />
        <Stat label="Home kitchens & shops" value={SELLERS.length + 9} icon={Store} tone="lime" />
        <Stat label="Orders this week" value={orders.length + 212} icon={ShoppingBag} tone="sky" />
        <Stat label="Reports to review" value={reports.length} icon={Flag} tone="red" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Resident listings">
          <Table rows={listings} cols={[
            { h: "Item", c: (r) => <div className="flex items-center gap-2.5"><Photo id={r.image} w={120} className="size-10 shrink-0 rounded-lg" /><div><div className="font-medium">{r.title}</div><div className="text-xs text-muted-foreground">{r.category} · {r.condition}</div></div></div> },
            { h: "Price", c: (r) => pkr(r.price) }, { h: "Seller", c: (r) => `${r.seller} · ${r.sellerApt}` }, { h: "Posted", c: (r) => ago(r.at) },
            { h: "Status", c: (r) => hidden.includes(r.id) ? <Badge variant="danger">Hidden</Badge> : r.sold ? <Badge variant="muted">Sold</Badge> : <Badge>Live</Badge> },
            { h: "", c: (r) => <Button size="sm" variant="ghost" onClick={() => { setHidden(hidden.includes(r.id) ? hidden.filter((x) => x !== r.id) : [...hidden, r.id]); toast(hidden.includes(r.id) ? "Listing restored" : "Listing hidden from residents"); }}>{hidden.includes(r.id) ? "Restore" : "Hide"}</Button> },
          ]} />
        </Panel>
        <div className="flex flex-col gap-4">
          <Panel title="Reported content">
            <div className="flex flex-col gap-2.5">
              {reports.length === 0 && <div className="py-4 text-center text-sm text-muted-foreground">Nothing to review</div>}
              {reports.map((r) => (
                <div key={r.id} className="rounded-xl border p-3.5 text-sm">
                  <div className="font-medium">{r.item}</div><div className="text-xs text-muted-foreground">{r.reason} · reported by {r.by}</div>
                  <div className="mt-2.5 flex gap-2"><Button size="sm" variant="destructive" onClick={() => { setReports(reports.filter((x) => x !== r)); toast.success("Listing removed and seller warned"); }}>Remove</Button><Button size="sm" variant="outline" onClick={() => { setReports(reports.filter((x) => x !== r)); toast("Report dismissed"); }}>Dismiss</Button></div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Sponsored offers">
            <div className="flex flex-col gap-2 text-sm">{OFFERS.slice(0, 5).map((o) => <div key={o.id} className="flex items-center justify-between gap-2"><span className="truncate">{o.title}</span><Badge variant="lime">{o.business}</Badge></div>)}</div>
          </Panel>
        </div>
      </div>
    </>
  );
}
