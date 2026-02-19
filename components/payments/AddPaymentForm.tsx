"use client";

import { ICustomer } from "@/types/customer";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  customer: ICustomer;
};

export default function AddPaymentForm({ customer }: Props) {
  const router = useRouter();

  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState<string>("");
  const [nextDueDate, setNextDueDate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // -----------------------------
  // Safe numeric calculations
  // -----------------------------
  const pending = Number(customer.pendingAmount || 0);
  const numericAmount = amount === "" ? 0 : Number(amount);
  const remainingPending = pending - numericAmount;

  // -----------------------------
  // Handle submit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const paymentAmount = Number(amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    if (paymentAmount > pending) {
      alert("Amount exceeds pending");
      return;
    }

    if (remainingPending > 0 && !nextDueDate) {
      alert("Please select next due date");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: customer._id,
          amount: paymentAmount,
          date: new Date(date),
          notes,
          nextDueDate:
            remainingPending > 0 ? new Date(nextDueDate) : null,
        }),
      });

      router.back();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong while saving payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CUSTOMER INFO */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-neutral-500">
          Customer
        </p>

        <div className="bg-neutral-100 p-4 rounded-xl">
          <p className="font-semibold">{customer.name}</p>
          {customer.phone && (
            <p className="text-sm text-neutral-500">
              {customer.phone}
            </p>
          )}
        </div>
      </div>

      {/* PENDING */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-xs text-neutral-500">Pending amount</p>
        <p className="text-xl font-bold text-yellow-700">
          ₹{pending}
        </p>
      </div>

      {/* PAYMENT INPUT */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-500">
          Payment
        </p>

        <input
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input text-lg font-semibold"
          placeholder="Enter amount"
        />

        {/* QUICK BUTTONS */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setAmount(pending.toString())}
            className="flex-1 py-3 bg-neutral-100 rounded-xl"
          >
            Full
          </button>

          <button
            type="button"
            onClick={() => setAmount("500")}
            className="flex-1 py-3 bg-neutral-100 rounded-xl"
          >
            ₹500
          </button>

          <button
            type="button"
            onClick={() => setAmount("1000")}
            className="flex-1 py-3 bg-neutral-100 rounded-xl"
          >
            ₹1000
          </button>
        </div>

        {/* LIVE REMAINING */}
        {amount && (
          <p
            className={`text-sm font-medium ${
              remainingPending < 0
                ? "text-red-600"
                : "text-neutral-600"
            }`}
          >
            Remaining: ₹{remainingPending}
          </p>
        )}
      </div>

      {/* NEXT DUE DATE */}
      {remainingPending > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-neutral-500">
            Next due date
          </p>

          <input
            type="date"
            value={nextDueDate}
            onChange={(e) => setNextDueDate(e.target.value)}
            className="input"
            required
          />
        </div>
      )}

      {/* PAYMENT DATE */}
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
          placeholder="Optional"
          rows={3}
        />
      </div>

      {/* SAVE BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center items-center py-4 bg-neutral-900 text-white rounded-xl font-semibold disabled:opacity-60"
      >
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          "Record Payment"
        )}
      </button>
    </form>
  );
}
