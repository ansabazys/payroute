"use client";

import Header from "@/components/common/Header";
import CustomerMap from "@/components/dashboard/CustomerMap";
import { ICustomer } from "@/types/customer";
import { useEffect, useState } from "react";

export default function MapPage() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [type, setType] = useState("overdue"); // default best for collection

  useEffect(() => {
    fetchRoutes();
  }, [type]);

  const fetchRoutes = async () => {
    try {
      const res = await fetch(`/api/routes?type=${type}`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Route fetch error:", err);
    }
  };

  return (
    <div className="h-screen w-full flex p-5 gap-5 pb-25 flex-col bg-white">
      
      {/* HEADER */}
      <Header />

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-3">
        {["overdue", "today", "pending", "all"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`px-4 py-2 rounded-xl text-sm ${
              type === t
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* MAP */}
      <div className="flex-1">
        <CustomerMap customers={customers} />
      </div>
    </div>
  );
}
