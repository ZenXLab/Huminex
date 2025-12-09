import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter } from "lucide-react";

interface EventsSearchFilterProps {
  onSearch: (query: string) => void;
  onEventTypeChange: (type: string) => void;
  onPageFilter: (page: string) => void;
  eventType: string;
  searchQuery: string;
  pageFilter: string;
  availablePages: string[];
}

export const EventsSearchFilter = ({
  onSearch,
  onEventTypeChange,
  onPageFilter,
  eventType,
  searchQuery,
  pageFilter,
  availablePages,
}: EventsSearchFilterProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearch = useCallback(() => {
    onSearch(localSearch);
  }, [localSearch, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setLocalSearch("");
    onSearch("");
    onEventTypeChange("all");
    onPageFilter("");
  };

  const hasActiveFilters = searchQuery || eventType !== "all" || pageFilter;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by element, session, or page..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10 h-9 text-sm"
          />
          {localSearch && (
            <button
              onClick={() => { setLocalSearch(""); onSearch(""); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Event Type Filter */}
        <Select value={eventType} onValueChange={onEventTypeChange}>
          <SelectTrigger className="w-32 h-9 text-sm">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="click">Clicks</SelectItem>
            <SelectItem value="pageview">Page Views</SelectItem>
            <SelectItem value="scroll">Scrolls</SelectItem>
          </SelectContent>
        </Select>

        {/* Page Filter */}
        <Select value={pageFilter || "all"} onValueChange={(v) => onPageFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-40 h-9 text-sm">
            <SelectValue placeholder="Filter by Page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pages</SelectItem>
            {availablePages.slice(0, 10).map((page) => (
              <SelectItem key={page} value={page}>
                {page.length > 30 ? `...${page.slice(-27)}` : page}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button onClick={handleSearch} size="sm" className="h-9">
          <Search className="h-4 w-4 mr-1" />
          Search
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {searchQuery && (
            <Badge variant="secondary" className="text-xs">
              Search: "{searchQuery}"
              <button onClick={() => { setLocalSearch(""); onSearch(""); }} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {eventType !== "all" && (
            <Badge variant="secondary" className="text-xs">
              Type: {eventType}
              <button onClick={() => onEventTypeChange("all")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {pageFilter && (
            <Badge variant="secondary" className="text-xs">
              Page: {pageFilter.slice(-20)}
              <button onClick={() => onPageFilter("")} className="ml-1">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
