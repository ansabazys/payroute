"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Phone, MapPin, IndianRupee } from "lucide-react";
import Header from "@/components/common/Header";
import ActionIcon from "@/components/dashboard/ActionIcon";

export default function CustomerDetailPage() {
  const { id } = useParams();

  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    const res = await fetch(`/api/customers/${id}`);
    const data = await res.json();
    setCustomer(data);
  };

  if (!customer) return <p className="p-5">Loading...</p>;

  const isPaid = customer.pendingAmount <= 0;

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white p-5 space-y-6">
        <Header />

        {/* NAME */}
        <div>
          <h1 className="text-2xl font-bold">{customer.name}</h1>
          <p className="text-sm text-neutral-500">{customer.address}</p>
        </div>

        {/* AMOUNT CARD */}
        <div className="bg-neutral-100 rounded-2xl p-5">
          {isPaid ? (
            <p className="text-green-600 font-semibold text-lg">Paid ✅</p>
          ) : (
            <>
              <p className="text-sm text-neutral-500">Pending</p>
              <h2 className="text-3xl font-bold">₹{customer.pendingAmount}</h2>
            </>
          )}

          <div className="mt-3 text-sm text-neutral-500">
            Total ₹{customer.totalAmount} • Paid ₹{customer.paidAmount}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-3 place-content-center gap-4">
          <ActionIcon icon={<IndianRupee />} label="Payment" />
          <ActionIcon icon={<Phone />} label="Call" />
          <ActionIcon icon={<MapPin />} label="Navigate" />
        </div>

        {/* DETAILS */}
        <div className="space-y-2 text-sm">
          <p>Phone: {customer.phone}</p>
          <p>Address: {customer.address}</p>
          <p>Next due: {new Date(customer.nextDueDate).toDateString()}</p>
        </div>

        {/* PAYMENT HISTORY */}
        <div>
          <h3 className="font-semibold mb-2">Payment history</h3>
          <p className="text-sm text-neutral-500">No payments recorded yet</p>
        </div>
      </div>
    </div>
  );
}
