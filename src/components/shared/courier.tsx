import { cn } from "@/lib/utils";

export const COURIERS: Record<string, { c: string; bg: string }> = {
  TCS: { c: "#c8102e", bg: "#fdecee" }, Leopards: { c: "#0f5aa6", bg: "#e8f0fa" }, "M&P": { c: "#e25b00", bg: "#fdf0e6" }, Trax: { c: "#0a8a5a", bg: "#e6f5ee" },
  BlueEX: { c: "#1f4fbf", bg: "#e9eefb" }, "Pakistan Post": { c: "#a01f1f", bg: "#f8e9e9" }, Daraz: { c: "#f57224", bg: "#fef1e8" }, Other: { c: "#57534e", bg: "#f0efec" },
};
export function CourierMark({ name, className }: { name: string; className?: string }) {
  const k = COURIERS[name] ?? COURIERS.Other;
  const label = name === "Pakistan Post" ? "PP" : name === "M&P" ? "M&P" : name === "BlueEX" ? "BX" : name.slice(0, 3).toUpperCase();
  return <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl text-[11px] font-bold tracking-tight", className)} style={{ color: k.c, background: k.bg }}>{label}</span>;
}
