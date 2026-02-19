"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { ICustomer } from "@/types/customer";

type Props = {
  customers: ICustomer[];
};

export default function CustomerMap({ customers }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // 🔹 Initialize map once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [76.2673, 9.9312],
      zoom: 10,
    });

    map.on("load", () => {
      map.resize();
    });

    mapRef.current = map;
  }, []);

  // 🔹 Update markers when customers change
  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current;

    // Remove old markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (!customers.length) return;

    const bounds = new maplibregl.LngLatBounds();

    customers.forEach((customer) => {
      if (!customer.location?.lat || !customer.location?.lng) return;

      const marker = new maplibregl.Marker({
        color: getMarkerColor(customer),
      })
        .setLngLat([
          Number(customer.location.lng),
          Number(customer.location.lat),
        ])
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <div style="font-size:14px;padding: 5px">
              <b>${customer.name}</b><br/>  
              ₹${customer.pendingAmount}<br/>
              <a 
                href="https://www.google.com/maps/dir/?api=1&destination=${customer.location.lat},${customer.location.lng}" 
                target="_blank"
                style="color:#2563eb;text-decoration:none;font-weight:600;"
              >
                Start Navigation →
              </a>
            </div>
          `),
        )
        .addTo(map);

      markersRef.current.push(marker);

      bounds.extend([
        Number(customer.location.lng),
        Number(customer.location.lat),
      ]);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80 });
    }
  }, [customers]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
    </div>
  );
}

// 🔹 Marker color logic
function getMarkerColor(customer: Partial<ICustomer>) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!customer.nextDueDate) return "#6b7280";

  const dueDate = new Date(customer.nextDueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (customer.pendingAmount! <= 0) return "#22c55e"; // green
  if (dueDate.getTime() === today.getTime()) return "#eab308"; // yellow
  if (dueDate < today) return "#ef4444"; // red

  return "#374151";
}
