"use client";
import Link from "next/link";
import { BookOpen, Car, Download, FileBarChart, FileText, Flame, Gavel, Hammer, ScrollText, Vote } from "lucide-react";
import { toast } from "sonner";
import { face } from "@/lib/img";
import { Avatar } from "@/components/ui/misc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { List, PageHeader, Row, Section } from "@/components/shared/kit";

const DOCS = [
  { t: "Building bylaws (2024 revision)", s: "PDF · 42 pages", i: Gavel },
  { t: "Resident handbook", s: "PDF · 18 pages · Urdu & English", i: BookOpen },
  { t: "Parking policy", s: "PDF · 4 pages", i: Car },
  { t: "Renovation & contractor rules", s: "Working hours 9 AM – 6 PM, Mon–Sat", i: Hammer },
  { t: "Emergency procedures & fire exits", s: "Assembly point: main lawn", i: Flame },
  { t: "AGM minutes — June 2026", s: "PDF · 11 pages", i: ScrollText },
  { t: "Audited financial statements FY 2025–26", s: "Audited by Haider Shamsi & Co.", i: FileBarChart },
  { t: "Monthly income & expense — October 2026", s: "Published to owners", i: FileText },
];
const COMMITTEE = [
  { n: "Brig. (R) Khalid Mahmood", r: "President", p: face("m3") }, { n: "Sadia Qureshi", r: "General Secretary", p: face("w1") },
  { n: "Tariq Mehmood", r: "Treasurer", p: face("m2") }, { n: "Dr. Nazia Hasan", r: "Member · Safety", p: face("w4") }, { n: "Ahmed Raza", r: "Member · Technology", p: face("ahmed") },
];

export default function DocumentsPage() {
  return (
    <div>
      <PageHeader back="/resident" title="Documents & governance" subtitle="Ocean Heights Owners' Association" />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        <Section title="Documents" className="mt-0">
          <List>{DOCS.map((d) => <Row key={d.t} icon={d.i} tone="stone" title={d.t} subtitle={d.s} trailing={<Button variant="ghost" size="icon-sm" onClick={() => toast.success("Downloading", { description: d.t })}><Download /></Button>} chevron={false} />)}</List>
        </Section>
        <div>
          <Section title="Management committee" className="mt-0">
            <List>{COMMITTEE.map((c) => <Row key={c.n} leading={<Avatar src={c.p} name={c.n} />} title={c.n} subtitle={c.r} />)}</List>
          </Section>
          <Section title="Decisions">
            <div className="space-y-3">
              <Link href="/resident/building/announcements" className="block rounded-2xl border border-violet-200 bg-violet-50/60 p-4">
                <div className="flex items-center gap-2"><Badge variant="violet"><Gavel /> Formal resolution</Badge><span className="text-xs text-muted-foreground">closes in 9 days</span></div>
                <div className="mt-2 font-semibold">2027 maintenance revision (+8%)</div>
                <div className="text-[13px] text-muted-foreground">Binding · owners only · one vote per apartment</div>
              </Link>
              <Link href="/resident/building/announcements" className="block rounded-2xl border bg-card p-4">
                <div className="flex items-center gap-2"><Badge variant="muted"><Vote /> Informal poll</Badge></div>
                <div className="mt-2 font-semibold">Install EV chargers at P2?</div>
                <div className="text-[13px] text-muted-foreground">Opinion gathering — not binding. Feeds into AGM agenda.</div>
              </Link>
              <button onClick={() => toast.success("Proposal submitted to committee", { description: "You'll be notified when it's tabled." })} className="w-full rounded-2xl border border-dashed p-4 text-left text-sm font-medium text-pine-700 hover:border-pine-300">+ Submit a proposal to the committee</button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
