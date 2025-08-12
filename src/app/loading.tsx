import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-8">
      <header>
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-4 w-2/3 mt-3" />
      </header>
      
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-4 rounded-lg border p-4">
              <Skeleton className="h-48 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-5/6" />
                <Skeleton className="h-4 w-1/2" />
              </div>
               <Skeleton className="h-10 w-full mt-auto" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
