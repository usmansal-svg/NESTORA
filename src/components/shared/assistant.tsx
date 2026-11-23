"use client";
import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, Download, Lock, Mic, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import { adminAnswer, residentAnswer, ADMIN_SUGGESTIONS, RESIDENT_SUGGESTIONS, type AiReply } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Msg = { from: "me"; text: string } | { from: "ai"; reply: AiReply };

export function Assistant({ mode = "resident", initial, className }: { mode?: "resident" | "admin"; initial?: string | null; className?: string }) {
  const [msgs, setMsgs] = React.useState<Msg[]>([]);
  const [text, setText] = React.useState("");
  const [thinking, setThinking] = React.useState(false);
  const end = React.useRef<HTMLDivElement>(null);
  const sent = React.useRef(false);
  const suggestions = mode === "admin" ? ADMIN_SUGGESTIONS : RESIDENT_SUGGESTIONS;

  const ask = React.useCallback((q: string) => {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: q }]);
    setText("");
    setThinking(true);
    setTimeout(() => {
      const st = useDemo.getState();
      setMsgs((m) => [...m, { from: "ai", reply: mode === "admin" ? adminAnswer(q, st) : residentAnswer(q, st) }]);
      setThinking(false);
    }, 700 + Math.random() * 500);
  }, [mode]);

  React.useEffect(() => { if (initial && !sent.current) { sent.current = true; ask(initial); } }, [initial, ask]);
  React.useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, thinking]);

  const act = (a: NonNullable<AiReply["actions"]>[number]) => {
    const st = useDemo.getState();
    if (a.kind === "approve-visitor" && a.id) { st.decideVisitor(a.id, true); toast.success("Approved by you", { description: "Guard notified." }); setMsgs((m) => [...m, { from: "ai", reply: { lang: "en", text: "Done — you approved the entry. Gate 1 has been notified and you'll get an alert when they enter." } }]); }
    if (a.kind === "reject-visitor" && a.id) { st.decideVisitor(a.id, false); toast("Entry rejected"); }
    if (a.kind === "download") toast.success("Report downloaded", { description: "Ocean-Heights-Nov-2026-Ops.pdf" });
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {msgs.length === 0 && (
          <div className="flex flex-col items-center px-2 pt-6 text-center">
            <span className="grid size-16 place-items-center rounded-3xl bg-gradient-to-br from-pine-700 to-pine-950 text-lime-accent shadow-lift"><Sparkles className="size-8" /></span>
            <div className="mt-4 font-display text-3xl">{mode === "admin" ? "How can I help run Ocean Heights?" : "Salaam Ahmed, how can I help?"}</div>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">Ask in English, اردو or Roman Urdu. I can read your building data — any access, payment or safety action still needs your confirmation.</p>
            <div className="mt-6 flex max-w-2xl flex-wrap justify-center gap-2">
              {suggestions.map((s) => <button key={s} onClick={() => ask(s)} className={cn("rounded-full border bg-card px-3.5 py-2 text-[13px] shadow-soft transition hover:border-pine-300", /[؀-ۿ]/.test(s) && "font-urdu")}>{s}</button>)}
            </div>
          </div>
        )}
        {msgs.map((m, i) => m.from === "me" ? (
          <div key={i} className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14.5px] text-white" dir="auto">{m.text}</div>
        ) : (
          <div key={i} className="flex max-w-[92%] gap-2.5">
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-pine-900 text-lime-accent"><Sparkles className="size-4" /></span>
            <div className="min-w-0 flex-1 space-y-2">
              <div className={cn("whitespace-pre-line rounded-2xl rounded-tl-md border bg-card px-4 py-3 text-[14.5px] leading-relaxed shadow-soft", m.reply.lang === "ur" && "text-right font-urdu leading-loose")} dir={m.reply.lang === "ur" ? "rtl" : "ltr"}>{m.reply.text}</div>
              {m.reply.cards && <div className="grid gap-2 sm:grid-cols-2">{m.reply.cards.map((c, k) => {
                const inner = <><div className="min-w-0 flex-1"><div className="truncate text-sm font-medium">{c.title}</div>{c.sub && <div className="truncate text-xs text-muted-foreground">{c.sub}</div>}</div>{c.badge && <Badge variant="muted">{c.badge}</Badge>}{c.href && <ArrowUpRight className="size-4 text-muted-foreground" />}</>;
                return c.href ? <Link key={k} href={c.href} className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5 hover:border-pine-300">{inner}</Link> : <div key={k} className="flex items-center gap-2 rounded-xl border bg-card px-3 py-2.5">{inner}</div>;
              })}</div>}
              {m.reply.actions && <div className="flex flex-wrap gap-2">{m.reply.actions.map((a, k) => a.kind === "link" ? <Button key={k} size="sm" variant={k === 0 ? "default" : "outline"} asChild><Link href={a.href!}>{a.sensitive && <Lock />}{a.label}</Link></Button> : <Button key={k} size="sm" variant={a.kind === "reject-visitor" ? "outline" : "default"} onClick={() => act(a)}>{a.sensitive && <Lock />}{a.kind === "download" && <Download />}{a.label}</Button>)}</div>}
              {m.reply.note && <div className="flex items-center gap-1.5 text-[11.5px] text-muted-foreground"><Lock className="size-3" /> {m.reply.note}</div>}
            </div>
          </div>
        ))}
        {thinking && <div className="flex gap-2.5"><span className="grid size-8 place-items-center rounded-xl bg-pine-900 text-lime-accent"><Sparkles className="size-4 animate-pulse" /></span><div className="flex items-center gap-1 rounded-2xl border bg-card px-4 py-3">{[0, 1, 2].map((i) => <span key={i} className="size-1.5 animate-bounce rounded-full bg-pine-500" style={{ animationDelay: `${i * 120}ms` }} />)}</div></div>}
        <div ref={end} />
      </div>
      {msgs.length > 0 && <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">{suggestions.slice(0, 8).map((s) => <button key={s} onClick={() => ask(s)} className="shrink-0 rounded-full border bg-card px-3 py-1.5 text-xs">{s}</button>)}</div>}
      <form onSubmit={(e) => { e.preventDefault(); ask(text); }} className="flex items-center gap-2 rounded-2xl border bg-card p-1.5 pl-4 shadow-soft focus-within:border-pine-400">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === "admin" ? "Ask about collections, complaints, lockers…" : "Ask anything… “Mera parcel aya?”"} className="h-10 min-w-0 flex-1 bg-transparent text-[15px] outline-none" dir="auto" />
        <Button type="button" variant="ghost" size="icon" onClick={() => toast("Voice input", { description: "Speak in English or Urdu (demo)" })}><Mic /></Button>
        <Button type="submit" size="icon"><Send /></Button>
      </form>
    </div>
  );
}
