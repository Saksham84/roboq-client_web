"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import type { Category } from "@/lib/types";

interface CourseFiltersProps {
  categories: Category[];
  onFilterChange: (category: string) => void;
}

export function CourseFilters({ categories, onFilterChange }: CourseFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg border border-border">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search for courses..." className="pl-10" />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <Select onValueChange={onFilterChange} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
