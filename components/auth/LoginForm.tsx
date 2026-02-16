"use client";
import { Eye, EyeClosed, LoaderCircle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.username && !formData.password) {
      setLoading(false);
      return setError("Required all fields.");
    }

    const res = await signIn("credentials", {
      ...formData,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/dashboard");
    }
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
      <div className="flex justify-between  px-3 py-4 bg-neutral-100 rounded-xl w-full ">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="password"
          className="outline-0"
          onChange={handleChange}
        />
        {showPassword ? (
          <Eye color="gray" onClick={() => setShowPassword((prev) => !prev)} />
        ) : (
          <EyeClosed
            color="gray"
            onClick={() => setShowPassword((prev) => !prev)}
          />
        )}
      </div>

      <p className="text-xs px-3 text-red-400">{error}</p>

      <button className="w-full p-4 flex items-center justify-center bg-neutral-900 text-white rounded-xl">
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <span>Login</span>
        )}
      </button>
    </form>
  );
}
