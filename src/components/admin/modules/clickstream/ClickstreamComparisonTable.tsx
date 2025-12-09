import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, X, Minus, Crown, Zap, Shield, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    category: "Core Tracking",
    items: [
      { feature: "Page View Tracking", atlas: true, glassbox: true, fullstory: true },
      { feature: "Click Tracking", atlas: true, glassbox: true, fullstory: true },
      { feature: "Scroll Depth Tracking", atlas: true, glassbox: true, fullstory: true },
      { feature: "Session Recording", atlas: true, glassbox: true, fullstory: true },
      { feature: "IP Geolocation", atlas: true, glassbox: true, fullstory: true },
      { feature: "User Identity Linking", atlas: true, glassbox: true, fullstory: true },
    ],
  },
  {
    category: "Struggle Detection",
    items: [
      { feature: "Rage Click Detection", atlas: true, glassbox: true, fullstory: true },
      { feature: "Dead Click Detection", atlas: true, glassbox: true, fullstory: true },
      { feature: "Form Abandonment Tracking", atlas: true, glassbox: true, fullstory: true },
      { feature: "AI-Powered Analysis", atlas: true, glassbox: true, fullstory: true },
      { feature: "Real-time Alerts", atlas: true, glassbox: true, fullstory: true },
      { feature: "Frustration Score", atlas: true, glassbox: true, fullstory: "partial" },
    ],
  },
  {
    category: "Form Analytics",
    items: [
      { feature: "Field-Level Tracking", atlas: true, glassbox: true, fullstory: true },
      { feature: "Time Spent Per Field", atlas: true, glassbox: true, fullstory: true },
      { feature: "Field Error Rate", atlas: true, glassbox: true, fullstory: true },
      { feature: "Field Abandonment Rate", atlas: true, glassbox: true, fullstory: "partial" },
      { feature: "Form Completion Funnel", atlas: true, glassbox: true, fullstory: true },
      { feature: "Input Validation Insights", atlas: true, glassbox: true, fullstory: "partial" },
    ],
  },
  {
    category: "Advanced Analytics",
    items: [
      { feature: "Conversion Funnels", atlas: true, glassbox: true, fullstory: true },
      { feature: "User Journey Mapping", atlas: true, glassbox: true, fullstory: true },
      { feature: "Heatmaps", atlas: true, glassbox: true, fullstory: true },
      { feature: "A/B Test Integration", atlas: true, glassbox: true, fullstory: true },
      { feature: "Revenue Attribution", atlas: false, glassbox: true, fullstory: true },
      { feature: "Predictive Analytics", atlas: true, glassbox: true, fullstory: "partial" },
    ],
  },
  {
    category: "Data & Privacy",
    items: [
      { feature: "Self-Hosted Option", atlas: true, glassbox: false, fullstory: false },
      { feature: "Full Data Ownership", atlas: true, glassbox: false, fullstory: false },
      { feature: "GDPR Compliance", atlas: true, glassbox: true, fullstory: true },
      { feature: "Data Masking", atlas: true, glassbox: true, fullstory: true },
      { feature: "Privacy Controls", atlas: true, glassbox: true, fullstory: true },
      { feature: "Custom Retention Policies", atlas: true, glassbox: "partial", fullstory: "partial" },
    ],
  },
  {
    category: "Integration & Customization",
    items: [
      { feature: "Native Platform Integration", atlas: true, glassbox: false, fullstory: false },
      { feature: "API Access", atlas: true, glassbox: true, fullstory: true },
      { feature: "Webhook Support", atlas: true, glassbox: true, fullstory: true },
      { feature: "Custom Events", atlas: true, glassbox: true, fullstory: true },
      { feature: "White-Label Option", atlas: true, glassbox: "partial", fullstory: false },
      { feature: "Source Code Access", atlas: true, glassbox: false, fullstory: false },
    ],
  },
];

const renderStatus = (status: boolean | string) => {
  if (status === true) {
    return <Check className="h-5 w-5 text-green-600" />;
  }
  if (status === false) {
    return <X className="h-5 w-5 text-red-500" />;
  }
  if (status === "partial") {
    return <Minus className="h-5 w-5 text-amber-500" />;
  }
  return null;
};

export const ClickstreamComparisonTable = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">ATLAS ClickStream vs Industry Leaders</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          See how ATLAS's built-in analytics compares to enterprise solutions like Glassbox and FullStory
        </p>
      </div>

      {/* Pricing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-primary border-2 relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Badge className="rounded-none rounded-bl-lg">INCLUDED</Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                ATLAS ClickStream
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">$0</p>
              <p className="text-sm text-muted-foreground">Included with ATLAS</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Self-hosted, full data ownership</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-amber-600" />
                  <span>AI-powered insights included</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Glassbox</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$50k+</p>
              <p className="text-sm text-muted-foreground">Per year (enterprise)</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  <span>Session-based pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-red-500" />
                  <span>No self-hosting option</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">FullStory</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$30k+</p>
              <p className="text-sm text-muted-foreground">Per year (business)</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-amber-600" />
                  <span>Session-based pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-red-500" />
                  <span>No self-hosting option</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Feature Comparison */}
      {features.map((category, categoryIdx) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIdx * 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category.category}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[200px]">Feature</TableHead>
                      <TableHead className="text-center w-[120px]">
                        <div className="flex items-center justify-center gap-1">
                          <Crown className="h-4 w-4 text-primary" />
                          ATLAS
                        </div>
                      </TableHead>
                      <TableHead className="text-center w-[120px]">Glassbox</TableHead>
                      <TableHead className="text-center w-[120px]">FullStory</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {category.items.map((item) => (
                      <TableRow key={item.feature}>
                        <TableCell className="font-medium">{item.feature}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">{renderStatus(item.atlas)}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">{renderStatus(item.glassbox)}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center">{renderStatus(item.fullstory)}</div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-green-600" />
          <span>Full Support</span>
        </div>
        <div className="flex items-center gap-2">
          <Minus className="h-4 w-4 text-amber-500" />
          <span>Partial Support</span>
        </div>
        <div className="flex items-center gap-2">
          <X className="h-4 w-4 text-red-500" />
          <span>Not Available</span>
        </div>
      </div>

      {/* Key Differentiators */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            Why ATLAS ClickStream?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                Data Sovereignty
              </h4>
              <p className="text-sm text-muted-foreground">
                Your data stays in your infrastructure. No third-party data processing or storage concerns.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Zero Additional Cost
              </h4>
              <p className="text-sm text-muted-foreground">
                Included with ATLAS platform. No per-session pricing that scales unpredictably.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-600" />
                Native Integration
              </h4>
              <p className="text-sm text-muted-foreground">
                Seamlessly integrated with ATLAS workflows, users, and operational data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
