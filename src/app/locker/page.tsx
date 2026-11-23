"use client";
import * as React from "react";
import { ArrowLeft, CheckCircle2, Delete, DoorOpen, HelpCircle, Loader2, PackageOpen, PackagePlus, QrCode, RotateCcw, ShieldAlert, Truck, XCircle } from "lucide-react";
import { useDemo } from "@/lib/store";
import type { Parcel } from "@/lib/types";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/logo";

type Screen = "home" | "collect" | "collect-open" | "deliver" | "return" | "return-open" | "security" | "help";
const IDLE = 45;

export default function LockerKiosk() {
  const [screen, setScreen] = React.useState<Screen>("home");
  const [opened, setOpened] = React.useState<Parcel | null>(null);
  const [idle, setIdle] = React.useState(IDLE);
  const [clock, setClock] = React.useState("");
  React.useEffect(() => {
    const t = setInterval(() => { setClock(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })); setIdle((x) => x - 1); }, 1000);
    const reset = () => setIdle(IDLE);
    window.addEventListener("pointerdown", reset); window.addEventListener("keydown", reset);
    return () => { clearInterval(t); window.removeEventListener("pointerdown", reset); window.removeEventListener("keydown", reset); };
  }, []);
  React.useEffect(() => { if (idle <= 0) { setScreen("home"); setOpened(null); setIdle(IDLE); } }, [idle]);
  const go = (s: Screen) => { setScreen(s); setIdle(IDLE); };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#0b1512] p-0 sm:p-6">
      <div className="relative flex min-h-dvh w-full max-w-[880px] flex-col overflow-hidden bg-pine-950 text-white sm:min-h-[640px] sm:rounded-[36px] sm:border-[10px] sm:border-[#1a1f1d] sm:shadow-2xl">
        <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-pine-500/20 blur-3xl" />
        <header className="relative flex items-center justify-between px-6 pt-5 sm:px-8">
          <div className="flex items-center gap-3"><LogoMark inverted className="size-9" /><div><div className="text-sm font-semibold tracking-[0.2em]">NESTORA</div><div className="text-[11px] text-white/50">Bank A · Tower A Lobby · Ocean Heights</div></div></div>
          <div className="text-right"><div className="text-xl font-semibold tabular">{clock}</div><div className="text-[11px] text-white/45">{screen !== "home" ? `Returning home in ${idle}s` : "اردو · English"}</div></div>
        </header>
        <main className="relative flex flex-1 flex-col px-6 pb-6 pt-6 sm:px-8">
          {screen !== "home" && !screen.endsWith("-open") && <button onClick={() => go("home")} className="mb-5 flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-base"><ArrowLeft className="size-5" /> Back</button>}
          {screen === "home" && <Home go={go} />}
          {screen === "collect" && <Collect onOpen={(p) => { setOpened(p); go("collect-open"); }} />}
          {screen === "collect-open" && opened && <DoorOpenScreen comp={opened.compartment!} title="Your parcel is ready" body={`${opened.courier} · for ${opened.recipient}`} after="Take your parcel and close the door firmly." done="Collected. Thank you!" onDone={() => { setOpened(null); go("home"); }} />}
          {screen === "deliver" && <Deliver />}
          {screen === "return" && <Return onOpen={() => go("return-open")} />}
          {screen === "return-open" && <DoorOpenScreen comp="A-15" title="Place your return inside" body="Daraz return · RTN-44821" after="Put the sealed return parcel inside and close the door." done="Return dropped off. Daraz will collect it tomorrow. Receipt sent to your app." onDone={() => go("home")} />}
          {screen === "security" && <Security />}
          {screen === "help" && <Help />}
        </main>
        <footer className="relative flex items-center justify-between border-t border-white/10 px-6 py-3 text-[11px] text-white/40 sm:px-8"><span>Battery backup OK · Online</span><span>Need help? Security: Gate 1 · Ext. 100</span></footer>
      </div>
    </div>
  );
}

function Home({ go }: { go: (s: Screen) => void }) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="text-center">
        <h1 className="font-display text-[44px] leading-none sm:text-[56px]">NESTORA <span className="italic text-lime-accent">Smart Parcel Lockers</span></h1>
        <p className="mt-3 text-lg text-white/60">Tap to begin · ٹیپ کریں</p>
      </div>
      <div className="mt-8 grid flex-1 grid-cols-2 gap-4">
        <KBtn big icon={PackageOpen} label="Collect parcel" sub="Scan QR or enter PIN" onClick={() => go("collect")} tone="lime" />
        <KBtn big icon={Truck} label="Deliver parcel" sub="For courier agents" onClick={() => go("deliver")} />
        <KBtn icon={RotateCcw} label="Return parcel" sub="Retailer returns" onClick={() => go("return")} />
        <KBtn icon={ShieldAlert} label="Contact security" sub="Talk to the gate" onClick={() => go("security")} />
      </div>
      <button onClick={() => go("help")} className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-white/5 py-4 text-lg"><HelpCircle className="size-5" /> Help</button>
    </div>
  );
}

