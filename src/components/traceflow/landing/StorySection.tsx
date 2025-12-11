import { Badge } from "@/components/ui/badge";

export const StorySection = () => {
  return (
    <section className="py-16 lg:py-24 bg-muted/30 relative overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #0B3D91 0%, transparent 50%),
                           radial-gradient(circle at 80% 50%, #00C2D8 0%, transparent 50%)`,
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <Badge className="mb-6 bg-[#FF8A00]/10 text-[#FF8A00] border-[#FF8A00]/20">
          Our Mission
        </Badge>

        <blockquote className="space-y-6">
          <p className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-relaxed">
            <span className="text-muted-foreground">"</span>
            Digital experience analytics is{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">broken</span>.
            <br />
            Security is{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">broken</span>.
            <br />
            Observability is{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">siloed</span>.
            <span className="text-muted-foreground">"</span>
          </p>

          <div className="w-24 h-1 bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] mx-auto rounded-full" />

          <p className="text-xl lg:text-2xl font-medium text-foreground">
            TRACEFLOW unifies all of it inside a{" "}
            <span className="bg-gradient-to-r from-[#0B3D91] to-[#00C2D8] bg-clip-text text-transparent font-bold">
              Zero-Trust DXI Operating System
            </span>.
          </p>
        </blockquote>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-8 w-2 h-2 rounded-full bg-[#0B3D91] animate-pulse" />
        <div className="absolute top-3/4 left-16 w-3 h-3 rounded-full bg-[#00C2D8] animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-12 w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 right-8 w-3 h-3 rounded-full bg-[#0B3D91] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </section>
  );
};
