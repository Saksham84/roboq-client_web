"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AtSign, Lock, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/utils/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Email not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/verify-otp", { email, otp });
      setStep("reset");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, newPassword });
      router.push("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto min-h-screen flex items-center">
      <form
        onSubmit={
          step === "email"
            ? handleEmailSubmit
            : step === "otp"
            ? handleOtpSubmit
            : handleResetSubmit
        }
        className="space-y-4 w-full"
      >
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold font-headline">Forgot Password</h2>
          <p className="text-muted-foreground mt-2">
            {step === "email"
              ? "Enter your email to receive an OTP."
              : step === "otp"
              ? "Check your email and enter the OTP sent to you."
              : "Enter a new password."}
          </p>
        </div>

        {step === "email" && (
          <div className="relative">
            <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        )}

        {step === "otp" && (
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        )}

        {step === "reset" && (
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        )}

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading
            ? "Processing..."
            : step === "email"
            ? "Send OTP"
            : step === "otp"
            ? "Verify OTP"
            : "Reset Password"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <p className="text-sm text-center mt-4">
          Back to{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