function KBtn({ icon: Icon, label, sub, onClick, tone, big }: { icon: typeof Truck; label: string; sub: string; onClick: () => void; tone?: "lime"; big?: boolean }) {
  return (
    <button onClick={onClick} className={cn("flex flex-col justify-between rounded-3xl p-5 text-left transition active:scale-[0.98] sm:p-6", big ? "min-h-[170px]" : "min-h-[120px]", tone === "lime" ? "bg-lime-accent text-pine-950" : "bg-white/[0.07] ring-1 ring-white/10 hover:bg-white/10")}>
      <Icon className={big ? "size-10" : "size-8"} strokeWidth={1.6} />
      <div><div className={cn("font-semibold", big ? "text-2xl" : "text-xl")}>{label}</div><div className={cn("text-sm", tone === "lime" ? "text-pine-900/70" : "text-white/55")}>{sub}</div></div>
    </button>
  );
}

function PinPad({ value, onChange, len = 6 }: { value: string; onChange: (v: string) => void; len?: number }) {
  return (
    <div>
      <div className="mb-5 flex justify-center gap-2.5">{Array.from({ length: len }, (_, i) => <div key={i} className={cn("grid size-12 place-items-center rounded-xl text-2xl font-semibold tabular sm:size-14", value[i] ? "bg-white text-pine-950" : "bg-white/10")}>{value[i] ?? ""}</div>)}</div>
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((k) => (
          <button key={k} onClick={() => onChange(k === "C" ? "" : k === "⌫" ? value.slice(0, -1) : (value + k).slice(0, len))} className="grid h-16 place-items-center rounded-2xl bg-white/[0.08] text-2xl font-medium active:bg-white/20">{k === "⌫" ? <Delete className="size-6" /> : k}</button>
        ))}
      </div>
    </div>
  );
}

function Collect({ onOpen }: { onOpen: (p: Parcel) => void }) {
  const collect = useDemo((s) => s.collectParcel);
  const parcels = useDemo((s) => s.parcels);
  const [mode, setMode] = React.useState<"pin" | "qr">("pin");
  const [pin, setPin] = React.useState("");
  const [err, setErr] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const ready = parcels.filter((p) => p.status === "awaiting" && p.lockerBank === "LB-A");
  const tryPin = (v: string) => { setBusy(true); setTimeout(() => { setBusy(false); const r = collect(v); if (r.ok) onOpen(r.parcel); else { setErr(r.reason); setPin(""); } }, 700); };
  React.useEffect(() => { if (pin.length === 6) tryPin(pin); else if (pin) setErr(""); }, [pin]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto mb-6 flex rounded-2xl bg-white/10 p-1 text-lg">{(["pin", "qr"] as const).map((m) => <button key={m} onClick={() => setMode(m)} className={cn("rounded-xl px-6 py-2.5", mode === m && "bg-white text-pine-950")}>{m === "pin" ? "Enter PIN" : "Scan QR"}</button>)}</div>
      {mode === "pin" ? (
        <>
          <div className="mb-4 text-center text-xl">Enter the 6-digit PIN from your NESTORA app</div>
          <PinPad value={pin} onChange={setPin} />
          {busy && <div className="mt-4 flex items-center justify-center gap-2 text-white/70"><Loader2 className="size-5 animate-spin" /> Checking…</div>}
          {err && <div className="mx-auto mt-4 flex max-w-md items-start gap-2 rounded-2xl bg-danger/90 p-4 text-base"><XCircle className="mt-0.5 size-5 shrink-0" />{err}</div>}
        </>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="relative grid size-64 place-items-center overflow-hidden rounded-3xl bg-black/40 ring-1 ring-white/15">
            <QrCode className="size-24 text-white/15" />
            <div className="absolute inset-x-6 top-6 h-0.5 animate-scan bg-lime-accent shadow-[0_0_18px_#c4e36b]" />
          </div>
          <div className="text-center text-xl">Hold your phone's QR code under the scanner</div>
          {ready.length > 0 && <div className="text-center text-sm text-white/50">Demo: tap a parcel to simulate its QR</div>}
          <div className="flex flex-wrap justify-center gap-2">{ready.map((p) => <button key={p.id} onClick={() => tryPin(p.pin!)} className="rounded-full bg-white/10 px-4 py-2 text-sm">{p.recipient.split(" ")[0]} · {p.compartment}</button>)}</div>
          {err && <div className="flex max-w-md items-start gap-2 rounded-2xl bg-danger/90 p-4"><XCircle className="mt-0.5 size-5 shrink-0" />{err}</div>}
        </div>
      )}
    </div>
  );
}

