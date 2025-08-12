"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import BuyNavbar from "@/components/courses/BuyNavbar";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isAuthPage = ["/login", "/signup", "/forgot-password"].includes(pathname);
  const isCoursePage = /^\/courses\/\d+$/i.test(pathname);

  const [courseId, setCourseId] = useState<number | null>(null);
  const [showBuyNavbar, setShowBuyNavbar] = useState(false);

  // 1️⃣ Get the courseId from URL & verify by fetching course
  useEffect(() => {
    if (!isCoursePage) {
      setCourseId(null);
      return;
    }

    const idMatch = pathname.match(/^\/courses\/(\d+)$/i);
    if (idMatch) {
      const urlCourseId = Number(idMatch[1]);

      // optional: verify the course exists
      axios
        .get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${urlCourseId}`)
        .then((res) => {
          if (res.status === 200) {
            setCourseId(urlCourseId);
          } else {
            setCourseId(null);
          }
        })
        .catch(() => setCourseId(null));
    }
  }, [pathname, isCoursePage]);

  // 2️⃣ Check enrollment
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!isCoursePage || !courseId) {
        setShowBuyNavbar(false);
        return;
      }

      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/enrolled`, {
          withCredentials: true,
        });

        const data = res.data;

        if (data.isLoggedIn === false) {
          setShowBuyNavbar(true);
          return;
        }

        if (Array.isArray(data)) {
          const isEnrolled = data.some(
            (course: { id: number }) => course.id === courseId
          );
          setShowBuyNavbar(!isEnrolled);
        } else {
          setShowBuyNavbar(true);
        }
      } catch (error) {
        console.error("❌ Failed to fetch enrolled courses:", error);
        setShowBuyNavbar(true);
      }
    };

    checkEnrollment();
  }, [pathname, courseId, isCoursePage]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      {showBuyNavbar && courseId && <BuyNavbar courseId={courseId} />}
      <main
        className={`flex-1 container mx-auto px-4 py-8 ${
          showBuyNavbar ? "pt-20" : ""
        }`}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}
