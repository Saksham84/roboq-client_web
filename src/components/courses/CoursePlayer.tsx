'use client';

import { useEffect, useRef, useState } from 'react';
import type { Course, Lesson } from '@/lib/types';
import Image from 'next/image';
import axios from 'axios';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  BookText,
  Lock,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Card, CardContent } from '../ui/card';

export function CoursePlayer({ course }: { course: Course }) {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(course.lessons?.[0] || null);
  const [completedLessons, setCompletedLessons] = useState<Record<string, string>>({});
  const [enrollmentId, setEnrollmentId] = useState<number | null | undefined>(undefined);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // const BASE_URL = 'http://localhost:5000';
  const isCourseEmpty = course.lessons.length === 0;

  // ✅ Fetch enrollment and progress
  useEffect(() => {
    const fetchEnrollmentAndProgress = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/progress/${course.id}`, {
          withCredentials: true,
        });

        const { enrollmentId, completedLessonIds = [] } = res.data;

        setEnrollmentId(enrollmentId);

        const ids: number[] = completedLessonIds || [];
        const lessonMap: Record<string, string> = {};
        ids.forEach((id) => {
          lessonMap[String(id)] = new Date().toISOString(); // mock timestamp
        });
        setCompletedLessons(lessonMap);
      } catch (err) {
        console.error('❌ Error fetching enrollment/progress:', err);
        setEnrollmentId(null); // fail-safe
      }
    };

    fetchEnrollmentAndProgress();
  }, [course.id]);

  const isLocked = enrollmentId === null;

  const postLessonProgress = async (lessonId: string) => {
    if (isLocked) return;
    try {
      const payload = {
        courseId: Number(course.id),
        lessonId: Number(lessonId),
      };
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/progress/complete`, payload, {
        withCredentials: true,
      });
      setCompletedLessons((prev) => ({
        ...prev,
        [String(lessonId)]: new Date().toISOString(),
      }));
    } catch (error: any) {
      console.error('❌ Error saving lesson progress:', error?.response?.data || error);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    if (isLocked) return;
    setCurrentLesson(lesson);
    setIsVideoPlaying(true);
  };

  // const handleCompleteLesson = (lessonId: string) => {
  //   if (!completedLessons[lessonId] && !isLocked) {
  //     postLessonProgress(lessonId);
  //   }
  // };

    const handleCompleteLesson = (lessonId: string) => {
    if (isLocked || completedLessons[lessonId]) return;

    const payload = {
      courseId: Number(course.id),
      lessonId: Number(lessonId),
    };

    axios
      .post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/progress/complete`, payload, {
        withCredentials: true,
      })
      .then(() => {
        setCompletedLessons((prev) => ({
          ...prev,
          [String(lessonId)]: new Date().toISOString(),
        }));
      })
      .catch((err) => {
        console.error('❌ Error saving progress:', err);
      });
  };

  const handlePlayClick = () => {
    if (isCourseEmpty || isLocked) return;
    const allCompleted = course.lessons.every((l) => completedLessons[l.id]);
    const nextLesson = allCompleted
      ? course.lessons[0]
      : course.lessons.find((l) => !completedLessons[l.id]);
    if (nextLesson) {
      setCurrentLesson(nextLesson);
      setIsVideoPlaying(true);
    }
  };

  const navigateLesson = (direction: 'next' | 'prev') => {
    if (isLocked || !currentLesson) return;

    const index = course.lessons.findIndex((l) => l.id === currentLesson.id);
    const newIndex = direction === 'next' ? index + 1 : index - 1;

    if (newIndex >= 0 && newIndex < course.lessons.length) {
      setCurrentLesson(course.lessons[newIndex]);
      setIsVideoPlaying(true);
    }
  };

  const handleVideoEnded = () => {
    if (currentLesson && !isLocked) {
      handleCompleteLesson(currentLesson.id);
      const currentIndex = course.lessons.findIndex((l) => l.id === currentLesson.id);
      const nextLesson = course.lessons[currentIndex + 1];
      if (nextLesson) {
        setCurrentLesson(nextLesson);
        setIsVideoPlaying(true);
      } else {
        setIsVideoPlaying(false);
      }
    }
  };

  const progress = course.lessons.length
    ? (Object.keys(completedLessons).length / course.lessons.length) * 100
    : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Backspace' && videoRef.current && !isLocked) {
        e.preventDefault();
        const video = videoRef.current;
        video.paused ? video.play() : video.pause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, []);

  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8">
        <div className="mb-6">
          <div className="relative aspect-video rounded-lg overflow-hidden bg-card border border-border mb-4">
            {isCourseEmpty ? (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground text-xl">
                🚧 Course coming soon. Stay tuned!
              </div>
            ) : isVideoPlaying && currentLesson?.videoUrl ? (
              <video
                ref={videoRef}
                src={
                  currentLesson.videoUrl.startsWith('/assets')
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${currentLesson.videoUrl}`
                    : currentLesson.videoUrl
                }
                className="w-full h-full object-cover"
                controls
                autoPlay
                onEnded={handleVideoEnded}
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <>
                <Image
                  src={
                    course.imageUrl?.startsWith('/assets')
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}${course.imageUrl}`
                      : course.imageUrl || '/fallback-image.jpg'
                  }
                  alt={currentLesson?.title || 'Course image'}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <PlayCircle
                    className="w-20 h-20 text-white/70 hover:text-white transition-colors cursor-pointer"
                    onClick={handlePlayClick}
                  />
                </div>
              </>
            )}
          </div>

          {currentLesson && (
            <>
              <h1 className="text-3xl font-bold font-headline mb-2">{currentLesson.title}</h1>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>By {course.instructor}</p>
                <div className="flex gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Card className="my-6">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold font-headline mb-4 flex items-center">
                    <BookText className="mr-2 h-5 w-5 text-primary" />
                    Lesson Details
                  </h3>
                  <p className="text-muted-foreground">{currentLesson.content}</p>
                  {completedLessons[currentLesson.id] && (
                    <p className="text-green-600 mt-4 text-sm">
                      ✅ Completed on {formatDate(completedLessons[currentLesson.id])}
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => navigateLesson('prev')}
                  disabled={
                    isLocked ||
                    course.lessons.findIndex((l) => l.id === currentLesson?.id) === 0
                  }
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>

                <Button
                  onClick={() => handleCompleteLesson(currentLesson!.id)}
                  disabled={isLocked || !!completedLessons[currentLesson!.id]}
                >
                  {completedLessons[currentLesson!.id] ? 'Completed' : 'Mark as Complete'}
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => navigateLesson('next')}
                  disabled={
                    isLocked ||
                    course.lessons.findIndex((l) => l.id === currentLesson?.id) ===
                      course.lessons.length - 1
                  }
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="sticky top-20">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold font-headline mb-2">{course.title}</h2>
              <div className="mb-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.round(progress)}% Complete
                </p>
              </div>

              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="font-bold">Course Content</AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {course.lessons.map((lesson) => (
                        <li key={lesson.id}>
                          <button
                            onClick={() => handleLessonClick(lesson)}
                            disabled={isLocked}
                            className={`w-full text-left p-3 rounded-md text-sm flex items-center justify-between transition-colors ${
                              currentLesson?.id === lesson.id
                                ? 'bg-primary/10 text-primary'
                                : 'hover:bg-muted/50'
                            }`}
                          >
                            <div className="flex flex-col text-left">
                              <div className="flex items-center">
                                {isLocked ? (
                                  <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                                ) : completedLessons[lesson.id] ? (
                                  <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                                ) : (
                                  <PlayCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                                )}
                                <span>{lesson.title}</span>
                              </div>
                              {completedLessons[lesson.id] && (
                                <span className="text-xs text-green-600">
                                  {formatDate(completedLessons[lesson.id])}
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </aside>
    </div>
  );
}