function DoorOpenScreen({ comp, title, body, after, done, onDone }: { comp: string; title: string; body: string; after: string; done: string; onDone: () => void }) {
  const [closed, setClosed] = React.useState(false);
  const [checking, setChecking] = React.useState(false);
  if (closed) return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <CheckCircle2 className="size-24 text-lime-accent" strokeWidth={1.4} />
      <div className="mt-4 text-3xl font-semibold">{done}</div>
      <div className="mt-2 text-lg text-white/55">Compartment {comp} is locked and secured.</div>
      <button onClick={onDone} className="mt-8 rounded-2xl bg-white px-10 py-4 text-lg font-semibold text-pine-950">Done</button>
    </div>
  );
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="text-lg text-white/60">{title}</div>
      <div className="mt-1 text-[64px] font-semibold leading-none text-lime-accent">{comp}</div>
      <div className="mt-2 text-lg text-white/70">{body}</div>
      <div className="mt-8 grid grid-cols-4 gap-1.5 rounded-2xl bg-black/30 p-3">
        {Array.from({ length: 12 }, (_, i) => i === 5 ? <div key={i} className="grid h-14 w-16 animate-pulse-soft place-items-center rounded-lg bg-lime-accent text-sm font-bold text-pine-950 [transform:perspective(200px)_rotateY(-25deg)]"><DoorOpen className="size-6" /></div> : <div key={i} className="h-14 w-16 rounded-lg bg-white/10" />)}
      </div>
      <div className="mt-6 max-w-md text-xl">{after}</div>
      <button onClick={() => { setChecking(true); setTimeout(() => { setChecking(false); setClosed(true); }, 1100); }} className="mt-6 flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-3.5 text-base ring-1 ring-white/15">{checking ? <><Loader2 className="size-5 animate-spin" /> Door sensor checking…</> : "Simulate closing the door"}</button>
    </div>
  );
}

function Deliver() {
  const [code, setCode] = React.useState("");
  const ok = code.length === 6;
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <Truck className="size-12 text-lime-accent" strokeWidth={1.5} />
      <div className="mt-3 text-2xl font-semibold">Courier delivery</div>
      <p className="mt-1 max-w-md text-white/60">Couriers deliver using the NESTORA Courier app, which assigns a compartment and opens it remotely. Enter your agent code to continue on this screen.</p>
      <div className="mt-6 w-full max-w-sm"><PinPad value={code} onChange={setCode} /></div>
      {ok && <div className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-base"><PackagePlus className="size-5 text-lime-accent" /> Agent verified. Open the Courier app (Demo as… → Courier) to register the parcel.</div>}
    </div>
  );
}

function Return({ onOpen }: { onOpen: () => void }) {
  const [code, setCode] = React.useState("");
  return (
    <div className="flex flex-1 flex-col items-center text-center">
      <RotateCcw className="size-12 text-lime-accent" strokeWidth={1.5} />
      <div className="mt-3 text-2xl font-semibold">Drop off a return</div>
      <p className="mt-1 text-white/60">Enter the 6-digit return code from the retailer (Daraz, Khaadi, Outfitters…)</p>
      <div className="mt-6 w-full max-w-sm"><PinPad value={code} onChange={setCode} /></div>
      <button disabled={code.length !== 6} onClick={onOpen} className="mt-6 rounded-2xl bg-lime-accent px-10 py-4 text-lg font-semibold text-pine-950 disabled:opacity-40">Open a compartment</button>
      <div className="mt-3 text-xs text-white/40">Returns are a preview of an upcoming feature</div>
    </div>
  );
}

function Security() {
  const notify = useDemo((s) => s.notify);
  const [state, setState] = React.useState<"idle" | "calling" | "connected">("idle");
  React.useEffect(() => { if (state === "calling") { const t = setTimeout(() => setState("connected"), 2200); return () => clearTimeout(t); } }, [state]);
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <div className={cn("grid size-28 place-items-center rounded-full", state === "idle" ? "bg-white/10" : "animate-pulse-soft bg-lime-accent/25")}><ShieldAlert className="size-12 text-lime-accent" strokeWidth={1.5} /></div>
      <div className="mt-5 text-3xl font-semibold">{state === "idle" ? "Contact security" : state === "calling" ? "Calling Gate 1…" : "Connected to Guard Rizwan"}</div>
      <p className="mt-2 max-w-md text-lg text-white/60">{state === "connected" ? "Speak into the microphone below the screen. A guard is also on the way to the lobby." : "A guard will answer over the intercom and can come to the lockers."}</p>
      {state === "idle" && <button onClick={() => { setState("calling"); notify({ kind: "emergency", title: "Locker Bank A needs assistance", body: "Someone pressed Contact Security at the Tower A lobby lockers.", role: "guard", href: "/guard" }); }} className="mt-8 rounded-2xl bg-lime-accent px-10 py-4 text-xl font-semibold text-pine-950">Call security</button>}
    </div>
  );
}

function Help() {
  const items = [
    ["Where is my PIN?", "Open NESTORA → Building → My Parcels. Your PIN and QR are also sent by WhatsApp and SMS."],
    ["My PIN doesn't work", "PINs are single-use and expire after 48 hours. Request a new PIN in the app, or contact security."],
    ["The door didn't open", "Wait 5 seconds and try again. If it still fails, tap Contact Security."],
    ["Parcel too big?", "Oversized parcels are kept at reception. You'll be notified with a collection PIN."],
  ];
  return (
    <div className="grid gap-3">
      {items.map(([q, a]) => <div key={q} className="rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/10"><div className="text-xl font-semibold">{q}</div><div className="mt-1 text-base text-white/65">{a}</div></div>)}
    </div>
  );
}
