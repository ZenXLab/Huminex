import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Construction, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { type LucideIcon } from "lucide-react";

interface AdminPlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  comingSoon?: boolean;
}

export const AdminPlaceholderPage = ({ 
  title, 
  description, 
  icon: Icon,
  features = [],
  comingSoon = true 
}: AdminPlaceholderPageProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
              {title}
              {comingSoon && (
                <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <Link to="/admin">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Content */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Construction className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Module Under Development</h2>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            This module is currently being built. Check back soon for full functionality.
          </p>
          
          {features.length > 0 && (
            <div className="w-full max-w-md">
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Planned Features
              </h3>
              <div className="grid gap-2">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};