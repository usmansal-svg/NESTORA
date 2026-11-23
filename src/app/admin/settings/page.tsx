"use client";
import * as React from "react";
import { Building2, CreditCard, KeyRound, Languages, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { AdminHeader, Panel, Table } from "@/components/admin/shell";
import { Field } from "@/components/shared/pickers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, Switch } from "@/components/ui/misc";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ROLES = [
  { role: "Committee admin", who: "Sadia Qureshi", perms: "Everything except financial release" },
  { role: "Treasurer", who: "Tariq Mehmood", perms: "Billing, ledger, expenses, payment release (2-person rule)" },
  { role: "Supervisor", who: "Naveed Akhtar", perms: "Complaints, tasks, staff attendance, utilities log" },
  { role: "Security lead", who: "Rizwan Ali", perms: "Gate, visitors, incidents, parcels" },
  { role: "Reception", who: "Nasir Mehmood", perms: "Parcels, visitors (read), amenities" },
];
const AUDIT = [
  { at: "3:12 PM", who: "Sadia Q.", what: "Viewed contact number of B-0303" },
  { at: "2:48 PM", who: "Tariq M.", what: "Recorded expense EXP-1182 (Rs 285,000)" },
  { at: "1:05 PM", who: "Rizwan A.", what: "Opened compartment C-14 for manual handover (approved by Naveed A.)" },
  { at: "11:30 AM", who: "System", what: "Daily backup completed" },
];

export default function Settings() {
  const [s, setS] = React.useState({ autoApproveFamily: false, guardCall: true, twoPerson: true, quiet: true, mask: true, cnic: true });
  const t = (k: keyof typeof s, label: string) => (v: boolean) => { setS({ ...s, [k]: v }); toast.success(`${label} ${v ? "on" : "off"}`); };
  return (
    <>
      <AdminHeader title="Settings" subtitle="Building profile, roles, policies and integrations" />
      <Tabs defaultValue="building">
        <TabsList className="mb-4 flex-wrap"><TabsTrigger value="building">Building</TabsTrigger><TabsTrigger value="roles">Roles & access</TabsTrigger><TabsTrigger value="policies">Policies</TabsTrigger><TabsTrigger value="integrations">Integrations</TabsTrigger><TabsTrigger value="audit">Audit log</TabsTrigger></TabsList>
        <TabsContent value="building">
          <Panel title="Building profile">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name"><Input defaultValue="Ocean Heights" /></Field>
              <Field label="Address"><Input defaultValue="Plot 14, Khayaban-e-Rahat, DHA Phase VIII, Karachi" /></Field>
              <Field label="Towers"><Input defaultValue="A, B, C (22 floors each)" /></Field>
              <Field label="Default language"><Select value="en" onValueChange={(v) => toast(`Default language set to ${v === "ur" ? "Urdu" : "English"}`)} options={[{ value: "en", label: "English" }, { value: "ur", label: "اردو Urdu" }]} /></Field>
              <Field label="Billing rate (Rs / sq ft)"><Input defaultValue="12.5" inputMode="decimal" /></Field>
              <Field label="Late payment surcharge"><Input defaultValue="2% after 10th" /></Field>
            </div>
            <Button className="mt-4" onClick={() => toast.success("Building profile saved")}><Building2 /> Save</Button>
          </Panel>
        </TabsContent>
        <TabsContent value="roles">
          <Panel title="Roles and permissions" action={<Button size="sm" variant="outline" onClick={() => toast("Invite link copied")}><Users /> Add member</Button>}>
            <Table rows={ROLES} cols={[{ h: "Role", c: (r) => <span className="font-medium">{r.role}</span> }, { h: "Assigned to", c: (r) => r.who }, { h: "Permissions", c: (r) => <span className="text-muted-foreground">{r.perms}</span> }]} />
          </Panel>
        </TabsContent>
        <TabsContent value="policies">
          <Panel title="Security and privacy policies">
            <div className="flex flex-col divide-y">
              {([
                ["autoApproveFamily", "Auto-approve registered family visitors", "Off: every guest needs resident approval or a pre-issued pass"],
                ["guardCall", "Guard may call resident if no response in 2 min", "Masked call through the NESTORA line"],
                ["twoPerson", "Two-person approval for payments over Rs 100,000", "Treasurer + chairperson"],
                ["quiet", "Quiet hours for non-urgent notifications (10 PM – 8 AM)", "Emergencies and gate approvals always come through"],
                ["mask", "Mask resident phone numbers for staff and vendors", "Viewing unmasked numbers is logged"],
                ["cnic", "Require CNIC verification for household staff", "Collected with consent, visible to security lead only"],
              ] as const).map(([k, l, d]) => <label key={k} className="flex items-center justify-between gap-4 py-3.5"><span><span className="block text-sm font-medium">{l}</span><span className="text-xs text-muted-foreground">{d}</span></span><Switch checked={s[k]} onCheckedChange={t(k, l)} /></label>)}
            </div>
          </Panel>
        </TabsContent>
        <TabsContent value="integrations" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[[CreditCard, "Raast · 1LINK", "Instant bank payments", true], [CreditCard, "JazzCash & Easypaisa", "Mobile wallet collections", true], [Languages, "WhatsApp Business", "Notifications and passes", true], [KeyRound, "Locker vendor API", "3 banks · 72 compartments", true], [ShieldCheck, "NADRA Verisys", "CNIC verification (requires consent)", false], [Building2, "K-Electric outage feed", "Load-shedding schedule", true]].map(([I, n, d, on]) => {
            const Icon = I as typeof CreditCard;
            return <div key={n as string} className="rounded-2xl border bg-card p-4 shadow-soft"><Icon className="size-5 text-pine-600" /><div className="mt-3 font-medium">{n as string}</div><div className="text-xs text-muted-foreground">{d as string}</div><div className="mt-3 flex items-center justify-between">{on ? <Badge>Connected</Badge> : <Badge variant="muted">Not connected</Badge>}<Button size="sm" variant="ghost" onClick={() => toast(on ? `${n} settings opened` : `${n} connection requested`)}>{on ? "Manage" : "Connect"}</Button></div></div>;
          })}
        </TabsContent>
        <TabsContent value="audit">
          <Panel title="Audit log" subtitle="Sensitive actions across the portal">
            <Table rows={AUDIT} cols={[{ h: "Time", c: (r) => r.at }, { h: "User", c: (r) => r.who }, { h: "Action", c: (r) => r.what }]} />
          </Panel>
        </TabsContent>
      </Tabs>
    </>
  );
}
