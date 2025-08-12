import Link from 'next/link';
import { Bot } from 'lucide-react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl rounded-lg shadow-2xl border border-border overflow-hidden grid md:grid-cols-2">
        <div className="relative hidden md:block">
          <Image
            src="https://placehold.co/800x1200.png"
            alt="Robots learning"
            width={800}
            height={1200}
            className="h-full w-full object-cover"
            data-ai-hint="robotics education"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent p-8 flex flex-col justify-end">
            <h1 className="text-4xl font-bold text-white font-headline">
              Unlock the Future of Robotics
            </h1>
            <p className="mt-2 text-white/80">
              Join RoboQ and start your journey with our expert-led courses.
            </p>
          </div>
        </div>
        <div className="p-8 md:p-12">
          <div className="flex justify-center items-center gap-2 mb-8">
            <Bot className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold font-headline">RoboQ</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
