import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { securityData, featureMatrixStatus } from "@/lib/traceflowDemoData";
import { FeatureModuleCard } from "./FeatureModuleCard";
import { 
  Shield, 
  Lock, 
  Key, 
  FileCheck, 
  Eye,
  Check,
  Clock,
  AlertTriangle,
  Globe,
  Server
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SecurityComplianceModule = () => {
  return (
    <FeatureModuleCard
      id="security-compliance"
      title="Security & Compliance"
      description="Enterprise-grade security with zero-PII architecture and compliance frameworks"
      icon={<Shield className="h-5 w-5 text-blue-500" />}
      category="I"
      featureId="security-compliance-module"
      stats={securityData.stats}
      status={featureMatrixStatus['I']}
      accentColor="blue"
    >
      <div className="space-y-4">
        {/* Compliance Frameworks */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Compliance Certifications
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {securityData.compliance.map((cert, idx) => (
              <motion.div
                key={cert.framework}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-3 rounded-lg border",
                  cert.status === 'certified' && "bg-emerald-500/5 border-emerald-500/20",
                  cert.status === 'compliant' && "bg-blue-500/5 border-blue-500/20",
                  cert.status === 'in-progress' && "bg-amber-500/5 border-amber-500/20"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">{cert.framework}</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[9px] h-4",
                      cert.status === 'certified' && "text-emerald-600 border-emerald-500/30",
                      cert.status === 'compliant' && "text-blue-600 border-blue-500/30",
                      cert.status === 'in-progress' && "text-amber-600 border-amber-500/30"
                    )}
                  >
                    {cert.status === 'certified' && <Check className="h-2.5 w-2.5 mr-1" />}
                    {cert.status === 'in-progress' && <Clock className="h-2.5 w-2.5 mr-1" />}
                    {cert.status}
                  </Badge>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {cert.lastAudit !== 'N/A' && (
                    <p>Last Audit: {cert.lastAudit}</p>
                  )}
                  <p>Next: {cert.nextAudit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Security Features
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {securityData.securityFeatures.map((feature, idx) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center justify-between p-2 rounded-lg bg-blue-500/5 border border-blue-500/10"
              >
                <div className="flex items-center gap-2">
                  <Lock className="h-3 w-3 text-blue-500" />
                  <div>
                    <span className="text-[11px] font-medium">{feature.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-2">{feature.description}</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Audit Trail */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Audit Trail
            </h4>
            <Button variant="ghost" size="sm" className="h-5 text-[10px]">
              View All
            </Button>
          </div>
          <ScrollArea className="h-24">
            <div className="space-y-1">
              {securityData.recentAudits.map((audit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <div>
                      <span className="text-[11px] font-medium">{audit.action}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">by {audit.user}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{audit.timestamp}</span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </FeatureModuleCard>
  );
};
