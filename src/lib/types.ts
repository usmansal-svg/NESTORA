export type RoleId =
  | "resident"
  | "admin"
  | "treasurer"
  | "guard"
  | "supervisor"
  | "provider"
  | "courier"
  | "business"
  | "locker";

export type VisitorType = "guest" | "family" | "contractor" | "delivery" | "service" | "cab";
export type VisitorStatus = "expected" | "pending" | "approved" | "rejected" | "inside" | "exited" | "expired" | "cancelled";

export interface Visitor {
  id: string;
  apt: string;
  name: string;
  phone: string;
  type: VisitorType;
  purpose?: string;
  vehicle?: string;
  guests?: number;
  photo?: string;
  validFrom: string;
  validTo: string;
  code: string; // QR / pass code
  status: VisitorStatus;
  recurring?: string; // e.g. "Every Sunday"
  createdBy: "resident" | "guard";
  requestedAt?: string;
  decidedAt?: string;
  entryAt?: string;
  exitAt?: string;
  gate?: string;
  note?: string;
}

export type StaffRole =
  | "Maid" | "Driver" | "Cook" | "Nanny" | "Cleaner" | "Gardener" | "Caregiver" | "Personal Trainer" | "Tutor" | "Service Provider";

export interface StaffPermission {
  id: string;
  apt: string;
  name: string;
  role: StaffRole;
  phone: string;
  photo?: string;
  days: number[]; // 0 = Sun
  from: string; // "08:00"
  to: string; // "12:00"
  status: "active" | "paused" | "revoked";
  verified: boolean;
  since: string;
  consentId?: boolean;
  log: { in: string; out?: string }[];
}

export type ParcelStatus = "expected" | "awaiting" | "reception" | "collected" | "overdue" | "returned";
export interface Parcel {
  id: string;
  apt: string;
  recipient: string;
  courier: string;
  tracking: string;
  description?: string;
  status: ParcelStatus;
  lockerBank?: string;
  compartment?: string;
  size?: LockerSize;
  arrivedAt?: string;
  expiresAt?: string;
  collectedAt?: string;
  expectedOn?: string;
  pin?: string;
  pinUsed?: boolean;
  photo?: boolean;
  courierAgent?: string;
  handoverBy?: string;
}

export type LockerSize = "S" | "M" | "L" | "XL";
export interface Compartment {
  id: string; // e.g. A-07
  bank: string;
  size: LockerSize;
  status: "available" | "occupied" | "faulty" | "disabled";
  parcelId?: string;
  fault?: string;
}

export interface LockerBank {
  id: string;
  name: string;
  location: string;
  online: boolean;
  battery: number;
  tamper: boolean;
  lastPing: string;
}

export type ComplaintStatus = "Submitted" | "Acknowledged" | "Assigned" | "In Progress" | "Resolved" | "Reopened";
export interface Complaint {
  id: string;
  apt: string;
  category: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  preferredTime?: string;
  status: ComplaintStatus;
  assignee?: string;
  attachments: number;
  createdAt: string;
  sla: string;
  timeline: { status: ComplaintStatus | string; at: string; by: string; note?: string }[];
  rating?: number;
}

export interface Bill {
  id: string;
  apt: string;
  month: string;
  issued: string;
  dueDate: string;
  items: { label: string; amount: number }[];
  status: "paid" | "due" | "overdue";
  paidAt?: string;
  method?: string;
  receiptNo?: string;
}

export type BookingStatus = "Upcoming" | "Confirmed" | "In Progress" | "Completed" | "Cancelled";
export interface Booking {
  id: string;
  category: string; // e.g. "Home services"
  service: string;
  provider: string;
  providerPhoto?: string;
  image?: string;
  date: string; // ISO start
  duration?: string;
  price: number;
  status: BookingStatus;
  address: string;
  notes?: string;
  ref: string;
  timeline: { label: string; at: string; done: boolean }[];
  recurring?: string;
  paymentMethod?: string;
}

export interface Notification {
  id: string;
  kind:
    | "visitor" | "parcel" | "bill" | "complaint" | "announcement" | "booking" | "staff" | "utility" | "emergency" | "order" | "ev" | "system";
  title: string;
  body: string;
  at: string;
  read: boolean;
  href?: string;
  channels?: ("push" | "whatsapp" | "sms")[];
  role?: "resident" | "guard" | "admin" | "supervisor";
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  category: "Notice" | "Emergency" | "Event" | "Poll" | "Maintenance";
  audience: string;
  at: string;
  author: string;
  reads: number;
  total: number;
  pinned?: boolean;
  read?: boolean;
  poll?: { options: { label: string; votes: number }[]; voted?: number; closes: string; formal?: boolean };
  event?: { date: string; place: string; going: number; rsvp?: boolean };
}

export interface CartItem {
  id: string;
  sellerId: string;
  name: string;
  price: number;
  qty: number;
}

export interface FoodOrder {
  id: string;
  seller: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "Placed" | "Preparing" | "On the way" | "Delivered";
  at: string;
  mode: "Delivery" | "Pickup";
}

export interface FoodRequest {
  id: string;
  text: string;
  portions: number;
  when: string;
  budget?: number;
  at: string;
  status: "open" | "accepted" | "closed";
  responses: { id: string; seller: string; price: number; eta: string; note: string; rating: number; accepted?: boolean }[];
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: "New" | "Like new" | "Good" | "Fair";
  image: string;
  seller: string;
  sellerApt: string;
  scope: "Building" | "Neighbourhood";
  description: string;
  at: string;
  sold?: boolean;
  mine?: boolean;
  negotiable?: boolean;
}

export interface Task {
  id: string;
  title: string;
  area: string;
  assignee: string;
  due: string;
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Done";
  complaintId?: string;
}

export interface Incident {
  id: string;
  title: string;
  type: string;
  at: string;
  by: string;
  severity: "Low" | "Medium" | "High";
  status: "Open" | "Closed";
  location: string;
}

export interface GateLog {
  id: string;
  name: string;
  kind: "Visitor" | "Staff" | "Courier" | "Service" | "Contractor" | "Resident vehicle";
  apt: string;
  dir: "in" | "out";
  at: string;
  gate: string;
  vehicle?: string;
}

export interface EvSession {
  id: string;
  station: string;
  charger: string;
  start: string;
  end?: string;
  kwh: number;
  cost: number;
  status: "Reserved" | "Charging" | "Completed" | "Cancelled";
  slot?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  plate: string;
  color: string;
  type: "Car" | "Motorcycle" | "EV";
  slot?: string;
}

export interface Apartment {
  id: string;
  building: string;
  tower: string;
  unit: string;
  area: string;
  role: "Owner" | "Tenant" | "Family member" | "Authorised representative" | "Property manager";
  sqft: number;
}
