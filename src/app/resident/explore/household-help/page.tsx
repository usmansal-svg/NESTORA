"use client";
import * as React from "react";
import Link from "next/link";
import { BadgeCheck, Briefcase, MapPin, ShieldCheck, Languages } from "lucide-react";
import { CANDIDATES, STAFF_TYPES } from "@/data/catalog";
import { useDemo } from "@/lib/store";
import { cn, pkr } from "@/lib/utils";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Chips, PageHeader, SearchBar, Stars } from "@/components/shared/kit";

const EMP = ["Any", "Full-time", "Part-time", "Daily", "Hourly", "Monthly", "Temporary", "Live-in"];

export default function HouseholdHelp() {
  const hiring = useDemo((s) => s.hiring);
  const [type, setType] = React.useState("All");
  const [emp, setEmp] = React.useState("Any");
  const [q, setQ] = React.useState("");
  const list = CANDIDATES.filter((c) => (type === "All" || c.roles.includes(type)) && (emp === "Any" || c.types.includes(emp as never)) && [c.name, c.role, ...c.skills].join(" ").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader back="/resident/explore" title="Household help" subtitle="Verified maids, cooks, drivers, nannies & caregivers" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        {[["CNIC verified", "NADRA check on every profile"], ["Police character certificate", "Renewed annually"], ["References called", "By the NESTORA team"]].map(([a, b]) => (
          <div key={a} className="flex items-center gap-3 rounded-2xl bg-pine-50 p-3.5"><ShieldCheck className="size-5 shrink-0 text-pine-700" /><div><div className="text-sm font-semibold text-pine-950">{a}</div><div className="text-xs text-pine-900/70">{b}</div></div></div>
        ))}
      </div>
      <SearchBar value={q} onChange={setQ} placeholder="Search skills — “Chinese”, “newborn”, “automatic car”" />
      <Chips className="mt-4" value={type} onChange={setType} options={STAFF_TYPES.map((t) => ({ value: t, label: t }))} />
      <div className="no-scrollbar mt-2 flex gap-1.5 overflow-x-auto text-[12.5px]">{EMP.map((e) => <button key={e} onClick={() => setEmp(e)} className={cn("shrink-0 rounded-lg px-2.5 py-1", emp === e ? "bg-secondary font-semibold" : "text-muted-foreground")}>{e}</button>)}</div>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((c) => (
          <Link key={c.id} href={`/resident/explore/household-help/${c.id}`} className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex gap-3">
              <Avatar src={c.photo} name={c.name} className="size-16 rounded-2xl" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-semibold">{c.name} {c.verified.police && <BadgeCheck className="size-4 text-pine-600" />}</div>
                <div className="text-[13px] text-muted-foreground">{c.role} · {c.age} yrs</div>
                <div className="mt-1 flex items-center gap-2 text-xs"><Stars value={c.rating} /><span className="text-muted-foreground">{c.reviews} reviews</span></div>
              </div>
              {hiring[c.id] && <Badge variant={hiring[c.id].stage === "hired" ? "default" : "warn"}>{hiring[c.id].stage === "hired" ? "Hired" : hiring[c.id].stage === "offer" ? "Offer sent" : "Interview"}</Badge>}
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">{c.skills.slice(0, 3).map((s) => <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[11.5px]">{s}</span>)}</div>
            <div className="mt-3 grid grid-cols-2 gap-y-1 text-[12.5px] text-muted-foreground">
              <span className="flex items-center gap-1.5"><Briefcase className="size-3.5" /> {c.experience} yrs exp.</span>
              <span className="flex items-center gap-1.5"><Languages className="size-3.5" /> {c.languages.join(", ")}</span>
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5" /> {c.area}</span>
              <span className="font-semibold text-foreground">{pkr(c.salary)}/{c.salaryUnit}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">{c.types.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
