"use client";
import * as React from "react";
import { Camera, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { cn, fmtTime } from "@/lib/utils";
import { Chips } from "@/components/shared/kit";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function SupTasks() {
  const tasks = useDemo((s) => s.tasks);
  const complaints = useDemo((s) => s.complaints);
  const setStatus = useDemo((s) => s.setTaskStatus);
  const advance = useDemo((s) => s.advanceComplaint);
  const [f, setF] = React.useState<"open" | "done">("open");
  const rows = tasks.filter((t) => (f === "open" ? t.status !== "Done" : t.status === "Done"));
  return (
    <div className="flex flex-col gap-4">
      <Chips value={f} onChange={setF} options={[{ value: "open", label: "Open", count: tasks.filter((t) => t.status !== "Done").length }, { value: "done", label: "Done" }]} />
      {rows.map((t) => {
        const c = t.complaintId ? complaints.find((x) => x.id === t.complaintId) : undefined;
        return (
          <div key={t.id} className={cn("rounded-2xl border bg-card p-4 shadow-soft", t.priority === "High" && t.status !== "Done" && "border-l-4 border-l-amber-500")}>
            <div className="flex items-start justify-between gap-2"><div className="font-semibold">{t.title}</div><Badge variant={t.status === "Done" ? "default" : t.status === "In Progress" ? "info" : "muted"}>{t.status}</Badge></div>
            <div className="mt-1 text-sm text-muted-foreground">{t.area} · {t.assignee} · due {fmtTime(t.due)}{c ? ` · linked to ${c.id}` : ""}</div>
            {t.status !== "Done" && (
              <div className="mt-3 flex gap-2">
                {t.status === "Open" && <Button size="sm" variant="outline" onClick={() => { setStatus(t.id, "In Progress"); if (c && c.status !== "In Progress") advance(c.id, "In Progress", "Supervisor Naveed", `${t.assignee.split(" ")[0]} has started work`); toast.success("Task started", { description: c ? "Resident sees “In progress”." : undefined }); }}><Play /> Start</Button>}
                <Button size="sm" onClick={() => { setStatus(t.id, "Done"); if (c && c.status !== "Resolved") advance(c.id, "Resolved", "Supervisor Naveed", "Work completed. Please confirm and rate."); toast.success("Task completed", { description: c ? `${c.id} resolved · resident asked to confirm` : undefined }); }}><CheckCircle2 /> Complete</Button>
                <Button size="sm" variant="ghost" onClick={() => toast("After-photo attached")}><Camera /> Photo</Button>
              </div>
            )}
          </div>
        );
      })}
      {rows.length === 0 && <div className="py-10 text-center text-sm text-muted-foreground">No tasks</div>}
    </div>
  );
}
