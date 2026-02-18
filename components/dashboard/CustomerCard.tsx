"use client";

import { ICustomer } from "@/types/customer";
import { IndianRupee, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerCard({
  customer,
  status,
}: {
  customer: ICustomer;
  status: { label: string; color: string };
}) {
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-2xl p-4 space-y-1 border border-neutral-100"
      onClick={() => router.push(`/customers/${customer._id}`)}
    >
      <div className="flex justify-between">
        <h3 className="font-semibold">{customer.name}</h3>
        <span className="text-yellow-600 font-semibold">
          ₹{customer.pendingAmount}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <p
          className={`text-sm font-medium ${
            status.color === "red"
              ? "text-red-500"
              : status.color === "yellow"
                ? "text-yellow-600"
                : status.color === "green"
                  ? "text-green-600"
                  : "text-neutral-500"
          }`}
        >
          {status.label}
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
