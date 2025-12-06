import Lottie from "lottie-react";

// Custom Lottie-style animated components for each pillar
// Since we don't have actual Lottie JSON files, we'll create animated SVG components

export const CodeAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Terminal window */}
      <rect x="20" y="30" width="160" height="120" rx="8" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" className="animate-pulse-glow" />
      <rect x="20" y="30" width="160" height="20" rx="8" fill="hsl(186 64% 18%)" />
      <circle cx="35" cy="40" r="4" fill="hsl(0 84% 60%)" />
      <circle cx="50" cy="40" r="4" fill="hsl(45 100% 50%)" />
      <circle cx="65" cy="40" r="4" fill="hsl(120 60% 50%)" />
      
      {/* Code lines with animation */}
      <g className="animate-pulse" style={{ animationDelay: '0s' }}>
        <rect x="35" y="65" width="60" height="6" rx="3" fill="hsl(180 85% 63%)" opacity="0.8" />
      </g>
      <g className="animate-pulse" style={{ animationDelay: '0.2s' }}>
        <rect x="45" y="80" width="80" height="6" rx="3" fill="hsl(180 100% 33%)" opacity="0.6" />
      </g>
      <g className="animate-pulse" style={{ animationDelay: '0.4s' }}>
        <rect x="45" y="95" width="50" height="6" rx="3" fill="hsl(180 85% 63%)" opacity="0.8" />
      </g>
      <g className="animate-pulse" style={{ animationDelay: '0.6s' }}>
        <rect x="35" y="110" width="70" height="6" rx="3" fill="hsl(180 100% 33%)" opacity="0.6" />
      </g>
      <g className="animate-pulse" style={{ animationDelay: '0.8s' }}>
        <rect x="35" y="125" width="40" height="6" rx="3" fill="hsl(180 85% 63%)" opacity="0.8" />
      </g>
    </svg>
  </div>
);

export const AIBrainAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Brain outline */}
      <ellipse cx="100" cy="100" rx="60" ry="55" fill="none" stroke="hsl(180 100% 33%)" strokeWidth="2" className="animate-pulse-glow" />
      
      {/* Neural network nodes */}
      {[
        { cx: 70, cy: 70 }, { cx: 130, cy: 70 },
        { cx: 60, cy: 100 }, { cx: 100, cy: 85 }, { cx: 140, cy: 100 },
        { cx: 70, cy: 130 }, { cx: 100, cy: 115 }, { cx: 130, cy: 130 },
      ].map((node, i) => (
        <g key={i}>
          <circle cx={node.cx} cy={node.cy} r="8" fill="hsl(185 100% 12%)" stroke="hsl(180 85% 63%)" strokeWidth="2" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
          <circle cx={node.cx} cy={node.cy} r="4" fill="hsl(180 85% 63%)" className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
        </g>
      ))}
      
      {/* Connections */}
      <g stroke="hsl(180 100% 33%)" strokeWidth="1" opacity="0.5" className="animate-network">
        <line x1="70" y1="70" x2="100" y2="85" />
        <line x1="130" y1="70" x2="100" y2="85" />
        <line x1="60" y1="100" x2="100" y2="85" />
        <line x1="140" y1="100" x2="100" y2="85" />
        <line x1="100" y1="85" x2="100" y2="115" />
        <line x1="70" y1="130" x2="100" y2="115" />
        <line x1="130" y1="130" x2="100" y2="115" />
        <line x1="60" y1="100" x2="70" y2="130" />
        <line x1="140" y1="100" x2="130" y2="130" />
      </g>
    </svg>
  </div>
);

export const DesignAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Canvas */}
      <rect x="30" y="30" width="140" height="140" rx="8" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
      
      {/* Abstract shapes */}
      <circle cx="70" cy="80" r="25" fill="hsl(180 100% 33%)" opacity="0.6" className="animate-float" />
      <rect x="100" y="60" width="50" height="50" rx="4" fill="hsl(180 85% 63%)" opacity="0.5" className="animate-float" style={{ animationDelay: '1s' }} />
      <polygon points="80,130 100,100 120,130" fill="hsl(180 100% 33%)" opacity="0.7" className="animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Cursor */}
      <g className="animate-float" style={{ animationDelay: '0.5s' }}>
        <path d="M140 120 L150 150 L143 143 L150 160 L145 162 L138 145 L130 150 Z" fill="hsl(180 85% 63%)" />
      </g>
    </svg>
  </div>
);

export const CloudAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Main cloud */}
      <path d="M50 120 Q30 120 30 100 Q30 80 50 80 Q55 60 80 60 Q100 40 130 60 Q160 55 170 80 Q190 85 180 110 Q185 130 160 130 Z" 
            fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" className="animate-pulse-glow" />
      
      {/* Server nodes inside cloud */}
      <rect x="60" y="85" width="30" height="25" rx="3" fill="hsl(186 64% 18%)" stroke="hsl(180 85% 63%)" strokeWidth="1" className="animate-pulse" />
      <rect x="100" y="85" width="30" height="25" rx="3" fill="hsl(186 64% 18%)" stroke="hsl(180 85% 63%)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
      <rect x="140" y="85" width="25" height="25" rx="3" fill="hsl(186 64% 18%)" stroke="hsl(180 85% 63%)" strokeWidth="1" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
      
      {/* Connection arrows */}
      <path d="M100 140 L100 160 M90 150 L100 160 L110 150" stroke="hsl(180 85% 63%)" strokeWidth="2" fill="none" className="animate-pulse" />
      <path d="M60 140 L60 155 M50 145 L60 155 L70 145" stroke="hsl(180 100% 33%)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
      <path d="M140 140 L140 155 M130 145 L140 155 L150 145" stroke="hsl(180 100% 33%)" strokeWidth="2" fill="none" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
    </svg>
  </div>
);

