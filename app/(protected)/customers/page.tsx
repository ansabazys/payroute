"use client";

import { useEffect, useState } from "react";
import { Phone, MapPin, IndianRupee } from "lucide-react";

type Customer = {
  _id: string;
  name: string;
  phone?: string;
  pendingAmount: number;
  location: { lat: 0, lng: 0 },
  nextDueDate?: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white p-5 flex flex-col h-screen">
        {/* HEADER */}
        <h1 className="text-2xl font-bold mb-4">Customers</h1>

        {/* SEARCH */}
        <div className="flex items-center bg-neutral-100 px-4 py-3 rounded-2xl mb-4">
          <input
            placeholder="Search customers..."
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* LIST */}
        <div className="space-y-4 overflow-y-auto flex-1 pb-24">
          {loading && <p>Loading customers...</p>}

          {!loading && customers.length === 0 && (
            <p className="text-center text-neutral-500 mt-10">
              No customers added yet
            </p>
          )}

          {customers.map((customer) => (
            <CustomerCard key={customer._id} customer={customer} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-2 border border-neutral-100 shadow-sm">
      <div className="flex justify-between">
        <h3 className="font-semibold">{customer.name}</h3>
        <span className="text-red-600 font-semibold">
          ₹{customer.pendingAmount}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">
          Next due:{" "}
          {customer.nextDueDate
            ? new Date(customer.nextDueDate).toDateString()
            : "Not set"}
        </p>

        <div className="flex gap-3">
          <Phone size={18} className="text-neutral-600" />
          <MapPin
            size={18}
            className="text-neutral-600 cursor-pointer"
            onClick={() => {
              if (!customer.location) {
                alert("Location not available");
                return;
              }

              window.open(
                `https://www.google.com/maps?q=${customer.location.lat},${customer.location.lng}`,
                "_blank",
              );
            }}
          />
          <IndianRupee size={18} className="text-neutral-600" />
        </div>
      </div>
    </div>
  );
}
