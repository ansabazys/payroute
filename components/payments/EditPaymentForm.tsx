"use client";

import { ICustomer } from "@/types/customer";
import { IPayment } from "@/types/payment";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  payment: IPayment;
  customer: ICustomer;
};

export default function EditPaymentForm({
  payment,
  customer,
}: Props) {
  const router = useRouter();

  const [amount, setAmount] = useState<string>(
    payment.amount.toString()
  );
  const [date, setDate] = useState<string>(
    new Date(payment.date).toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>(payment.notes || "");
  const [nextDueDate, setNextDueDate] = useState<string>(
    customer.nextDueDate
      ? new Date(customer.nextDueDate)
          .toISOString()
          .split("T")[0]
      : ""
  );
  const [loading, setLoading] = useState(false);

  const editableMax =
    Number(customer.pendingAmount) + Number(payment.amount);

  const numericAmount = Number(amount);
  const remaining =
    editableMax - numericAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!numericAmount || numericAmount <= 0) {
      alert("Enter valid amount");
      return;
    }

    if (numericAmount > editableMax) {
      alert("Amount exceeds allowed limit");
      return;
    }

    if (remaining > 0 && !nextDueDate) {
      alert("Please select next due date");
      return;
    }

    try {
      setLoading(true);

      await fetch(`/api/payments/${payment._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: numericAmount,
          date: new Date(date),
          notes,
          nextDueDate:
            remaining > 0 ? new Date(nextDueDate) : null,
        }),
      });

      router.back();
    } catch (err) {
      console.error("Edit payment error:", err);
      alert("Failed to update payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CUSTOMER */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">
          Customer
        </p>

        <div className="bg-neutral-100 p-4 rounded-xl">
          <p className="font-semibold">{customer.name}</p>
        </div>
      </div>

      {/* EDITABLE LIMIT */}
      <div className="bg-yellow-50 border-yellow-200 border rounded-xl p-4">
        <p className="text-xs text-neutral-500">
          Maximum allowed
        </p>
        <p className="font-semibold">₹{editableMax}</p>
      </div>

      {/* AMOUNT */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">
          Amount
        </p>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input text-lg font-semibold"
        />

        <p
          className={`text-sm ${
            remaining < 0
              ? "text-red-600"
              : "text-neutral-600"
          }`}
        >
          Remaining after edit: ₹{remaining}
        </p>
      </div>

      {/* NEXT DUE DATE */}
      {remaining > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-500">
            Next due date
          </p>

          <input
            type="date"
            value={nextDueDate}
            onChange={(e) =>
              setNextDueDate(e.target.value)
            }
            className="input"
            required
          />
        </div>
      )}

      {/* DATE */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">
          Payment date
        </p>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
        />
      </div>

      {/* NOTES */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">
          Notes
        </p>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input"
          rows={3}
        />
      </div>

      {/* SAVE */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-neutral-900 text-white rounded-xl font-semibold disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          "Update Payment"
        )}
      </button>
    </form>
  );
}
