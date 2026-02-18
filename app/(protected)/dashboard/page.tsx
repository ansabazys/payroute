"use client";

import ActionIcon from "@/components/dashboard/ActionIcon";
import CustomerCard from "@/components/dashboard/CustomerCard";;
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
  const [totalAmount, setTotalAmount] = useState<number>(0);
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
      let data: ICustomer[] = await res.json();

      // const response = await fetch("/api/analytics");
      // const analytics = await response.json();

      // console.log(analytics);

      if (data.length > 0) {
        setCustomers(data);
        setTotalAmount(data.reduce((acc, curr) => acc + curr.pendingAmount, 0));
        setTitle("Today's Collections");
        return;
      }

      // 2️⃣ OVERDUE
      res = await fetch("/api/customers?sort=overdue");
      data = await res.json();

      if (data.length > 0) {
        setCustomers(data);
        setTotalAmount(data.reduce((acc, curr) => acc + curr.pendingAmount, 0));
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

        {/* AMOUNT CARD */}
        <div className="bg-neutral-100 rounded-3xl p-6">
          <p className="text-sm opacity-80">{title}</p>

          <h1 className="text-4xl font-bold mt-2">
            ₹{totalAmount.toLocaleString()}
          </h1>

          <div className="flex justify-between mt-4 text-xs opacity-80">
            <span>{customers.length} customers</span>
            <span>Tap to view</span>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-4 gap-4">
          <ActionIcon icon={<Plus />} label="Add" />
          <ActionIcon icon={<IndianRupee />} label="Payment" />
          <ActionIcon icon={<Phone />} label="Call" />
          <ActionIcon icon={<MapPin />} label="Map" />
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
            <div className="flex flex-col items-center justify-center  h-full text-center">
              <p className="text-lg font-semibold">
                🎉
                <br /> No collections today
              </p>
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
