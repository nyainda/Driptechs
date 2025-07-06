import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthToken, getUser, clearAuth } from "@/lib/auth";
import { 
  BarChart3, 
  Users, 
  Package, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  LogOut,
  Settings,
  Plus,
  Trophy,
  TrendingDown, 
  Eye, 
  MessageSquare
} from "lucide-react";
import { Link } from "wouter";
import type { Quote, Product, Contact } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const token = getAuthToken();
  const user = getUser();

  useEffect(() => {
    if (!token || !user) {
      setLocation("/admin");
    }
  }, [token, user, setLocation]);

  const { data: quotes } = useQuery<Quote[]>({
    queryKey: ["/api/admin/quotes"],
    enabled: !!token,
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!token,
  });

  const { data: contacts } = useQuery<Contact[]>({
    queryKey: ["/api/admin/contacts"],
    enabled: !!token,
  });

  const handleLogout = () => {
    clearAuth();
    setLocation("/admin");
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  // Calculate dashboard stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyQuotes = quotes?.filter(q => {
    const quoteDate = new Date(q.createdAt!);
    return quoteDate.getMonth() === currentMonth && quoteDate.getFullYear() === currentYear;
  }) || [];

  const serviceTypes = quotes?.reduce((acc, q) => {
    acc[q.projectType] = (acc[q.projectType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const popularService = Object.entries(serviceTypes)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

  const stats = {
    totalQuotes: quotes?.length || 0,
    pendingQuotes: quotes?.filter(q => q.status === 'pending').length || 0,
    totalProducts: products?.length || 0,
    inStockProducts: products?.filter(p => p.inStock).length || 0,
    newContacts: contacts?.filter(c => c.status === 'new').length || 0,
    totalRevenue: quotes?.reduce((sum, q) => sum + parseFloat(q.totalAmount || "0"), 0) || 0,
    monthlyRevenue: monthlyQuotes.reduce((sum, q) => sum + parseFloat(q.totalAmount || "0"), 0),
    growthRate: Math.floor(Math.random() * 15) + 5, // Simulated growth rate
    activeProjects: quotes?.filter(q => q.status === 'in_progress').length || 0,
    completedProjects: quotes?.filter(q => q.status === 'completed').length || 0,
    serviceTypes: Object.keys(serviceTypes).length,
    popularService: popularService.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
  };

  const { data: recentQuotes } = useQuery({
    queryKey: ["/api/admin/quotes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/quotes");
      if (!response.ok) throw new Error("Failed to fetch quotes");
      return response.json();
    },
    enabled: !!token,
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    enabled: !!token,
  });

  const recentContacts = contacts?.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {user.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {user.role}
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.totalQuotes || recentQuotes?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {analytics?.quoteGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                {analytics?.quoteGrowth ? `${analytics.quoteGrowth}%` : '+20.1%'} from last month
              </p>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                KSh {analytics?.totalRevenue?.toLocaleString() || '45,231.89'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {analytics?.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                {analytics?.revenueGrowth ? `${analytics.revenueGrowth}%` : '+20.1%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.activeProjects || '+12'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                {analytics?.projectGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                )}
                {analytics?.projectGrowth ? `${analytics.projectGrowth}%` : '+19%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Website Visitors</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.websiteVisitors || '+573'}
              </div>
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {analytics?.visitorGrowth || '+201'} since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products">
            <Button className="w-full h-16 bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/quotes">
            <Button className="w-full h-16" variant="outline">
              <FileText className="mr-2 h-5 w-5" />
              View Quotes
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button className="w-full h-16" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              Manage Users
            </Button>
          </Link>
          <Button className="w-full h-16" variant="outline">
            <BarChart3 className="mr-2 h-5 w-5" />
            Analytics
          </Button>
        </div>

        {/* Service Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(serviceTypes).slice(0, 5).map(([service, count]) => (
                  <div key={service} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium capitalize">
                        {service.replace('_', ' ')}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Monthly Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">New Quotes</span>
                  <span className="text-2xl font-bold text-blue-600">{monthlyQuotes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Converted</span>
                  <span className="text-2xl font-bold text-green-600">
                    {monthlyQuotes.filter(q => q.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Revenue</span>
                  <span className="text-2xl font-bold text-orange-600">
                    KSh {stats.monthlyRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/quotes">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Quotes
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                </Link>
                <Link href="/admin/blog">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog Post
                  </Button>
                </Link>
                <Link href="/admin/team">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                  </Button>
                </Link>
                <Link href="/admin/success-stories">
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="h-4 w-4 mr-2" />
                    Success Stories
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Quotes */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Quotes
                <Link href="/admin/quotes">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentQuotes.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No quotes yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentQuotes.map((quote) => (
                    <div key={quote.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{quote.customerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {quote.projectType} - {quote.areaSize}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quote.location}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600 mb-2">
                          {quote.totalAmount ? `KSh ${parseFloat(quote.totalAmount).toLocaleString()}` : 'TBD'}
                        </div>
                        <Badge className={
                          quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          quote.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {quote.status}
                        </Badge>
                        <p className="text-sm font-semibold mt-1">
                          {quote.totalAmount ? `KSh ${parseFloat(quote.totalAmount).toLocaleString()}` : 'Pending'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Contacts
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentContacts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No contacts yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">
                          {contact.firstName} {contact.lastName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {contact.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {contact.subject}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          contact.status === 'new' ? 'bg-green-100 text-green-800' :
                          contact.status === 'replied' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {contact.status}
                        </Badge>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analytics Insights */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle>Analytics Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Monthly Quotes</span>
                  <Badge variant="secondary">
                    {analytics?.monthlyQuotes || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Contacts</span>
                  <Badge variant="secondary">
                    {analytics?.totalContacts || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Success Stories</span>
                  <Badge variant="secondary">
                    {analytics?.totalStories || 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Featured Stories</span>
                  <Badge variant="outline">
                    {analytics?.featuredStories || 0}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}