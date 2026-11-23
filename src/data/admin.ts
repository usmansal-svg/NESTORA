import { face } from "@/lib/img";

const FIRST = ["Ahmed", "Sana", "Bilal", "Hira", "Omer", "Ayesha", "Faraz", "Nadia", "Kamran", "Saba", "Usman", "Mahnoor", "Hamza", "Zainab", "Asad", "Iqra", "Danish", "Rabia", "Talha", "Mehwish", "Shahid", "Kiran", "Faisal", "Amna"];
const LAST = ["Raza", "Malik", "Siddiqui", "Shah", "Farooq", "Khan", "Hussain", "Imran", "Ali", "Aziz", "Qureshi", "Javed", "Sheikh", "Mirza", "Karim", "Butt", "Abbasi", "Chaudhry"];
const rnd = (i: number, n: number) => ((i * 2654435761) >>> 0) % n;

export interface AptRow { id: string; tower: string; floor: number; unit: string; owner: string; occupant: string; type: "Owner-occupied" | "Tenant" | "Vacant"; sqft: number; residents: number; dues: number; lastPaid: string; phone: string; vehicles: number; photo: string }
export const APTS: AptRow[] = [];
["A", "B", "C"].forEach((t, ti) => {
  for (let f = 1; f <= 22; f++) for (let u = 1; u <= 4; u++) {
    const i = ti * 1000 + f * 10 + u;
    const id = `${t}-${String(f).padStart(2, "0")}${String(u).padStart(2, "0")}`;
    const vac = rnd(i, 17) === 0;
    const ten = !vac && rnd(i, 4) === 0;
    const owner = `${FIRST[rnd(i, FIRST.length)]} ${LAST[rnd(i + 7, LAST.length)]}`;
    const dues = id === "A-1204" ? 27050 : id === "B-0303" ? 112400 : vac ? 0 : rnd(i, 5) === 0 ? 24650 * (1 + rnd(i, 3)) : 0;
    APTS.push({ id, tower: t, floor: f, unit: `${String(f).padStart(2, "0")}${String(u).padStart(2, "0")}`, owner: id === "A-1204" ? "Ahmed Raza" : owner, occupant: vac ? "—" : ten ? `${FIRST[rnd(i + 3, FIRST.length)]} ${LAST[rnd(i + 11, LAST.length)]}` : id === "A-1204" ? "Ahmed Raza" : owner, type: vac ? "Vacant" : ten ? "Tenant" : "Owner-occupied", sqft: [1650, 2150, 1400, 2600][u - 1], residents: vac ? 0 : 2 + rnd(i, 5), dues, lastPaid: dues ? "Sep 2026" : "Nov 2026", phone: `+92 3${rnd(i, 4)}${rnd(i + 1, 10)} ${100 + rnd(i, 899)} ${1000 + rnd(i + 5, 8999)}`, vehicles: vac ? 0 : 1 + rnd(i, 3), photo: face((["m1", "w1", "m2", "w2", "m3", "w3", "m4", "w4", "m5", "w5", "m6", "w6"] as const)[rnd(i, 12)]) });
  }
});

