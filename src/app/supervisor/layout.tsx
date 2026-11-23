"use client";
import { ClipboardCheck, ClipboardList, Droplets, LayoutGrid, Wrench } from "lucide-react";
import { useDemo } from "@/lib/store";
import { face } from "@/lib/img";
import { OpsShell } from "@/components/ops/shell";

export default function SupervisorLayout({ children }: { children: React.ReactNode }) {
  const open = useDemo((s) => s.complaints.filter((c) => c.status === "Submitted" || c.status === "Reopened" || c.status === "Acknowledged").length);
  return (
    <OpsShell app="Operations · Supervisor" person="Naveed Akhtar" role="Day shift" photo={face("m3")} tone="light"
      tabs={[{ href: "/supervisor", label: "Today", icon: LayoutGrid }, { href: "/supervisor/complaints", label: "Complaints", icon: Wrench, badge: open }, { href: "/supervisor/tasks", label: "Tasks", icon: ClipboardList }, { href: "/supervisor/utilities", label: "Utilities", icon: Droplets }, { href: "/supervisor/inspections", label: "Inspect", icon: ClipboardCheck }]}>
      {children}
    </OpsShell>
  );
}
