import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Monitor, Smartphone, Tablet, Globe, Chrome, Apple, Radio } from "lucide-react";
import { motion } from "framer-motion";

interface DeviceAnalyticsProps {
  events: Array<{
    metadata: any;
    session_id: string;
  }>;
}

interface DeviceStats {
  device: string;
  count: number;
  percentage: number;
  icon: React.ElementType;
}

interface BrowserStats {
  browser: string;
  count: number;
  percentage: number;
  color: string;
}

interface OSStats {
  os: string;
  count: number;
  percentage: number;
}

export const DeviceAnalytics = ({ events }: DeviceAnalyticsProps) => {
  // Parse userAgent to extract device, browser, and OS info
  const parseUserAgent = (ua: string) => {
    if (!ua) return { device: "Unknown", browser: "Unknown", os: "Unknown" };

    // Device detection
    let device = "Desktop";
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
      if (/iPad|Tablet/i.test(ua)) {
        device = "Tablet";
      } else {
        device = "Mobile";
      }
    }

    // Browser detection
    let browser = "Other";
    if (ua.includes("Chrome") && !ua.includes("Edg")) browser = "Chrome";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edg")) browser = "Edge";
    else if (ua.includes("Opera") || ua.includes("OPR")) browser = "Opera";

    // OS detection
    let os = "Other";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    return { device, browser, os };
  };

  // Aggregate data from events
  const deviceCounts: Record<string, number> = {};
  const browserCounts: Record<string, number> = {};
  const osCounts: Record<string, number> = {};
  const screenSizes: Record<string, number> = {};
  const uniqueSessions = new Set<string>();

  events.forEach(event => {
    const metadata = event.metadata as Record<string, any> | null;
    const ua = metadata?.userAgent || "";
    const { device, browser, os } = parseUserAgent(ua);

    uniqueSessions.add(event.session_id);
    deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    osCounts[os] = (osCounts[os] || 0) + 1;

    // Screen size categorization
    const width = metadata?.screenWidth || 0;
    let sizeCategory = "Unknown";
    if (width >= 1920) sizeCategory = "Large (1920+)";
    else if (width >= 1366) sizeCategory = "Medium (1366-1919)";
    else if (width >= 768) sizeCategory = "Small (768-1365)";
    else if (width > 0) sizeCategory = "Mobile (<768)";
    
    if (sizeCategory !== "Unknown") {
      screenSizes[sizeCategory] = (screenSizes[sizeCategory] || 0) + 1;
    }
  });

  const totalEvents = events.length;

  // Prepare device stats
  const deviceIcons: Record<string, React.ElementType> = {
    Desktop: Monitor,
    Mobile: Smartphone,
    Tablet: Tablet,
    Unknown: Globe,
  };

  const deviceStats: DeviceStats[] = Object.entries(deviceCounts)
    .map(([device, count]) => ({
      device,
      count,
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
      icon: deviceIcons[device] || Globe,
    }))
    .sort((a, b) => b.count - a.count);

  // Prepare browser stats
  const browserColors: Record<string, string> = {
    Chrome: "bg-gradient-to-r from-green-500 to-blue-500",
    Safari: "bg-gradient-to-r from-blue-400 to-blue-600",
    Firefox: "bg-gradient-to-r from-orange-500 to-red-500",
    Edge: "bg-gradient-to-r from-blue-600 to-cyan-500",
    Opera: "bg-gradient-to-r from-red-500 to-red-700",
    Other: "bg-gradient-to-r from-gray-400 to-gray-600",
  };

  const browserStats: BrowserStats[] = Object.entries(browserCounts)
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
      color: browserColors[browser] || browserColors.Other,
    }))
    .sort((a, b) => b.count - a.count);

  // Prepare OS stats
  const osStats: OSStats[] = Object.entries(osCounts)
    .map(([os, count]) => ({
      os,
      count,
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Screen size stats
  const screenStats = Object.entries(screenSizes)
    .map(([size, count]) => ({
      size,
      count,
      percentage: totalEvents > 0 ? (count / totalEvents) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  if (totalEvents === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Device & Browser Analytics
          </CardTitle>
          <CardDescription>User agent breakdown and device statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Monitor className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p>No device data available yet</p>
            <p className="text-sm">Device analytics will appear as users visit the site</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Monitor className="h-6 w-6" />
            Device & Browser Analytics
          </h2>
          <p className="text-muted-foreground">
            Analyze user devices, browsers, and screen sizes
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
          <Radio className="h-3 w-3 mr-1 animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Device Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {deviceStats.map((stat, idx) => (
          <motion.div
            key={stat.device}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{stat.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">{stat.count} events</div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="font-medium">{stat.device}</div>
                  <Progress value={stat.percentage} className="h-2 mt-2" />
                </div>
              </CardContent>
              <motion.div 
                className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${stat.percentage}%` }}
                transition={{ delay: idx * 0.1 + 0.3, duration: 0.5 }}
              />
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Browser Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Browser Distribution
            </CardTitle>
            <CardDescription>Popular browsers used by visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {browserStats.map((stat, idx) => (
                <motion.div
                  key={stat.browser}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${stat.color}`} />
                      <span className="font-medium">{stat.browser}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{stat.count}</span>
                      <Badge variant="outline">{stat.percentage.toFixed(1)}%</Badge>
                    </div>
                  </div>
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute inset-y-0 left-0 ${stat.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.percentage}%` }}
                      transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operating System Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Operating System
            </CardTitle>
            <CardDescription>OS breakdown of visitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {osStats.map((stat, idx) => (
                <motion.div
                  key={stat.os}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-sm font-bold">
                      {stat.os.charAt(0)}
                    </div>
                    <span className="font-medium">{stat.os}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ delay: idx * 0.05 + 0.2, duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {stat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Screen Size Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Screen Size Distribution
          </CardTitle>
          <CardDescription>Viewport sizes of visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {screenStats.map((stat, idx) => (
              <motion.div
                key={stat.size}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg border bg-card text-center"
              >
                <div className="text-2xl font-bold text-primary">
                  {stat.percentage.toFixed(1)}%
                </div>
                <div className="text-sm font-medium mt-1">{stat.size}</div>
                <div className="text-xs text-muted-foreground">{stat.count} events</div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary">{totalEvents}</div>
          <div className="text-sm text-muted-foreground">Total Events</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-emerald-600">{uniqueSessions.size}</div>
          <div className="text-sm text-muted-foreground">Unique Sessions</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{browserStats.length}</div>
          <div className="text-sm text-muted-foreground">Browsers Detected</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{osStats.length}</div>
          <div className="text-sm text-muted-foreground">Operating Systems</div>
        </Card>
      </div>
    </div>
  );
};
