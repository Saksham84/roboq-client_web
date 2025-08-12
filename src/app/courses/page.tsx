"use client";

import { useEffect, useState } from "react";
import { CourseCard } from "@/components/courses/CourseCard";
import { BookOpen, Search } from "lucide-react";
import api from "@/utils/api";
import type { Course } from "@/lib/types";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        const data = res.data || [];
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Something went wrong while loading courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(term)
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  return (
    <div className="space-y-8">
      <header className="pt-6">
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Course Catalog
        </h1>
        <p className="text-muted-foreground mt-2">
          Explore our courses and start your journey today.
        </p>

        {/* 🔍 Search Input */}
        <div className="mt-6 max-w-md relative">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 border border-border rounded-lg shadow-sm bg-background text-foreground"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
        </div>
      </header>

      <section>
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            Loading courses...
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
            <p className="text-muted-foreground">No matching courses found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