export const COLLECTIONS = [
  { m: "Jun", billed: 58.2, collected: 54.1, expense: 41.5 }, { m: "Jul", billed: 58.9, collected: 52.8, expense: 44.2 }, { m: "Aug", billed: 71.0, collected: 66.3, expense: 52.9 },
  { m: "Sep", billed: 60.1, collected: 57.6, expense: 43.1 }, { m: "Oct", billed: 61.4, collected: 58.9, expense: 45.8 }, { m: "Nov", billed: 62.4, collected: 48.6, expense: 39.2 },
];
export const EXPENSES = [
  { name: "Salaries", value: 13.4 }, { name: "Diesel", value: 8.1 }, { name: "Electricity (common)", value: 5.2 }, { name: "Security", value: 4.6 }, { name: "Water tankers", value: 3.1 }, { name: "Lift maintenance", value: 2.2 }, { name: "Cleaning", value: 1.6 }, { name: "Other", value: 1.0 },
];
export const LEDGER = [
  { d: "22 Nov", ref: "EXP-1182", desc: "Diesel — 1,000 L (PSO Khayaban-e-Ittehad)", cat: "Diesel", amt: -285000, by: "Tariq M." },
  { d: "21 Nov", ref: "RCP-OH-88269", desc: "Maintenance — C-1503 (Raast)", cat: "Maintenance", amt: 26550, by: "Auto" },
  { d: "21 Nov", ref: "EXP-1181", desc: "Water tankers × 6 (Hydrant Safoora)", cat: "Water", amt: -54000, by: "Naveed A." },
  { d: "20 Nov", ref: "EXP-1180", desc: "Schindler AMC — Q4 instalment", cat: "Lift maintenance", amt: -220000, by: "Tariq M." },
  { d: "20 Nov", ref: "RCP-OH-88251", desc: "Maintenance — B-0904 (JazzCash)", cat: "Maintenance", amt: 25650, by: "Auto" },
  { d: "19 Nov", ref: "EXP-1179", desc: "Security staff salaries (Phoenix Security)", cat: "Security", amt: -460000, by: "Tariq M." },
  { d: "19 Nov", ref: "RCP-OH-88240", desc: "Community hall booking — A-0601", cat: "Facilities", amt: 15000, by: "Auto" },
  { d: "18 Nov", ref: "TRF-0092", desc: "Transfer to sinking fund", cat: "Sinking fund", amt: -500000, by: "Committee" },
];
export const STAFF = [
  { name: "Rizwan Ali", role: "Security guard", shift: "2 PM – 10 PM", status: "On duty", in: "1:52 PM", photo: face("m1"), vendor: "Phoenix Security" },
  { name: "Shahid Iqbal", role: "Security guard", shift: "2 PM – 10 PM", status: "On duty", in: "1:58 PM", photo: face("m6"), vendor: "Phoenix Security" },
  { name: "Naveed Akhtar", role: "Supervisor", shift: "9 AM – 6 PM", status: "On duty", in: "8:47 AM", photo: face("m3"), vendor: "In-house" },
  { name: "Rashid Khan", role: "Plumber", shift: "9 AM – 6 PM", status: "On task", in: "9:05 AM", photo: face("m4"), vendor: "In-house" },
  { name: "Jamil Ahmed", role: "Electrician", shift: "9 AM – 6 PM", status: "On duty", in: "9:12 AM", photo: face("m2"), vendor: "In-house" },
  { name: "Imtiaz Hussain", role: "Genset operator", shift: "8 AM – 8 PM", status: "On duty", in: "7:55 AM", photo: face("m5"), vendor: "In-house" },
  { name: "Nasir Mehmood", role: "Receptionist", shift: "9 AM – 9 PM", status: "On break", in: "8:58 AM", photo: face("m1"), vendor: "In-house" },
  { name: "Gul Bano", role: "Cleaner", shift: "7 AM – 3 PM", status: "On duty", in: "6:55 AM", photo: face("w5"), vendor: "SparkClean" },
  { name: "Allah Ditta", role: "Cleaner", shift: "7 AM – 3 PM", status: "Absent", in: "—", photo: face("m4"), vendor: "SparkClean" },
  { name: "Waqar Shah", role: "Security guard", shift: "10 PM – 6 AM", status: "Off shift", in: "—", photo: face("m2"), vendor: "Phoenix Security" },
];
export const VENDORS = [
  { name: "Phoenix Security Services", type: "Security", contract: "Rs 4.6 lac / month", rating: 4.3, status: "Active", renews: "Mar 2027" },
  { name: "Schindler Pakistan", type: "Lift AMC", contract: "Rs 8.8 lac / year", rating: 4.6, status: "Active", renews: "Jun 2027" },
  { name: "SparkClean Facility", type: "Cleaning", contract: "Rs 1.6 lac / month", rating: 4.0, status: "Review due", renews: "Jan 2027" },
  { name: "PSO Khayaban-e-Ittehad", type: "Diesel supplier", contract: "Per delivery", rating: 4.5, status: "Active", renews: "—" },
  { name: "Hydrant Safoora Tankers", type: "Water tankers", contract: "Rs 9,000 / tanker", rating: 3.8, status: "Active", renews: "—" },
  { name: "CoolTech Karachi", type: "Marketplace · AC", contract: "Commission 8%", rating: 4.8, status: "Active", renews: "—" },
  { name: "SafaiPro", type: "Marketplace · Cleaning", contract: "Commission 10%", rating: 4.8, status: "Active", renews: "—" },
  { name: "Ustad Saleem", type: "Marketplace · Barber", contract: "Commission 10%", rating: 4.9, status: "Active", renews: "—" },
  { name: "PressPerfect Laundry", type: "Marketplace · Laundry", contract: "Commission 12%", rating: 4.6, status: "Active", renews: "—" },
  { name: "TCS", type: "Courier", contract: "Locker partner API", rating: 4.4, status: "Integrated", renews: "—" },
  { name: "Leopards Courier", type: "Courier", contract: "Locker partner", rating: 4.2, status: "Manual", renews: "—" },
  { name: "Kolachi Grill", type: "Local business", contract: "Sponsored listing", rating: 4.6, status: "Active", renews: "Dec 2026" },
];
export const PARCEL_DAILY = [{ d: "Mon", n: 41 }, { d: "Tue", n: 52 }, { d: "Wed", n: 48 }, { d: "Thu", n: 63 }, { d: "Fri", n: 71 }, { d: "Sat", n: 39 }, { d: "Sun", n: 24 }];
export const VISITORS_HOURLY = Array.from({ length: 16 }, (_, i) => ({ h: `${i + 7}:00`, n: Math.round(6 + 10 * Math.sin((i - 2) / 3) ** 2 + (i > 10 ? 9 : 0)) }));
export const COMPLAINT_TREND = [{ w: "W1", opened: 12, resolved: 10 }, { w: "W2", opened: 9, resolved: 11 }, { w: "W3", opened: 14, resolved: 12 }, { w: "W4", opened: 11, resolved: 13 }];
export const BUILDINGS = [
  { id: "oh", name: "Ocean Heights", area: "DHA Phase VIII", apts: 264 },
  { id: "cc", name: "Clifton Crest", area: "Clifton Block 4", apts: 96 },
  { id: "et", name: "Emerald Towers", area: "Shahrah-e-Faisal", apts: 180 },
];
