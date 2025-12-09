import React, { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  width?: number;
  render?: (item: T, index: number) => React.ReactNode;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  overscan?: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
  emptyMessage?: string;
  getRowKey?: (item: T, index: number) => string;
  // Infinite scroll props
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  isLoading?: boolean;
}

const VirtualTableRow = memo(({ 
  item, 
  columns, 
  index, 
  style, 
  onClick,
  isEven
}: { 
  item: any; 
  columns: Column<any>[]; 
  index: number; 
  style: React.CSSProperties;
  onClick?: () => void;
  isEven: boolean;
}) => (
  <div 
    className={cn(
      "flex items-center border-b border-border transition-colors",
      isEven ? "bg-muted/30" : "bg-background",
      onClick && "cursor-pointer hover:bg-muted/50"
    )}
    style={style}
    onClick={onClick}
  >
    {columns.map((col) => (
      <div 
        key={col.key} 
        className="px-4 py-2 truncate text-sm"
        style={{ width: col.width || 150, flex: col.width ? 'none' : 1 }}
      >
        {col.render ? col.render(item, index) : (item as any)[col.key]}
      </div>
    ))}
  </div>
));

VirtualTableRow.displayName = "VirtualTableRow";

// Loading skeleton row
const SkeletonRow = memo(({ columns, style }: { columns: Column<any>[]; style: React.CSSProperties }) => (
  <div 
    className="flex items-center border-b border-border bg-muted/20 animate-pulse"
    style={style}
  >
    {columns.map((col) => (
      <div 
        key={col.key} 
        className="px-4 py-2"
        style={{ width: col.width || 150, flex: col.width ? 'none' : 1 }}
      >
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    ))}
  </div>
));

SkeletonRow.displayName = "SkeletonRow";

export function VirtualTable<T>({
  data,
  columns,
  rowHeight = 48,
  overscan = 5,
  className,
  onRowClick,
  emptyMessage = "No data available",
  getRowKey = (_, index) => String(index),
  hasNextPage = false,
  isFetchingNextPage = false,
  fetchNextPage,
  isLoading = false,
}: VirtualTableProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerHeight(entry.contentRect.height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setScrollTop(target.scrollTop);
    
    // Infinite scroll trigger - load more when 200px from bottom
    if (
      hasNextPage && 
      !isFetchingNextPage && 
      fetchNextPage &&
      target.scrollHeight - target.scrollTop - target.clientHeight < 200
    ) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { visibleItems, startIndex, totalHeight } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / rowHeight) + overscan * 2;
    const end = Math.min(data.length, start + visibleCount);
    
    // Add extra height for loading indicator if fetching
    const extraHeight = isFetchingNextPage ? rowHeight : 0;
    
    return {
      visibleItems: data.slice(start, end),
      startIndex: start,
      totalHeight: data.length * rowHeight + extraHeight
    };
  }, [data, scrollTop, containerHeight, rowHeight, overscan, isFetchingNextPage]);

  // Show loading skeleton on initial load
  if (isLoading) {
    const skeletonRows = 8;
    return (
      <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
        <div 
          className="flex items-center bg-muted/50 border-b border-border font-medium text-sm"
          style={{ height: 44 }}
        >
          {columns.map((col) => (
            <div 
              key={col.key} 
              className="px-4 py-2 truncate"
              style={{ width: col.width || 150, flex: col.width ? 'none' : 1 }}
            >
              {col.header}
            </div>
          ))}
        </div>
        <div>
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <SkeletonRow 
              key={i} 
              columns={columns} 
              style={{ height: rowHeight }} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("rounded-lg border bg-card", className)}>
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          {emptyMessage}
        </div>
      </div>
    );
  }

  const headerHeight = 44;

  return (
    <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
      {/* Header */}
      <div 
        className="flex items-center bg-muted/50 border-b border-border font-medium text-sm sticky top-0 z-10"
        style={{ height: headerHeight }}
      >
        {columns.map((col) => (
          <div 
            key={col.key} 
            className="px-4 py-2 truncate"
            style={{ width: col.width || 150, flex: col.width ? 'none' : 1 }}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Virtual Scrolling Container */}
      <div 
        ref={containerRef}
        className="overflow-auto"
        style={{ height: `calc(100% - ${headerHeight}px)`, maxHeight: 500 }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {visibleItems.map((item, i) => {
            const actualIndex = startIndex + i;
            return (
              <VirtualTableRow
                key={getRowKey(item, actualIndex)}
                item={item}
                columns={columns}
                index={actualIndex}
                isEven={actualIndex % 2 === 0}
                onClick={onRowClick ? () => onRowClick(item, actualIndex) : undefined}
                style={{
                  position: 'absolute',
                  top: actualIndex * rowHeight,
                  left: 0,
                  right: 0,
                  height: rowHeight
                }}
              />
            );
          })}
          
          {/* Loading indicator for infinite scroll */}
          {isFetchingNextPage && (
            <div 
              className="absolute left-0 right-0 flex items-center justify-center gap-2 text-muted-foreground text-sm"
              style={{ 
                top: data.length * rowHeight, 
                height: rowHeight 
              }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more...
            </div>
          )}
        </div>
      </div>
      
      {/* Load more indicator at bottom */}
      {hasNextPage && !isFetchingNextPage && (
        <div className="px-4 py-2 text-center text-xs text-muted-foreground bg-muted/30 border-t">
          Scroll down to load more
        </div>
      )}
    </div>
  );
}

export default VirtualTable;
