"use client";

import { useEffect, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import api from "@/utils/api";
import { CourseCard } from "@/components/courses/CourseCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/enrolled");
        setEnrolledCourses(res.data || []);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
        setError("Failed to fetch enrolled courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <LayoutDashboard className="w-8 h-8 text-primary" />
          My Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Continue your learning journey.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-bold font-headline mb-6">My Courses</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-48 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id || course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
            <p className="text-muted-foreground">
              You are not enrolled in any courses yet.
            </p>
            <a
              href="/courses"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Explore courses
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
