"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Bot, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { writeCurrentUser } from "@/lib/auth-storage";

function AuthForm({ mode }) {
  const isSignUp = mode === "sign-up";
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Authentication failed");
      }

      writeCurrentUser(payload.user);
      toast.success(isSignUp ? "Account created" : "Signed in successfully");
      router.replace("/dashboard");
    } catch (error) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-slate-950 text-white shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.35),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.25),transparent_32%)]" />
      <div className="absolute -right-24 top-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative grid gap-0 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-10 xl:p-12 bg-white/5 border-r border-white/10">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              <Sparkles size={16} className="text-cyan-300" />
              MongoDB-backed access
            </div>
            <h1 className="mt-8 max-w-md text-4xl font-bold tracking-tight text-white xl:text-5xl">
              {isSignUp ? "Create your MockMate account" : "Welcome back to MockMate"}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              Store interview history in MongoDB, manage it through Compass, and keep every mock interview tied to your own account.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">What changes</p>
            <p className="mt-3 text-sm leading-6 text-white/75">
              Clerk is removed. Sign in now uses a local account backed by MongoDB, and the dashboard loads your interview history from Mongoose models.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 xl:p-12">
          <div className="mx-auto flex max-w-md flex-col">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white">
              <Bot className="text-cyan-300" size={18} />
              MockMate AI
            </Link>

            <h2 className="mt-8 text-3xl font-semibold tracking-tight text-white">
              {isSignUp ? "Build your account" : "Sign in"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65">
              {isSignUp
                ? "Use your email and password to create a new MongoDB-backed profile."
                : "Use the account you created to continue your interview practice."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {isSignUp && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Alex Johnson"
                    required
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:bg-white/10"
                  />
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="alex@example.com"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:bg-white/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/80" htmlFor="password">
                  Password
                </label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-cyan-300/60 focus-within:bg-white/10">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="w-full bg-transparent text-white outline-none placeholder:text-white/35"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-white/60 transition hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Please wait" : isSignUp ? "Create account" : "Sign in"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
              {isSignUp ? (
                <p>
                  Already have an account? <Link href="/sign-in" className="font-semibold text-cyan-200 hover:text-cyan-100">Sign in</Link>
                </p>
              ) : (
                <p>
                  Need an account? <Link href="/sign-up" className="font-semibold text-cyan-200 hover:text-cyan-100">Create one</Link>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuthForm;
