"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import Header from "@/components/common/Header";
import { ICustomer } from "@/types/customer";

export default function EditCustomerPage() {
  const { id } = useParams();
  const router = useRouter();

  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    totalAmount: 0,
    nextDueDate: "",
  });

  // Fetch customer
  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${id}`);
        const data = await res.json();

        setCustomer(data);

        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          address: data.address || "",
          totalAmount: Number(data.totalAmount) || 0,
          nextDueDate: data.nextDueDate
            ? new Date(data.nextDueDate).toISOString().split("T")[0]
            : "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin" />
      </div>
    );
  }

  const paidAmount = Number(customer.paidAmount) || 0;
  const totalAmount = Number(formData.totalAmount) || 0;
  const pendingAmount = totalAmount - paidAmount;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value === "" ? 0 : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (totalAmount < paidAmount) {
      alert("Total amount cannot be less than already paid amount");
      return;
    }

    try {
      setSaving(true);

      await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          totalAmount: totalAmount,
          nextDueDate:
            pendingAmount > 0 && formData.nextDueDate
              ? new Date(formData.nextDueDate)
              : null,
        }),
      });

      router.push(`/customers/${id}`);
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-neutral-100 pb-20">
      <div className="w-full max-w-md bg-white p-5 space-y-6">
        <Header />
        <h1 className="text-xl font-semibold">Edit Customer</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CUSTOMER INFO */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-500">
              Customer
            </p>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Customer name"
              required
            />

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="Phone number"
            />

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input"
              rows={3}
              placeholder="Address"
            />
          </div>

          {/* AMOUNT SECTION */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-500">
              Amount
            </p>

            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="input"
              placeholder="Total amount"
            />

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs text-neutral-500">Paid amount</p>
              <p className="text-lg font-semibold text-emerald-600">
                ₹{paidAmount}
              </p>
            </div>

            <div className="bg-yellow-50 border-yellow-200 border rounded-xl p-4">
              <p className="text-xs text-neutral-500">Pending amount</p>
              <p
                className={`text-lg font-semibold ${
                  pendingAmount > 0
                    ? "text-red-500"
                    : "text-emerald-600"
                }`}
              >
                ₹{pendingAmount > 0 ? pendingAmount : 0}
              </p>
            </div>
          </div>

          {/* INSTALLMENT */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-neutral-500">
              Installment
            </p>

            <div className="bg-neutral-50 px-4 py-4 rounded-xl flex justify-between items-center">
              <label
                className={`${
                  pendingAmount <= 0
                    ? "text-neutral-400"
                    : "text-neutral-500"
                }`}
              >
                Next due date
              </label>

              <input
                type="date"
                name="nextDueDate"
                value={formData.nextDueDate}
                onChange={handleChange}
                disabled={pendingAmount <= 0}
                className={`bg-transparent outline-none ${
                  pendingAmount <= 0
                    ? "opacity-40 cursor-not-allowed"
                    : ""
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 bg-neutral-900 text-white rounded-xl font-semibold disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Customer"}
          </button>
        </form>
      </div>
    </div>
  );
}
