"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { authState, login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");

      return;
    }

    setLoading(true);

    try {
      await login({
        email: formData.email,
        password: formData.password,
        remember: formData.remember,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="bg-[#128C7E] px-6 py-8 text-center text-white">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="mt-2 text-green-100">Sign in to continue to ChatApp</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {authState.error && (
            <div
              className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
              role="alert"
            >
              {authState.error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-[#128C7E] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#128C7E] focus:outline-none focus:ring-1 focus:ring-[#128C7E]"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-[#128C7E] focus:ring-[#128C7E]"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember me
            </label>
          </div>

          {error && (
            <div
              className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#128C7E] px-4 py-2 text-white shadow-sm hover:bg-[#0c6b5e] focus:outline-none focus:ring-2 focus:ring-[#128C7E] focus:ring-opacity-50 disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#128C7E] hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
