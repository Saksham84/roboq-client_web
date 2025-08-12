// app/courses/[id]/page.tsx
import { notFound } from "next/navigation";
import BuyNavbar from "@/components/courses/BuyNavbar";
import { CoursePlayer } from "@/components/courses/CoursePlayer";
import type { Course } from "@/lib/types";

interface PageProps {
  params: { id?: string };
}

export default async function CoursePage({ params }: PageProps) {
  const courseId = params?.id;

  if (!courseId) return notFound();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}`, {
      cache: "no-store",
    });

    if (!res.ok) return notFound();

    const course: Course = await res.json();

    if (!course || !course.title) return notFound();

    return (
      <>
        {/* Top navigation bar */}
        {/* <BuyNavbar courseId={courseId} /> */}

        {/* Video player / course content */}
        <CoursePlayer course={course} />
      </>
    );
  } catch (err) {
    console.error("❌ Error loading course:", err);
    return notFound();
  }
}
