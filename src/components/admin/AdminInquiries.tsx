import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Phone, Building } from "lucide-react";

export const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const { data, error } = await supabase
          .from('inquiries')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInquiries(data || []);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        toast.error('Failed to load inquiries');
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Inquiries</h1>
        <p className="text-muted-foreground">View and manage contact inquiries from the website</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries ({inquiries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No inquiries yet</p>
          ) : (
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <div 
                  key={inquiry.id} 
                  className="p-6 bg-muted/30 rounded-xl border border-border"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground">{inquiry.name}</h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {inquiry.email}
                        </span>
                        {inquiry.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {inquiry.phone}
                          </span>
                        )}
                        {inquiry.company && (
                          <span className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {inquiry.company}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {inquiry.service_interest && (
                        <Badge variant="secondary">{inquiry.service_interest}</Badge>
                      )}
                      <Badge variant="outline">{inquiry.source}</Badge>
                    </div>
                  </div>

                  {inquiry.message && (
                    <div className="pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-1">Message</p>
                      <p className="text-foreground">{inquiry.message}</p>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-muted-foreground">
                    Received on {new Date(inquiry.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
