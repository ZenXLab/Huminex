import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Radio, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

interface GeoAnalyticsProps {
  events: Array<{
    session_id: string;
    page_url: string | null;
    created_at: string;
  }>;
}

// Simulated geo data based on session patterns (in production, you'd get real IP geolocation)
const MOCK_REGIONS = [
  { name: "India", code: "IN", x: 72, y: 45, sessions: 0, color: "from-emerald-500 to-teal-600" },
  { name: "United States", code: "US", x: 22, y: 38, sessions: 0, color: "from-blue-500 to-indigo-600" },
  { name: "United Kingdom", code: "GB", x: 48, y: 32, sessions: 0, color: "from-purple-500 to-violet-600" },
  { name: "Germany", code: "DE", x: 51, y: 33, sessions: 0, color: "from-amber-500 to-orange-600" },
  { name: "Australia", code: "AU", x: 82, y: 72, sessions: 0, color: "from-pink-500 to-rose-600" },
  { name: "Canada", code: "CA", x: 20, y: 28, sessions: 0, color: "from-cyan-500 to-sky-600" },
  { name: "Japan", code: "JP", x: 85, y: 40, sessions: 0, color: "from-red-500 to-rose-600" },
  { name: "Singapore", code: "SG", x: 76, y: 55, sessions: 0, color: "from-green-500 to-emerald-600" },
];

export const GeoAnalytics = ({ events }: GeoAnalyticsProps) => {
  // Distribute sessions across regions based on session hash
  const geoData = useMemo(() => {
    const uniqueSessions = [...new Set(events.map(e => e.session_id))];
    const regions = [...MOCK_REGIONS];
    
    uniqueSessions.forEach(sessionId => {
      const hash = sessionId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const regionIndex = hash % regions.length;
      regions[regionIndex].sessions++;
    });

    const maxSessions = Math.max(...regions.map(r => r.sessions), 1);
    return regions.map(r => ({
      ...r,
      percentage: (r.sessions / maxSessions) * 100,
    })).sort((a, b) => b.sessions - a.sessions);
  }, [events]);

  const totalSessions = geoData.reduce((sum, r) => sum + r.sessions, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Geographic Analytics
            </CardTitle>
            <CardDescription>User distribution by region</CardDescription>
          </div>
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            <Radio className="h-3 w-3 mr-1 animate-pulse" />
            Live
          </Badge>
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
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg px-3 py-2 text-xs whitespace-nowrap">
                      <p className="font-semibold">{region.name}</p>
                      <p className="text-muted-foreground">{region.sessions} sessions</p>
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
                    <span className="font-medium text-sm">{region.name}</span>
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
