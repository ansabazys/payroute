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

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Submitted data:", formData);

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFormData({
        name: "",
        phone: "",
        address: "",
        location: { lat: 0, lng: 0 },
        totalAmount: "",
        paidAmount: "",
        nextDueDate: "",
      });
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        });
      },
      () => {
        alert("Permission denied");
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full"
        placeholder="Name"
      />

      <input
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full"
        placeholder="Phone"
      />

      <textarea
        name="address"
        value={formData.address}
        onChange={handleChange}
        className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full"
        placeholder="Address"
        rows={5}
      />

      <div className="flex gap-3">
        {/* <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full"
          placeholder="Location"
        /> */}
        <button
          type="button"
          className="outline-0 px-3 py-4 bg-blue-600 text-white rounded-xl w-full"
          onClick={getLocation}
        >
          Get Location
        </button>
      </div>

      <input
        type="number"
        name="totalAmount"
        value={formData.totalAmount}
        onChange={handleChange}
        className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full"
        placeholder="Total amount"
      />

      <input
        type="number"
        name="paidAmount"
        value={formData.paidAmount}
        onChange={handleChange}
        className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full"
        placeholder="Advance paid"
      />

      <div className="outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full flex justify-between">
        <label className="text-neutral-500">Next due date</label>
        <input
          type="date"
          name="nextDueDate"
          value={formData.nextDueDate}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="outline-0 px-3 py-4 bg-neutral-900 text-white rounded-xl w-full"
      >
        Save Customer
      </button>
    </form>
  );
}
