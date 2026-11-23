"use client";
import * as React from "react";

export interface LiveUtilities {
  grid: "On" | "Outage";
  gridSince: string;
  generator: "Standby" | "Running";
  genRuntimeToday: number; // hours
  fuel: number; // %
  water: "Available" | "Limited" | "Off";
  ugTank: number; // %
  ohTank: { A: number; B: number; C: number };
  lifts: { id: string; tower: string; status: "Operational" | "Maintenance" | "Fault"; floor: number }[];
  guardsOnDuty: number;
  cctvOnline: number;
  cctvTotal: number;
  nextTanker: string;
  nextShedding: string;
  voltage: number;
}

const base: LiveUtilities = {
  grid: "On",
  gridSince: "11:42 AM",
  generator: "Standby",
  genRuntimeToday: 2.4,
  fuel: 68,
  water: "Available",
  ugTank: 72,
  ohTank: { A: 64, B: 81, C: 58 },
  lifts: [
    { id: "A-1", tower: "A", status: "Operational", floor: 12 },
    { id: "A-2", tower: "A", status: "Operational", floor: 3 },
    { id: "B-1", tower: "B", status: "Operational", floor: 17 },
    { id: "B-2", tower: "B", status: "Maintenance", floor: 0 },
    { id: "C-1", tower: "C", status: "Operational", floor: 8 },
    { id: "C-2", tower: "C", status: "Operational", floor: 21 },
  ],
  guardsOnDuty: 6,
  cctvOnline: 46,
  cctvTotal: 48,
  nextTanker: "Tomorrow, 7:30 AM",
  nextShedding: "Tomorrow 2–4 PM",
  voltage: 228,
};

/** Simulated live building telemetry (mock — gently fluctuates). */
export function useLiveUtilities() {
  const [s, setS] = React.useState(base);
  React.useEffect(() => {
    const t = setInterval(() => {
      setS((p) => ({
        ...p,
        ugTank: Math.max(40, Math.min(95, p.ugTank + (Math.random() - 0.55) * 0.6)),
        ohTank: { A: jitter(p.ohTank.A), B: jitter(p.ohTank.B), C: jitter(p.ohTank.C) },
        voltage: Math.round(224 + Math.random() * 8),
        lifts: p.lifts.map((l) => (l.status === "Operational" ? { ...l, floor: Math.max(0, Math.min(22, l.floor + Math.round((Math.random() - 0.5) * 4))) } : l)),
      }));
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return s;
}
const jitter = (v: number) => Math.max(20, Math.min(98, v + (Math.random() - 0.5) * 1.2));
