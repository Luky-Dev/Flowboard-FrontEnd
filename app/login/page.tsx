"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      setAuth(data.token, data.user);
      localStorage.setItem("token", data.token);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-100 p-6">

      <div className="w-full max-w-md bg-white/70 backdrop-blur border border-white/40 rounded-3xl p-8 shadow-xl">

        <h1 className="text-3xl font-bold text-center">
          Welcome back
        </h1>

        <div className="space-y-3 mt-6">

          <input
            className="w-full px-4 py-3 rounded-xl border outline-none"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl border outline-none"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        {error && (
          <p className="mt-4 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-5 py-3 rounded-xl text-white font-medium
          bg-gradient-to-r from-indigo-500 to-violet-500
          hover:shadow-lg active:scale-95 transition
          disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Sign in"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-indigo-600 font-medium">
            Create account
          </Link>
        </p>

      </div>

    </main>
  );
}