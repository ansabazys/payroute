"use client";

import React, { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input
        type="text"
        name="username"
        className=" outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full "
        placeholder="username"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        className=" outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full "
        placeholder="email"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        className=" outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full "
        placeholder="password"
        onChange={handleChange}
      />

      <button className="w-full py-4 bg-neutral-900 text-white rounded-xl">
        Submit
      </button>
    </form>
  );
}
