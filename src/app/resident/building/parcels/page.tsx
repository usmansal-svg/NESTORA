"use client";
import * as React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Camera, CheckCircle2, Clock, KeyRound, MapPin, Package, PackageOpen, RefreshCw, Send, Timer, Undo2, Info, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { useTick } from "@/lib/hooks";
import type { Parcel } from "@/lib/types";
import { ago, cn, fmtDateTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetBody, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Chips, Empty, KeyVal, PageHeader, Section } from "@/components/shared/kit";
import { CourierMark } from "@/components/shared/courier";

const BANKS: Record<string, string> = { "LB-A": "Tower A lobby", "LB-B": "Tower B lobby", "LB-C": "Service gate" };
type Tab = "awaiting" | "expected" | "collected" | "overdue" | "returned";

function countdown(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso).getTime() - Date.now();
  if (d <= 0) return "Expired";
  const h = Math.floor(d / 3600000), m = Math.floor((d % 3600000) / 60000);
  return h > 0 ? `${h}h ${m}m left` : `${m}m left`;
}

export default function ParcelsPage() {
  const s = useDemo();
  useTick(30000);
  const [tab, setTab] = React.useState<Tab>("awaiting");
  const [sel, setSel] = React.useState<string | null>(null);
  const mine = s.parcels.filter((p) => p.apt === "A-1204");
  const by: Record<Tab, Parcel[]> = {
    awaiting: mine.filter((p) => p.status === "awaiting" || p.status === "reception"),
    expected: mine.filter((p) => p.status === "expected"),
    collected: mine.filter((p) => p.status === "collected"),
    overdue: mine.filter((p) => p.status === "overdue"),
    returned: mine.filter((p) => p.status === "returned"),
  };
  const cur = s.parcels.find((p) => p.id === sel);

  return (
    <div>
      <PageHeader back="/resident/building" title="My parcels" subtitle="NESTORA Smart Parcel Lockers · 3 banks · 72 compartments" />
      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pine-800 to-pine-950 p-6 text-white">
          <div className="absolute right-0 top-0 grid h-full w-40 grid-cols-3 gap-1.5 p-4 opacity-[0.12]">{Array.from({ length: 18 }).map((_, i) => <div key={i} className="rounded-md border border-white" />)}</div>
          <div className="relative">
            <div className="flex items-center gap-2 text-sm text-white/70"><PackageOpen className="size-4 text-lime-accent" /> Ready to collect</div>
            <div className="mt-1 text-4xl font-semibold tracking-tight">{by.awaiting.length} parcel{by.awaiting.length === 1 ? "" : "s"}</div>
            <p className="mt-1 max-w-sm text-sm text-white/60">Scan the QR or type your PIN at the locker screen. No need to wait for reception.</p>
            {by.awaiting[0] && <Button variant="accent" className="mt-4" onClick={() => setSel(by.awaiting[0].id)}><KeyRound /> Show collection code</Button>}
          </div>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-5 shadow-soft">
          <div className="text-sm font-semibold">How it works</div>
          <ol className="mt-3 space-y-2.5 text-[13px]">
            {["Courier deposits your parcel in a locker", "You get a push, WhatsApp & SMS with a one-time PIN", "Scan QR or enter PIN at the locker terminal", "Door opens — take your parcel and close it"].map((t, i) => (
              <li key={t} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-pine-50 text-xs font-semibold text-pine-700">{i + 1}</span><span className="pt-0.5 text-foreground/80">{t}</span></li>
            ))}
          </ol>
        </div>
      </div>

      <Chips className="mt-6" value={tab} onChange={setTab} options={[
        { value: "awaiting", label: "Awaiting collection", count: by.awaiting.length }, { value: "expected", label: "Expected", count: by.expected.length },
        { value: "collected", label: "Collected" }, { value: "overdue", label: "Overdue", count: by.overdue.length }, { value: "returned", label: "Returned" },
      ]} />

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {by[tab].length === 0 && <div className="md:col-span-2"><Empty icon={Package} title="No parcels here" body="Shopping on Daraz or elsewhere? Use 'Ocean Heights Lockers, A-1204' as your address." /></div>}
        {by[tab].map((p) => (
          <button key={p.id} onClick={() => setSel(p.id)} className="rounded-2xl border border-border/70 bg-card p-4 text-left shadow-soft transition hover:shadow-lift">
            <div className="flex items-start gap-3">
              <CourierMark name={p.courier} />
              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold">{p.description ?? `${p.courier} parcel`}</div>
                <div className="truncate font-mono text-[12px] text-muted-foreground">{p.tracking}</div>
              </div>
              {p.status === "awaiting" && <Badge variant="lime">In locker</Badge>}
              {p.status === "reception" && <Badge variant="warn">At reception</Badge>}
              {p.status === "expected" && <Badge variant="info">On the way</Badge>}
              {p.status === "collected" && <Badge variant="muted">Collected</Badge>}
              {p.status === "returned" && <Badge variant="danger">Returned</Badge>}
              {p.status === "overdue" && <Badge variant="danger">Overdue</Badge>}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
              <div className="rounded-xl bg-secondary/70 px-2.5 py-2"><div className="text-muted-foreground">Locker</div><div className="font-semibold">{p.compartment ?? (p.status === "reception" ? "Reception" : "—")}</div></div>
              <div className="rounded-xl bg-secondary/70 px-2.5 py-2"><div className="text-muted-foreground">{p.status === "expected" ? "Expected" : "Arrived"}</div><div className="font-semibold">{p.arrivedAt ? ago(p.arrivedAt) : p.expectedOn ? fmtDateTime(p.expectedOn).split(",")[0] : "—"}</div></div>
              <div className="rounded-xl bg-secondary/70 px-2.5 py-2"><div className="text-muted-foreground">{p.status === "collected" ? "Collected" : "Expires"}</div><div className={cn("font-semibold", p.status === "awaiting" && "text-amber-700")}>{p.status === "collected" ? ago(p.collectedAt!) : p.status === "awaiting" || p.status === "reception" ? countdown(p.expiresAt) : "—"}</div></div>
            </div>
          </button>
        ))}
      </div>

      <Section title="Coming soon">
        <div className="grid gap-3 sm:grid-cols-2">
          {[{ i: Send, t: "Send a parcel", d: "Drop outgoing parcels in a locker for TCS or Leopards pickup." }, { i: Undo2, t: "Retailer returns", d: "Return Daraz & brand orders through your building lockers." }].map((x) => (
            <button key={x.t} onClick={() => toast.success("You're on the early-access list", { description: x.t })} className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-card/60 p-4 text-left hover:border-pine-300">
              <x.i className="mt-0.5 size-5 text-pine-600" /><div><div className="font-medium">{x.t}</div><div className="text-[13px] text-muted-foreground">{x.d}</div></div>
            </button>
          ))}
        </div>
      </Section>

      <Sheet open={!!cur} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent>
          {cur && (
            <>
              <SheetHeader><SheetTitle>{cur.description ?? `${cur.courier} parcel`}</SheetTitle><SheetDescription>{cur.courier} · {cur.tracking}</SheetDescription></SheetHeader>
              <SheetBody className="space-y-4">
                {(cur.status === "awaiting" || cur.status === "reception" || cur.status === "overdue") && cur.pin && (
                  <div className="rounded-3xl bg-pine-900 p-5 text-center text-white">
                    <div className="text-xs uppercase tracking-[0.18em] text-white/50">{cur.status === "reception" ? "Show at reception" : `Locker ${cur.compartment} · ${BANKS[cur.lockerBank ?? "LB-A"]}`}</div>
                    <div className="mx-auto mt-4 w-fit rounded-2xl bg-white p-3"><QRCodeSVG value={`NESTORA-LOCKER:${cur.id}:${cur.pin}`} size={168} fgColor="var(--color-pine-900)" /></div>
                    <div className="mt-4 text-xs text-white/50">Collection PIN</div>
                    <div className="mt-1 flex justify-center gap-1.5">{cur.pin.split("").map((d, i) => <span key={i} className="grid h-12 w-10 place-items-center rounded-xl bg-white/10 font-mono text-2xl font-semibold text-lime-accent ring-1 ring-white/15">{d}</span>)}</div>
                    <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/60"><span className="flex items-center gap-1"><Timer className="size-3.5" /> {countdown(cur.expiresAt)}</span><span className="flex items-center gap-1"><KeyRound className="size-3.5" /> Single use</span></div>
                  </div>
                )}
                {cur.status === "collected" && <div className="flex items-center gap-3 rounded-2xl bg-pine-50 p-4 text-sm"><CheckCircle2 className="size-6 text-pine-600" /><div><div className="font-semibold">Collected {ago(cur.collectedAt!)}</div><div className="text-muted-foreground">{cur.handoverBy ? `Handed over by ${cur.handoverBy}` : `From Locker ${cur.compartment} · PIN used and disabled`}</div></div></div>}
                <div className="rounded-2xl border bg-card px-4 py-2">
                  <KeyVal k="Recipient" v={`${cur.recipient} · ${cur.apt}`} />
                  {cur.compartment && <KeyVal k="Locker" v={<span className="flex items-center gap-1"><MapPin className="size-3.5" /> {cur.compartment} ({cur.size}) · {BANKS[cur.lockerBank!]}</span>} />}
                  {cur.status === "reception" && <KeyVal k="Location" v={<span className="flex items-center gap-1"><Building2 className="size-3.5" /> Tower A reception</span>} />}
                  {cur.arrivedAt && <KeyVal k="Arrived" v={fmtDateTime(cur.arrivedAt)} />}
                  {cur.expiresAt && cur.status !== "collected" && <KeyVal k="Collect by" v={fmtDateTime(cur.expiresAt)} />}
                  {cur.courierAgent && <KeyVal k="Delivered by" v={cur.courierAgent} />}
                  {cur.expectedOn && <KeyVal k="Expected" v={fmtDateTime(cur.expectedOn)} />}
                </div>
                {cur.photo && (
                  <div className="rounded-2xl border bg-card p-4">
                    <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Camera className="size-4" /> Deposit photo</div>
                    <div className="grid aspect-video place-items-center rounded-xl bg-gradient-to-br from-amber-100 via-amber-200 to-amber-300 text-amber-800"><div className="text-center"><Package className="mx-auto size-10" strokeWidth={1.4} /><div className="mt-1 text-xs">Taken by courier at {cur.arrivedAt && fmtDateTime(cur.arrivedAt)}</div></div></div>
                  </div>
                )}
                {cur.status === "awaiting" && <p className="flex items-start gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" /> Can't make it? Uncollected parcels move to reception after expiry, or ask a family member — you can forward the PIN securely.</p>}
              </SheetBody>
              {(cur.status === "awaiting" || cur.status === "overdue") && (
                <SheetFooter className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => { s.regeneratePin(cur.id); toast.success("New PIN issued", { description: "Previous PIN has been disabled. Valid 48 hours." }); }}><RefreshCw /> New PIN</Button>
                  <Button asChild><a href="/locker" target="_blank" rel="noreferrer"><Clock /> Open locker demo</a></Button>
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
