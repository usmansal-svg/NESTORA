import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pkr = (n: number, opts: { compact?: boolean } = {}) => {
  if (opts.compact) {
    if (Math.abs(n) >= 10_000_000) return `Rs ${(n / 10_000_000).toFixed(2)} Cr`;
    if (Math.abs(n) >= 100_000) return `Rs ${(n / 100_000).toFixed(1)} Lac`;
    if (Math.abs(n) >= 1000) return `Rs ${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  }
  return `Rs ${Math.round(n).toLocaleString("en-PK")}`;
};

export const uid = (prefix = "") =>
  `${prefix}${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export const pin6 = () => String(Math.floor(100000 + Math.random() * 900000));

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MIN = 60_000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;

export const ago = (iso: string | number) => {
  const t = typeof iso === "number" ? iso : new Date(iso).getTime();
  const d = Date.now() - t;
  if (d < 0) {
    const f = -d;
    if (f < HOUR) return `in ${Math.max(1, Math.round(f / MIN))} min`;
    if (f < DAY) return `in ${Math.round(f / HOUR)} h`;
    return `in ${Math.round(f / DAY)} d`;
  }
  if (d < MIN) return "just now";
  if (d < HOUR) return `${Math.round(d / MIN)} min ago`;
  if (d < DAY) return `${Math.round(d / HOUR)} h ago`;
  if (d < 2 * DAY) return "yesterday";
  return `${Math.round(d / DAY)} d ago`;
};

export const fmtTime = (iso: string | number) =>
  new Date(iso).toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit" });

export const fmtDate = (iso: string | number, o: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) =>
  new Date(iso).toLocaleDateString("en-GB", o);

export const fmtDateTime = (iso: string | number) => `${fmtDate(iso, { weekday: "short", day: "numeric", month: "short" })}, ${fmtTime(iso)}`;

export const at = (dayOffset: number, hour = 9, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const minsAgo = (m: number) => new Date(Date.now() - m * MIN).toISOString();
export const hoursAgo = (h: number) => new Date(Date.now() - h * HOUR).toISOString();

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0]).join("").toUpperCase();

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
