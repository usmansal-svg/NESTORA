"use client";
import * as React from "react";
import { CalendarDays, Check, Eye, Gavel, MapPin, Megaphone, Pin, Vote } from "lucide-react";
import { toast } from "sonner";
import { useDemo } from "@/lib/store";
import type { Announcement } from "@/lib/types";
import { ago, cn, fmtDate, fmtDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chips, PageHeader } from "@/components/shared/kit";

const variant = (a: Announcement) => (a.category === "Maintenance" ? "warn" : a.category === "Emergency" ? "danger" : a.category === "Poll" ? "violet" : a.category === "Event" ? "lime" : "muted") as "warn";

export default function AnnouncementsPage() {
  const s = useDemo();
  const [f, setF] = React.useState<"all" | "Notice" | "Poll" | "Event" | "Maintenance">("all");
  const list = s.announcements.filter((a) => f === "all" || a.category === f || (f === "Notice" && a.category === "Emergency"));
  React.useEffect(() => { s.announcements.forEach((a) => !a.read && s.readAnnouncement(a.id)); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <PageHeader back="/resident/building" title="Notices & community" subtitle="Announcements, polls, formal votes and events" />
      <Chips value={f} onChange={setF} options={[{ value: "all", label: "All" }, { value: "Notice", label: "Notices" }, { value: "Maintenance", label: "Maintenance" }, { value: "Poll", label: "Polls & votes" }, { value: "Event", label: "Events" }]} />
      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {list.map((a) => (
          <article key={a.id} className={cn("rounded-2xl border bg-card p-5 shadow-soft", a.category === "Emergency" ? "border-danger/40" : "border-border/70")}>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={variant(a)}>{a.category === "Poll" ? (a.poll?.formal ? <><Gavel /> Formal resolution</> : <><Vote /> Informal poll</>) : a.category === "Emergency" ? <><Megaphone /> Emergency</> : a.category}</Badge>
              {a.pinned && <Badge variant="outline"><Pin /> Pinned</Badge>}
              <span className="ml-auto text-xs text-muted-foreground">{ago(a.at)}</span>
            </div>
            <h3 className="mt-3 text-[17px] font-semibold leading-snug">{a.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
            {a.poll && <Poll a={a} />}
            {a.event && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-lime-soft/70 p-3.5">
                <div className="text-sm"><div className="flex items-center gap-1.5 font-medium"><CalendarDays className="size-4" /> {fmtDateTime(a.event.date)}</div><div className="mt-0.5 flex items-center gap-1.5 text-muted-foreground"><MapPin className="size-4" /> {a.event.place} · {a.event.going} going</div></div>
                <Button size="sm" variant={a.event.rsvp ? "outline" : "default"} className="ml-auto" onClick={() => { s.rsvp(a.id); toast.success(a.event!.rsvp ? "RSVP removed" : "You're going! Added to your calendar."); }}>{a.event.rsvp ? <><Check /> Going</> : "RSVP"}</Button>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
              <span>{a.author} · to {a.audience}</span>
              <span className="flex items-center gap-1"><Eye className="size-3.5" /> Read by {a.reads}/{a.total}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function Poll({ a }: { a: Announcement }) {
  const vote = useDemo((s) => s.vote);
  const p = a.poll!;
  const tot = p.options.reduce((x, o) => x + o.votes, 0);
  const voted = p.voted !== undefined;
  return (
    <div className="mt-4 space-y-2">
      {p.formal && <div className="rounded-xl bg-violet-50 px-3 py-2 text-xs text-violet-900">Binding vote under bylaw 14(b). One vote per apartment, owners only. Quorum: 50% (current {Math.round((tot / 198) * 100)}%). Closes {fmtDate(p.closes)}.</div>}
      {p.options.map((o, i) => {
        const pct = Math.round((o.votes / tot) * 100);
        return (
          <button key={o.label} disabled={voted} onClick={() => { vote(a.id, i); toast.success(p.formal ? "Your vote has been recorded" : "Thanks for voting", { description: p.formal ? "Vote receipt sent to your registered email." : undefined }); }} className={cn("relative w-full overflow-hidden rounded-xl border px-3.5 py-2.5 text-left text-sm transition", voted ? "cursor-default" : "hover:border-pine-400", p.voted === i ? "border-pine-600" : "border-border")}>
            {voted && <span className="absolute inset-y-0 left-0 bg-pine-100 transition-all duration-700" style={{ width: `${pct}%` }} />}
            <span className="relative flex justify-between gap-2"><span className="flex items-center gap-2 font-medium">{p.voted === i && <Check className="size-4 text-pine-700" />}{o.label}</span>{voted && <span className="font-semibold tabular">{pct}%</span>}</span>
          </button>
        );
      })}
      <div className="text-xs text-muted-foreground">{tot} votes · {voted ? "You voted" : `Closes ${fmtDate(p.closes)}`}</div>
    </div>
  );
}