export const ConsultingAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Chart background */}
      <rect x="30" y="40" width="140" height="100" rx="4" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
      
      {/* Bar chart */}
      <rect x="50" y="100" width="20" height="30" fill="hsl(180 100% 33%)" className="animate-pulse" />
      <rect x="80" y="80" width="20" height="50" fill="hsl(180 85% 63%)" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
      <rect x="110" y="60" width="20" height="70" fill="hsl(180 100% 33%)" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
      <rect x="140" y="50" width="20" height="80" fill="hsl(180 85% 63%)" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
      
      {/* Trend line */}
      <path d="M55 95 L95 75 L125 55 L155 45" stroke="hsl(180 85% 63%)" strokeWidth="3" fill="none" strokeLinecap="round" className="animate-pulse-glow" />
      
      {/* Briefcase icon below */}
      <rect x="80" y="155" width="40" height="30" rx="4" fill="hsl(186 64% 18%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
      <rect x="90" y="150" width="20" height="8" rx="2" fill="hsl(186 64% 18%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
    </svg>
  </div>
);

export const SupportAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Shield outline */}
      <path d="M100 30 L160 50 L160 100 Q160 150 100 175 Q40 150 40 100 L40 50 Z" 
            fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" className="animate-pulse-glow" />
      
      {/* Headset icon */}
      <path d="M75 100 Q75 70 100 70 Q125 70 125 100" stroke="hsl(180 85% 63%)" strokeWidth="4" fill="none" />
      <rect x="65" y="95" width="15" height="25" rx="5" fill="hsl(180 85% 63%)" />
      <rect x="120" y="95" width="15" height="25" rx="5" fill="hsl(180 85% 63%)" />
      <path d="M80 120 Q80 135 100 135" stroke="hsl(180 100% 33%)" strokeWidth="3" fill="none" />
      
      {/* 24/7 text */}
      <text x="100" y="160" textAnchor="middle" fill="hsl(180 85% 63%)" fontSize="14" fontWeight="bold" className="animate-pulse">24/7</text>
    </svg>
  </div>
);

export const SecurityAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Shield */}
      <path d="M100 25 L165 50 L165 105 Q165 160 100 180 Q35 160 35 105 L35 50 Z" 
            fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="3" className="animate-pulse-glow" />
      
      {/* Lock */}
      <rect x="75" y="95" width="50" height="40" rx="5" fill="hsl(186 64% 18%)" stroke="hsl(180 85% 63%)" strokeWidth="2" />
      <path d="M85 95 L85 80 Q85 65 100 65 Q115 65 115 80 L115 95" stroke="hsl(180 85% 63%)" strokeWidth="3" fill="none" />
      <circle cx="100" cy="115" r="8" fill="hsl(180 85% 63%)" className="animate-pulse" />
      <rect x="98" y="115" width="4" height="12" fill="hsl(180 85% 63%)" />
      
      {/* Check mark */}
      <path d="M85 50 L95 60 L115 40" stroke="hsl(180 85% 63%)" strokeWidth="4" fill="none" strokeLinecap="round" className="animate-pulse" />
    </svg>
  </div>
);

export const IndustryAnimation = () => (
  <div className="relative w-48 h-48">
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Grid of industry icons */}
      <g className="animate-pulse" style={{ animationDelay: '0s' }}>
        <rect x="35" y="35" width="50" height="50" rx="8" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
        <path d="M50 65 L60 50 L70 65 L60 70 Z" fill="hsl(180 85% 63%)" />
      </g>
      
      <g className="animate-pulse" style={{ animationDelay: '0.2s' }}>
        <rect x="115" y="35" width="50" height="50" rx="8" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
        <circle cx="140" cy="60" r="15" fill="none" stroke="hsl(180 85% 63%)" strokeWidth="2" />
        <path d="M140 50 L140 60 L148 65" stroke="hsl(180 85% 63%)" strokeWidth="2" />
      </g>
      
      <g className="animate-pulse" style={{ animationDelay: '0.4s' }}>
        <rect x="35" y="115" width="50" height="50" rx="8" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
        <rect x="45" y="130" width="30" height="25" rx="3" fill="hsl(180 85% 63%)" />
        <rect x="50" y="125" width="20" height="8" rx="2" fill="hsl(180 85% 63%)" />
      </g>
      
      <g className="animate-pulse" style={{ animationDelay: '0.6s' }}>
        <rect x="115" y="115" width="50" height="50" rx="8" fill="hsl(185 100% 12%)" stroke="hsl(180 100% 33%)" strokeWidth="2" />
        <path d="M130 150 L140 130 L150 150 M140 150 L140 140" stroke="hsl(180 85% 63%)" strokeWidth="2" fill="none" />
      </g>
      
      {/* Center connection */}
      <circle cx="100" cy="100" r="15" fill="hsl(180 100% 33%)" className="animate-pulse-glow" />
      <line x1="85" y1="85" x2="70" y2="70" stroke="hsl(180 100% 33%)" strokeWidth="2" opacity="0.5" />
      <line x1="115" y1="85" x2="130" y2="70" stroke="hsl(180 100% 33%)" strokeWidth="2" opacity="0.5" />
      <line x1="85" y1="115" x2="70" y2="130" stroke="hsl(180 100% 33%)" strokeWidth="2" opacity="0.5" />
      <line x1="115" y1="115" x2="130" y2="130" stroke="hsl(180 100% 33%)" strokeWidth="2" opacity="0.5" />
    </svg>
  </div>
);
