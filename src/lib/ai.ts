import type { DemoState } from "./store";
import { CANDIDATES, getProvider } from "@/data/catalog";
import { OFFERS, STATIONS } from "@/data/places";
import { fmtDateTime, pkr } from "./utils";

export type Lang = "en" | "roman" | "ur";
export interface AiCard { title: string; sub?: string; href?: string; badge?: string }
export interface AiAction { label: string; kind: "approve-visitor" | "reject-visitor" | "link" | "download"; id?: string; href?: string; sensitive?: boolean }
export interface AiReply { text: string; cards?: AiCard[]; actions?: AiAction[]; note?: string; lang: Lang }

export function detectLang(q: string): Lang {
  if (/[؀-ۿ]/.test(q)) return "ur";
  if (/\b(kitna|kitni|kitne|mera|meri|mere|hai|hain|kab|kya|kahan|kidhar|chahiye|karo|karna|batao|aya|aaya|agaya|pani|bijli|kaun|dhoondo|dhundo)\b/i.test(q)) return "roman";
  return "en";
}
const L = (lang: Lang, en: string, roman: string, ur: string) => (lang === "ur" ? ur : lang === "roman" ? roman : en);
const has = (q: string, ...w: string[]) => w.some((x) => q.includes(x));

export function residentAnswer(raw: string, s: DemoState): AiReply {
  const q = raw.toLowerCase();
  const lang = detectLang(raw);
  const apt = "A-1204";

  if (has(q, "approve", "let them in", "allow")) {
    const p = s.visitors.find((v) => v.apt === apt && v.status === "pending");
    if (!p) return { lang, text: L(lang, "No one is waiting at the gate for you right now.", "Abhi gate par aap ke liye koi intezar nahi kar raha.", "اس وقت گیٹ پر آپ کا کوئی مہمان انتظار نہیں کر رہا۔") };
    return { lang, text: L(lang, `${p.name} is waiting at ${p.gate?.split(" —")[0]}. Access decisions need your confirmation — tap below.`, `${p.name} ${p.gate?.split(" —")[0]} par intezar kar rahe hain. Entry ke liye aap ki tasdeeq zaroori hai.`, `${p.name} گیٹ پر انتظار کر رہے ہیں۔ داخلے کے لیے آپ کی تصدیق ضروری ہے۔`), actions: [{ label: `Approve ${p.name.split(" ")[0]}`, kind: "approve-visitor", id: p.id, sensitive: true }, { label: "Reject", kind: "reject-visitor", id: p.id, sensitive: true }], note: "Nestora AI never grants access on its own. Sensitive actions require your tap." };
  }
  if (has(q, "owe", "maintenance", "dues", "bill", "kitna", "واجب", "بل", "pay")) {
    const due = s.bills.filter((b) => b.status !== "paid");
    const total = due.reduce((a, b) => a + b.items.reduce((x, i) => x + i.amount, 0), 0);
    if (!total) return { lang, text: L(lang, "You're fully paid up — nothing outstanding for A-1204. 🎉", "Aap ke zimme koi raqam baqi nahi. Sab clear hai! 🎉", "آپ کے ذمے کوئی رقم باقی نہیں۔ 🎉"), cards: [{ title: "Payment history", href: "/resident/building/payments" }] };
    return { lang, text: L(lang, `You owe ${pkr(total)} for ${due[0].month}, due ${fmtDateTime(due[0].dueDate).split(",")[0]}. It includes a Rs 500 late fee from October.`, `Aap ke ${pkr(total)} baqi hain (${due[0].month}). Is mein October ki Rs 500 late fee shamil hai.`, `آپ کے ذمے ${pkr(total)} واجب الادا ہیں (${due[0].month})۔`), cards: due[0].items.map((i) => ({ title: i.label, sub: pkr(i.amount) })), actions: [{ label: "Pay now", kind: "link", href: "/resident/building/payments" }] };
  }
  if (has(q, "parcel", "locker", "package", "delivery", "پارسل")) {
    const ps = s.parcels.filter((p) => p.apt === apt && ["awaiting", "reception"].includes(p.status));
    if (!ps.length) return { lang, text: L(lang, "No parcels are waiting. I'll notify you the moment a courier deposits one.", "Abhi koi parcel nahi aya. Jaise hi aye ga, main bata doon ga.", "ابھی کوئی پارسل نہیں آیا۔") };
    return { lang, text: L(lang, `Yes — ${ps.length} parcel${ps.length > 1 ? "s are" : " is"} ready. ${ps[0].courier} is in Locker ${ps[0].compartment} at the Tower A lobby bank, PIN ${ps[0].pin}.`, `Jee haan — ${ps.length} parcel tayyar hain. ${ps[0].courier} wala Locker ${ps[0].compartment} (Tower A lobby) mein hai, PIN ${ps[0].pin}.`, `جی ہاں — ${ps.length} پارسل تیار ہیں۔ لاکر ${ps[0].compartment}، پن ${ps[0].pin}`), cards: ps.map((p) => ({ title: `${p.courier} · ${p.description ?? p.tracking}`, sub: `Locker ${p.compartment ?? "Reception"} · PIN ${p.pin}`, href: "/resident/building/parcels" })) };
  }
  if (has(q, "visitor", "guest", "arrived", "mehmaan", "mehman", "مہمان")) {
    const inside = s.visitors.filter((v) => v.apt === apt && v.status === "inside");
    const pending = s.visitors.filter((v) => v.apt === apt && v.status === "pending");
    const exp = s.visitors.filter((v) => v.apt === apt && ["expected", "approved"].includes(v.status));
    return { lang, text: L(lang, `${inside.length ? `${inside.map((v) => v.name).join(", ")} ${inside.length > 1 ? "are" : "is"} inside. ` : "No visitors are inside right now. "}${pending.length ? `${pending[0].name} is waiting for your approval at the gate. ` : ""}${exp.length ? `Next expected: ${exp[0].name}, ${fmtDateTime(exp[0].validFrom)}.` : ""}`, `${inside.length ? `${inside[0].name} andar hain. ` : "Abhi koi mehmaan andar nahi. "}${pending.length ? `${pending[0].name} gate par aap ki approval ka intezar kar rahe hain. ` : ""}${exp.length ? `Agla mehmaan: ${exp[0].name}, ${fmtDateTime(exp[0].validFrom)}.` : ""}`, `${pending.length ? `${pending[0].name} گیٹ پر آپ کی منظوری کے منتظر ہیں۔ ` : ""}${exp.length ? `اگلا مہمان: ${exp[0].name}` : ""}`), cards: [...pending, ...exp.slice(0, 2)].map((v) => ({ title: v.name, sub: v.status === "pending" ? "Waiting at gate" : fmtDateTime(v.validFrom), href: "/resident/building/visitors", badge: v.status })), actions: pending.length ? [{ label: `Approve ${pending[0].name.split(" ")[0]}`, kind: "approve-visitor", id: pending[0].id, sensitive: true }] : undefined };
  }
  if (has(q, "water", "pani", "tank", "tanker", "پانی")) return { lang, text: L(lang, "Water is available with normal pressure. Underground tank is at 72% and overhead tank A at 64%. Next tanker: tomorrow 7:30 AM. Tower B has a planned interruption Thursday 10 AM – 3 PM.", "Pani available hai. Underground tank 72% aur overhead A 64% bhara hai. Agla tanker kal subah 7:30 baje.", "پانی دستیاب ہے۔ زیرِ زمین ٹینک 72٪ بھرا ہے۔ اگلا ٹینکر کل صبح 7:30 بجے۔"), cards: [{ title: "Water & power dashboard", href: "/resident/building/utilities" }] };
  if (has(q, "generator", "electricity", "power", "bijli", "k-electric", "load", "بجلی")) return { lang, text: L(lang, "K-Electric grid is ON (228 V). The generator is on standby with 68% diesel (~31 h backup). Load-shedding is expected tomorrow 2–4 PM; generator backup is scheduled.", "K-Electric ki bijli aa rahi hai. Generator standby par hai, 68% diesel. Kal 2–4 baje load-shedding hai, generator chalega.", "کے الیکٹرک کی بجلی موجود ہے۔ جنریٹر اسٹینڈ بائی پر ہے۔"), cards: [{ title: "Live utilities", href: "/resident/building/utilities" }] };
  if (has(q, "complaint", "shikayat", "شکایت")) {
    const cs = s.complaints.filter((c) => c.apt === apt && c.status !== "Resolved");
    return { lang, text: L(lang, cs.length ? `You have ${cs.length} open complaint${cs.length > 1 ? "s" : ""}. ${cs[0].id} (${cs[0].title}) is ${cs[0].status.toLowerCase()}${cs[0].assignee ? ` with ${cs[0].assignee}` : ""}.` : "All your complaints are resolved.", cs.length ? `${cs[0].id} (${cs[0].title}) abhi "${cs[0].status}" hai.` : "Aap ki sab shikayaat hal ho chuki hain.", cs.length ? `آپ کی شکایت ${cs[0].id} پر کام جاری ہے۔` : "تمام شکایات حل ہو چکی ہیں۔"), cards: cs.map((c) => ({ title: `${c.id} · ${c.title}`, sub: c.timeline[c.timeline.length - 1].note ?? c.status, href: "/resident/building/complaints", badge: c.status })) };
  }
  const staffQ: [string[], string][] = [[["cook", "chef", "khansama", "bawarchi"], "Cooks"], [["maid", "masi", "cleaning lady", "housekeeper"], "Maids"], [["driver"], "Drivers"], [["nanny", "babysit"], "Nannies"], [["caregiver", "elderly", "nurse"], "Caregivers"]];
  for (const [words, role] of staffQ) if (has(q, ...words)) {
    const cs = CANDIDATES.filter((c) => c.roles.includes(role)).slice(0, 3);
    return { lang, text: L(lang, `Here are ${cs.length} verified ${role.toLowerCase()} available near Ocean Heights. All are CNIC- and police-verified.`, `Yeh ${cs.length} verified ${role.toLowerCase()} Ocean Heights ke qareeb available hain.`, `یہ ${cs.length} تصدیق شدہ افراد دستیاب ہیں۔`), cards: cs.map((c) => ({ title: `${c.name} · ★ ${c.rating}`, sub: `${c.experience} yrs · ${c.skills.slice(0, 2).join(", ")} · ${pkr(c.salary)}/${c.salaryUnit}`, href: `/resident/explore/household-help/${c.id}` })) };
  }
  const pv: [string[], string, string][] = [[["gardener", "mali", "plant"], "pv-greenthumb", "gardener"], [["barber", "haircut", "hajjam", "nai"], "pv-saleem", "barber"], [["trainer", "gym", "fitness"], "pv-faisal", "trainer"], [["electrician"], "pv-farhan", "electrician"], [["ac ", "a/c", "air condition"], "pv-cooltech", "AC technician"], [["swim"], "pv-aqua", "swimming coach"], [["plumber", "leak"], "pv-rashid", "plumber"]];
  for (const [words, id, what] of pv) if (has(q + " ", ...words)) {
    const p = getProvider(id)!;
    return { lang, text: L(lang, `${p.name} is the top-rated ${what} for Ocean Heights (★ ${p.rating}, ${p.jobs.toLocaleString()} jobs). Next availability: ${p.eta ?? "tomorrow"}. Want me to open booking?`, `${p.name} sab se behtareen ${what} hain (★ ${p.rating}). ${p.eta ?? "Kal"} available hain.`, `${p.name} بہترین ${what} ہیں (★ ${p.rating})۔`), cards: [{ title: p.name, sub: `${p.tagline} · from ${pkr(Math.min(...p.services.filter((x) => x.price).map((x) => x.price)))}`, href: `/resident/explore/provider/${p.id}` }], actions: [{ label: "Book now", kind: "link", href: `/resident/explore/provider/${p.id}` }] };
  }
  if (has(q, "offer", "restaurant", "deal", "discount")) return { lang, text: L(lang, "Top offers near you right now:", "Aap ke qareeb behtareen offers:", "آپ کے قریب بہترین آفرز:"), cards: OFFERS.slice(0, 4).map((o) => ({ title: `${o.business} — ${o.title}`, sub: `${o.distance} · code ${o.code}`, href: "/resident/offers" })) };
  if (has(q, "ev", "charge", "charger", "charging")) {
    const st = STATIONS.slice(0, 3);
    return { lang, text: L(lang, "Your building has 2 free 22 kW chargers at P1 right now (Rs 70/kWh). Nearest public DC fast charger: Khayaban-e-Ittehad, 1.9 km.", "Aap ki building ke P1 mein 2 charger khali hain (Rs 70/kWh).", "آپ کی عمارت میں 2 چارجر خالی ہیں۔"), cards: st.map((x) => ({ title: x.name, sub: `${x.distance} · ${x.chargers.filter((c) => c.status === "Available").length}/${x.chargers.length} free · ${pkr(x.price)}/kWh`, href: "/resident/ev" })) };
  }
  if (has(q, "food", "biryani", "hungry", "khana")) return { lang, text: L(lang, "Ammi's Kitchen (C-0905) is cooking chicken biryani tonight — ★ 4.9. Or post a Request Food and let chefs send offers.", "Ammi's Kitchen (C-0905) aaj chicken biryani bana rahi hain — ★ 4.9.", "امی کا کچن آج بریانی بنا رہا ہے۔"), cards: [{ title: "Ammi's Kitchen", sub: "Biryani · 35–45 min", href: "/resident/food/fs-ammi" }, { title: "Request Food", sub: "Let home chefs respond", href: "/resident/food" }] };
  return { lang, text: L(lang, "I can help with dues, visitors, parcels, water and power, complaints, and finding cooks, gardeners, barbers, trainers or EV chargers. Try one of the suggestions below.", "Main dues, mehmaan, parcel, pani-bijli, shikayaat aur services dhoondne mein madad kar sakta hoon.", "میں واجبات، مہمان، پارسل، پانی بجلی اور سروسز میں مدد کر سکتا ہوں۔") };
}

