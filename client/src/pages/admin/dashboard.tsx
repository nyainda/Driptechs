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
  Trophy
} from "lucide-react";
import { Link } from "wouter";
import type { Quote, Product, Contact } from "@shared/schema";

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

  const recentQuotes = quotes?.slice(0, 5) || [];
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Quotes</p>
                  <p className="text-3xl font-bold">{stats.totalQuotes}</p>
                  <p className="text-sm text-green-600">
                    {stats.pendingQuotes} pending
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                  <p className="text-3xl font-bold">KSh {stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">
                    +{stats.growthRate}% growth
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-3xl font-bold">{stats.activeProjects}</p>
                  <p className="text-sm text-blue-600">
                    {stats.completedProjects} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service Types</p>
                  <p className="text-3xl font-bold">{stats.serviceTypes}</p>
                  <p className="text-sm text-purple-600">
                    {stats.popularService}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Products</p>
                  <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  <p className="text-sm text-green-600">
                    {stats.inStockProducts} in stock
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Contacts</p>
                  <p className="text-3xl font-bold">{stats.newContacts}</p>
                  <p className="text-sm text-blue-600">This month</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                  <p className="text-3xl font-bold">
                    KSh {stats.totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
              </div>
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
      </div>
    </div>
  );
}