import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface AdminCardSkeletonProps {
  variant?: "stat" | "chart" | "table" | "list";
  className?: string;
}

export const AdminCardSkeleton = ({ variant = "stat", className }: AdminCardSkeletonProps) => {
  if (variant === "stat") {
    return (
      <div className={cn("rounded-lg border bg-card p-6", className)}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
        <Skeleton className="mt-4 h-3 w-32" />
      </div>
    );
  }

  if (variant === "chart") {
    return (
      <div className={cn("rounded-lg border bg-card p-6", className)}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex items-end justify-between h-48 gap-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="flex-1" 
              style={{ height: `${30 + Math.random() * 70}%` }} 
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("rounded-lg border bg-card", className)}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="flex gap-4 mb-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
          {[...Array(5)].map((_, row) => (
            <div key={row} className="flex gap-4 py-3 border-b last:border-0">
              {[...Array(5)].map((_, col) => (
                <Skeleton key={col} className="h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export const AdminDashboardSkeleton = () => (
  <div className="space-y-6 p-6 animate-in fade-in duration-300">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <AdminCardSkeleton key={i} variant="stat" />
      ))}
    </div>
    
    {/* Charts Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <AdminCardSkeleton variant="chart" />
      <AdminCardSkeleton variant="chart" />
    </div>
    
    {/* Table */}
    <AdminCardSkeleton variant="table" />
  </div>
);

export const AdminTableSkeleton = ({ rows = 10 }: { rows?: number }) => (
  <div className="rounded-lg border bg-card">
    <div className="p-4 border-b">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
    <div className="overflow-hidden">
      <div className="grid grid-cols-6 gap-4 p-4 border-b bg-muted/50">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      {[...Array(rows)].map((_, row) => (
        <div key={row} className="grid grid-cols-6 gap-4 p-4 border-b last:border-0">
          {[...Array(6)].map((_, col) => (
            <Skeleton key={col} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  </div>
);
