"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { CourseCard } from "@/components/courses/CourseCard";
import api from "@/utils/api";
import type { Course } from "@/lib/types"; // ✅ Use shared type

// const BASE_URL = "http://localhost:5000";

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const plugin = useRef(Autoplay({ delay: 7000, stopOnInteraction: true }));

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses");
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const heroCourses = courses.slice(0, 3);
  const featuredCourses = courses;

  return (
    <div className="space-y-16">
      {/* Hero Carousel */}
      <section>
        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{ loop: true }}
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {heroCourses.map((course) => (
              <CarouselItem key={course.id}>
                <Card className="overflow-hidden border-none shadow-lg">
                  <CardContent className="relative aspect-square sm:aspect-[16/7] p-0">
                    <Image
                      src={
                        course.imageUrl?.startsWith("/assets")
                          ? `${process.env.NEXT_PUBLIC_BASE_URL}${course.imageUrl}`
                          : course.imageUrl || "/fallback-image.jpg"
                      }
                      alt={course.title}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/80 via-black/60 to-transparent p-6 sm:p-8 md:p-12 lg:p-16 flex flex-col justify-end sm:justify-center">
                      <div className="max-w-xl text-white">
                        <h1 className="text-2xl md:text-5xl font-bold font-headline tracking-tight">
                          {course.title}
                        </h1>
                        <p className="mt-2 sm:mt-4 text-base md:text-lg text-white/80">
                          {course.description}
                        </p>
                        <Button asChild size="lg" className="mt-4 sm:mt-6">
                          <Link href={`/courses/${course.id}`}>
                            Learn More <ArrowRight className="ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </section>

      {/* Featured Courses */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6">
          Featured Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  );
}
