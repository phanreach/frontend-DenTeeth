import { Skeleton } from "./ui/skeleton";

export default function DentistCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-md">
      {/* Image */}
      <Skeleton className="aspect-[4/3] w-full" />

      <div className="space-y-4 p-5">
        {/* Name */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>

        {/* Info */}
        <div className="space-y-3 border-y border-gray-100 py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-6 w-28" />
          </div>

          <Skeleton className="h-11 w-full rounded-xl md:w-36" />
        </div>
      </div>
    </div>
  );
}
