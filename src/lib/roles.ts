import { Building2, Calculator, Home, PackageOpen, ShieldCheck, Store, Truck, Wrench, ClipboardList, type LucideIcon } from "lucide-react";
import type { RoleId } from "./types";

export interface RoleDef { id: RoleId; label: string; person: string; blurb: string; href: string; icon: LucideIcon; surface: "Mobile" | "Desktop" | "Kiosk"; }

export const ROLES: RoleDef[] = [
  { id: "resident", label: "Resident", person: "Ahmed Raza · A-1204", blurb: "Consumer super-app: home, building, marketplace, bookings", href: "/resident", icon: Home, surface: "Mobile" },
  { id: "admin", label: "Administrator", person: "Sadia Qureshi · Building Admin", blurb: "Enterprise portal for operations, security and lockers", href: "/admin", icon: Building2, surface: "Desktop" },
  { id: "treasurer", label: "Treasurer", person: "Tariq Mehmood · Committee", blurb: "Billing, ledgers, expenses and collections", href: "/admin/billing", icon: Calculator, surface: "Desktop" },
  { id: "guard", label: "Security Guard", person: "Rizwan Ali · Gate 1", blurb: "Scan passes, walk-ins, approvals, parcels", href: "/guard", icon: ShieldCheck, surface: "Mobile" },
  { id: "supervisor", label: "Supervisor", person: "Naveed Akhtar · Day shift", blurb: "Tasks, complaints, utilities, inspections", href: "/supervisor", icon: ClipboardList, surface: "Mobile" },
  { id: "provider", label: "Service Provider", person: "CoolTech Karachi", blurb: "Jobs, schedule, earnings and gate access", href: "/provider", icon: Wrench, surface: "Mobile" },
  { id: "courier", label: "Courier", person: "Kashif · TCS", blurb: "Register and deposit parcels into lockers", href: "/courier", icon: Truck, surface: "Mobile" },
  { id: "business", label: "Local Business", person: "Kolachi Grill · Do Darya", blurb: "Offers, coupons, sponsored listings, insights", href: "/business", icon: Store, surface: "Desktop" },
  { id: "locker", label: "Locker Terminal", person: "Bank A · Tower A Lobby", blurb: "Physical touchscreen at the smart locker bank", href: "/locker", icon: PackageOpen, surface: "Kiosk" },
];
