import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  MessageSquare,
  Search,
  Filter,
  Calendar,
  ArrowRight,
  Star,
  Activity,
  Zap,
  Target,
  ChevronDown,
  MoreHorizontal
} from "lucide-react";
import { Link } from "wouter";
import type { Quote, Product, Contact } from "../../types/client-schema";
import { apiRequest } from "@/lib/queryClient";
import { getAuthToken, getUser, clearAuth } from "@/lib/auth";
import QuickSuccessStory from "@/components/admin/quick-success-story";
import GamificationDashboard from "@/components/admin/gamification-dashboard";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [quotesFilter, setQuotesFilter] = useState("all");
  const [contactsFilter, setContactsFilter] = useState("all");
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 dark:border-blue-400 border-t-transparent" />
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
    growthRate: Math.floor(Math.random() * 15) + 5,
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

  const filteredQuotes = recentQuotes?.filter(quote => {
    if (quotesFilter === "all") return true;
    return quote.status === quotesFilter;
  }).slice(0, 6) || [];

  const filteredContacts = contacts?.filter(contact => {
    if (contactsFilter === "all") return true;
    return contact.status === contactsFilter;
  }).slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-b border-white/20 dark:border-slate-800/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-blue-800 dark:from-slate-200 dark:to-blue-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Welcome back, <span className="font-semibold">{user.name}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800 dark:to-emerald-800 text-green-700 dark:text-green-200 border-green-200 dark:border-green-700 px-3 py-1">
                <Star className="h-3 w-3 mr-1" />
                {user.role}
              </Badge>
              <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-200">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 transition-all duration-200">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-800 dark:hover:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Quotes</CardTitle>
              <div className="p-2 bg-blue-600 dark:bg-blue-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                {analytics?.totalQuotes || recentQuotes?.length || 0}
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center">
                {analytics?.quoteGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                )}
                {analytics?.quoteGrowth ? `${analytics.quoteGrowth}%` : '+20.1%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800 dark:hover:to-emerald-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Revenue</CardTitle>
              <div className="p-2 bg-emerald-600 dark:bg-emerald-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                KSh {analytics?.totalRevenue?.toLocaleString() || '45,231.89'}
              </div>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 flex items-center">
                {analytics?.revenueGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                )}
                {analytics?.revenueGrowth ? `${analytics.revenueGrowth}%` : '+20.1%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-950 hover:from-purple-100 hover:to-purple-200 dark:hover:from-purple-800 dark:hover:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200">Active Projects</CardTitle>
              <div className="p-2 bg-purple-600 dark:bg-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Package className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                {analytics?.activeProjects || '+12'}
              </div>
              <p className="text-xs text-purple-700 dark:text-purple-300 flex items-center">
                {analytics?.projectGrowth >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1 text-red-500 dark:text-red-400" />
                )}
                {analytics?.projectGrowth ? `${analytics.projectGrowth}%` : '+19%'} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 hover:from-orange-100 hover:to-orange-200 dark:hover:from-orange-800 dark:hover:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-800 dark:text-orange-200">Website Visitors</CardTitle>
              <div className="p-2 bg-orange-600 dark:bg-orange-500 rounded-lg group-hover:scale-110 transition-transform duration-200">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100 mb-1">
                {analytics?.websiteVisitors || '+573'}
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-300 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500 dark:text-green-400" />
                {analytics?.visitorGrowth || '+201'} since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/products">
            <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="mr-2 h-5 w-5" />
              Add Product
            </Button>
          </Link>
          <Link href="/admin/quote-management">
            <Button className="w-full h-16 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-700 dark:hover:to-slate-800 text-slate-800 dark:text-slate-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <FileText className="mr-2 h-5 w-5" />
              Quote Management
            </Button>
          </Link>
          <Link href="/admin/users">
            <Button className="w-full h-16 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-800 dark:to-emerald-900 hover:from-emerald-200 hover:to-emerald-300 dark:hover:from-emerald-700 dark:hover:to-emerald-800 text-emerald-800 dark:text-emerald-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Users className="mr-2 h-5 w-5" />
              Manage Users
            </Button>
          </Link>
          <Button className="w-full h-16 bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 hover:from-orange-200 hover:to-orange-300 dark:hover:from-orange-700 dark:hover:to-orange-800 text-orange-800 dark:text-orange-200 border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <BarChart3 className="mr-2 h-5 w-5" />
            Analytics
          </Button>
        </div>

        {/* Service & Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5" />
                Service Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(serviceTypes).slice(0, 5).map(([service, count], index) => (
                  <div key={service} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500 dark:bg-blue-400' :
                        index === 1 ? 'bg-purple-500 dark:bg-purple-400' :
                        index === 2 ? 'bg-emerald-500 dark:bg-emerald-400' :
                        index === 3 ? 'bg-orange-500 dark:bg-orange-400' :
                        'bg-pink-500 dark:bg-pink-400'
                      }`}></div>
                      <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                        {service.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700">{count}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-500 dark:to-blue-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">New Quotes</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{monthlyQuotes.length}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">this month</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Converted</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {monthlyQuotes.filter(q => q.status === 'completed').length}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">projects</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Revenue</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      KSh {stats.monthlyRevenue.toLocaleString()}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">earned</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <Link href="/admin/quotes">
                  <Button variant="outline" className="w-full justify-start hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-200 dark:hover:border-blue-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 transition-all duration-200">
                    <FileText className="h-4 w-4 mr-2" />
                    View All Quotes
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full justify-start hover:bg-emerald-50 dark:hover:bg-emerald-900 hover:border-emerald-200 dark:hover:border-emerald-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 transition-all duration-200">
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/admin/blog">
                  <Button variant="outline" className="w-full justify-start hover:bg-purple-50 dark:hover:bg-purple-900 hover:border-purple-200 dark:hover:border-purple-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 transition-all duration-200">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Blog Post
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/admin/team">
                  <Button variant="outline" className="w-full justify-start hover:bg-orange-50 dark:hover:bg-orange-900 hover:border-orange-200 dark:hover:border-orange-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 transition-all duration-200">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Team
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Recent Quotes with Filtering */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Recent Quotes
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    value={quotesFilter} 
                    onChange={(e) => setQuotesFilter(e.target.value)}
                    className="bg-white/20 dark:bg-slate-900/20 text-white text-sm rounded-lg px-3 py-1 border-0 focus:ring-2 focus:ring-white/50 dark:focus:ring-slate-700/50"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <Link href="/admin/quotes">
                    <Button size="sm" variant="outline" className="bg-white/20 dark:bg-slate-900/20 border-white/30 dark:border-slate-700/30 text-white hover:bg-white/30 dark:hover:bg-slate-800/30">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!filteredQuotes || filteredQuotes.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No quotes found</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredQuotes.map((quote, index) => (
                      <div key={quote.id} className="p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900 dark:hover:to-indigo-900 transition-all duration-200 group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {quote.customerName?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-800 dark:group-hover:text-blue-300 transition-colors">
                                  {quote.customerName}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {quote.projectType?.replace('_', ' ')} • {quote.areaSize}
                                </p>
                              </div>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 ml-13">
                              📍 {quote.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                              {quote.totalAmount ? `KSh ${parseFloat(quote.totalAmount).toLocaleString()}` : 'TBD'}
                            </div>
                            <Badge className={`mb-2 ${
                              quote.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700' :
                              quote.status === 'completed' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' :
                              quote.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700' :
                              'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                            }`}>
                              {quote.status?.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(quote.createdAt!).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Recent Contacts */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Recent Contacts
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <select 
                    value={contactsFilter} 
                    onChange={(e) => setContactsFilter(e.target.value)}
                    className="bg-white/20 dark:bg-slate-900/20 text-white text-sm rounded-lg px-3 py-1 border-0 focus:ring-2 focus:ring-white/50 dark:focus:ring-slate-700/50"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Button size="sm" variant="outline" className="bg-white/20 dark:bg-slate-900/20 border-white/30 dark:border-slate-700/30 text-white hover:bg-white/30 dark:hover:bg-slate-800/30">
                    View All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-600 mb-4" />
                  <p className="text-slate-500 dark:text-slate-400 text-lg">No contacts found</p>
                  <p className="text-slate-400 dark:text-slate-500 text-sm">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredContacts.map((contact, index) => (
                    <div key={contact.id} className="p-6 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-emerald-900 dark:hover:to-teal-900 transition-all duration-200 group">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {contact.firstName?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                                {contact.firstName} {contact.lastName}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {contact.email}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 ml-13 truncate">
                            {contact.subject}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={`${
                            contact.status === 'new' ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' :
                            contact.status === 'replied' ? 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700'
                          }`}>
                            {contact.status}
                          </Badge>
                          <div className="flex items-center text-xs text-slate-400 dark:text-slate-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {new Date(contact.createdAt || Date.now()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Create Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Plus className="mr-2 h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <QuickSuccessStory />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Content Creation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              <Link href="/admin/blog">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Blog Post
                </Button>
              </Link>
              <Link href="/admin/products">
                <Button variant="outline" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" />
                Analytics Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 rounded-lg">
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-1">
                    {analytics?.monthlyQuotes || 0}
                  </div>
                  <p className="text-sm text-blue-600 dark:text-blue-400">Monthly Quotes</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-950 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-1">
                    {analytics?.totalContacts || 0}
                  </div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Total Contacts</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-950 rounded-lg">
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200 mb-1">
                    {analytics?.totalStories || 0}
                  </div>
                  <p className="text-sm text-purple-600 dark:text-purple-400">Success Stories</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950 rounded-lg">
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-1">
                    {analytics?.featuredStories || 0}
                  </div>
                  <p className="text-sm text-orange-600 dark:text-orange-400">Featured Stories</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 hover:shadow-2xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">New quote submitted</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900 dark:to-teal-900 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 dark:bg-emerald-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Project completed</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">New contact message</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">3 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900 dark:to-red-900 rounded-lg">
                  <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Product inventory updated</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">5 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gamification Dashboard */}
        <div className="mt-8">
          <GamificationDashboard />
        </div>
      </div>
    </div>
  );
}