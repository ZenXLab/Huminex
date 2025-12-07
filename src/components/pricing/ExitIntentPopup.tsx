import { useState } from "react";
import { X, Gift, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExitIntentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitIntentPopup = ({ isOpen, onClose }: ExitIntentPopupProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // Save lead
      await supabase.from("leads").insert({
        name,
        email,
        source: "exit_intent_pricing",
        status: "new",
      });

      // Trigger email
      await supabase.functions.invoke("send-quote-followup", {
        body: { name, email, type: "exit_intent" }
      });

      toast.success("Check your inbox for an exclusive offer!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent p-8 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-primary-foreground/70 hover:text-primary-foreground"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-primary-foreground" />
          </div>
          
          <h2 className="text-2xl font-heading font-bold text-primary-foreground mb-2">
            Wait! Before You Go...
          </h2>
          <p className="text-primary-foreground/80">
            Get an exclusive 15% discount on your first 3 months
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Claim My Discount
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={onClose}
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              No thanks, I'll pay full price
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            🔒 We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
