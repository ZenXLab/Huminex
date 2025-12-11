import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Lock,
  Fingerprint,
  Key,
  Users,
  Globe,
  FileCheck,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

const securityFeatures = [
  {
    icon: Fingerprint,
    title: "Dual WebAuthn",
    description: "TouchID & FaceID with hardware key backup",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Shield,
    title: "Zero-PII Ingestion",
    description: "Local tokenization before cloud transit",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Key,
    title: "Customer-Managed Keys",
    description: "BYOK encryption for sensitive data",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "RBAC + Governance",
    description: "Granular role-based access control",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Globe,
    title: "Data Residency",
    description: "Multi-region deployment controls",
    color: "from-indigo-500 to-violet-500",
  },
  {
    icon: FileCheck,
    title: "SOC2 + ISO Ready",
    description: "Enterprise compliance roadmap",
    color: "from-rose-500 to-red-500",
  },
];

export const SecuritySection = () => {
  return (
    <section className="py-16 lg:py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            currentColor 10px,
            currentColor 11px
          )`
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            Enterprise Security
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Zero-Trust <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">Security Architecture</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built for BFSI, healthcare, and government — security is not an afterthought.
          </p>
        </div>

        {/* Security Visualization */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Security Diagram */}
          <div className="relative">
            <div className="bg-card border border-border rounded-2xl p-8 relative overflow-hidden">
              {/* Animated Lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                <defs>
                  <linearGradient id="secGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0B3D91" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00C2D8" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Connection lines */}
                <path
                  d="M 50,150 Q 150,100 250,150"
                  stroke="url(#secGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                  style={{ animationDuration: '3s' }}
                />
                <path
                  d="M 250,150 Q 350,200 450,150"
                  stroke="url(#secGradient)"
                  strokeWidth="2"
                  fill="none"
                  className="animate-pulse"
                  style={{ animationDuration: '3.5s' }}
                />
              </svg>

              {/* Security Flow */}
              <div className="relative z-10 space-y-6">
                {/* SDK Layer */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Server className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">SDK Capture</p>
                    <p className="text-sm text-muted-foreground">Client-side data collection</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-500/10 rounded-lg">
                    <span className="text-xs font-medium text-blue-600">Encrypted</span>
                  </div>
                </div>

                {/* Tokenization */}
                <div className="flex items-center gap-4 ml-8">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-emerald-500" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">PII Tokenization</p>
                    <p className="text-sm text-muted-foreground">Local redaction engine</p>
                  </div>
                  <div className="px-3 py-1 bg-emerald-500/10 rounded-lg animate-pulse">
                    <span className="text-xs font-medium text-emerald-600">Zero-PII</span>
                  </div>
                </div>

                {/* Cloud Transit */}
                <div className="flex items-center gap-4 ml-8">
                  <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-purple-500" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">Secure Transit</p>
                    <p className="text-sm text-muted-foreground">mTLS + customer-managed keys</p>
                  </div>
                  <div className="px-3 py-1 bg-purple-500/10 rounded-lg">
                    <span className="text-xs font-medium text-purple-600">BYOK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={cn(
                    "group bg-card border border-border rounded-xl p-4 transition-all duration-300 hover:border-[#00C2D8] hover:shadow-lg hover:-translate-y-1",
                    index === 0 && "col-span-2"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg bg-gradient-to-r flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110",
                    feature.color
                  )}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
