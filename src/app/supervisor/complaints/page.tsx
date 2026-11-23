"use client";
import * as React from "react";
import { Wrench } from "lucide-react";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import { ago } from "@/lib/utils";
import { Chips, List, Row } from "@/components/shared/kit";
import { ComplaintSheet, prioVariant } from "@/components/admin/complaint-sheet";
import { Badge } from "@/components/ui/badge";

export default function SupComplaints() {
  const complaints = useDemo((s) => s.complaints);
  const qid = useQuery("id");
  const [sel, setSel] = React.useState<string | null>(null);
  const [f, setF] = React.useState<"action" | "progress" | "done">("action");
  React.useEffect(() => { if (qid) setSel(qid); }, [qid]);
  const rows = complaints.filter((c) => f === "action" ? ["Submitted", "Reopened", "Acknowledged"].includes(c.status) : f === "progress" ? ["Assigned", "In Progress"].includes(c.status) : c.status === "Resolved");
  return (
    <div className="flex flex-col gap-4">
      <Chips value={f} onChange={setF} options={[{ value: "action", label: "Needs action", count: complaints.filter((c) => ["Submitted", "Reopened", "Acknowledged"].includes(c.status)).length }, { value: "progress", label: "In progress" }, { value: "done", label: "Resolved" }]} />
      <List>
        {rows.map((c) => <Row key={c.id} onClick={() => setSel(c.id)} icon={Wrench} tone={c.status === "Reopened" ? "red" : "amber"} title={c.title} subtitle={`${c.id} · ${c.apt} · ${c.status}${c.assignee ? ` · ${c.assignee}` : ""} · ${ago(c.createdAt)}`} trailing={<Badge variant={prioVariant(c.priority)}>{c.priority}</Badge>} />)}
        {rows.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">Nothing here</div>}
      </List>
      <ComplaintSheet c={complaints.find((c) => c.id === sel) ?? null} onClose={() => setSel(null)} by="Supervisor Naveed" />
    </div>
  );
}
