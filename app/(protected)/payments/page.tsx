"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Header from "@/components/common/Header";
import { IPayment } from "@/types/payment";
import { ICustomer } from "@/types/customer";

interface PaymentWithCustomer extends IPayment {
  customer: ICustomer;
}

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentWithCustomer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/payments?limit=50");
      const data = await res.json();

      setPayments(data);
    } catch (err) {
      console.error("Payment history error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white p-5 flex flex-col gap-5 h-screen">
        {/* Header */}
        <Header />

        <h1 className="text-2xl font-bold">Recent Payments</h1>

        {/* SCROLLABLE LIST */}
        <div className="flex-1 flex flex-col overflow-y-auto space-y-4 pb-24">
          {!loading && payments.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <p className="text-lg font-semibold">No payments yet</p>
              <p className="text-sm text-neutral-500">
                Start recording payments
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {!loading &&
              payments.map((payment) => (
                <div
                  key={payment._id}
                  onClick={() => router.push(`/payments/${payment._id}`)}
                  className="bg-neutral-100 rounded-2xl p-4 cursor-pointer hover:bg-neutral-200 transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{payment.customer.name}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(payment.date).toDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-emerald-600">
                        ₹{payment.amount}
                      </p>
                    </div>
                  </div>

                  {payment.notes && (
                    <p className="text-xs text-neutral-500 mt-2">
                      {payment.notes}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
