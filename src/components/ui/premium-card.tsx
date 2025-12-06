import * as React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  title?: string;
  description?: string;
  glowColor?: "purple" | "cyan" | "pink" | "emerald" | "default";
  variant?: "default" | "glass" | "outlined" | "elevated";
  hoverable?: boolean;
}

const glowColors = {
  purple: "group-hover:shadow-[0_0_30px_hsl(262_83%_58%/0.25)]",
  cyan: "group-hover:shadow-[0_0_30px_hsl(188_94%_43%/0.25)]",
  pink: "group-hover:shadow-[0_0_30px_hsl(330_81%_60%/0.25)]",
  emerald: "group-hover:shadow-[0_0_30px_hsl(160_84%_39%/0.25)]",
  default: "group-hover:shadow-elevated",
};

const borderGlowColors = {
  purple: "group-hover:border-[hsl(262_83%_58%/0.5)]",
  cyan: "group-hover:border-[hsl(188_94%_43%/0.5)]",
  pink: "group-hover:border-[hsl(330_81%_60%/0.5)]",
  emerald: "group-hover:border-[hsl(160_84%_39%/0.5)]",
  default: "group-hover:border-primary/30",
};

const PremiumCard = React.forwardRef<HTMLDivElement, PremiumCardProps>(
  ({ 
    className, 
    children, 
    icon: Icon, 
    iconColor = "text-primary",
    iconBg = "bg-primary/10",
    title, 
    description,
    glowColor = "default",
    variant = "default",
    hoverable = true,
    ...props 
  }, ref) => {
    const baseStyles = "relative rounded-2xl transition-all duration-300";
    
    const variantStyles = {
      default: "bg-card border border-border/60 shadow-card",
      glass: "bg-card/80 backdrop-blur-xl border border-border/40",
      outlined: "bg-transparent border border-border/60",
      elevated: "bg-card shadow-elevated border border-border/40",
    };

    const hoverStyles = hoverable ? cn(
      "group cursor-pointer",
      "hover:-translate-y-1",
      glowColors[glowColor],
      borderGlowColors[glowColor]
    ) : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          hoverStyles,
          className
        )}
        {...props}
      >
        {(Icon || title || description) && (
          <div className="p-6">
            {Icon && (
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300",
                iconBg,
                hoverable && "group-hover:scale-110"
              )}>
                <Icon className={cn("w-6 h-6", iconColor)} strokeWidth={1.5} />
              </div>
            )}
            {title && (
              <h3 className="text-base font-heading font-semibold text-foreground mb-1.5 tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    );
  }
);
PremiumCard.displayName = "PremiumCard";

interface PremiumCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardHeader = React.forwardRef<HTMLDivElement, PremiumCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pb-0", className)}
      {...props}
    />
  )
);
PremiumCardHeader.displayName = "PremiumCardHeader";

interface PremiumCardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardContent = React.forwardRef<HTMLDivElement, PremiumCardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6", className)}
      {...props}
    />
  )
);
PremiumCardContent.displayName = "PremiumCardContent";

interface PremiumCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const PremiumCardFooter = React.forwardRef<HTMLDivElement, PremiumCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0 flex items-center", className)}
      {...props}
    />
  )
);
PremiumCardFooter.displayName = "PremiumCardFooter";

export { PremiumCard, PremiumCardHeader, PremiumCardContent, PremiumCardFooter };
