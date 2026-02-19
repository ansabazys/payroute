"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import { LoaderCircle, Trash2, Pencil } from "lucide-react";

import { IPayment } from "@/types/payment";
import { ICustomer } from "@/types/customer";
import ConfirmModal from "@/components/customers/ConfimModal";

export default function PaymentDetailPage() {
  const { paymentId } = useParams();
  const router = useRouter();

  const [payment, setPayment] = useState<IPayment | null>(null);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (paymentId) fetchPayment();
  }, [paymentId]);

  const fetchPayment = async () => {
    try {
      setLoading(true);

      const res = await fetch(`/api/payments/${paymentId}`);
      const data = await res.json();

      console.log(data);

      setPayment(data.payment);
      setCustomer(data.customer);
    } catch (err) {
      console.error("Fetch payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    await fetch(`/api/payments/${paymentId}`, {
      method: "DELETE",
    });

    router.back();
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );

  if (!payment) return null;

  return (
    <div className="min-h-screen bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white p-5 space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <Header />
        
        </div>

        {/* AMOUNT CARD */}
        <div className="bg-neutral-100 rounded-2xl p-5">
          <p className="text-sm text-neutral-500">Payment amount</p>
          <h1 className="text-3xl font-bold">₹{payment.amount}</h1>

          <p className="text-xs text-neutral-500 mt-2">
            {new Date(payment.date).toDateString()}
          </p>
        </div>

        {/* CUSTOMER */}
        {customer && (
          <div className="bg-white border border-neutral-100 rounded-2xl p-4">
            <p className="text-sm text-neutral-500">Customer</p>
            <h2 className="font-semibold">{customer.name}</h2>
            {customer.phone && (
              <p className="text-sm text-neutral-500">{customer.phone}</p>
            )}
          </div>
        )}

        {/* NOTES */}
        {payment.notes && (
          <div className="bg-neutral-50 rounded-2xl p-4">
            <p className="text-sm text-neutral-500">Notes</p>
            <p className="mt-1">{payment.notes}</p>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/payments/edit/${payment._id}`)}
            className="flex-1 py-4 bg-neutral-900 text-white rounded-xl flex items-center justify-center gap-2"
          >
            <Pencil size={18} />
            Edit
          </button>

          <button
            onClick={() => setIsDeleteOpen(true)}
            className="flex-1 py-4 bg-red-100 text-red-600 rounded-xl"
          >
            Delete
          </button>
        </div>

        {/* DELETE MODAL */}
        {isDeleteOpen && (
          <ConfirmModal
            title="Delete payment?"
            paragraph="This action cannot be undone. The payment data will be
           removed."
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={handleDelete}
            loading={loading}
          />
        )}
      </div>
    </div>
  );
}
