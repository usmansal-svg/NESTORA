"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Building2, Car, CreditCard, Globe, Heart, HelpCircle, Home, KeyRound, LogOut, MapPin, Receipt, Shield, UserCog, UserPlus, Users, UserCheck, Lock, Fingerprint, Eye, Plus } from "lucide-react";
import { toast } from "sonner";
import { APARTMENTS, RESIDENT } from "@/data/seed";
import { getProvider } from "@/data/catalog";
import { face } from "@/lib/img";
import { useDemo } from "@/lib/store";
import { useQuery } from "@/lib/hooks";
import { cn, fmtDate, pkr } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, Switch } from "@/components/ui/misc";
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { List, PageHeader, Row, Section } from "@/components/shared/kit";
import { Field } from "@/components/shared/pickers";
import { PAY_METHODS } from "@/components/resident/pay-sheet";

const FAMILY = [
  { name: "Mariam Raza", rel: "Spouse", photo: face("w2"), role: "Co-owner", perms: { pay: true, visitors: true, staff: true, votes: false } },
  { name: "Zayan Raza", rel: "Son, 16", photo: face("m5"), role: "Family member", perms: { pay: false, visitors: true, staff: false, votes: false } },
  { name: "Imran Siddiqui", rel: "Tenant, C-0702", photo: face("m2"), role: "Tenant", perms: { pay: true, visitors: true, staff: true, votes: false } },
];
const STR = {
  en: { hi: "Good evening, Ahmed", pay: "Pay maintenance", visitor: "Register visitor" },
  ur: { hi: "شام بخیر، احمد", pay: "مینٹیننس ادا کریں", visitor: "مہمان رجسٹر کریں" },
  roman: { hi: "Shaam bakhair, Ahmed", pay: "Maintenance ada karein", visitor: "Mehmaan register karein" },
};
type Sec = "personal" | "homes" | "family" | "vehicles" | "payments" | "transactions" | "addresses" | "saved" | "notifications" | "privacy" | "language" | "support" | null;

