"use client";
import * as React from "react";
import { AlertCircle, CheckCircle2, Download, FileText, Receipt, Zap } from "lucide-react";
import { toast } from "sonner";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useDemo } from "@/lib/store";
import type { Bill } from "@/lib/types";
import { fmtDate, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { KeyVal, List, PageHeader, Row } from "@/components/shared/kit";
import { PaySheet, PAY_METHODS } from "@/components/resident/pay-sheet";

const total = (b: Bill) => b.items.reduce((a, i) => a + i.amount, 0);

export default function PaymentsPage() {
  const s = useDemo();
  const [pay, setPay] = React.useState<Bill | null>(null);
  const [view, setView] = React.useState<Bill | null>(null);
  const due = s.bills.filter((b) => b.status !== "paid");
  const dueTotal = due.reduce((a, b) => a + total(b), 0);
  const paid = s.bills.filter((b) => b.status === "paid");
  const chart = [...s.bills].reverse().map((b) => ({ m: b.month.slice(0, 3), v: total(b) }));
  const extra = [
    { label: "Late payment penalty", date: "Oct 2026", amount: 500, note: "Paid after the 10th" },
    { label: "Lift modernisation levy (one-time)", date: "Aug 2026", amount: 12000, note: "Approved at AGM 2026" },
    { label: "Car sticker replacement", date: "Jul 2026", amount: 300, note: "" },
  ];

  return (
    <div>
      <PageHeader back="/resident" title="Maintenance & payments" subtitle={`Apartment ${s.apartment} · Ocean Heights Owners' Association`} />
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white">
          <div className="absolute -right-16 -top-16 size-56 rounded-full bg-lime-accent/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between text-sm text-white/70"><span>Outstanding dues</span>{due.length ? <Badge variant="warn">Due {fmtDate(due[0].dueDate)}</Badge> : <Badge variant="lime"><CheckCircle2 /> Paid up</Badge>}</div>
            <div className="mt-2 text-4xl font-semibold tracking-tight tabular">{pkr(dueTotal)}</div>
            <div className="mt-1 text-sm text-white/60">{due.length ? `${due[0].month} bill · pay by the 10th to avoid Rs 500 penalty` : "Thank you! Next bill is issued on the 1st."}</div>
            <div className="mt-5 flex gap-2">
              <Button variant="accent" size="lg" className="flex-1" disabled={!due.length} onClick={() => setPay(due[0])}><Zap /> Pay now</Button>
              <Button size="lg" className="bg-white/10 ring-1 ring-white/15 hover:bg-white/15" onClick={() => toast.success("Statement downloaded", { description: "Ocean-Heights-A1204-2026.pdf" })}><Download /> Statement</Button>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="text-sm font-semibold">Last 6 months</div>
          <div className="text-xs text-muted-foreground">Average {pkr(chart.reduce((a, c) => a + c.v, 0) / chart.length)} / month</div>
          <div className="mt-3 h-36">
            <ResponsiveContainer><BarChart data={chart}><XAxis dataKey="m" axisLine={false} tickLine={false} fontSize={11} /><Tooltip cursor={{ fill: "rgba(15,61,51,0.05)" }} formatter={(v) => pkr(Number(v))} contentStyle={{ borderRadius: 12, border: "1px solid #e5e1d8", fontSize: 12 }} /><Bar dataKey="v" fill="var(--color-pine-600)" radius={[6, 6, 2, 2]} /></BarChart></ResponsiveContainer>
          </div>
        </div>
      </div>

      <Tabs defaultValue="bills" className="mt-6">
        <TabsList className="w-full sm:w-auto"><TabsTrigger value="bills">Bills</TabsTrigger><TabsTrigger value="history">Payment history</TabsTrigger><TabsTrigger value="charges">Penalties & charges</TabsTrigger><TabsTrigger value="methods">Methods</TabsTrigger></TabsList>
        <TabsContent value="bills">
          <List>{s.bills.map((b) => <Row key={b.id} onClick={() => setView(b)} icon={FileText} tone={b.status === "paid" ? "stone" : "amber"} title={b.month} subtitle={b.status === "paid" ? `Paid ${fmtDate(b.paidAt!)} · ${b.method}` : `Due ${fmtDate(b.dueDate)}`} trailing={<div className="text-right"><div className="text-sm font-semibold tabular">{pkr(total(b))}</div>{b.status === "paid" ? <Badge variant="muted">Paid</Badge> : <Badge variant="warn">Due</Badge>}</div>} />)}</List>
        </TabsContent>
        <TabsContent value="history">
          <List>{paid.map((b) => <Row key={b.id} onClick={() => setView(b)} icon={Receipt} title={`${pkr(total(b))} · ${b.method}`} subtitle={`${b.receiptNo} · ${fmtDate(b.paidAt!, { day: "numeric", month: "short", year: "numeric" })}`} trailing={<Button variant="ghost" size="icon-sm" onClick={(e) => { e.stopPropagation(); toast.success(`Receipt ${b.receiptNo} downloaded`); }}><Download /></Button>} />)}</List>
        </TabsContent>
        <TabsContent value="charges">
          <List>{extra.map((x) => <Row key={x.label} icon={AlertCircle} tone="amber" title={x.label} subtitle={`${x.date}${x.note ? ` · ${x.note}` : ""}`} trailing={<span className="text-sm font-semibold">{pkr(x.amount)}</span>} />)}</List>
        </TabsContent>
        <TabsContent value="methods">
          <List>{PAY_METHODS.map((m) => <Row key={m.id} leading={<span className={`grid size-10 place-items-center rounded-xl ${m.tone}`}><m.icon className="size-5" /></span>} title={m.label} subtitle={m.sub} trailing={m.id === "Raast" ? <Badge>Default</Badge> : undefined} />)}</List>
        </TabsContent>
      </Tabs>

      <Sheet open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <SheetContent>
          {view && (
            <>
              <SheetHeader><SheetTitle>{view.month}</SheetTitle><SheetDescription>Bill {view.id} · Issued {fmtDate(view.issued)}</SheetDescription></SheetHeader>
              <SheetBody>
                <div className="rounded-2xl border bg-card p-4">
                  {view.items.map((i) => <KeyVal key={i.label} k={i.label} v={pkr(i.amount)} />)}
                  <div className="mt-2 border-t pt-2"><KeyVal k={<b className="text-foreground">Total</b>} v={<span className="text-lg">{pkr(total(view))}</span>} /></div>
                </div>
                {view.status === "paid" && <div className="mt-3 rounded-2xl bg-pine-50 p-4 text-sm"><KeyVal k="Receipt" v={view.receiptNo} /><KeyVal k="Paid on" v={fmtDate(view.paidAt!, { day: "numeric", month: "long", year: "numeric" })} /><KeyVal k="Method" v={view.method} /></div>}
              </SheetBody>
              <SheetFooter>{view.status === "paid" ? <Button variant="outline" className="w-full" onClick={() => toast.success(`Receipt ${view.receiptNo} downloaded`)}><Download /> Download receipt</Button> : <Button className="w-full" size="lg" onClick={() => { setPay(view); setView(null); }}>Pay {pkr(total(view))}</Button>}</SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {pay && <PaySheet open={!!pay} onOpenChange={(o) => !o && setPay(null)} amount={total(pay)} title={`Maintenance · ${pay.month} · ${s.apartment}`} lines={pay.items} onPaid={(m) => s.payBill(pay.id, m)} />}
    </div>
  );
}
