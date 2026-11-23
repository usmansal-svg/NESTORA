"use client";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Station } from "@/data/places";

const pin = (label: string, active: boolean, priv: boolean) =>
  L.divIcon({
    className: "",
    html: `<div style="transform:translate(-50%,-100%);display:flex;flex-direction:column;align-items:center"><div style="background:${active ? "var(--color-pine-800)" : priv ? "var(--color-lime-accent)" : "#fff"};color:${active ? "var(--color-lime-accent)" : "var(--color-pine-800)"};border:2px solid #0f3d33;border-radius:12px;padding:3px 8px;font:600 12px Geist,system-ui;white-space:nowrap;box-shadow:0 6px 16px -6px rgba(0,0,0,.35)">⚡ ${label}</div><div style="width:2px;height:8px;background:#0f3d33"></div></div>`,
    iconSize: [0, 0],
  });

export default function EvMap({ stations, selected, onSelect }: { stations: Station[]; selected?: string; onSelect: (id: string) => void }) {
  return (
    <MapContainer center={[24.8, 67.048]} zoom={13} scrollWheelZoom={false} className="h-full w-full" attributionControl={false}>
      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
      {stations.map((s) => {
        const free = s.chargers.filter((c) => c.status === "Available").length;
        return (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={pin(`${free}/${s.chargers.length}`, selected === s.id, s.network !== "Public")} eventHandlers={{ click: () => onSelect(s.id) }}>
            <Tooltip direction="top" offset={[0, -30]}>{s.name}</Tooltip>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
