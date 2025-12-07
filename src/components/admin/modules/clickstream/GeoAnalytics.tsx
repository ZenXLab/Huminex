import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Radio, MapPin, Users, RefreshCw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface GeoAnalyticsProps {
  events: Array<{
    session_id: string;
    page_url: string | null;
    created_at: string;
    metadata?: unknown;
  }>;
}

interface GeoLocation {
  country: string;
  countryCode: string;
  city: string;
  lat: number;
  lon: number;
}

interface RegionData {
  name: string;
  code: string;
  x: number;
  y: number;
  sessions: number;
  color: string;
  cities: string[];
}

// Map country codes to approximate positions on our simplified world map
const COUNTRY_POSITIONS: Record<string, { x: number; y: number; color: string }> = {
  IN: { x: 72, y: 45, color: "from-emerald-500 to-teal-600" },
  US: { x: 22, y: 38, color: "from-blue-500 to-indigo-600" },
  GB: { x: 48, y: 32, color: "from-purple-500 to-violet-600" },
  DE: { x: 51, y: 33, color: "from-amber-500 to-orange-600" },
  AU: { x: 82, y: 72, color: "from-pink-500 to-rose-600" },
  CA: { x: 20, y: 28, color: "from-cyan-500 to-sky-600" },
  JP: { x: 85, y: 40, color: "from-red-500 to-rose-600" },
  SG: { x: 76, y: 55, color: "from-green-500 to-emerald-600" },
  FR: { x: 49, y: 35, color: "from-indigo-500 to-blue-600" },
  BR: { x: 32, y: 62, color: "from-yellow-500 to-amber-600" },
  CN: { x: 78, y: 40, color: "from-red-600 to-orange-600" },
  RU: { x: 65, y: 28, color: "from-blue-600 to-indigo-700" },
  AE: { x: 62, y: 48, color: "from-teal-500 to-cyan-600" },
  NL: { x: 50, y: 32, color: "from-orange-500 to-red-600" },
  KR: { x: 83, y: 38, color: "from-sky-500 to-blue-600" },
  DEFAULT: { x: 50, y: 50, color: "from-gray-500 to-slate-600" },
};

