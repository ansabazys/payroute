"use client";

import ActionIcon from "@/components/dashboard/ActionIcon";
import CustomerCard from "@/components/dashboard/CustomerCard";
import Header from "@/components/dashboard/Header";
import {
  Phone,
  MapPin,
  Plus,
  IndianRupee,
  Search,
  Settings,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      {/* Mobile container */}
      <div className="w-full max-w-md bg-white p-5 gap-5 flex flex-col h-screen">
        {/* HEADER */}
        <Header />

        {/* SUMMARY CARD */}
        <div className="py-2">
          <h1 className="text-4xl font-bold mt-2">₹18,000</h1>
          <p className="mt-1 text-sm opacity-80">6 customers due</p>
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

        <div className="space-y-4 overflow-y-auto flex-1 pb-15">
          <CustomerCard name="Ravi Kumar" amount="₹2,000" status="Due today" />
          <CustomerCard name="Arjun" amount="₹5,000" status="Overdue" />
          <CustomerCard name="Arjun" amount="₹5,000" status="Overdue" />
          <CustomerCard name="Arjun" amount="₹5,000" status="Overdue" />
          <CustomerCard name="Arjun" amount="₹5,000" status="Overdue" />
        </div>

        {/* CUSTOMER LIST */}
        {/* <div className="space-y-4">
          <CustomerCard name="Ravi Kumar" amount="₹2,000" status="Due today" />
          <CustomerCard name="Arjun" amount="₹5,000" status="Overdue" />
        </div> */}
      </div>
    </div>
  );
}

/* ACTION ICON COMPONENT */



/* CUSTOMER CARD */


