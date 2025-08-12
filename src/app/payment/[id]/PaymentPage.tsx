"use client";

import { useEffect, useState } from "react";
import api from "@/utils/api";
import Script from "next/script";
import { useRouter } from "next/navigation";

export default function PaymentPage({ id }: { id: string }) {
  const [user, setUser] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user & course details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await api.get("/auth/status");
        const courseRes = await api.get(`/courses/${id}`);

        setUser(userRes.data);
        setCourse(courseRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load details.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePayment = async () => {
    try {
      // Step 1 — Create Razorpay order from backend
      const orderRes = await api.post("/auth/purchase-course", {
        amount: course.price,
        course: course
      });

      const { order } = orderRes.data;

      // Step 2 — Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_525mRzEtTSEZ6m", // public key
        amount: order.amount,
        currency: order.currency,
        name: "My Academy",
        description: course.title,
        order_id: order.id,
        prefill: {
          name: user.user?.name,
          email: user.user?.email,
        },
        handler: async function (response: any) {
          try {
            // Step 3 — Send payment details to backend for verification + enrollment
            await api.post("/auth/purchase-course", {
              amount: course.price,
              course: course,
              paymentResponse: response
            });

            alert("✅ Payment successful & enrolled!");
            router.push("/dashboard"); // Redirect to dashboard
          } catch (err) {
            console.error(err);
            alert("Payment verification failed.");
          }
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed to start.");
    }
  };

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error) return <div className="text-center py-16 text-red-500">{error}</div>;

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="space-y-8 max-w-3xl mx-auto pt-10">
        <h1 className="text-4xl font-bold">{course?.title}</h1>
        <p className="text-muted-foreground">{course?.description}</p>

        <div className="border p-4 rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-2">Your Details</h2>
          <p><strong>Name:</strong> {user.user?.name}</p>
          <p><strong>Email:</strong> {user.user?.email}</p>
        </div>

        <div className="border p-4 rounded-lg bg-card">
          <h2 className="text-lg font-semibold mb-2">Course Details</h2>
          <p><strong>Title:</strong> {course?.title}</p>
          <p><strong>Price:</strong> ₹{course?.price}</p>
        </div>

        <button
          onClick={handlePayment}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Pay Now
        </button>
      </div>
    </>
  );
}
