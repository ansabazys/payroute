"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
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

    
    const res = await signIn("credentials", {
      ...formData,
      redirect: true,
      callbackUrl: "/dashboard",
    });

    console.log(res)
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <input
        type="text"
        className=" outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full "
        placeholder="username"
        name="username"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        className=" outline-0 px-3 py-4 bg-neutral-100 rounded-xl w-full "
        placeholder="password"
        onChange={handleChange}
      />

      <button className="w-full p-4 bg-neutral-900 text-white rounded-xl">
        Login
      </button>
    </form>
  );
}
