export interface Category {
  name: string;
  slug: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "15 min"
  content: string;
  videoUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  instructor: string;
  imageUrl: string;
  imageHint: string;
  category: Category;
  lessons: Lesson[];
  tags: string[];
  price: string;
}

export interface Certificate {
  id: string;
  courseTitle: string;
  dateIssued: string;
}
