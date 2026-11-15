
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "@/contexts/auth";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const auth = useAuth();
  const router = useRouter();

  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email")).trim();
    const password = String(formData.get("password"));

    setError(undefined);
    setSuccess(undefined);
    setPending(true);

    try {
      if (isRegister) {
        const response = await auth.register(email, password);

        if (typeof response === "string") {
          setError(response);
          return;
        }

        setSuccess("Account created! You can now log in.");
        setIsRegister(false);
        return;
      }

      const response = await auth.login(email, password);

      if (typeof response === "string") {
        setError(response);
        return;
      }

      router.push("/");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-stone-50 px-6 py-16">
      <div className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-lg sm:p-10">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-800">
            StayFinder
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-stone-500">
            {isRegister
              ? "Create an account and discover your next escape."
              : "Log in to discover and book your next stay."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-stone-700"
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-stone-700"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              minLength={6}
              required
              className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-emerald-800 focus:ring-2 focus:ring-emerald-800/10"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {success && (
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-full bg-emerald-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending
              ? "Please wait..."
              : isRegister
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <div className="mt-8 border-t border-stone-200 pt-6 text-center">
          <p className="text-sm text-stone-600">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>

          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(undefined);
              setSuccess(undefined);
            }}
            className="mt-2 text-sm font-semibold text-emerald-800 transition hover:text-emerald-600"
          >
            {isRegister ? "Log in" : "Create an account"}
          </button>
        </div>
      </div>
    </main>
  );
}
