"use client";

import ActionIcon from "@/components/dashboard/ActionIcon";
import CustomerCard from "@/components/dashboard/CustomerCard";
import Header from "@/components/dashboard/Header";
import { ICustomer } from "@/types/customer";
import {
  Phone,
  MapPin,
  Plus,
  IndianRupee,
  Search,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Today's Collections");

  useEffect(() => {
    fetchDashboardCustomers();
  }, []);

  const fetchDashboardCustomers = async () => {
    try {
      setLoading(true);

      // 1️⃣ TODAY
      let res = await fetch("/api/customers?sort=today");
      let data = await res.json();

      if (data.length > 0) {
        setCustomers(data);
        setTitle("Today's Collections");
        return;
      }

      // 2️⃣ OVERDUE
      res = await fetch("/api/customers?sort=overdue");
      data = await res.json();

      if (data.length > 0) {
        setCustomers(data);
        setTitle("Overdue Collections");
        return;
      }

      // 3️⃣ EMPTY SUCCESS STATE
      setCustomers([]);
      setTitle("No Collections");

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  function getCustomerStatus(customer: ICustomer) {
    if (customer.pendingAmount <= 0) {
      return { label: "Paid", color: "green" };
    }

    if (!customer.nextDueDate) {
      return { label: "Pending", color: "gray" };
    }

    const today = new Date();
    const dueDate = new Date(customer.nextDueDate);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate.getTime() === today.getTime()) {
      return { label: "Due Today", color: "yellow" };
    }

    if (dueDate < today) {
      return { label: "Overdue", color: "red" };
    }

    return { label: "Pending", color: "gray" };
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white p-5 gap-5 flex flex-col h-screen">

        {/* HEADER */}
        <Header />

        {/* SUMMARY */}
        <div className="py-2">
          <h1 className="text-4xl font-bold mt-2">₹18,000</h1>
          <p className="mt-1 text-sm opacity-80">{title}</p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-4 gap-4">
          <ActionIcon icon={<Plus />} label="Add" />
          <ActionIcon icon={<IndianRupee />} label="Payment" />
          <ActionIcon icon={<Phone />} label="Call" />
          <ActionIcon icon={<MapPin />} label="Navigate" />
        </div>

        {/* SEARCH */}
        <div className="flex items-center bg-neutral-100 px-4 py-4 rounded-2xl">
          <Search size={18} className="text-neutral-400" />
          <input
            placeholder="Search customers"
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>

        {/* LIST AREA */}
        <div className="space-y-4 overflow-y-auto flex-1 pb-15">

          {/* LOADING */}
          {loading && (
            <div className="flex justify-center items-center h-full">
              <LoaderCircle color="gray" className="animate-spin" />
            </div>
          )}

          {/* EMPTY SUCCESS STATE */}
          {!loading && customers.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <p className="text-lg font-semibold">🎉<br /> No collections today</p>
              <p className="text-sm text-neutral-500">
                All customers are up to date
              </p>
            </div>
          )}

          {/* CUSTOMER LIST */}
          {!loading &&
            customers.map((customer) => (
              <CustomerCard
                key={customer._id}
                customer={customer}
                status={getCustomerStatus(customer)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
