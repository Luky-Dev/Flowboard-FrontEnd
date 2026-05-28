"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!isValidEmail(form.email)) {
      setError("Invalid email format");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", {
        ...form,
        email: form.email.trim().toLowerCase(),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-100 p-6">

      <div className="w-full max-w-md bg-white/70 backdrop-blur border border-white/40 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Create account
        </h1>

        <div className="space-y-3 mt-6">

          {["name", "email", "password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "text"}
              placeholder={field}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-white/80 border border-white/40 outline-none"
            />
          ))}

        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-5 py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-violet-500 to-indigo-500
          hover:shadow-lg active:scale-95 transition
          disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 font-medium">
            Sign in
          </Link>
        </p>

      </div>
    </main>
  );
}