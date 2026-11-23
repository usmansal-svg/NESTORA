"use client";
import * as React from "react";
import { Building, CheckCircle2, CreditCard, Landmark, Loader2, ShieldCheck, Smartphone, Zap, Download } from "lucide-react";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn, pkr, sleep } from "@/lib/utils";

export const PAY_METHODS = [
  { id: "Raast", label: "Raast", sub: "Instant bank transfer · Raast ID 0300-8241190", icon: Zap, tone: "bg-pine-50 text-pine-700" },
  { id: "JazzCash", label: "JazzCash", sub: "Wallet •• 1190", icon: Smartphone, tone: "bg-rose-50 text-rose-700" },
  { id: "Easypaisa", label: "Easypaisa", sub: "Wallet •• 1190", icon: Smartphone, tone: "bg-emerald-50 text-emerald-700" },
  { id: "Card", label: "Debit / credit card", sub: "Visa •• 4021 · Meezan Bank", icon: CreditCard, tone: "bg-sky-50 text-sky-700" },
  { id: "Bank transfer", label: "Bank transfer", sub: "IBAN PK36 MEZN •••• 7781", icon: Landmark, tone: "bg-amber-soft text-amber-700" },
];

export function PaySheet({
  open,
  onOpenChange,
  amount,
  title,
  lines,
  onPaid,
  payee = "Ocean Heights Owners' Association",
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  amount: number;
  title: string;
  lines?: { label: string; amount: number }[];
  onPaid: (method: string) => string | void;
  payee?: string;
}) {
  const [method, setMethod] = React.useState("Raast");
  const [stage, setStage] = React.useState<"choose" | "processing" | "done">("choose");
  const [receipt, setReceipt] = React.useState<string>("");

  React.useEffect(() => { if (open) { setStage("choose"); setReceipt(""); } }, [open]);

  const pay = async () => {
    setStage("processing");
    await sleep(1600);
    const r = onPaid(method);
    setReceipt(r || `TXN-${Math.floor(Math.random() * 1e8)}`);
    setStage("done");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        {stage === "done" ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="grid size-20 animate-rise place-items-center rounded-full bg-pine-100 text-pine-700"><CheckCircle2 className="size-10" /></span>
            <div className="mt-5 text-2xl font-semibold tracking-tight">{pkr(amount)} paid</div>
            <p className="mt-1 text-sm text-muted-foreground">{title} · via {method}</p>
            <div className="mt-6 w-full max-w-sm rounded-2xl border bg-card p-4 text-left text-sm">
              <div className="flex justify-between py-1"><span className="text-muted-foreground">Receipt</span><span className="font-mono font-medium">{receipt}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted-foreground">Paid to</span><span className="font-medium">{payee}</span></div>
              <div className="flex justify-between py-1"><span className="text-muted-foreground">Date</span><span className="font-medium">{new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</span></div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">A copy has been sent to WhatsApp +92 300 824 1190.</p>
            <div className="mt-6 flex w-full max-w-sm gap-2">
              <Button variant="outline" className="flex-1" onClick={() => window.print()}><Download /> Receipt</Button>
              <Button className="flex-1" onClick={() => onOpenChange(false)}>Done</Button>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>Checkout</SheetTitle>
              <SheetDescription>{title}</SheetDescription>
            </SheetHeader>
            <SheetBody>
              <div className="rounded-2xl bg-primary p-5 text-white">
                <div className="text-xs uppercase tracking-[0.16em] text-white/60">Amount</div>
                <div className="mt-1 text-3xl font-semibold tracking-tight tabular">{pkr(amount)}</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-white/70"><Building className="size-3.5" /> {payee}</div>
              </div>
              {lines && (
                <div className="mt-4 rounded-2xl border bg-card p-4">
                  {lines.map((l) => (
                    <div key={l.label} className="flex justify-between py-1.5 text-sm"><span className="text-muted-foreground">{l.label}</span><span className="tabular">{pkr(l.amount)}</span></div>
                  ))}
                </div>
              )}
              <div className="mt-5 text-sm font-semibold">Pay with</div>
              <div className="mt-2 grid gap-2">
                {PAY_METHODS.map((m) => (
                  <button key={m.id} onClick={() => setMethod(m.id)} className={cn("flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition", method === m.id ? "border-pine-600 ring-2 ring-pine-600/15" : "border-border hover:border-pine-300")}>
                    <span className={cn("grid size-10 place-items-center rounded-xl", m.tone)}><m.icon className="size-5" /></span>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{m.label}</span>
                      <span className="block text-xs text-muted-foreground">{m.sub}</span>
                    </span>
                    <span className={cn("size-5 rounded-full border-2", method === m.id ? "border-[6px] border-pine-600" : "border-border")} />
                  </button>
                ))}
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-3.5 text-pine-600" /> Demo checkout — no real payment is processed.</p>
            </SheetBody>
            <SheetFooter>
              <Button size="lg" className="w-full" onClick={pay} disabled={stage === "processing"}>
                {stage === "processing" ? <><Loader2 className="animate-spin" /> Authorising with {method}…</> : <>Pay {pkr(amount)}</>}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
