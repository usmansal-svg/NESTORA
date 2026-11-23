"use client";
import * as React from "react";
import { CalendarCheck, ClipboardList, Plus, UserCog, Users } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { STAFF } from "@/data/admin";
import { fmtTime } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Stat } from "@/components/shared/kit";
import { Field } from "@/components/shared/pickers";
import { Avatar, Select } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const sv = (s: string) => (s === "On duty" ? "default" : s === "On task" ? "info" : s === "On break" ? "warn" : s === "Absent" ? "danger" : "muted") as "default";
const ASSIGNEES = ["Rashid (Plumbing)", "Jamil (Electrical)", "Imtiaz (Genset)", "SparkClean team", "Supervisor Naveed"];

export default function Staff() {
  const tasks = useDemo((s) => s.tasks);
  const household = useDemo((s) => s.staff);
  const addTask = useDemo((s) => s.addTask);
  const setTaskStatus = useDemo((s) => s.setTaskStatus);
  const [open, setOpen] = React.useState(false);
  const [t, setT] = React.useState({ title: "", area: "", assignee: ASSIGNEES[0], priority: "Medium" });
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <>
      <AdminHeader title="Staff Management" subtitle="Building staff, attendance, tasks and household staff registry" actions={<Button onClick={() => setOpen(true)}><Plus /> New task</Button>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Building staff" value={42} sub="18 in-house · 24 contracted" icon={UserCog} />
        <Stat label="Present today" value="37 / 40" sub="1 absent · 2 on leave" icon={CalendarCheck} tone="lime" />
        <Stat label="Open tasks" value={tasks.filter((x) => x.status !== "Done").length} icon={ClipboardList} tone="amber" />
        <Stat label="Household staff" value={318} sub="registered by residents" icon={Users} tone="sky" />
      </div>
      <Tabs defaultValue="attendance">
        <TabsList className="mb-4"><TabsTrigger value="attendance">Attendance</TabsTrigger><TabsTrigger value="tasks">Tasks</TabsTrigger><TabsTrigger value="household">Household staff</TabsTrigger></TabsList>
        <TabsContent value="attendance" className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
          <Panel title="Today's roster" subtitle="Biometric check-in at the staff gate">
            <Table rows={STAFF} cols={[
              { h: "Name", c: (r) => <div className="flex items-center gap-2.5"><Avatar src={r.photo} name={r.name} className="size-8" /><span className="font-medium">{r.name}</span></div> },
              { h: "Role", c: (r) => r.role }, { h: "Shift", c: (r) => r.shift }, { h: "Check-in", c: (r) => <span className="tabular">{r.in}</span> },
              { h: "Status", c: (r) => <Badge variant={sv(r.status)}>{r.status}</Badge> }, { h: "Employer", c: (r) => <span className="text-muted-foreground">{r.vendor}</span> },
            ]} />
          </Panel>
          <Panel title="This week" subtitle="Attendance %">
            <div className="flex h-[180px] items-end gap-2">
              {[96, 94, 97, 92, 95, 88, 93].map((v, i) => <div key={i} className="flex flex-1 flex-col items-center gap-1.5"><span className="text-[11px] tabular text-muted-foreground">{v}</span><div className="w-full rounded-t-md bg-pine-600" style={{ height: `${(v - 70) * 5}px` }} /><span className="text-[11px] text-muted-foreground">{week[i]}</span></div>)}
            </div>
          </Panel>
        </TabsContent>
        <TabsContent value="tasks">
          <Panel title="Maintenance tasks">
            <Table rows={tasks} cols={[
              { h: "Task", c: (r) => <div><div className="font-medium">{r.title}</div>{r.complaintId && <div className="text-xs text-muted-foreground">from {r.complaintId}</div>}</div> },
              { h: "Area", c: (r) => r.area }, { h: "Assignee", c: (r) => r.assignee }, { h: "Due", c: (r) => <span className="tabular">{fmtTime(r.due)}</span> },
              { h: "Priority", c: (r) => <Badge variant={r.priority === "High" ? "warn" : "muted"}>{r.priority}</Badge> },
              { h: "Status", c: (r) => <Select className="h-8 w-[130px] text-xs" value={r.status} onValueChange={(v) => { setTaskStatus(r.id, v as typeof r.status); toast.success(`${r.id} → ${v}`); }} options={["Open", "In Progress", "Done"].map((x) => ({ value: x, label: x }))} /> },
            ]} />
          </Panel>
        </TabsContent>
        <TabsContent value="household">
          <Panel title="Household staff registry" subtitle="Registered by residents · CNIC verified with consent">
            <Table rows={[...household, { id: "x1", apt: "B-0904", name: "Naseem Akhtar", role: "Maid", status: "active", verified: true, from: "09:00", to: "14:00" }, { id: "x2", apt: "C-1503", name: "Abdul Ghafoor", role: "Driver", status: "active", verified: false, from: "08:00", to: "20:00" }] as { id: string; apt: string; name: string; role: string; status: string; verified: boolean; from: string; to: string }[]} cols={[
              { h: "Name", c: (r) => <span className="font-medium">{r.name}</span> }, { h: "Role", c: (r) => r.role }, { h: "Apartment", c: (r) => r.apt },
              { h: "Hours", c: (r) => `${r.from}–${r.to}` }, { h: "Verification", c: (r) => r.verified ? <Badge>CNIC verified</Badge> : <Badge variant="warn">Pending</Badge> },
              { h: "Status", c: (r) => <Badge variant={r.status === "active" ? "default" : "muted"}>{r.status}</Badge> },
            ]} />
          </Panel>
        </TabsContent>
      </Tabs>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New maintenance task</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <Field label="Task"><Input value={t.title} onChange={(e) => setT({ ...t, title: e.target.value })} placeholder="Clean Tower B water tank" /></Field>
            <Field label="Area"><Input value={t.area} onChange={(e) => setT({ ...t, area: e.target.value })} placeholder="Tower B roof" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Assign to"><Select value={t.assignee} onValueChange={(v) => setT({ ...t, assignee: v })} options={ASSIGNEES.map((x) => ({ value: x, label: x }))} /></Field>
              <Field label="Priority"><Select value={t.priority} onValueChange={(v) => setT({ ...t, priority: v })} options={["Low", "Medium", "High"].map((x) => ({ value: x, label: x }))} /></Field>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button disabled={!t.title} onClick={() => { addTask({ title: t.title, area: t.area || "Building", assignee: t.assignee, priority: t.priority as "Low", due: new Date(Date.now() + 8 * 3600e3).toISOString() }); toast.success("Task created", { description: `Assigned to ${t.assignee} · visible in the supervisor app` }); setT({ ...t, title: "", area: "" }); setOpen(false); }}>Create task</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
