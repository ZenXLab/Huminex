import React, { useRef, useState, useEffect, useCallback, memo, useMemo } from "react";
import { cn } from "@/lib/utils";

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

export function VirtualTable<T>({
  data,
  columns,
  rowHeight = 48,
  overscan = 5,
  className,
  onRowClick,
  emptyMessage = "No data available",
  getRowKey = (_, index) => String(index)
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
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const { visibleItems, startIndex, totalHeight } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
    const visibleCount = Math.ceil(containerHeight / rowHeight) + overscan * 2;
    const end = Math.min(data.length, start + visibleCount);
    
    return {
      visibleItems: data.slice(start, end),
      startIndex: start,
      totalHeight: data.length * rowHeight
    };
  }, [data, scrollTop, containerHeight, rowHeight, overscan]);

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
        </div>
      </div>
    </div>
  );
}

export default VirtualTable;
