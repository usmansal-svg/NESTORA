import { at, hoursAgo, minsAgo } from "@/lib/utils";
import { face, u, IMG } from "@/lib/img";
import type {
  Announcement, Apartment, Bill, Booking, Complaint, Compartment, EvSession, FoodOrder, FoodRequest, GateLog,
  Incident, Listing, LockerBank, Notification, Parcel, StaffPermission, Task, Vehicle, Visitor,
} from "@/lib/types";

export const BUILDING = {
  name: "Ocean Heights",
  area: "DHA Phase VIII, Karachi",
  towers: ["A", "B", "C"],
  floors: 22,
  apartments: 264,
};

export const RESIDENT = {
  name: "Ahmed Raza",
  first: "Ahmed",
  phone: "+92 300 824 1190",
  email: "ahmed.raza@example.pk",
  photo: face("ahmed"),
  memberSince: "March 2023",
};

export const APARTMENTS: Apartment[] = [
  { id: "A-1204", building: "Ocean Heights", tower: "A", unit: "1204", area: "DHA Phase VIII", role: "Owner", sqft: 2150 },
  { id: "C-0702", building: "Ocean Heights", tower: "C", unit: "0702", area: "DHA Phase VIII", role: "Owner", sqft: 1650 },
  { id: "CL-503", building: "Clifton Crest", tower: "1", unit: "503", area: "Clifton Block 4", role: "Authorised representative", sqft: 1400 },
];

