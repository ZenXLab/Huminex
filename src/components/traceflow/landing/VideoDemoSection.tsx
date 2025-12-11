import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Play, Eye, Brain, GitBranch, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

const demoFeatures = [
  { id: "replay", label: "Session Replay", icon: Eye, active: true },
  { id: "ai", label: "AI Summary", icon: Brain, active: false },
  { id: "causality", label: "Causality Graph", icon: GitBranch, active: false },
  { id: "ticket", label: "Ticket Creation", icon: Ticket, active: false },
];

export const VideoDemoSection = () => {
  const [activeFeature, setActiveFeature] = useState("replay");
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-[#0B3D91]/10 text-[#0B3D91] border-[#0B3D91]/20">
            See It In Action
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Experience <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent">TRACEFLOW</span> Live
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch how TRACEFLOW captures, analyzes, and resolves experience issues in real-time.
          </p>
        </div>

        {/* Video Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glassmorphic Frame */}
          <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl shadow-[#0B3D91]/10">
            {/* Video Header */}
            <div className="bg-gradient-to-r from-[#0B3D91]/90 to-[#00C2D8]/90 backdrop-blur px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-white/80 text-sm">TRACEFLOW Dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/80 text-xs">Live Demo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Content */}
            <div className="aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-[#0B3D91]/30 relative overflow-hidden">
              {/* Simulated Dashboard Content */}
              <div className="absolute inset-0 p-6">
                {/* Sidebar Mock */}
                <div className="absolute left-0 top-0 bottom-0 w-16 bg-slate-800/50 border-r border-white/10">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-8 h-8 mx-auto my-3 rounded-lg transition-all duration-300",
                        i === 0 ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8]" : "bg-white/10"
                      )}
                    />
                  ))}
                </div>

                {/* Main Content Area */}
                <div className="ml-20 h-full flex flex-col gap-4">
                  {/* Top Stats */}
                  <div className="flex gap-4">
                    {[
                      { label: "Sessions", value: "12,847" },
                      { label: "Errors", value: "23" },
                      { label: "Rage Clicks", value: "156" },
                    ].map((stat, i) => (
                      <div 
                        key={stat.label}
                        className="bg-white/5 backdrop-blur rounded-xl p-3 flex-1 animate-fade-in"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <p className="text-white/50 text-xs">{stat.label}</p>
                        <p className="text-white text-lg font-bold">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Session Replay Area */}
                  <div className="flex-1 bg-white/5 backdrop-blur rounded-xl p-4 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] flex items-center justify-center">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-medium text-sm">Session Replay</span>
                      <div className="ml-auto flex items-center gap-2 text-xs text-white/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Playing</span>
                      </div>
                    </div>
                    
                    {/* Fake Browser Window */}
                    <div className="bg-slate-900/50 rounded-lg h-[calc(100%-40px)] border border-white/10">
                      <div className="h-6 bg-slate-800/50 rounded-t-lg flex items-center px-2 gap-1">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      </div>
                      <div className="p-4 relative">
                        {/* Cursor animation */}
                        <div 
                          className="absolute w-4 h-4 border-2 border-[#FF8A00] rounded-full animate-bounce"
                          style={{ 
                            left: '40%', 
                            top: '60%',
                            animation: 'cursorMove 4s ease-in-out infinite'
                          }}
                        />
                        {/* Content blocks */}
                        <div className="h-4 w-32 bg-white/20 rounded mb-2" />
                        <div className="h-3 w-48 bg-white/10 rounded mb-2" />
                        <div className="h-3 w-40 bg-white/10 rounded mb-4" />
                        <div className="h-8 w-24 bg-[#FF8A00]/50 rounded animate-pulse" />
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Bar */}
                  <div className="bg-white/5 backdrop-blur rounded-xl p-3 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium text-sm">PROXIMA Analysis</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px] border-0">Complete</Badge>
                      </div>
                      <p className="text-white/50 text-xs">Rage click detected on checkout button — API timeout causing 68% abandonment</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Play Overlay */}
              {!isPlaying && (
                <div 
                  className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer"
                  onClick={() => setIsPlaying(true)}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {demoFeatures.map((feature) => {
              const Icon = feature.icon;
              const isActive = activeFeature === feature.id;

              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveFeature(feature.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] text-white shadow-lg"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{feature.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cursorMove {
          0%, 100% {
            left: 40%;
            top: 60%;
          }
          25% {
            left: 60%;
            top: 40%;
          }
          50% {
            left: 45%;
            top: 70%;
          }
          75% {
            left: 55%;
            top: 50%;
          }
        }
      `}</style>
    </section>
  );
};
