"use client";
import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { BellRing, Download, FilePlus2, FileSpreadsheet, Plus, Receipt, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { APTS, COLLECTIONS, EXPENSES, LEDGER } from "@/data/admin";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Stat } from "@/components/shared/kit";
import { Field } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/misc";

const PIE = ["var(--color-pine-700)", "var(--color-pine-500)", "var(--color-pine-400)", "var(--color-pine-300)", "#d9a441", "#e9c46a", "#b4b0a5", "#d8d4c8"];
type L = (typeof LEDGER)[number];

export default function Billing() {
  const notify = useDemo((s) => s.notify);
  const myBills = useDemo((s) => s.bills);
  const [ledger, setLedger] = React.useState<L[]>(LEDGER);
  const [exp, setExp] = React.useState(false);
  const [gen, setGen] = React.useState(false);
  const [reminded, setReminded] = React.useState(false);
  const defaulters = APTS.filter((r) => r.dues > 0).sort((a, b) => b.dues - a.dues);
  const ahmedPaid = myBills.find((b) => b.month.startsWith("November"))?.status === "paid";
  const ledgerRows = ahmedPaid && !ledger.some((l) => l.desc.includes("A-1204")) ? [{ d: "Today", ref: myBills.find((b) => b.month.startsWith("November"))?.receiptNo ?? "RCP", desc: "Maintenance — A-1204 (in-app)", cat: "Maintenance", amt: 27050, by: "Auto" }, ...ledger] : ledger;
  const income = ledgerRows.filter((l) => l.amt > 0).reduce((a, l) => a + l.amt, 0);
  const outflow = ledgerRows.filter((l) => l.amt < 0).reduce((a, l) => a - l.amt, 0);

  return (
    <>
      <AdminHeader title="Billing & Accounting" subtitle="Treasurer view · maintenance billing, ledgers and expenses" actions={<>
        <Button variant="outline" onClick={() => setExp(true)}><Plus /> Record expense</Button>
        <Button onClick={() => setGen(true)}><FilePlus2 /> Generate December bills</Button>
      </>} />
      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Billed (Nov)" value="Rs 62.4 lac" sub="264 invoices" icon={Receipt} />
        <Stat label="Collected" value="Rs 48.6 lac" sub="78% · 193 units paid" tone="lime" trend={{ v: "4% vs Oct", up: false, good: false }} />
        <Stat label="Outstanding" value={pkr(defaulters.reduce((a, r) => a + r.dues, 0) - (ahmedPaid ? 27050 : 0), { compact: true })} sub={`${defaulters.length - (ahmedPaid ? 1 : 0)} units`} tone="red" />
        <Stat label="Reserve & sinking fund" value="Rs 1.84 cr" sub="Meezan Bank · audited Jun 2026" tone="stone" />
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="ledger">Ledger</TabsTrigger><TabsTrigger value="dues">Defaulters</TabsTrigger><TabsTrigger value="reports">Statements</TabsTrigger></TabsList>

        <TabsContent value="overview" className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <Panel title="Income vs expenditure" subtitle="Rs lac">
            <div className="h-[260px]">
              <ResponsiveContainer>
                <LineChart data={COLLECTIONS}>
                  <CartesianGrid vertical={false} stroke="#ece9e1" />
                  <XAxis dataKey="m" fontSize={12} tickLine={false} axisLine={false} /><YAxis fontSize={11} tickLine={false} axisLine={false} width={30} />
                  <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v, n) => [`Rs ${v} lac`, String(n)]} />
                  <Line dataKey="collected" name="Income" stroke="var(--color-pine-600)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line dataKey="expense" name="Expenditure" stroke="#d9a441" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
          <Panel title="November expenses" subtitle="Rs 39.2 lac by category">
            <div className="flex items-center gap-4">
              <div className="size-[150px] shrink-0">
                <ResponsiveContainer><PieChart><Pie data={EXPENSES} dataKey="value" innerRadius={44} outerRadius={70} paddingAngle={2}>{EXPENSES.map((_, i) => <Cell key={i} fill={PIE[i]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} formatter={(v) => `Rs ${v} lac`} /></PieChart></ResponsiveContainer>
              </div>
              <div className="flex flex-1 flex-col gap-1.5 text-[13px]">
                {EXPENSES.map((e, i) => <div key={e.name} className="flex items-center gap-2"><span className="size-2.5 rounded-sm" style={{ background: PIE[i] }} /><span className="flex-1 text-muted-foreground">{e.name}</span><span className="font-medium tabular">{e.value}</span></div>)}
              </div>
            </div>
          </Panel>
          <Panel title="Payment channels" subtitle="Share of November collections" className="lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-5">
              {[["Raast", 38], ["JazzCash", 21], ["Easypaisa", 14], ["Card", 9], ["Bank transfer / cheque", 18]].map(([n, v]) => (
                <div key={n} className="rounded-xl bg-secondary/60 p-3"><div className="text-xs text-muted-foreground">{n}</div><div className="text-lg font-semibold">{v}%</div><div className="mt-1.5 h-1.5 rounded-full bg-card"><div className="h-full rounded-full bg-pine-600" style={{ width: `${v}%` }} /></div></div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="ledger">
          <Panel title="General ledger · November 2026" action={<Button size="sm" variant="outline" onClick={() => toast.success("Ledger exported to Excel")}><FileSpreadsheet /> Export</Button>}>
            <div className="mb-3 flex flex-wrap gap-4 text-sm"><span>Inflow <b className="text-pine-700 tabular">{pkr(income)}</b></span><span>Outflow <b className="text-danger tabular">{pkr(outflow)}</b></span></div>
            <Table rows={ledgerRows} cols={[
              { h: "Date", c: (r) => r.d }, { h: "Reference", c: (r) => <span className="font-mono text-xs">{r.ref}</span> },
              { h: "Description", c: (r) => r.desc }, { h: "Category", c: (r) => <Badge variant="muted">{r.cat}</Badge> },
              { h: "Amount", className: "text-right", c: (r) => <span className={cn("font-medium tabular", r.amt > 0 ? "text-pine-700" : "text-foreground")}>{r.amt > 0 ? "+" : "−"}{pkr(Math.abs(r.amt))}</span> },
              { h: "Entered by", c: (r) => <span className="text-muted-foreground">{r.by}</span> },
            ]} />
          </Panel>
        </TabsContent>

        <TabsContent value="dues">
          <Panel title="Outstanding maintenance" subtitle="Reminders go by push, WhatsApp and SMS" action={<Button size="sm" disabled={reminded} onClick={() => { setReminded(true); if (!ahmedPaid) notify({ kind: "bill", title: "Maintenance reminder", body: "November maintenance of Rs 27,050 is due on 30 Nov. Pay in a tap.", href: "/resident/building/payments", channels: ["push", "whatsapp"], role: "resident" }); toast.success(`Reminders sent to ${defaulters.length} apartments`); }}><BellRing /> {reminded ? "Reminders sent" : "Remind all"}</Button>}>
            <Table rows={defaulters.filter((r) => !(ahmedPaid && r.id === "A-1204")).slice(0, 30)} cols={[
              { h: "Apartment", c: (r) => <span className="font-medium">{r.id}</span> }, { h: "Owner", c: (r) => r.owner },
              { h: "Months", c: (r) => Math.max(1, Math.round(r.dues / 25000)) },
              { h: "Outstanding", c: (r) => <span className="font-medium text-danger tabular">{pkr(r.dues)}</span> },
              { h: "Last paid", c: (r) => r.lastPaid },
              { h: "Status", c: (r) => r.dues > 60000 ? <Badge variant="danger">Committee notice</Badge> : r.dues > 30000 ? <Badge variant="warn">2nd reminder</Badge> : <Badge variant="muted">Due</Badge> },
            ]} />
          </Panel>
        </TabsContent>

        <TabsContent value="reports" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {["Income & expenditure statement", "Balance sheet", "Receivables ageing", "Bank reconciliation — Meezan", "Sinking fund statement", "Vendor payments register"].map((r) => (
            <div key={r} className="flex flex-col rounded-2xl border bg-card p-4 shadow-soft">
              <FileSpreadsheet className="size-5 text-pine-600" /><div className="mt-3 font-medium">{r}</div><div className="text-xs text-muted-foreground">November 2026 · draft</div>
              <div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={() => toast.success(`${r} downloaded (PDF)`)}><Download /> PDF</Button><Button size="sm" variant="ghost" onClick={() => toast.success(`${r} downloaded (Excel)`)}>Excel</Button></div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <ExpenseDialog open={exp} onClose={() => setExp(false)} onSave={(l) => setLedger((x) => [l, ...x])} />
      <Dialog open={gen} onOpenChange={setGen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate December 2026 bills</DialogTitle><DialogDescription>264 invoices will be prepared from the approved budget and published to residents.</DialogDescription></DialogHeader>
          <div className="rounded-xl border p-4 text-sm">
            {[["Maintenance (Rs 12.5 / sq ft)", "Rs 50.1 lac"], ["Generator & diesel share", "Rs 8.4 lac"], ["Water charges", "Rs 2.9 lac"], ["Sinking fund", "Rs 2.6 lac"]].map(([a, b]) => <div key={a} className="flex justify-between py-1"><span className="text-muted-foreground">{a}</span><span className="font-medium">{b}</span></div>)}
            <div className="mt-2 flex justify-between border-t pt-2 font-semibold"><span>Total</span><span>Rs 64.0 lac</span></div>
          </div>
          <div className="flex items-start gap-2 rounded-xl bg-amber-soft p-3 text-xs text-amber-900"><ShieldCheck className="mt-0.5 size-4 shrink-0" /> Publishing bills needs a second approval from the committee chairperson. A request will be sent to them.</div>
          <DialogFooter><Button variant="outline" onClick={() => setGen(false)}>Cancel</Button><Button onClick={() => { setGen(false); toast.success("Bills prepared and sent for chairperson approval", { description: "Residents will be notified once approved." }); }}>Prepare and request approval</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ExpenseDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (l: L) => void }) {
  const [desc, setDesc] = React.useState("");
  const [amt, setAmt] = React.useState("");
  const [cat, setCat] = React.useState("Repairs");
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader><DialogTitle>Record an expense</DialogTitle><DialogDescription>Attach the vendor invoice. Entries over Rs 100,000 need committee approval.</DialogDescription></DialogHeader>
        <div className="grid gap-3">
          <Field label="Description"><Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="e.g. Water tankers × 4" rows={2} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount (Rs)"><Input value={amt} onChange={(e) => setAmt(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="36000" /></Field>
            <Field label="Category"><Select value={cat} onValueChange={setCat} options={["Repairs", "Diesel", "Water", "Salaries", "Security", "Lift maintenance", "Cleaning", "Other"].map((x) => ({ value: x, label: x }))} /></Field>
          </div>
          <button className="rounded-xl border border-dashed p-3 text-sm text-muted-foreground hover:bg-secondary/50" onClick={() => toast("invoice-scan.jpg attached")}>+ Attach invoice photo</button>
        </div>
        <DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button disabled={!desc || !amt} onClick={() => {
          const n = Number(amt);
          onSave({ d: "Today", ref: `EXP-${1183 + Math.floor(Math.random() * 50)}`, desc: desc + (n > 100000 ? " (pending approval)" : ""), cat, amt: -n, by: "Tariq M." });
          toast.success(n > 100000 ? "Expense recorded, pending committee approval" : "Expense recorded"); setDesc(""); setAmt(""); onClose();
        }}>Save expense</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
