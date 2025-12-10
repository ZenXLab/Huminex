import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getFeatureStageById, getFeatureBadgeStyles, getDaysUntilNextStage, featureReleases } from "@/lib/featureLifecycle";
import { cn } from "@/lib/utils";
import { Sparkles, FlaskConical } from "lucide-react";

interface FeatureBadgeProps {
  featureId: string;
  className?: string;
  showTooltip?: boolean;
}

/**
 * Automatic Feature Badge Component
 * Displays Beta (0-14 days) → New (15-30 days) → Nothing (>30 days)
 */
export const FeatureBadge = ({ featureId, className, showTooltip = true }: FeatureBadgeProps) => {
  const stage = getFeatureStageById(featureId);
  const styles = getFeatureBadgeStyles(stage);
  
  if (!styles) return null;
  
  const feature = featureReleases.find(f => f.id === featureId);
  const daysRemaining = feature ? getDaysUntilNextStage(feature.releaseDate) : null;
  
  const badge = (
    <Badge 
      variant="outline" 
      className={cn(
        "text-[10px] px-1.5 py-0 h-4 gap-1 font-medium",
        styles.className,
        className
      )}
    >
      {stage === 'beta' ? (
        <FlaskConical className="h-2.5 w-2.5" />
      ) : (
        <Sparkles className="h-2.5 w-2.5" />
      )}
      {styles.label}
    </Badge>
  );

  if (!showTooltip) return badge;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {badge}
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <p className="font-medium">
          {stage === 'beta' ? 'Beta Feature' : 'Newly Released'}
        </p>
        {daysRemaining !== null && (
          <p className="text-muted-foreground">
            {stage === 'beta' 
              ? `${daysRemaining} days until "New" status`
              : `Badge expires in ${daysRemaining} days`
            }
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};

/**
 * Inline feature stage indicator for cards/modules
 */
interface FeatureStageIndicatorProps {
  featureId: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FeatureStageIndicator = ({ featureId, size = 'sm' }: FeatureStageIndicatorProps) => {
  const stage = getFeatureStageById(featureId);
  const styles = getFeatureBadgeStyles(stage);
  
  if (!styles) return null;

  const sizeClasses = {
    sm: "text-[9px] px-1 py-0 h-3.5",
    md: "text-[10px] px-1.5 py-0 h-4",
    lg: "text-xs px-2 py-0.5 h-5"
  };

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "gap-0.5 font-medium shrink-0",
        sizeClasses[size],
        styles.className
      )}
    >
      {stage === 'beta' ? (
        <FlaskConical className={cn(size === 'sm' ? "h-2 w-2" : size === 'md' ? "h-2.5 w-2.5" : "h-3 w-3")} />
      ) : (
        <Sparkles className={cn(size === 'sm' ? "h-2 w-2" : size === 'md' ? "h-2.5 w-2.5" : "h-3 w-3")} />
      )}
      {styles.label}
    </Badge>
  );
};
