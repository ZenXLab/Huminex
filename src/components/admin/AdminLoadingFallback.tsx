import { Skeleton } from "@/components/ui/skeleton";

interface AdminLoadingFallbackProps {
  module?: string;
}

export const AdminLoadingFallback = ({ module }: AdminLoadingFallbackProps) => {
  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-200">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-8 rounded" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="p-4 space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 py-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1 max-w-[200px]" />
              <Skeleton className="h-4 w-24 hidden md:block" />
              <Skeleton className="h-4 w-20 hidden lg:block" />
              <Skeleton className="h-6 w-16 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      <div className="flex justify-center pt-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading {module || 'module'}...</span>
        </div>
      </div>
    </div>
  );
};