export default function AccountPage() {
  const s = useDemo();
  const router = useRouter();
  const q = useQuery("section");
  const [sec, setSec] = React.useState<Sec>(null);
  React.useEffect(() => { if (q) setSec(q as Sec); }, [q]);
  const [prefs, setPrefs] = React.useState<Record<string, [boolean, boolean, boolean]>>({
    "Visitor arrivals & approvals": [true, true, false], "Parcel arrivals": [true, true, true], "Bills & reminders": [true, true, false], "Complaint updates": [true, false, false],
    "Water & power alerts": [true, true, false], "Booking confirmations": [true, true, false], "Staff arrival": [true, false, false], "Emergency alerts": [true, true, true],
  });
  const title: Record<Exclude<Sec, null>, string> = { personal: "Personal information", homes: "My homes & roles", family: "Family & authorised people", vehicles: "Vehicles", payments: "Payment methods", transactions: "Transaction history", addresses: "Saved addresses", saved: "Saved providers", notifications: "Notifications", privacy: "Privacy & security", language: "Language", support: "Help & support" };
  const paid = s.bills.filter((b) => b.status === "paid");

  return (
    <div>
      <PageHeader title="Account" />
      <div className="flex items-center gap-4 rounded-3xl bg-primary p-5 text-white">
        <Avatar src={RESIDENT.photo} name={RESIDENT.name} className="size-16 ring-2 ring-white/20" />
        <div className="min-w-0 flex-1"><div className="text-xl font-semibold">{RESIDENT.name}</div><div className="text-sm text-white/65">{RESIDENT.phone} · Member since {RESIDENT.memberSince}</div><div className="mt-1.5 flex gap-1.5"><Badge variant="lime">Owner</Badge><Badge className="bg-white/10 text-white">3 homes</Badge></div></div>
        <Button variant="accent" size="sm" onClick={() => setSec("personal")}>Edit</Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Section title="Home & household" className="mt-0">
            <List>
              <Row onClick={() => setSec("homes")} icon={Home} title="My homes" subtitle={`${APARTMENTS.length} apartments · owner, representative`} />
              <Row onClick={() => setSec("family")} icon={Users} tone="violet" title="Family & tenants" subtitle="Members and their permissions" />
              <Row href="/resident/building/staff" icon={UserCheck} tone="teal" title="Household staff" subtitle={`${s.staff.filter((x) => x.status === "active").length} active`} />
              <Row href="/resident/building/visitors" icon={UserPlus} tone="sky" title="Authorised visitors" subtitle={`${s.visitors.filter((v) => v.recurring).length} recurring passes`} />
              <Row onClick={() => setSec("vehicles")} icon={Car} tone="stone" title="Vehicles" subtitle={`${s.vehicles.length} registered`} />
              <Row href="/resident/building/security" icon={KeyRound} tone="amber" title="Access permissions" subtitle="Gate, lift & amenity access" />
            </List>
          </Section>
          <Section title="Payments">
            <List>
              <Row onClick={() => setSec("payments")} icon={CreditCard} title="Payment methods" subtitle="Raast, JazzCash, Easypaisa, card" />
              <Row onClick={() => setSec("transactions")} icon={Receipt} tone="lime" title="Transaction history" subtitle={`${paid.length + s.bookings.length} transactions`} />
              <Row onClick={() => setSec("addresses")} icon={MapPin} tone="stone" title="Saved addresses" subtitle="Home, office, parents" />
              <Row onClick={() => setSec("saved")} icon={Heart} tone="rose" title="Saved providers" subtitle={`${s.savedProviders.length} favourites`} />
            </List>
          </Section>
        </div>
        <div className="space-y-6">
          <Section title="Preferences" className="mt-0">
            <List>
              <Row onClick={() => setSec("notifications")} icon={Bell} title="Notifications" subtitle="App, WhatsApp & SMS" />
              <Row onClick={() => setSec("language")} icon={Globe} tone="sky" title="Language" subtitle={{ en: "English", ur: "اردو", roman: "Roman Urdu" }[s.lang]} />
              <Row onClick={() => setSec("privacy")} icon={Shield} tone="dark" title="Privacy & security" subtitle="Biometric lock, data sharing" />
              <Row onClick={() => setSec("support")} icon={HelpCircle} tone="stone" title="Help & support" subtitle="Chat, call, FAQs" />
            </List>
          </Section>
          <Section title="Switch home">
            <List>{APARTMENTS.map((a) => <Row key={a.id} onClick={() => { s.setApartment(a.id); toast.success(`Switched to ${a.id}`); }} icon={Building2} tone={s.apartment === a.id ? "dark" : "stone"} title={`${a.building} · ${a.id}`} subtitle={a.role} trailing={s.apartment === a.id ? <Badge>Current</Badge> : undefined} />)}</List>
          </Section>
          <Button variant="outline" className="w-full text-danger" onClick={() => { toast("Signed out (demo)"); router.push("/"); }}><LogOut /> Log out</Button>
          <p className="text-center text-xs text-muted-foreground">NESTORA v0.9 · Prototype</p>
        </div>
      </div>

      <Sheet open={!!sec} onOpenChange={(o) => !o && setSec(null)}>
        <SheetContent>
          {sec && (
            <>
              <SheetHeader><SheetTitle>{title[sec]}</SheetTitle></SheetHeader>
              <SheetBody className="space-y-4">
                {sec === "personal" && (<>
                  <Field label="Full name"><Input defaultValue={RESIDENT.name} /></Field>
                  <Field label="Mobile"><Input defaultValue={RESIDENT.phone} /></Field>
                  <Field label="Email"><Input defaultValue={RESIDENT.email} /></Field>
                  <Field label="CNIC" hint="Verified · visible only to building management"><Input defaultValue="42201-•••••••-3" disabled /></Field>
                  <Field label="Emergency contact"><Input defaultValue="Mariam Raza · +92 321 555 0199" /></Field>
                </>)}
                {sec === "homes" && APARTMENTS.map((a) => (
                  <div key={a.id} className="rounded-2xl border bg-card p-4">
                    <div className="flex items-center justify-between"><div className="font-semibold">{a.building} · {a.id}</div><Badge variant={a.role === "Owner" ? "default" : "violet"}>{a.role}</Badge></div>
                    <div className="text-sm text-muted-foreground">{a.area}, Karachi · {a.sqft.toLocaleString()} sq ft</div>
                    <div className="mt-3 flex flex-wrap gap-1.5 text-[11.5px]">{(a.role === "Owner" ? ["Pay dues", "Vote in AGM", "Manage tenants", "Approve visitors", "Register staff"] : ["Pay dues on behalf", "View statements", "Raise complaints"]).map((p) => <span key={p} className="rounded-full bg-secondary px-2 py-0.5">{p}</span>)}</div>
                  </div>
                ))}
                {sec === "family" && (<>
                  {FAMILY.map((f) => (
                    <div key={f.name} className="rounded-2xl border bg-card p-4">
                      <div className="flex items-center gap-3"><Avatar src={f.photo} name={f.name} /><div className="flex-1"><div className="font-medium">{f.name}</div><div className="text-xs text-muted-foreground">{f.rel}</div></div><Badge variant="outline">{f.role}</Badge></div>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-[13px]">{Object.entries({ pay: "Make payments", visitors: "Approve visitors", staff: "Manage staff", votes: "Vote (owners only)" }).map(([k, l]) => <label key={k} className="flex items-center justify-between rounded-xl bg-secondary/60 px-3 py-2">{l}<Switch defaultChecked={f.perms[k as keyof typeof f.perms]} disabled={k === "votes"} /></label>)}</div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={() => toast.success("Invite sent via WhatsApp")}><Plus /> Invite family member, tenant or property manager</Button>
                </>)}
                {sec === "vehicles" && <List>{s.vehicles.map((v) => <Row key={v.id} icon={Car} title={v.make} subtitle={`${v.plate} · ${v.slot ?? "—"}`} />)}</List>}
                {sec === "payments" && <List>{PAY_METHODS.map((m) => <Row key={m.id} leading={<span className={cn("grid size-10 place-items-center rounded-xl", m.tone)}><m.icon className="size-5" /></span>} title={m.label} subtitle={m.sub} />)}</List>}
                {sec === "transactions" && <List>{[...paid.map((b) => ({ t: `Maintenance · ${b.month}`, d: b.paidAt!, a: b.items.reduce((x, i) => x + i.amount, 0), m: b.method })), ...s.bookings.filter((b) => b.price && b.status !== "Cancelled").map((b) => ({ t: b.service, d: b.date, a: b.price, m: b.paymentMethod ?? "Pay after service" }))].sort((a, b) => +new Date(b.d) - +new Date(a.d)).map((t, i) => <Row key={i} icon={Receipt} tone="stone" title={t.t} subtitle={`${fmtDate(t.d)} · ${t.m}`} trailing={<span className="text-sm font-semibold">{pkr(t.a)}</span>} />)}</List>}
                {sec === "addresses" && <List><Row icon={Home} title="Home" subtitle="A-1204, Ocean Heights, DHA Phase VIII" /><Row icon={Building2} title="Office" subtitle="Floor 9, Dolmen Executive Tower, Clifton" /><Row icon={MapPin} title="Parents" subtitle="House 42, Street 7, PECHS Block 2" /></List>}
                {sec === "saved" && <List>{s.savedProviders.map((id) => getProvider(id)).filter(Boolean).map((p) => <Row key={p!.id} href={`/resident/explore/provider/${p!.id}`} leading={<Avatar src={p!.photo} name={p!.name} />} title={p!.name} subtitle={p!.tagline} />)}</List>}
                {sec === "notifications" && (
                  <div className="overflow-hidden rounded-2xl border bg-card">
                    <div className="grid grid-cols-[1fr_repeat(3,52px)] border-b bg-secondary/60 px-4 py-2 text-[11px] font-semibold text-muted-foreground"><span>Type</span><span className="text-center">App</span><span className="text-center">WhatsApp</span><span className="text-center">SMS</span></div>
                    {Object.entries(prefs).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[1fr_repeat(3,52px)] items-center border-b px-4 py-2.5 text-[13px] last:border-0"><span>{k}</span>{v.map((on, i) => <span key={i} className="flex justify-center"><Switch checked={on} onCheckedChange={(c) => setPrefs({ ...prefs, [k]: v.map((x, j) => (j === i ? c : x)) as [boolean, boolean, boolean] })} /></span>)}</div>
                    ))}
                  </div>
                )}
                {sec === "privacy" && <List>
                  <Row icon={Fingerprint} title="Biometric app lock" trailing={<Switch defaultChecked />} />
                  <Row icon={Eye} title="Show my apartment number in marketplace" trailing={<Switch defaultChecked />} />
                  <Row icon={UserCog} title="Share my name with guards for deliveries" trailing={<Switch defaultChecked />} />
                  <Row icon={Lock} title="Download my data" onClick={() => toast.success("Data export requested", { description: "We'll email a copy within 48 hours." })} />
                </List>}
                {sec === "language" && (<>
                  {(["en", "ur", "roman"] as const).map((l) => (
                    <button key={l} onClick={() => { s.setLang(l); toast.success("Language updated"); }} className={cn("w-full rounded-2xl border bg-card p-4 text-left", s.lang === l && "border-pine-600 ring-2 ring-pine-600/15")}>
                      <div className="flex items-center justify-between"><span className="font-semibold">{{ en: "English", ur: "اردو (Urdu)", roman: "Roman Urdu" }[l]}</span>{s.lang === l && <Badge>Selected</Badge>}</div>
                      <div className={cn("mt-2 space-y-0.5 text-sm text-muted-foreground", l === "ur" && "text-right font-urdu leading-loose")} dir={l === "ur" ? "rtl" : "ltr"}>{Object.values(STR[l]).map((x) => <div key={x}>{x}</div>)}</div>
                    </button>
                  ))}
                  <p className="text-xs text-muted-foreground">Nestora AI understands English, Urdu and Roman Urdu regardless of this setting.</p>
                </>)}
                {sec === "support" && <List>
                  <Row href="/resident/assistant" icon={HelpCircle} title="Ask Nestora AI" subtitle="Instant answers, 24/7" />
                  <Row icon={Users} title="Chat with NESTORA support" subtitle="Avg reply 4 min" onClick={() => toast.success("Support chat opened")} />
                  <Row icon={Building2} title="Contact building management" subtitle="Mon–Sat, 9 AM – 6 PM · +92 21 3534 0000" />
                </List>}
              </SheetBody>
              {sec === "personal" && <SheetFooter><Button className="w-full" onClick={() => { toast.success("Profile updated"); setSec(null); }}>Save changes</Button></SheetFooter>}
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
