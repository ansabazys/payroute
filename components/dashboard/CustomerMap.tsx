"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { ICustomer } from "@/types/customer";

type Props = {
  customers: ICustomer[]
};

export default function CustomerMap({ customers }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  function getMarkerColor(customer: Partial<ICustomer>) {
    const today = new Date();
    const dueDate = new Date(customer.nextDueDate!);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (customer.pendingAmount! <= 0) return "#22c55e"; // green

    if (dueDate.getTime() === today.getTime()) return "#eab308"; // yellow

    if (dueDate < today) return "#ef4444"; // red

    return "#374151"; // gray
  }

  // init map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [76.2673, 9.9312],
      zoom: 11,
    });

    map.on("load", () => {
      map.resize();
    });

    mapRef.current = map;
  }, []);

  // add markers when customers update
  useEffect(() => {
    if (!mapRef.current) return;

    // remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    customers.forEach((customer) => {
      if (!customer.location?.lat || !customer.location?.lng) return;

      new maplibregl.Marker({
        color: getMarkerColor(customer),
      })
        .setLngLat([customer.location.lng, customer.location.lat])
        .setPopup(new maplibregl.Popup().setHTML(`<b>${customer.name}</b>`))
        .addTo(mapRef.current!);
    });

    // auto fit map to markers
    if (customers.length > 0) {
      const bounds = new maplibregl.LngLatBounds();

      customers.forEach((c) => {
        if (c.location?.lat && c.location?.lng) {
          bounds.extend([Number(c.location.lng), Number(c.location.lat)]);
        }
      });

      if (!bounds.isEmpty()) {
        mapRef.current.fitBounds(bounds, { padding: 60 });
      }
    }
  }, [customers]);

  return (
    <div className="w-full h-full">
      <div ref={mapContainer} className="w-full h-full rounded-2xl" />
    </div>
  );
}
