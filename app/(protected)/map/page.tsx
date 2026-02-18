'use client'

import Header from "@/components/common/Header";
import CustomerMap from "@/components/dashboard/CustomerMap";
import { ICustomer } from "@/types/customer";
import { useEffect, useState } from "react";

export default function MapPage() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    };

    fetchCustomers();
  }, []);

  console.log(customers)

  return (
    <div className="h-screen w-full flex p-5 gap-5 pb-25 flex-col bg-white">

      {/* HEADER */}
      <div className="">
        <Header />
      </div>

      {/* MAP AREA */}
      <div className="flex-1">
        <CustomerMap customers={customers} />
      </div>

    </div>
  );
}