export function makeSeed() {
  const visitors: Visitor[] = [
    { id: "V-1001", apt: "A-1204", name: "Bilal Siddiqui", phone: "+92 321 445 9021", type: "guest", purpose: "Dinner", vehicle: "BKZ-482", guests: 2, validFrom: at(0, 18), validTo: at(0, 23, 30), code: "NST-8K2Q-41", status: "expected", createdBy: "resident" },
    { id: "V-1002", apt: "A-1204", name: "Hamza (Foodpanda rider)", phone: "+92 312 220 7781", type: "delivery", purpose: "Food delivery", validFrom: minsAgo(6), validTo: at(0, 23), code: "WALK-IN", status: "pending", createdBy: "guard", requestedAt: minsAgo(2), gate: "Gate 1 — Main" },
    { id: "V-1003", apt: "A-1204", name: "Farhan Electricals", phone: "+92 333 908 1123", type: "contractor", purpose: "DB rewiring", vehicle: "KHI-7741 (Suzuki pickup)", validFrom: at(1, 10), validTo: at(1, 16), code: "NST-3M9X-07", status: "expected", createdBy: "resident" },
    { id: "V-1004", apt: "A-1204", name: "Sana Malik", phone: "+92 300 112 4580", type: "family", purpose: "Family visit", validFrom: hoursAgo(5), validTo: hoursAgo(1), code: "NST-7Q1P-22", status: "exited", createdBy: "resident", entryAt: hoursAgo(4.6), exitAt: hoursAgo(1.2), gate: "Gate 1 — Main", vehicle: "AWR-210" },
    { id: "V-1005", apt: "A-1204", name: "Careem Captain — Imran", phone: "+92 345 771 0921", type: "cab", purpose: "Pickup", validFrom: hoursAgo(26), validTo: hoursAgo(25), code: "NST-2C8D-91", status: "exited", createdBy: "resident", entryAt: hoursAgo(25.8), exitAt: hoursAgo(25.6), gate: "Gate 2 — Service" },
    { id: "V-1006", apt: "A-1204", name: "Dr. Ayesha Khan", phone: "+92 302 555 1290", type: "guest", purpose: "Weekly physiotherapy", validFrom: at(2, 17), validTo: at(2, 18, 30), code: "NST-6H4R-15", status: "expected", createdBy: "resident", recurring: "Every Wednesday" },
    { id: "V-1007", apt: "B-0904", name: "Usama Tariq", phone: "+92 331 210 6655", type: "guest", purpose: "Visit", validFrom: hoursAgo(1), validTo: at(0, 23), code: "NST-9P2L-33", status: "inside", createdBy: "resident", entryAt: minsAgo(48), gate: "Gate 1 — Main" },
    { id: "V-1008", apt: "C-1503", name: "TCS Express", phone: "+92 21 111 123 456", type: "delivery", purpose: "Document delivery", validFrom: minsAgo(30), validTo: at(0, 20), code: "WALK-IN", status: "inside", createdBy: "guard", entryAt: minsAgo(12), gate: "Gate 2 — Service" },
    { id: "V-1009", apt: "A-0601", name: "Zainab Hussain", phone: "+92 300 998 2210", type: "guest", purpose: "Birthday party", guests: 4, validFrom: at(0, 19), validTo: at(0, 23, 59), code: "NST-4T6W-80", status: "expected", createdBy: "resident" },
  ];

  const staff: StaffPermission[] = [
    { id: "S-01", apt: "A-1204", name: "Shazia Bibi", role: "Maid", phone: "+92 310 448 2291", photo: face("w5"), days: [1, 2, 3, 4, 5, 6], from: "08:00", to: "12:00", status: "active", verified: true, since: "Jan 2024", consentId: true, log: [{ in: at(0, 8, 4), out: at(0, 11, 52) }, { in: at(-1, 8, 10), out: at(-1, 12, 1) }] },
    { id: "S-02", apt: "A-1204", name: "Muhammad Akram", role: "Driver", phone: "+92 301 772 0918", photo: face("m4"), days: [1, 2, 3, 4, 5], from: "07:30", to: "19:00", status: "active", verified: true, since: "Aug 2023", consentId: true, log: [{ in: at(0, 7, 28) }] },
    { id: "S-03", apt: "A-1204", name: "Rubina Akhtar", role: "Cook", phone: "+92 315 203 4471", photo: face("w3"), days: [0, 1, 2, 3, 4, 5, 6], from: "17:00", to: "21:00", status: "active", verified: true, since: "Feb 2025", consentId: true, log: [{ in: at(-1, 17, 2), out: at(-1, 20, 48) }] },
    { id: "S-04", apt: "A-1204", name: "Coach Faisal", role: "Personal Trainer", phone: "+92 333 610 7720", photo: face("m5"), days: [1, 3, 5], from: "06:30", to: "08:00", status: "paused", verified: true, since: "Jun 2025", log: [] },
  ];

  const banks: LockerBank[] = [
    { id: "LB-A", name: "Bank A · Tower A Lobby", location: "Ground floor, Tower A reception", online: true, battery: 100, tamper: false, lastPing: minsAgo(1) },
    { id: "LB-B", name: "Bank B · Tower B Lobby", location: "Ground floor, Tower B reception", online: true, battery: 100, tamper: false, lastPing: minsAgo(1) },
    { id: "LB-C", name: "Bank C · Service Gate", location: "Service entrance, near Gate 2", online: true, battery: 82, tamper: false, lastPing: minsAgo(3) },
  ];

  const sizes: Compartment["size"][] = ["S", "S", "S", "S", "M", "M", "M", "M", "L", "L", "L", "XL"];
  const compartments: Compartment[] = [];
  banks.forEach((b, bi) => {
    const letter = b.id.slice(-1);
    for (let i = 0; i < 24; i++) {
      compartments.push({ id: `${letter}-${String(i + 1).padStart(2, "0")}`, bank: b.id, size: sizes[i % 12], status: "available" });
    }
    // seed some occupied/faulty
    const occ = [1, 3, 5, 8, 9, 13, 14, 17, 20].slice(0, 6 + bi);
    occ.forEach((o) => (compartments[bi * 24 + o].status = "occupied"));
  });
  compartments[2 * 24 + 6].status = "faulty";
  compartments[2 * 24 + 6].fault = "Door sensor not reporting closure";
  compartments[1 * 24 + 22].status = "disabled";
  compartments[1 * 24 + 22].fault = "Hinge repair scheduled";

  const parcels: Parcel[] = [
    { id: "P-5501", apt: "A-1204", recipient: "Ahmed Raza", courier: "TCS", tracking: "TCS 7781 2290 4410", description: "Daraz order — Wireless earbuds", status: "awaiting", lockerBank: "LB-A", compartment: "A-04", size: "S", arrivedAt: minsAgo(38), expiresAt: at(2, 20), pin: "482913", photo: true, courierAgent: "Kashif (TCS)" },
    { id: "P-5502", apt: "A-1204", recipient: "Mariam Raza", courier: "Leopards", tracking: "LP 55 091 7720", description: "Khaadi — Apparel", status: "awaiting", lockerBank: "LB-A", compartment: "A-09", size: "M", arrivedAt: hoursAgo(20), expiresAt: at(1, 12), pin: "730158", photo: true, courierAgent: "Waseem (Leopards)" },
    { id: "P-5503", apt: "A-1204", recipient: "Ahmed Raza", courier: "M&P", tracking: "MP-KHI-0099213", description: "Books from Liberty Books", status: "expected", expectedOn: at(1, 14) },
    { id: "P-5504", apt: "A-1204", recipient: "Ahmed Raza", courier: "Trax", tracking: "TRX 440 128 991", description: "Shoes — Size 42", status: "collected", lockerBank: "LB-A", compartment: "A-15", size: "M", arrivedAt: at(-3, 13), collectedAt: at(-3, 19, 22), pin: "119044", pinUsed: true },
    { id: "P-5505", apt: "A-1204", recipient: "Ahmed Raza", courier: "BlueEX", tracking: "BX 2290 1182", description: "Phone case", status: "returned", arrivedAt: at(-9, 12), collectedAt: at(-5, 12) },
    { id: "P-5506", apt: "A-1204", recipient: "Ahmed Raza", courier: "Pakistan Post", tracking: "RL 0042 17PK", description: "Registered letter", status: "collected", arrivedAt: at(-6, 11), collectedAt: at(-6, 12), handoverBy: "Reception — Nasir" },
    { id: "P-5507", apt: "B-0303", recipient: "Kiran Javed", courier: "TCS", tracking: "TCS 7781 9921 0021", status: "overdue", lockerBank: "LB-B", compartment: "B-02", size: "S", arrivedAt: at(-4, 11), expiresAt: at(-1, 11), pin: "550192" },
  ];
  // link occupied compartments to parcels for the demo resident
  const link = (cid: string, pid: string) => { const c = compartments.find((x) => x.id === cid); if (c) { c.status = "occupied"; c.parcelId = pid; } };
  link("A-04", "P-5501"); link("A-09", "P-5502"); link("B-02", "P-5507");

  const complaints: Complaint[] = [
    { id: "CMP-2041", apt: "A-1204", category: "Leakage", title: "Seepage on bathroom ceiling", description: "Water stain spreading on master bathroom ceiling, likely from 1304.", priority: "High", status: "In Progress", assignee: "Rashid (Plumbing)", attachments: 2, createdAt: hoursAgo(30), sla: "48 h", preferredTime: "Weekdays, 10 AM – 1 PM",
      timeline: [
        { status: "Submitted", at: hoursAgo(30), by: "Ahmed Raza" },
        { status: "Acknowledged", at: hoursAgo(29), by: "Front desk" },
        { status: "Assigned", at: hoursAgo(26), by: "Supervisor Naveed", note: "Assigned to Rashid (Plumbing)" },
        { status: "In Progress", at: hoursAgo(3), by: "Rashid", note: "Inspected 1304 — pipe joint leaking under vanity. Parts ordered." },
      ] },
    { id: "CMP-2017", apt: "A-1204", category: "Lift", title: "Lift 2 door closing slowly", description: "Tower A lift 2 doors take very long to close on floor 12.", priority: "Medium", status: "Resolved", assignee: "Schindler service team", attachments: 0, createdAt: at(-6, 9), sla: "72 h", rating: 5,
      timeline: [
        { status: "Submitted", at: at(-6, 9), by: "Ahmed Raza" },
        { status: "Acknowledged", at: at(-6, 9, 20), by: "Front desk" },
        { status: "Assigned", at: at(-6, 11), by: "Supervisor Naveed" },
        { status: "In Progress", at: at(-5, 10), by: "Schindler" },
        { status: "Resolved", at: at(-5, 15), by: "Schindler", note: "Door operator sensor recalibrated." },
      ] },
    { id: "CMP-2052", apt: "B-0710", category: "Water", title: "Low water pressure", description: "Kitchen tap pressure very low since morning.", priority: "Medium", status: "Assigned", assignee: "Rashid (Plumbing)", attachments: 1, createdAt: hoursAgo(5), sla: "24 h", timeline: [{ status: "Submitted", at: hoursAgo(5), by: "Resident B-0710" }, { status: "Acknowledged", at: hoursAgo(4.5), by: "Front desk" }, { status: "Assigned", at: hoursAgo(4), by: "Supervisor Naveed" }] },
    { id: "CMP-2053", apt: "C-0201", category: "Parking", title: "Unknown car in my slot P2-118", description: "White Corolla parked in my allotted slot.", priority: "High", status: "Submitted", attachments: 1, createdAt: minsAgo(40), sla: "4 h", timeline: [{ status: "Submitted", at: minsAgo(40), by: "Resident C-0201" }] },
    { id: "CMP-2049", apt: "A-0802", category: "Lighting", title: "Corridor light out on floor 8", description: "Two lights near the stairwell are not working.", priority: "Low", status: "Acknowledged", attachments: 0, createdAt: hoursAgo(14), sla: "72 h", timeline: [{ status: "Submitted", at: hoursAgo(14), by: "Resident A-0802" }, { status: "Acknowledged", at: hoursAgo(12), by: "Front desk" }] },
    { id: "CMP-2038", apt: "C-1102", category: "Noise", title: "Renovation noise after 7 PM", description: "Drilling in C-1202 after permitted hours.", priority: "Medium", status: "Reopened", assignee: "Supervisor Naveed", attachments: 0, createdAt: at(-3, 20), sla: "24 h", timeline: [{ status: "Submitted", at: at(-3, 20), by: "Resident C-1102" }, { status: "Resolved", at: at(-2, 12), by: "Supervisor Naveed", note: "Contractor warned" }, { status: "Reopened", at: at(-1, 20, 30), by: "Resident C-1102", note: "Happened again" }] },
  ];

  const months = ["November 2026", "October 2026", "September 2026", "August 2026", "July 2026", "June 2026"];
  const bills: Bill[] = months.map((m, i) => ({
    id: `BL-${2611 - i}`,
    apt: "A-1204",
    month: m,
    issued: at(-22 - 30 * i, 9),
    dueDate: at(i === 0 ? 7 : -23 - 30 * i + 10, 23),
    items: [
      { label: "Monthly maintenance", amount: 18500 },
      { label: "Generator & diesel share", amount: i === 0 ? 4200 : 3600 + i * 120 },
      { label: "Water tanker share", amount: i === 0 ? 1850 : 1400 },
      { label: "Sinking fund", amount: 2000 },
      ...(i === 0 ? [{ label: "Late payment penalty (Oct)", amount: 500 }] : []),
    ],
    status: i === 0 ? "due" : "paid",
    paidAt: i === 0 ? undefined : at(-30 * i + 3, 14),
    method: i === 0 ? undefined : ["Raast", "JazzCash", "Card", "Raast", "Bank transfer"][i - 1],
    receiptNo: i === 0 ? undefined : `RCP-OH-${88210 - i * 31}`,
  }));

  const bookings: Booking[] = [
    { id: "BK-9001", category: "Home services", service: "AC servicing (2 units)", provider: "CoolTech Karachi", providerPhoto: face("m2"), image: IMG.ac, date: at(1, 11), duration: "2 h", price: 5000, status: "Confirmed", address: "A-1204, Ocean Heights", ref: "NST-BK-9001", timeline: [{ label: "Booked", at: hoursAgo(20), done: true }, { label: "Confirmed by provider", at: hoursAgo(18), done: true }, { label: "Technician on the way", at: at(1, 10, 30), done: false }, { label: "Service completed", at: at(1, 13), done: false }], paymentMethod: "JazzCash" },
    { id: "BK-9002", category: "Salon & barber", service: "Haircut & beard trim", provider: "Ustad Saleem", providerPhoto: face("m3"), image: IMG.barber, date: at(0, 20), duration: "45 min", price: 1800, status: "Upcoming", address: "A-1204, Ocean Heights", ref: "NST-BK-9002", timeline: [{ label: "Booked", at: hoursAgo(3), done: true }, { label: "Confirmed", at: hoursAgo(2.8), done: true }, { label: "Barber arrives", at: at(0, 20), done: false }] },
    { id: "BK-9003", category: "Building facilities", service: "Swimming pool — family slot", provider: "Ocean Heights Amenities", image: IMG.pool, date: at(2, 17), duration: "1 h", price: 0, status: "Confirmed", address: "Pool deck, Level 3", ref: "NST-BK-9003", timeline: [{ label: "Reserved", at: hoursAgo(10), done: true }] },
    { id: "BK-9004", category: "Car care", service: "Monthly car wash — Exterior + interior", provider: "SparkWash Mobile", providerPhoto: face("m6"), image: IMG.carWash, date: at(3, 9), duration: "1 h", price: 6500, status: "Upcoming", address: "Parking P1-042", recurring: "Every Saturday", ref: "NST-BK-9004", timeline: [{ label: "Subscribed", at: at(-12, 9), done: true }] },
    { id: "BK-9005", category: "Cleaning", service: "Deep cleaning — 3 bed apartment", provider: "SafaiPro", providerPhoto: face("w2"), image: IMG.cleaning, date: at(-4, 10), duration: "5 h", price: 14500, status: "Completed", address: "A-1204, Ocean Heights", ref: "NST-BK-9005", timeline: [{ label: "Booked", at: at(-8, 10), done: true }, { label: "Completed", at: at(-4, 15), done: true }] },
    { id: "BK-9006", category: "Laundry", service: "Weekly laundry pickup", provider: "PressPerfect Laundry", image: IMG.laundry, date: at(0, 9), duration: "Pickup", price: 2400, status: "In Progress", address: "A-1204, Ocean Heights", recurring: "Every Monday", ref: "NST-BK-9006", timeline: [{ label: "Picked up", at: at(0, 9, 12), done: true }, { label: "Washing & pressing", at: at(0, 12), done: true }, { label: "Out for delivery", at: at(1, 10), done: false }] },
    { id: "BK-9007", category: "Fumigation", service: "Cockroach treatment", provider: "PestAway Karachi", image: IMG.pest, date: at(-15, 11), price: 4500, status: "Cancelled", address: "A-1204, Ocean Heights", ref: "NST-BK-9007", timeline: [{ label: "Booked", at: at(-18, 11), done: true }, { label: "Cancelled by you", at: at(-16, 11), done: true }] },
  ];

  const notifications: Notification[] = [
    { id: "N-1", kind: "visitor", title: "Visitor waiting at Gate 1", body: "Hamza (Foodpanda rider) is requesting entry to A-1204.", at: minsAgo(2), read: false, href: "/resident/building/security", channels: ["push", "whatsapp"] },
    { id: "N-2", kind: "parcel", title: "Parcel in Locker A-04", body: "TCS parcel ready. Collection PIN 482913, valid 48 hours.", at: minsAgo(38), read: false, href: "/resident/building/parcels", channels: ["push", "whatsapp", "sms"] },
    { id: "N-3", kind: "utility", title: "Water tanker arrived", body: "12,000 L delivered to underground tank. Supply normal till 10 PM.", at: hoursAgo(2), read: false, href: "/resident/building/utilities", channels: ["push"] },
    { id: "N-4", kind: "bill", title: "November bill issued", body: "Rs 27,050 due by the 30th. Pay via Raast, JazzCash or card.", at: hoursAgo(26), read: true, href: "/resident/building/payments", channels: ["push", "whatsapp"] },
    { id: "N-5", kind: "complaint", title: "Complaint CMP-2041 in progress", body: "Rashid inspected 1304. Parts ordered for pipe joint.", at: hoursAgo(3), read: false, href: "/resident/building/complaints", channels: ["push"] },
    { id: "N-6", kind: "staff", title: "Shazia Bibi checked out", body: "Exited Gate 2 at 11:52 AM.", at: hoursAgo(5), read: true, channels: ["push"] },
    { id: "N-7", kind: "announcement", title: "Fire drill on Saturday", body: "All towers, 11 AM. Please follow wardens' instructions.", at: hoursAgo(30), read: true, href: "/resident/building/announcements", channels: ["push", "whatsapp"] },
    { id: "N-8", kind: "booking", title: "AC servicing confirmed", body: "CoolTech arrives tomorrow at 11 AM.", at: hoursAgo(18), read: true, href: "/resident/bookings", channels: ["push", "whatsapp"] },
    { id: "N-9", kind: "utility", title: "Load-shedding alert", body: "K-Electric outage expected 2–4 PM tomorrow. Generator backup scheduled.", at: hoursAgo(1), read: false, href: "/resident/building/utilities", channels: ["push"] },
  ];

  const announcements: Announcement[] = [
    { id: "AN-1", title: "Water supply interruption — Tower B", body: "KWSC line maintenance on Thursday 10 AM – 3 PM. Overhead tanks will be filled in advance. Please store water accordingly.", category: "Maintenance", audience: "Tower B", at: hoursAgo(4), author: "Management Office", reads: 61, total: 88, pinned: true },
    { id: "AN-2", title: "Fire drill this Saturday", body: "A building-wide fire drill will be conducted at 11:00 AM. Lifts will be paused for 15 minutes. Floor wardens will guide residents to assembly point near the main lawn.", category: "Notice", audience: "Entire building", at: hoursAgo(30), author: "Safety Committee", reads: 201, total: 264 },
    { id: "AN-3", title: "Should we install EV chargers at P2?", body: "The committee is gathering opinions on adding 4 additional 22 kW chargers in basement P2. This is an informal poll — a formal resolution will follow at the AGM.", category: "Poll", audience: "Owners", at: hoursAgo(50), author: "Management Committee", reads: 140, total: 198, poll: { options: [{ label: "Yes, install 4 chargers", votes: 92 }, { label: "Start with 2 chargers", votes: 31 }, { label: "Not now", votes: 17 }], closes: at(5, 23), formal: false } },
    { id: "AN-4", title: "Community Iftar & Family Night", body: "Join neighbours on the rooftop for a family evening — food stalls by resident home chefs, kids' corner and qawwali.", category: "Event", audience: "Entire building", at: hoursAgo(72), author: "Social Committee", reads: 180, total: 264, event: { date: at(6, 19), place: "Rooftop terrace, Tower A", going: 86 } },
    { id: "AN-5", title: "Resolution: 2027 maintenance revision", body: "Formal vote on revising monthly maintenance by 8% from January 2027 to cover diesel and security wage increases. One vote per apartment (owners only).", category: "Poll", audience: "Owners", at: hoursAgo(96), author: "Management Committee", reads: 170, total: 198, poll: { options: [{ label: "Approve 8% revision", votes: 88 }, { label: "Reject", votes: 41 }, { label: "Abstain", votes: 9 }], closes: at(9, 23), formal: true } },
  ];

  const listings: Listing[] = [
    { id: "L-1", title: "Interwood 3-seater sofa", price: 65000, category: "Furniture", condition: "Like new", image: IMG.sofa, seller: "Hira Shah", sellerApt: "B-1102", scope: "Building", description: "Barely used, moving abroad. Beige fabric, no stains. Pick-up from B-1102.", at: hoursAgo(6), negotiable: true },
    { id: "L-2", title: "Samsung 55\" 4K Smart TV", price: 115000, category: "Electronics", condition: "Good", image: IMG.tv, seller: "Omer Farooq", sellerApt: "C-0304", scope: "Building", description: "2023 model with wall mount and remote. Box available.", at: hoursAgo(20) },
    { id: "L-3", title: "Kids' bicycle (age 6–9)", price: 9500, category: "Toys", condition: "Good", image: IMG.bike, seller: "Nadia Imran", sellerApt: "A-0507", scope: "Neighbourhood", description: "Training wheels included. Minor scratches.", at: hoursAgo(28) },
    { id: "L-4", title: "Baby stroller — Joie", price: 18000, category: "Baby products", condition: "Like new", image: IMG.stroller, seller: "Saba Aziz", sellerApt: "A-1608", scope: "Building", description: "Used for 6 months, foldable, with rain cover.", at: hoursAgo(40) },
    { id: "L-5", title: "Haier double-door fridge", price: 72000, category: "Appliances", condition: "Good", image: IMG.fridge, seller: "Kamran Ali", sellerApt: "Phase VI", scope: "Neighbourhood", description: "Inverter model, very low power usage. Working perfectly.", at: hoursAgo(55), negotiable: true },
    { id: "L-6", title: "Urdu & English novels (20 books)", price: 6000, category: "Books", condition: "Good", image: IMG.books, seller: "Ahmed Raza", sellerApt: "A-1204", scope: "Building", description: "Mix of classics and recent fiction.", at: hoursAgo(80), mine: true },
    { id: "L-7", title: "Ergonomic office chair", price: 22000, category: "Furniture", condition: "Like new", image: IMG.chair, seller: "Faraz Hussain", sellerApt: "C-1910", scope: "Building", description: "Mesh back, lumbar support. Bought 8 months ago.", at: hoursAgo(10) },
    { id: "L-8", title: "Nike running shoes (size 43)", price: 8500, category: "Shoes", condition: "New", image: IMG.shoes, seller: "Hassan Raza", sellerApt: "Clifton Blk 2", scope: "Neighbourhood", description: "Wrong size, unworn with tags.", at: hoursAgo(3), sold: false },
  ];

  const tasks: Task[] = [
    { id: "T-301", title: "Fix bathroom seepage — A-1304 pipe joint", area: "Tower A, Fl 13", assignee: "Rashid (Plumbing)", due: at(0, 17), priority: "High", status: "In Progress", complaintId: "CMP-2041" },
    { id: "T-302", title: "Replace corridor lights", area: "Tower A, Fl 8", assignee: "Jamil (Electrical)", due: at(0, 18), priority: "Low", status: "Open", complaintId: "CMP-2049" },
    { id: "T-303", title: "Generator weekly load test", area: "Genset room", assignee: "Imtiaz (Genset)", due: at(1, 10), priority: "Medium", status: "Open" },
    { id: "T-304", title: "Clean overhead tank — Tower C", area: "Tower C roof", assignee: "Cleaning crew", due: at(-1, 16), priority: "High", status: "Open" },
    { id: "T-305", title: "Check water pressure B-0710", area: "Tower B, Fl 7", assignee: "Rashid (Plumbing)", due: at(0, 15), priority: "Medium", status: "Open", complaintId: "CMP-2052" },
    { id: "T-306", title: "Lobby glass cleaning", area: "Tower A lobby", assignee: "Cleaning crew", due: at(0, 11), priority: "Low", status: "Done" },
  ];

  const incidents: Incident[] = [
    { id: "INC-77", title: "Unauthorised vehicle in resident slot", type: "Parking", at: minsAgo(40), by: "Guard Rizwan", severity: "Medium", status: "Open", location: "Basement P2-118" },
    { id: "INC-76", title: "Boom barrier stuck open for 10 min", type: "Equipment", at: hoursAgo(9), by: "Guard Shahid", severity: "Low", status: "Closed", location: "Gate 2" },
  ];

  const gateLog: GateLog[] = [
    { id: "G-1", name: "Usama Tariq", kind: "Visitor", apt: "B-0904", dir: "in", at: minsAgo(48), gate: "Gate 1", vehicle: "BLB-551" },
    { id: "G-2", name: "TCS Express — Kashif", kind: "Courier", apt: "Lockers", dir: "in", at: minsAgo(40), gate: "Gate 2" },
    { id: "G-3", name: "Shazia Bibi", kind: "Staff", apt: "A-1204", dir: "out", at: hoursAgo(5), gate: "Gate 2" },
    { id: "G-4", name: "Sana Malik", kind: "Visitor", apt: "A-1204", dir: "out", at: hoursAgo(1.2), gate: "Gate 1", vehicle: "AWR-210" },
    { id: "G-5", name: "Muhammad Akram", kind: "Staff", apt: "A-1204", dir: "in", at: at(0, 7, 28), gate: "Gate 2" },
    { id: "G-6", name: "K-Electric meter reader", kind: "Service", apt: "Building", dir: "in", at: hoursAgo(3), gate: "Gate 2" },
    { id: "G-7", name: "Leopards — Waseem", kind: "Courier", apt: "Lockers", dir: "in", at: hoursAgo(20), gate: "Gate 2" },
  ];

  const vehicles: Vehicle[] = [
    { id: "VH-1", make: "Toyota Corolla Altis", plate: "BKR-1204", color: "Pearl white", type: "Car", slot: "P1-042" },
    { id: "VH-2", make: "MG ZS EV", plate: "BEV-221", color: "Dover white", type: "EV", slot: "P1-043 (EV)" },
    { id: "VH-3", make: "Honda CG 125", plate: "KMS-8810", color: "Red", type: "Motorcycle", slot: "M-17" },
  ];

  const evSessions: EvSession[] = [
    { id: "EV-301", station: "Ocean Heights P1", charger: "OH-P1-02 · 22 kW AC", start: at(-2, 21), end: at(-2, 23, 40), kwh: 31.4, cost: 2198, status: "Completed" },
    { id: "EV-298", station: "Dolmen Mall Clifton", charger: "DMC-DC-01 · 60 kW DC", start: at(-7, 15), end: at(-7, 15, 48), kwh: 28.2, cost: 3384, status: "Completed" },
  ];

  const orders: FoodOrder[] = [
    { id: "FO-771", seller: "Ammi's Kitchen (C-0905)", items: [{ name: "Chicken Biryani (full)", qty: 1, price: 1650 }, { name: "Raita", qty: 2, price: 120 }], total: 1890, status: "Delivered", at: at(-2, 20), mode: "Delivery" },
  ];

  const foodRequests: FoodRequest[] = [];

  return {
    visitors, staff, banks, compartments, parcels, complaints, bills, bookings, notifications, announcements,
    listings, tasks, incidents, gateLog, vehicles, evSessions, orders, foodRequests,
  };
}

export const photoFor = (id: string, w = 600) => u(id, w);