export function adminAnswer(raw: string, s: DemoState): AiReply {
  const q = raw.toLowerCase();
  const lang = detectLang(raw);
  if (has(q, "collected", "collection")) return { lang, text: "November collections: Rs 48.6 lac of Rs 62.4 lac billed (77.9%). That's 4.2 pts ahead of October at the same point. 58 apartments are yet to pay.", cards: [{ title: "Billing & accounting", sub: "Ledger, receipts, reminders", href: "/admin/billing" }] };
  if (has(q, "outstanding", "defaulter", "dues", "owe")) return { lang, text: "12 apartments have dues older than 60 days, totalling Rs 7.9 lac. Top 3:", cards: [{ title: "B-0303 · Kiran Javed", sub: "Rs 1,12,400 · 4 months", href: "/admin/billing" }, { title: "C-1801 · Faisal Mirza", sub: "Rs 96,200 · 3 months", href: "/admin/billing" }, { title: "A-0904 · Shahid Karim", sub: "Rs 81,150 · 3 months", href: "/admin/billing" }], actions: [{ label: "Send WhatsApp reminders", kind: "link", href: "/admin/billing", sensitive: true }], note: "Penalties and legal notices require treasurer approval." };
  if (has(q, "diesel", "generator", "fuel")) return { lang, text: "Diesel consumed this month: 2,840 L (Rs 8.1 lac) over 92 generator hours. That's 11% lower than October thanks to fewer outages. Fuel in tank: 68% (~1,360 L).", cards: [{ title: "Building utilities", href: "/admin/utilities" }] };
  if (has(q, "overdue", "complaint")) {
    const od = s.complaints.filter((c) => c.status !== "Resolved");
    return { lang, text: `${od.length} complaints are open; 2 are past SLA.`, cards: od.slice(0, 4).map((c) => ({ title: `${c.id} · ${c.title}`, sub: `${c.apt} · ${c.status} · SLA ${c.sla}`, href: "/admin/complaints", badge: c.priority })) };
  }
  if (has(q, "visitor", "entered", "gate")) return { lang, text: `Today: 184 visitor entries (126 pre-registered, 41 walk-ins approved, 17 deliveries). ${s.visitors.filter((v) => v.status === "inside").length} visitors are inside now. Peak at 7–9 PM.`, cards: [{ title: "Visitors & security", href: "/admin/security" }] };
  if (has(q, "parcel", "awaiting")) { const n = s.parcels.filter((p) => ["awaiting", "overdue", "reception"].includes(p.status)).length + 17; return { lang, text: `${n} parcels are awaiting collection across 3 locker banks; 3 are overdue (>48 h). Average collection time this week: 5.2 hours.`, cards: [{ title: "Parcel lockers", href: "/admin/lockers" }] }; }
  if (has(q, "faulty", "locker", "fault")) { const f = s.compartments.filter((c) => c.status === "faulty" || c.status === "disabled"); return { lang, text: `${f.length} compartments need attention:`, cards: f.map((c) => ({ title: `Compartment ${c.id}`, sub: c.fault ?? c.status, href: "/admin/lockers", badge: c.status })) }; }
  if (has(q, "report", "summary")) return { lang, text: "Here's your November operations report (draft):\n• Collections 77.9% (Rs 48.6 lac)\n• Expenses Rs 39.2 lac — diesel 21%, salaries 34%\n• 46 complaints, 41 resolved, avg 19 h\n• 5,210 visitor entries, 1,486 parcels via lockers\n• Locker utilisation 71%, 1 faulty compartment", actions: [{ label: "Download PDF report", kind: "download" }], note: "Reports are drafts until approved by the management committee." };
  return { lang, text: "Ask me about collections, defaulters, diesel, overdue complaints, visitors, parcels, faulty lockers, or say “generate this month's report”." };
}

export const RESIDENT_SUGGESTIONS = ["How much maintenance do I owe?", "Has my visitor arrived?", "Is my parcel ready?", "When is water available?", "Is the generator running?", "What is my complaint status?", "Find me a cook", "Book a barber", "Find a gardener", "Find a personal trainer", "Which restaurants have offers?", "Where can I charge my EV?", "Mera parcel aya?", "میرا بل کتنا ہے؟"];
export const ADMIN_SUGGESTIONS = ["How much maintenance was collected?", "Which apartments have outstanding dues?", "How much diesel was consumed?", "Which complaints are overdue?", "How many visitors entered today?", "How many parcels are awaiting collection?", "Which lockers are faulty?", "Generate this month's report"];
