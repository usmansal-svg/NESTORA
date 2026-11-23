"use client";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { toast } from "sonner";
import { APARTMENTS } from "@/data/seed";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/misc";

export function ApartmentSwitcher({ variant = "hero" }: { variant?: "hero" | "sidebar" }) {
  const apt = useDemo((s) => s.apartment);
  const setApt = useDemo((s) => s.setApartment);
  const cur = APARTMENTS.find((a) => a.id === apt) ?? APARTMENTS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "hero" ? (
          <button className="flex items-center gap-1.5 rounded-full bg-white/10 py-1 pl-3 pr-2 text-[12.5px] font-medium text-white/90 ring-1 ring-white/15 backdrop-blur transition hover:bg-white/15">
            <span className="sm:hidden">{cur.id} · {cur.building}</span><span className="hidden sm:inline">{cur.building} · {cur.tower === "1" ? "" : `Tower ${cur.tower} · `}{cur.unit}</span>
            <ChevronsUpDown className="size-3.5 opacity-70" />
          </button>
        ) : (
          <button className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-2.5 text-left shadow-soft transition hover:border-pine-300">
            <span className="grid size-10 place-items-center rounded-xl bg-primary text-[13px] font-semibold text-lime-accent">{cur.id.split("-")[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{cur.id} · {cur.building}</span>
              <span className="block truncate text-xs text-muted-foreground">{cur.role} · {cur.area}</span>
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>Your homes</DropdownMenuLabel>
        {APARTMENTS.map((a) => (
          <DropdownMenuItem key={a.id} onSelect={() => { setApt(a.id); toast.success(`Switched to ${a.building} ${a.id}`); }}>
            <span className={cn("grid size-9 place-items-center rounded-lg text-[12px] font-semibold", a.id === apt ? "bg-primary text-lime-accent" : "bg-secondary text-foreground/70")}>{a.id.split("-")[0]}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium">{a.building} · {a.id}</span>
              <span className="block text-xs text-muted-foreground">{a.role} · {a.sqft.toLocaleString()} sq ft</span>
            </span>
            {a.id === apt && <Check className="!text-pine-600" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => toast("Add a home", { description: "Enter the invite code from your building management to link another apartment." })}><Plus /> Link another apartment</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
