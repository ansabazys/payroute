"use client";

import { ICustomer } from "@/types/customer";
import { IndianRupee, MapPin, Phone } from "lucide-react";

export default function CustomerCard({ customer }: { customer: ICustomer }) {
  return (
    <div className="bg-white rounded-2xl p-4 space-y-2 border border-neutral-100">
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
          <Phone
            size={18}
            className="text-neutral-600"
            onClick={() => (window.location.href = `tel:${customer.phone}`)}
          />
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
