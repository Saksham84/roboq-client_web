"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Lock, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/utils/api"; // ✅ Use the shared API instance

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen flex items-center">
      <form onSubmit={handleSubmit} className="space-y-4 w-full">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold font-headline">Welcome Back!</h2>
          <p className="text-muted-foreground mt-2">
            Sign in to access your dashboard and courses.
          </p>
        </div>

        <div className="relative">
          <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
            className="pl-10"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="pl-10"
          />
        </div>

        <div className="text-right text-sm">
          <a href="/forgot-password" className="font-semibold text-primary hover:text-accent">
            Forgot password?
          </a>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
