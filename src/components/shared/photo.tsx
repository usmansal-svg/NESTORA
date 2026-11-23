"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { u, IMG } from "@/lib/img";
import { useDemo } from "@/lib/store";
import type { LucideIcon } from "lucide-react";

const tones = [
  "from-pine-800 via-pine-700 to-pine-500",
  "from-[#1f3b4d] via-[#2c5468] to-[#4f8a8b]",
  "from-[#5a3e2b] via-[#8a5a3b] to-[#c58b5a]",
  "from-[#2d4a22] via-[#4a7a3a] to-[#9bc26b]",
  "from-[#3b2f4a] via-[#5b4a72] to-[#8f7fb0]",
  "from-[#6b2d2d] via-[#9a4a3a] to-[#d08a5b]",
];

/** Photograph with a crafted gradient fallback so layouts stay beautiful offline. */
export function Photo({
  id,
  src,
  alt = "",
  w = 800,
  h,
  className,
  imgClassName,
  icon: Icon,
  children,
  seed,
}: {
  id?: string;
  src?: string;
  alt?: string;
  w?: number;
  h?: number;
  className?: string;
  imgClassName?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  seed?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const emaar = useDemo((st) => st.theme) === "emaar";
  // In the Emaar edition, building shots show the Emaar Oceanfront render (bundled locally).
  const local = emaar && (id === IMG.building || id === IMG.skyline) ? "/brand/emaar-oceanfront.jpg" : undefined;
  const url = local ?? src ?? (id ? u(id, w, h) : undefined);
  if (local) imgClassName = undefined;
  const s = seed ?? id ?? alt ?? "x";
  const tone = tones[[...s].reduce((a, c) => a + c.charCodeAt(0), 0) % tones.length];
  return (
    <div className={cn("relative overflow-hidden bg-gradient-to-br", tone, className)}>
      <div className="grain absolute inset-0 opacity-60" />
      {Icon && (!loaded || failed) && (
        <Icon className="absolute left-1/2 top-1/2 size-[28%] max-h-14 max-w-14 -translate-x-1/2 -translate-y-1/2 text-white/25" strokeWidth={1.25} />
      )}
      {url && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn("absolute inset-0 size-full object-cover transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", imgClassName)}
        />
      )}
      {children}
    </div>
  );
}
