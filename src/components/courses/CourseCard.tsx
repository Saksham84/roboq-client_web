import Image from "next/image";
import Link from "next/link";
import type { Course } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

// const BASE_URL = "http://localhost:5000";

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-1">
      <CardHeader className="p-0">
        <Link href={`/courses/${course.id}`} className="block">
          <Image
            src={
                  course.imageUrl?.startsWith("/assets")
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${course.imageUrl}`
                    : course.imageUrl || "/fallback-image.jpg"
                }
            alt={course.title}
            width={600}
            height={400}
            className="w-full h-40 md:h-48 object-cover"
            data-ai-hint={course.imageHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 p-4 md:pt-6">
        <div className="flex flex-wrap gap-2 mb-2">
            {course.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
        </div>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-lg md:text-xl font-bold font-headline leading-tight">
            <Link href={`/courses/${course.id}`} className="hover:text-primary transition-colors">
              {course.title}
            </Link>
          </CardTitle>
          <span className="text-sm md:text-base font-semibold text-green-600 ml-4 whitespace-nowrap">
            ₹{Number(course.price).toLocaleString("en-IN", { maximumFractionDigits: 0 })}

          </span>
        </div>
        <p className="text-sm text-muted-foreground">By {course.instructor}</p>
        
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/courses/${course.id}`}>
            Start Learning <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
