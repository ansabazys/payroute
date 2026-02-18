"use client";

import { useState } from "react";

type FormData = {
  name: string;
  phone: string;
  address: string;
  location: { lat: number; lng: number };
  totalAmount: number | string;
  paidAmount: number | string;
  nextDueDate: string;
};

export default function AddForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    location: { lat: 0, lng: 0 },
    totalAmount: "",
    paidAmount: "",
    nextDueDate: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const pendingAmount =
    Number(formData.totalAmount || 0) - Number(formData.paidAmount || 0);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        }));
      },
      () => {
        alert("Permission denied");
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setFormData({
      name: "",
      phone: "",
      address: "",
      location: { lat: 0, lng: 0 },
      totalAmount: "",
      paidAmount: "",
      nextDueDate: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CUSTOMER INFO */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-500">Customer</p>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          placeholder="Customer name"
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
          placeholder="Address"
          rows={4}
        />
      </div>

      {/* LOCATION */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-500">Location</p>

        <button
          type="button"
          onClick={getLocation}
          className="w-full py-4 bg-blue-600 text-white rounded-xl"
        >
          {formData.location.lat
            ? "📍 Location captured"
            : "Get current location"}
        </button>
      </div>

      {/* AMOUNT */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-500">Amount</p>

        <input
          type="number"
          name="totalAmount"
          value={formData.totalAmount}
          onChange={handleChange}
          className="input"
          placeholder="Total amount"
        />

        <input
          type="number"
          name="paidAmount"
          value={formData.paidAmount}
          onChange={handleChange}
          className="input"
          placeholder="Advance paid"
        />

        <div className="bg-neutral-100 rounded-xl p-4">
          <p className="text-xs text-neutral-500">Pending amount</p>
          <p className="text-lg font-semibold">
            ₹{pendingAmount > 0 ? pendingAmount : 0}
          </p>
        </div>
      </div>

      {/* INSTALLMENT */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-neutral-500">Installment</p>

        <div className="bg-neutral-100 px-4 py-4 rounded-xl flex justify-between items-center">
          <label
            className={`${
              pendingAmount <= 0 ? "text-neutral-400" : "text-neutral-500"
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
              pendingAmount <= 0 ? "opacity-40 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>

      {/* STICKY SAVE BUTTON */}
      <div className="">
        <button
          type="submit"
          className="w-full py-4 bg-neutral-900 text-white rounded-xl font-semibold"
        >
          Save Customer
        </button>
      </div>
    </form>
  );
}
