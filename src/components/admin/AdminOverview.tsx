import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Receipt, Users, MessageSquare, TrendingUp, Clock } from "lucide-react";

export const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalQuotes: 0,
    pendingQuotes: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalInquiries: 0,
  });
  const [recentQuotes, setRecentQuotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch quotes
        const { data: quotes } = await supabase.from('quotes').select('*');
        const pendingQuotes = quotes?.filter(q => q.status === 'pending') || [];

        // Fetch invoices
        const { data: invoices } = await supabase.from('invoices').select('*');
        const paidInvoices = invoices?.filter(i => i.status === 'paid') || [];
        const totalRevenue = paidInvoices.reduce((sum, i) => sum + Number(i.total_amount), 0);

        // Fetch users
        const { data: users } = await supabase.from('profiles').select('id');

        // Fetch inquiries
        const { data: inquiries } = await supabase.from('inquiries').select('id');

        // Recent quotes
        const { data: recent } = await supabase
          .from('quotes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalQuotes: quotes?.length || 0,
          pendingQuotes: pendingQuotes.length,
          totalInvoices: invoices?.length || 0,
          totalRevenue,
          totalUsers: users?.length || 0,
          totalInquiries: inquiries?.length || 0,
        });
        setRecentQuotes(recent || []);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Quotes", value: stats.totalQuotes, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
    { title: "Pending Quotes", value: stats.pendingQuotes, icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
    { title: "Total Invoices", value: stats.totalInvoices, icon: Receipt, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
    { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
    { title: "Inquiries", value: stats.totalInquiries, icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-100" },
  ];

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl" />
        ))}
      </div>
    </div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Admin Overview</h1>
        <p className="text-muted-foreground">Monitor your business performance at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Quotes */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentQuotes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No quotes yet</p>
          ) : (
            <div className="space-y-4">
              {recentQuotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{quote.quote_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {quote.contact_name} • {quote.service_type.replace('-', ' ')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">₹{Number(quote.final_price).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground capitalize">{quote.status}</p>
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
