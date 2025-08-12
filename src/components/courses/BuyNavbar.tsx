"use client";

import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import axios from "axios";

interface BuyNavbarProps {
  courseId: string;
}

export default function BuyNavbar({ courseId }: BuyNavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/status`, {
          withCredentials: true,
        });

        setIsLoggedIn(res.data?.isLoggedIn === true);
      } catch (err) {
        console.error("❌ Error checking auth status:", err);
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  // Redirect to payment page for this course if logged in, else to login page
  const targetHref = isLoggedIn
    ? `/payment/${courseId}`
    : `/login?redirect=/payment/${courseId}`;

  return (
    <div className="sticky top-[64px] z-40 bg-white border-b shadow-md px-4 py-3 flex items-center justify-between">
      <div className="text-lg font-semibold text-primary">Buy this Course</div>
      <Link
        href={targetHref}
        className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        <ShoppingCart className="w-5 h-5" />
        Buy Now
      </Link>
    </div>
  );
}
