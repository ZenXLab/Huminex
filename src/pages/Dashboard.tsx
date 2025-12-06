import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  FileText, 
  Receipt, 
  User, 
  Settings, 
  Loader2, 
  Download, 
  Home,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  ChevronRight,
  Phone,
  Mail,
  Building
} from "lucide-react";
import { toast } from "sonner";
import cropxonIcon from "@/assets/cropxon-icon.png";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  approved: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  converted: "bg-blue-100 text-blue-800 border-blue-200",
  draft: "bg-slate-100 text-slate-800 border-slate-200",
  sent: "bg-blue-100 text-blue-800 border-blue-200",
  paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
  overdue: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-slate-100 text-slate-800 border-slate-200",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'invoices' | 'profile'>('overview');
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: quotesData, error: quotesError } = await supabase
          .from('quotes')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (quotesError) throw quotesError;
        setQuotes(quotesData || []);

        const { data: invoicesData, error: invoicesError } = await supabase
          .from('invoices')
          .select('*, quotes(quote_number, service_type)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (invoicesError) throw invoicesError;
        setInvoices(invoicesData || []);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') throw profileError;
        setProfile(profileData);

      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleDownloadInvoice = async (invoice: any) => {
    setDownloadingInvoice(invoice.id);
    try {
      const invoiceData = {
        invoice_number: invoice.invoice_number,
        amount: invoice.amount,
        tax_amount: invoice.tax_amount,
        tax_percent: invoice.tax_percent || 18,
        total_amount: invoice.total_amount,
        status: invoice.status,
        due_date: invoice.due_date,
        created_at: invoice.created_at,
        notes: invoice.notes,
        client_name: profile?.full_name || user?.email || 'Customer',
        client_email: profile?.email || user?.email || '',
        client_company: profile?.company_name,
        client_phone: profile?.phone,
        quote_number: invoice.quotes?.quote_number,
        service_type: invoice.quotes?.service_type,
      };

      const response = await supabase.functions.invoke('generate-invoice-pdf', {
        body: invoiceData,
      });

      if (response.error) throw response.error;

      // Open HTML in new window for printing/saving as PDF
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(response.data);
        printWindow.document.close();
        toast.success('Invoice opened - use Print (Ctrl+P) to save as PDF');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    } finally {
      setDownloadingInvoice(null);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.get('full_name') as string,
          company_name: formData.get('company_name') as string,
          phone: formData.get('phone') as string,
        })
        .eq('id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      
      // Refresh profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      setProfile(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    totalQuotes: quotes.length,
    pendingQuotes: quotes.filter(q => q.status === 'pending').length,
    approvedQuotes: quotes.filter(q => q.status === 'approved').length,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(i => i.status === 'paid').length,
    totalPaid: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.total_amount), 0),
    pendingPayment: invoices.filter(i => i.status === 'sent' || i.status === 'overdue').reduce((sum, i) => sum + Number(i.total_amount), 0),
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <img src={cropxonIcon} alt="CropXon" className="h-10 w-10" />
            <div>
              <span className="text-foreground font-heading font-bold">CropXon</span>
              <span className="block text-primary font-heading font-semibold text-xs">ATLAS Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <TrendingUp className="h-5 w-5" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'quotes' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <FileText className="h-5 w-5" />
            My Quotes
            {stats.pendingQuotes > 0 && (
              <span className="ml-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {stats.pendingQuotes}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'invoices' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Receipt className="h-5 w-5" />
            Invoices
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'profile' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Settings className="h-5 w-5" />
            Profile Settings
          </button>
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Link to="/">
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Back to Website
            </Button>
          </Link>
          <Button variant="ghost" className="w-full gap-2 text-muted-foreground" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Welcome back, {profile?.full_name || user?.email?.split('@')[0]}
            </h1>
            <p className="text-muted-foreground">
              Manage your quotes, invoices, and account settings
            </p>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-l-4 border-l-primary">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Quotes</p>
                        <p className="text-3xl font-bold text-foreground">{stats.totalQuotes}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Review</p>
                        <p className="text-3xl font-bold text-foreground">{stats.pendingQuotes}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-500/10">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Paid</p>
                        <p className="text-3xl font-bold text-foreground">₹{stats.totalPaid.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-500/10">
                        <CheckCircle className="h-6 w-6 text-emerald-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending Payment</p>
                        <p className="text-3xl font-bold text-foreground">₹{stats.pendingPayment.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-red-500/10">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Quotes</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('quotes')}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {quotes.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No quotes yet</p>
                        <Link to="/">
                          <Button variant="hero" size="sm" className="mt-4">Request Quote</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {quotes.slice(0, 5).map((quote) => (
                          <div key={quote.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div>
                              <p className="font-medium text-sm">{quote.quote_number}</p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {quote.service_type?.replace(/-/g, ' ')}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">₹{Number(quote.final_price).toLocaleString()}</p>
                              <Badge className={`text-xs ${statusColors[quote.status || 'pending']}`}>
                                {quote.status || 'pending'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Recent Invoices</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('invoices')}>
                      View All <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {invoices.length === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground text-sm">No invoices yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {invoices.slice(0, 5).map((invoice) => (
                          <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                            <div>
                              <p className="font-medium text-sm">{invoice.invoice_number}</p>
                              <p className="text-xs text-muted-foreground">
                                Due: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'On Receipt'}
                              </p>
                            </div>
                            <div className="text-right flex items-center gap-3">
                              <div>
                                <p className="font-semibold text-sm">₹{Number(invoice.total_amount).toLocaleString()}</p>
                                <Badge className={`text-xs ${statusColors[invoice.status || 'draft']}`}>
                                  {invoice.status || 'draft'}
                                </Badge>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadInvoice(invoice)}
                                disabled={downloadingInvoice === invoice.id}
                              >
                                {downloadingInvoice === invoice.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Quotes Tab */}
          {activeTab === 'quotes' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                {quotes.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No quotes yet</p>
                    <Link to="/">
                      <Button variant="hero">Get a Quote</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quote #</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Service</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Complexity</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quotes.map((quote) => (
                          <tr key={quote.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{quote.quote_number}</td>
                            <td className="py-3 px-4 text-muted-foreground capitalize">{quote.service_type?.replace(/-/g, ' ')}</td>
                            <td className="py-3 px-4 text-muted-foreground capitalize">{quote.complexity}</td>
                            <td className="py-3 px-4 font-semibold">₹{Number(quote.final_price).toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Badge className={statusColors[quote.status || 'pending']}>
                                {quote.status || 'pending'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(quote.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <Card>
              <CardHeader>
                <CardTitle>Your Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                {invoices.length === 0 ? (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No invoices yet</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Invoice #</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Quote Ref</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tax</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Due Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((invoice) => (
                          <tr key={invoice.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4 font-medium">{invoice.invoice_number}</td>
                            <td className="py-3 px-4 text-muted-foreground">{invoice.quotes?.quote_number || '-'}</td>
                            <td className="py-3 px-4">₹{Number(invoice.amount).toLocaleString()}</td>
                            <td className="py-3 px-4 text-muted-foreground">₹{Number(invoice.tax_amount).toLocaleString()}</td>
                            <td className="py-3 px-4 font-semibold">₹{Number(invoice.total_amount).toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Badge className={statusColors[invoice.status || 'draft']}>
                                {invoice.status || 'draft'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                            </td>
                            <td className="py-3 px-4">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleDownloadInvoice(invoice)}
                                disabled={downloadingInvoice === invoice.id}
                                className="gap-2"
                              >
                                {downloadingInvoice === invoice.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                                PDF
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        defaultValue={profile?.full_name || ''}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        defaultValue={profile?.company_name || ''}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={profile?.phone || ''}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <Button type="submit" variant="hero">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Account Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                    <p className="font-semibold">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : '-'}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Quotes Requested</p>
                    <p className="font-semibold">{stats.totalQuotes}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Invoices</p>
                    <p className="font-semibold">{stats.totalInvoices}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                    <p className="text-sm text-emerald-700 mb-1">Total Amount Paid</p>
                    <p className="font-bold text-emerald-800 text-xl">₹{stats.totalPaid.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;