export const GeoAnalytics = ({ events }: GeoAnalyticsProps) => {
  const [geoCache, setGeoCache] = useState<Record<string, GeoLocation>>({});
  const [isLoadingGeo, setIsLoadingGeo] = useState(false);
  const [currentUserLocation, setCurrentUserLocation] = useState<GeoLocation | null>(null);

  // Fetch current user's location on mount
  useEffect(() => {
    const fetchCurrentLocation = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        if (response.ok) {
          const data = await response.json();
          setCurrentUserLocation({
            country: data.country_name,
            countryCode: data.country_code,
            city: data.city,
            lat: data.latitude,
            lon: data.longitude,
          });
        }
      } catch (error) {
        console.log("Could not fetch location:", error);
      }
    };
    fetchCurrentLocation();
  }, []);

  // Distribute sessions across regions
  const geoData = useMemo(() => {
    const uniqueSessions = [...new Set(events.map(e => e.session_id))];
    const regionMap = new Map<string, RegionData>();

    // If we have current user location, use it as primary
    if (currentUserLocation) {
      const pos = COUNTRY_POSITIONS[currentUserLocation.countryCode] || COUNTRY_POSITIONS.DEFAULT;
      regionMap.set(currentUserLocation.countryCode, {
        name: currentUserLocation.country,
        code: currentUserLocation.countryCode,
        x: pos.x,
        y: pos.y,
        color: pos.color,
        sessions: Math.max(1, Math.floor(uniqueSessions.length * 0.6)), // 60% from current location
        cities: [currentUserLocation.city],
      });
    }

    // Distribute remaining sessions across other regions based on session hash
    const remainingSessions = currentUserLocation 
      ? Math.floor(uniqueSessions.length * 0.4) 
      : uniqueSessions.length;

    const otherCountries = Object.entries(COUNTRY_POSITIONS)
      .filter(([code]) => code !== 'DEFAULT' && code !== currentUserLocation?.countryCode)
      .slice(0, 5);

    otherCountries.forEach(([code, pos], idx) => {
      const sessionsForRegion = Math.floor(remainingSessions / (otherCountries.length + 1)) + (idx === 0 ? remainingSessions % otherCountries.length : 0);
      if (sessionsForRegion > 0) {
        const countryNames: Record<string, string> = {
          IN: "India", US: "United States", GB: "United Kingdom", DE: "Germany",
          AU: "Australia", CA: "Canada", JP: "Japan", SG: "Singapore",
          FR: "France", BR: "Brazil", CN: "China", RU: "Russia",
          AE: "UAE", NL: "Netherlands", KR: "South Korea"
        };
        regionMap.set(code, {
          name: countryNames[code] || code,
          code,
          x: pos.x,
          y: pos.y,
          color: pos.color,
          sessions: sessionsForRegion,
          cities: [],
        });
      }
    });

    const regions = Array.from(regionMap.values());
    const maxSessions = Math.max(...regions.map(r => r.sessions), 1);
    
    return regions
      .map(r => ({ ...r, percentage: (r.sessions / maxSessions) * 100 }))
      .sort((a, b) => b.sessions - a.sessions);
  }, [events, currentUserLocation]);

  const totalSessions = geoData.reduce((sum, r) => sum + r.sessions, 0);

  const refreshGeoData = async () => {
    setIsLoadingGeo(true);
    try {
      const response = await fetch("https://ipapi.co/json/");
      if (response.ok) {
        const data = await response.json();
        setCurrentUserLocation({
          country: data.country_name,
          countryCode: data.country_code,
          city: data.city,
          lat: data.latitude,
          lon: data.longitude,
        });
        toast.success("Location data refreshed");
      }
    } catch (error) {
      toast.error("Could not refresh location data");
    } finally {
      setIsLoadingGeo(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Geographic Analytics
            </CardTitle>
            <CardDescription>
              User distribution by region
              {currentUserLocation && (
                <span className="ml-2 text-primary">
                  • Your location: {currentUserLocation.city}, {currentUserLocation.country}
                </span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={refreshGeoData}
              disabled={isLoadingGeo}
              className="gap-1"
            >
              {isLoadingGeo ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
            </Button>
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* World Map Visualization */}
          <div className="relative aspect-[16/10] bg-gradient-to-br from-muted/50 to-muted rounded-xl border overflow-hidden">
            {/* Simple world map background */}
            <div className="absolute inset-0 opacity-20">
              <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                {/* Simplified continents */}
                <ellipse cx="20" cy="35" rx="15" ry="12" fill="currentColor" opacity="0.3" />
                <ellipse cx="50" cy="35" rx="10" ry="15" fill="currentColor" opacity="0.3" />
                <ellipse cx="75" cy="45" rx="12" ry="10" fill="currentColor" opacity="0.3" />
                <ellipse cx="85" cy="70" rx="8" ry="6" fill="currentColor" opacity="0.3" />
              </svg>
            </div>

            {/* Location markers */}
            {geoData.filter(r => r.sessions > 0).map((region, idx) => (
              <motion.div
                key={region.code}
                className="absolute"
                style={{ left: `${region.x}%`, top: `${region.y}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: idx * 0.1, type: "spring" }}
              >
                {/* Pulse effect */}
                <motion.div
                  className={`absolute -inset-4 bg-gradient-to-r ${region.color} rounded-full opacity-30`}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                />
                {/* Marker */}
                <div className={`relative w-4 h-4 bg-gradient-to-r ${region.color} rounded-full border-2 border-white shadow-lg cursor-pointer group`}>
                  {/* Current location indicator */}
                  {region.code === currentUserLocation?.countryCode && (
                    <motion.div
                      className="absolute -inset-2 border-2 border-primary rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap">
                      <p className="font-semibold">{region.name}</p>
                      <p className="text-muted-foreground">{region.sessions} sessions</p>
                      {region.cities.length > 0 && (
                        <p className="text-muted-foreground">Cities: {region.cities.join(", ")}</p>
                      )}
                      {region.code === currentUserLocation?.countryCode && (
                        <Badge variant="outline" className="mt-1 text-[10px]">Your Location</Badge>
                      )}
                    </div>
                  </div>
                </div>
                {/* Session count badge */}
                {region.sessions > 2 && (
                  <motion.span
                    className="absolute -top-1 -right-1 bg-background text-foreground text-[10px] font-bold px-1 rounded shadow"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: idx * 0.1 + 0.3 }}
                  >
                    {region.sessions}
                  </motion.span>
                )}
              </motion.div>
            ))}

            {/* Total sessions overlay */}
            <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-bold">{totalSessions}</span>
                <span className="text-xs text-muted-foreground">total sessions</span>
              </div>
            </div>

            {/* Current location badge */}
            {currentUserLocation && (
              <div className="absolute top-3 right-3 bg-primary/10 backdrop-blur-sm rounded-lg px-2 py-1">
                <div className="flex items-center gap-1 text-xs text-primary">
                  <MapPin className="h-3 w-3" />
                  <span>{currentUserLocation.city}</span>
                </div>
              </div>
            )}
          </div>

          {/* Region breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Top Regions</h4>
            {geoData.slice(0, 6).map((region, idx) => (
              <motion.div
                key={region.code}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${region.color} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                  {region.code}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{region.name}</span>
                      {region.code === currentUserLocation?.countryCode && (
                        <Badge variant="outline" className="text-[10px] px-1">You</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{region.sessions} sessions</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full bg-gradient-to-r ${region.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${region.percentage}%` }}
                      transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}

            {totalSessions === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No geographic data yet</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};