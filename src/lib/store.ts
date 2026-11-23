"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { makeSeed } from "@/data/seed";
import { pin6, uid } from "@/lib/utils";
import type {
  Booking, CartItem, Complaint, ComplaintStatus, EvSession, FoodRequest, Listing, LockerSize,
  Notification, Parcel, StaffPermission, Task, Incident, Vehicle, Visitor, Announcement, GateLog,
} from "@/lib/types";

type Seed = ReturnType<typeof makeSeed>;

export interface DemoState extends Seed {
  apartment: string;
  lang: "en" | "ur" | "roman";
  cart: CartItem[];
  savedProviders: string[];
  guardOnline: boolean;
  hiring: Record<string, { stage: "interview" | "offer" | "hired"; at: string; detail?: string }>;
  setHiring: (id: string, stage: "interview" | "offer" | "hired", detail?: string) => void;

  setApartment: (id: string) => void;
  setLang: (l: DemoState["lang"]) => void;
  theme: "nestora" | "emaar";
  setTheme: (t: "nestora" | "emaar") => void;
  reset: () => void;

  notify: (n: Omit<Notification, "id" | "at" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;

  addVisitor: (v: Omit<Visitor, "id" | "code" | "status" | "createdBy">) => Visitor;
  requestEntry: (v: Pick<Visitor, "name" | "phone" | "apt" | "type" | "purpose" | "vehicle"> & { gate?: string }) => Visitor;
  decideVisitor: (id: string, approve: boolean, by?: "resident" | "guard") => void;
  checkIn: (id: string, gate?: string) => void;
  checkOut: (id: string) => void;
  cancelVisitor: (id: string) => void;

  addStaff: (s: Omit<StaffPermission, "id" | "log" | "since" | "status" | "apt"> & { apt?: string }) => void;
  updateStaff: (id: string, patch: Partial<StaffPermission>) => void;
  staffMove: (id: string, dir: "in" | "out") => void;

  depositParcel: (p: { apt: string; recipient: string; courier: string; tracking: string; size: LockerSize; bank?: string; agent?: string; description?: string }) => Parcel | null;
  collectParcel: (pin: string) => { ok: true; parcel: Parcel } | { ok: false; reason: string };
  receptionHandover: (p: { apt: string; recipient: string; courier: string; tracking: string; by: string }) => Parcel;
  setCompartment: (id: string, status: "available" | "faulty" | "disabled", fault?: string) => void;
  regeneratePin: (parcelId: string) => void;

  addComplaint: (c: Pick<Complaint, "category" | "title" | "description" | "priority" | "preferredTime" | "attachments">) => Complaint;
  advanceComplaint: (id: string, status: ComplaintStatus, by: string, note?: string, assignee?: string) => void;
  rateComplaint: (id: string, rating: number) => void;

  payBill: (id: string, method: string) => string;

  addBooking: (b: Omit<Booking, "id" | "ref" | "timeline" | "status"> & { status?: Booking["status"] }) => Booking;
  setBookingStatus: (id: string, status: Booking["status"], label?: string) => void;
  rescheduleBooking: (id: string, date: string) => void;

  vote: (annId: string, option: number) => void;
  rsvp: (annId: string) => void;
  readAnnouncement: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id" | "at" | "reads">) => void;

  addToCart: (item: Omit<CartItem, "qty">) => void;
  decCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (seller: string, mode: "Delivery" | "Pickup") => string;
  addFoodRequest: (r: Pick<FoodRequest, "text" | "portions" | "when" | "budget">) => FoodRequest;
  acceptFoodResponse: (reqId: string, respId: string) => void;

  addListing: (l: Omit<Listing, "id" | "at" | "seller" | "sellerApt" | "mine">) => void;
  markSold: (id: string) => void;

  addTask: (t: Omit<Task, "id" | "status">) => void;
  setTaskStatus: (id: string, status: Task["status"]) => void;
  addIncident: (i: Omit<Incident, "id" | "at" | "status">) => void;
  closeIncident: (id: string) => void;
  logGate: (g: Omit<GateLog, "id" | "at">) => void;

  addEvSession: (s: Omit<EvSession, "id">) => EvSession;
  updateEvSession: (id: string, patch: Partial<EvSession>) => void;

  addVehicle: (v: Omit<Vehicle, "id">) => void;
  toggleSaved: (id: string) => void;
  setGuardOnline: (b: boolean) => void;
}

const now = () => new Date().toISOString();
const plus = (h: number) => new Date(Date.now() + h * 3600_000).toISOString();
const passCode = () => `NST-${uid().slice(0, 4)}-${Math.floor(10 + Math.random() * 89)}`;

const initial = () => ({
  ...makeSeed(),
  apartment: "A-1204",
  lang: "en" as const,
  theme: "nestora" as "nestora" | "emaar",
  cart: [] as CartItem[],
  savedProviders: ["pv-cooltech", "pv-saleem"],
  guardOnline: true,
  hiring: {} as DemoState["hiring"],
});

export const useDemo = create<DemoState>()(
  persist(
    (set, get) => ({
      ...initial(),
      setApartment: (apartment) => set({ apartment }),
      setLang: (lang) => set({ lang }),
      setTheme: (theme) => set({ theme }),
      reset: () => set((s) => ({ ...initial(), theme: s.theme })),

      notify: (n) => set((s) => ({ notifications: [{ ...n, id: uid("N-"), at: now(), read: false }, ...s.notifications] })),
      markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),

      addVisitor: (v) => {
        const visitor: Visitor = { ...v, id: uid("V-"), code: passCode(), status: "expected", createdBy: "resident" };
        set((s) => ({ visitors: [visitor, ...s.visitors] }));
        return visitor;
      },
      requestEntry: (v) => {
        const visitor: Visitor = { ...v, id: uid("V-"), code: "WALK-IN", status: "pending", createdBy: "guard", validFrom: now(), validTo: plus(4), requestedAt: now(), gate: v.gate ?? "Gate 1 — Main" };
        set((s) => ({ visitors: [visitor, ...s.visitors] }));
        get().notify({ kind: "visitor", title: `${v.name} is at ${visitor.gate?.split(" —")[0]}`, body: `Requesting entry to ${v.apt}${v.purpose ? ` · ${v.purpose}` : ""}. Approve or reject.`, href: "/resident/building/security", channels: ["push", "whatsapp"], role: "resident" });
        return visitor;
      },
      decideVisitor: (id, approve) => {
        set((s) => ({ visitors: s.visitors.map((x) => (x.id === id ? { ...x, status: approve ? "approved" : "rejected", decidedAt: now() } : x)) }));
        const v = get().visitors.find((x) => x.id === id);
        if (v) get().notify({ kind: "visitor", title: approve ? `Approved: ${v.name}` : `Rejected: ${v.name}`, body: approve ? `${v.apt} approved entry. Allow at ${v.gate ?? "gate"}.` : `${v.apt} declined. Do not allow entry.`, role: "guard", href: "/guard" });
      },
      checkIn: (id, gate = "Gate 1 — Main") => {
        set((s) => ({ visitors: s.visitors.map((x) => (x.id === id ? { ...x, status: "inside", entryAt: now(), gate: x.gate ?? gate } : x)) }));
        const v = get().visitors.find((x) => x.id === id);
        if (v) {
          get().logGate({ name: v.name, kind: v.type === "contractor" ? "Contractor" : v.type === "delivery" ? "Courier" : "Visitor", apt: v.apt, dir: "in", gate: (v.gate ?? gate).split(" —")[0], vehicle: v.vehicle });
          get().notify({ kind: "visitor", title: `${v.name} has entered`, body: `Checked in at ${(v.gate ?? gate).split(" —")[0]} for ${v.apt}.`, href: "/resident/building/visitors", channels: ["push", "whatsapp"], role: "resident" });
        }
      },
      checkOut: (id) => {
        set((s) => ({ visitors: s.visitors.map((x) => (x.id === id ? { ...x, status: "exited", exitAt: now() } : x)) }));
        const v = get().visitors.find((x) => x.id === id);
        if (v) {
          get().logGate({ name: v.name, kind: "Visitor", apt: v.apt, dir: "out", gate: (v.gate ?? "Gate 1").split(" —")[0], vehicle: v.vehicle });
          get().notify({ kind: "visitor", title: `${v.name} has left`, body: `Checked out of Ocean Heights.`, href: "/resident/building/visitors", channels: ["push"], role: "resident" });
        }
      },
      cancelVisitor: (id) => set((s) => ({ visitors: s.visitors.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)) })),

      addStaff: (st) => set((s) => ({ staff: [{ ...st, apt: st.apt ?? s.apartment, id: uid("S-"), log: [], since: new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }), status: "active" }, ...s.staff] })),
      updateStaff: (id, patch) => set((s) => ({ staff: s.staff.map((x) => (x.id === id ? { ...x, ...patch } : x)) })),
      staffMove: (id, dir) => {
        set((s) => ({
          staff: s.staff.map((x) => {
            if (x.id !== id) return x;
            if (dir === "in") return { ...x, log: [{ in: now() }, ...x.log] };
            const [last, ...rest] = x.log;
            return { ...x, log: last && !last.out ? [{ ...last, out: now() }, ...rest] : x.log };
          }),
        }));
        const st = get().staff.find((x) => x.id === id);
        if (st) {
          get().logGate({ name: st.name, kind: "Staff", apt: st.apt, dir, gate: "Gate 2" });
          get().notify({ kind: "staff", title: `${st.name} ${dir === "in" ? "arrived" : "left"}`, body: `${st.role} ${dir === "in" ? "checked in" : "checked out"} at Gate 2 (within authorised window).`, role: "resident", channels: ["push"] });
        }
      },

      depositParcel: (p) => {
        const s = get();
        const order: LockerSize[] = ["S", "M", "L", "XL"];
        const fit = order.slice(order.indexOf(p.size));
        const bank = p.bank ?? (p.apt.startsWith("B") ? "LB-B" : p.apt.startsWith("C") ? "LB-C" : "LB-A");
        const candidates = s.compartments.filter((c) => c.status === "available" && fit.includes(c.size));
        const comp = candidates.find((c) => c.bank === bank) ?? candidates[0];
        if (!comp) return null;
        const parcel: Parcel = {
          id: uid("P-"), apt: p.apt, recipient: p.recipient, courier: p.courier, tracking: p.tracking, description: p.description,
          status: "awaiting", lockerBank: comp.bank, compartment: comp.id, size: comp.size, arrivedAt: now(), expiresAt: plus(48), pin: pin6(), photo: true, courierAgent: p.agent,
        };
        set((st) => ({
          parcels: [parcel, ...st.parcels],
          compartments: st.compartments.map((c) => (c.id === comp.id ? { ...c, status: "occupied", parcelId: parcel.id } : c)),
        }));
        get().logGate({ name: p.agent ?? p.courier, kind: "Courier", apt: "Lockers", dir: "in", gate: "Gate 2" });
        get().notify({ kind: "parcel", title: `Parcel in Locker ${comp.id}`, body: `${p.courier} delivered for ${p.recipient}. PIN ${parcel.pin} · valid 48 h, single use.`, href: "/resident/building/parcels", channels: ["push", "whatsapp", "sms"], role: "resident" });
        return parcel;
      },
      collectParcel: (pin) => {
        const p = get().parcels.find((x) => x.pin === pin && (x.status === "awaiting" || x.status === "overdue"));
        if (!p) {
          const used = get().parcels.find((x) => x.pin === pin && x.pinUsed);
          return { ok: false, reason: used ? "This PIN has already been used. Credentials are single-use." : "PIN not recognised. Check the 6-digit code in your NESTORA app." };
        }
        if (p.expiresAt && new Date(p.expiresAt).getTime() < Date.now() && p.status !== "overdue") return { ok: false, reason: "This PIN has expired. Request a new PIN from the app." };
        const updated: Parcel = { ...p, status: "collected", collectedAt: now(), pinUsed: true };
        set((s) => ({
          parcels: s.parcels.map((x) => (x.id === p.id ? updated : x)),
          compartments: s.compartments.map((c) => (c.id === p.compartment ? { ...c, status: "available", parcelId: undefined } : c)),
        }));
        get().notify({ kind: "parcel", title: "Parcel collected", body: `${p.courier} parcel collected from Locker ${p.compartment}. Compartment closed and secured.`, href: "/resident/building/parcels", channels: ["push"], role: "resident" });
        return { ok: true, parcel: updated };
      },
      receptionHandover: (p) => {
        const parcel: Parcel = { id: uid("P-"), apt: p.apt, recipient: p.recipient, courier: p.courier, tracking: p.tracking, status: "reception", arrivedAt: now(), expiresAt: plus(72), handoverBy: p.by, pin: pin6() };
        set((s) => ({ parcels: [parcel, ...s.parcels] }));
        get().notify({ kind: "parcel", title: "Parcel held at reception", body: `Lockers were full. ${p.courier} parcel is with ${p.by}. Show PIN ${parcel.pin} to collect.`, href: "/resident/building/parcels", channels: ["push", "whatsapp"], role: "resident" });
        return parcel;
      },
      setCompartment: (id, status, fault) => set((s) => ({ compartments: s.compartments.map((c) => (c.id === id ? { ...c, status, fault } : c)) })),
      regeneratePin: (parcelId) => set((s) => ({ parcels: s.parcels.map((p) => (p.id === parcelId ? { ...p, pin: pin6(), expiresAt: plus(48), status: "awaiting" } : p)) })),

      addComplaint: (c) => {
        const cmp: Complaint = { ...c, id: `CMP-${2060 + Math.floor(Math.random() * 900)}`, apt: get().apartment, status: "Submitted", createdAt: now(), sla: c.priority === "Urgent" ? "4 h" : c.priority === "High" ? "24 h" : "72 h", timeline: [{ status: "Submitted", at: now(), by: "Ahmed Raza" }] };
        set((s) => ({ complaints: [cmp, ...s.complaints] }));
        get().notify({ kind: "complaint", title: `New complaint ${cmp.id}`, body: `${cmp.category} · ${cmp.title} (${cmp.apt})`, role: "supervisor", href: `/supervisor/complaints?id=${cmp.id}` });
        return cmp;
      },
      advanceComplaint: (id, status, by, note, assignee) => {
        set((s) => ({
          complaints: s.complaints.map((c) => (c.id === id ? { ...c, status, assignee: assignee ?? c.assignee, timeline: [...c.timeline, { status, at: now(), by, note }] } : c)),
        }));
        const c = get().complaints.find((x) => x.id === id);
        if (c) get().notify({ kind: "complaint", title: `${c.id}: ${status}`, body: note ?? `${c.title} is now ${status.toLowerCase()}.`, href: "/resident/building/complaints", channels: ["push", "whatsapp"], role: "resident" });
      },
      rateComplaint: (id, rating) => set((s) => ({ complaints: s.complaints.map((c) => (c.id === id ? { ...c, rating } : c)) })),

      payBill: (id, method) => {
        const receipt = `RCP-OH-${Math.floor(88300 + Math.random() * 900)}`;
        set((s) => ({ bills: s.bills.map((b) => (b.id === id ? { ...b, status: "paid", paidAt: now(), method, receiptNo: receipt } : b)) }));
        get().notify({ kind: "bill", title: "Payment received", body: `Thank you. Receipt ${receipt} via ${method}.`, href: "/resident/building/payments", channels: ["push", "whatsapp"], role: "resident" });
        return receipt;
      },

      addBooking: (b) => {
        const id = uid("BK-");
        const booking: Booking = { ...b, id, ref: `NST-${id}`, status: b.status ?? "Confirmed", timeline: [{ label: "Booked", at: now(), done: true }, { label: "Confirmed by provider", at: now(), done: true }, { label: "Provider on the way", at: b.date, done: false }, { label: "Completed", at: b.date, done: false }] };
        set((s) => ({ bookings: [booking, ...s.bookings] }));
        get().notify({ kind: "booking", title: `${b.service} confirmed`, body: `${b.provider} · ${new Date(b.date).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}`, href: "/resident/bookings", channels: ["push", "whatsapp"], role: "resident" });
        return booking;
      },
      setBookingStatus: (id, status, label) =>
        set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, status, timeline: [...b.timeline.map((t) => (status === "Completed" ? { ...t, done: true } : t)), ...(label ? [{ label, at: now(), done: true }] : [])] } : b)) })),
      rescheduleBooking: (id, date) => set((s) => ({ bookings: s.bookings.map((b) => (b.id === id ? { ...b, date, status: "Confirmed", timeline: [...b.timeline, { label: "Rescheduled", at: now(), done: true }] } : b)) })),

      vote: (annId, option) => set((s) => ({ announcements: s.announcements.map((a) => (a.id === annId && a.poll && a.poll.voted === undefined ? { ...a, poll: { ...a.poll, voted: option, options: a.poll.options.map((o, i) => (i === option ? { ...o, votes: o.votes + 1 } : o)) } } : a)) })),
      rsvp: (annId) => set((s) => ({ announcements: s.announcements.map((a) => (a.id === annId && a.event ? { ...a, event: { ...a.event, rsvp: !a.event.rsvp, going: a.event.going + (a.event.rsvp ? -1 : 1) } } : a)) })),
      readAnnouncement: (id) => set((s) => ({ announcements: s.announcements.map((a) => (a.id === id && !a.read ? { ...a, read: true, reads: a.reads + 1 } : a)) })),
      addAnnouncement: (a) => {
        set((s) => ({ announcements: [{ ...a, id: uid("AN-"), at: now(), reads: 0 }, ...s.announcements] }));
        get().notify({ kind: a.category === "Emergency" ? "emergency" : "announcement", title: a.title, body: a.body.slice(0, 110), href: "/resident/building/announcements", channels: ["push", "whatsapp"], role: "resident" });
      },

      addToCart: (item) => set((s) => {
        const others = s.cart.filter((c) => c.sellerId === item.sellerId);
        const base = others.length === s.cart.length ? s.cart : []; // one seller per cart
        const ex = base.find((c) => c.id === item.id);
        return { cart: ex ? base.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)) : [...base, { ...item, qty: 1 }] };
      }),
      decCart: (id) => set((s) => ({ cart: s.cart.flatMap((c) => (c.id === id ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c])) })),
      clearCart: () => set({ cart: [] }),
      placeOrder: (seller, mode) => {
        const cart = get().cart;
        const total = cart.reduce((a, c) => a + c.price * c.qty, 0) + (mode === "Delivery" ? 120 : 0);
        const id = uid("FO-");
        set((s) => ({ orders: [{ id, seller, items: cart.map((c) => ({ name: c.name, qty: c.qty, price: c.price })), total, status: "Placed", at: now(), mode }, ...s.orders], cart: [] }));
        get().addBooking({ category: "Food orders", service: cart.map((c) => `${c.qty}× ${c.name}`).join(", "), provider: seller, image: undefined, date: plus(0.75), price: total, address: mode === "Delivery" ? "A-1204, Ocean Heights" : "Pickup", status: "In Progress" });
        return id;
      },
      addFoodRequest: (r) => {
        const req: FoodRequest = { ...r, id: uid("FR-"), at: now(), status: "open", responses: [] };
        set((s) => ({ foodRequests: [req, ...s.foodRequests] }));
        return req;
      },
      acceptFoodResponse: (reqId, respId) => set((s) => ({ foodRequests: s.foodRequests.map((r) => (r.id === reqId ? { ...r, status: "accepted", responses: r.responses.map((x) => ({ ...x, accepted: x.id === respId })) } : r)) })),

      addListing: (l) => set((s) => ({ listings: [{ ...l, id: uid("L-"), at: now(), seller: "Ahmed Raza", sellerApt: s.apartment, mine: true }, ...s.listings] })),
      markSold: (id) => set((s) => ({ listings: s.listings.map((l) => (l.id === id ? { ...l, sold: true } : l)) })),

      addTask: (t) => set((s) => ({ tasks: [{ ...t, id: uid("T-"), status: "Open" }, ...s.tasks] })),
      setTaskStatus: (id, status) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) })),
      addIncident: (i) => {
        set((s) => ({ incidents: [{ ...i, id: uid("INC-"), at: now(), status: "Open" }, ...s.incidents] }));
        get().notify({ kind: "emergency", title: `Incident: ${i.title}`, body: `${i.location} · reported by ${i.by}`, role: "supervisor", href: "/supervisor" });
      },
      closeIncident: (id) => set((s) => ({ incidents: s.incidents.map((i) => (i.id === id ? { ...i, status: "Closed" } : i)) })),
      logGate: (g) => set((s) => ({ gateLog: [{ ...g, id: uid("G-"), at: now() }, ...s.gateLog] })),

      addEvSession: (e) => {
        const sess = { ...e, id: uid("EV-") };
        set((s) => ({ evSessions: [sess, ...s.evSessions] }));
        return sess;
      },
      updateEvSession: (id, patch) => set((s) => ({ evSessions: s.evSessions.map((e) => (e.id === id ? { ...e, ...patch } : e)) })),

      addVehicle: (v) => set((s) => ({ vehicles: [...s.vehicles, { ...v, id: uid("VH-") }] })),
      toggleSaved: (id) => set((s) => ({ savedProviders: s.savedProviders.includes(id) ? s.savedProviders.filter((x) => x !== id) : [...s.savedProviders, id] })),
      setGuardOnline: (guardOnline) => set({ guardOnline }),
      setHiring: (id, stage, detail) => set((s) => ({ hiring: { ...s.hiring, [id]: { stage, at: now(), detail } } })),
    }),
    {
      name: "nestora-demo-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

/** Keep multiple open tabs (e.g. resident + guard + locker) in sync for live demos. */
export function enableCrossTabSync() {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === "nestora-demo-v1") useDemo.persist.rehydrate();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}
