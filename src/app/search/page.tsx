"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { CourseCard } from "@/components/courses/CourseCard";
import { BookOpen } from "lucide-react";
import type { Course } from "@/lib/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`);
        const filtered = res.data.filter((course: Course) =>
          course.title.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold font-headline flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          Search Results
        </h1>
        <p className="text-muted-foreground mt-2">
          Showing results for "<span className="font-semibold text-foreground">{query}</span>"
        </p>
      </header>

      <section>
        {loading ? (
          <div className="text-center py-16 text-muted-foreground">
            Searching courses...
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {results.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg">
            <p className="text-muted-foreground">No courses found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
