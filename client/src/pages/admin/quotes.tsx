
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { getAuthToken, getUser, clearAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Download, 
  Send, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Droplets,
  ArrowLeft,
  Search,
  DollarSign
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "wouter";
import QuotePDF from "@/components/admin/quote-pdf";
import type { Quote } from "@shared/schema";

export default function AdminQuotes() {
  const [, setLocation] = useLocation();
  const token = getAuthToken();
  const user = getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);

  // Redirect if not authenticated
  if (!token || !user) {
    setLocation("/admin");
    return null;
  }

  const { data: quotes, isLoading } = useQuery<Quote[]>({
    queryKey: ["/api/admin/quotes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/quotes");
      return response.json();
    },
    enabled: !!token,
  });

  const updateQuoteMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Quote> }) => {
      const response = await apiRequest("PUT", `/api/admin/quotes/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({
        title: "Quote Updated",
        description: "Quote status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/quotes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({
        title: "Quote Deleted",
        description: "Quote has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/quotes/${id}/send`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({
        title: "Quote Sent",
        description: "Quote has been successfully sent to the customer.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send quote. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadQuote = (quote: Quote) => {
    const quoteData = {
      id: quote.id,
      customerName: quote.customerName || 'N/A',
      customerEmail: quote.customerEmail || 'N/A',
      customerPhone: quote.customerPhone || 'N/A',
      projectType: quote.projectType || 'N/A',
      areaSize: quote.areaSize || 'N/A',
      location: quote.location || 'N/A',
      totalAmount: quote.totalAmount || 'TBD',
      status: quote.status || 'pending',
      createdAt: quote.createdAt || new Date().toISOString()
    };

    const dataStr = JSON.stringify(quoteData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `quote-${quote.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const filteredQuotes = quotes?.filter((quote) => {
    const matchesSearch = 
      quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.projectType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || quote.status === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  const handleStatusChange = (quoteId: number, newStatus: string) => {
    updateQuoteMutation.mutate({
      id: quoteId,
      data: { status: newStatus }
    });
  };

  const handleDelete = (quote: Quote) => {
    if (window.confirm(`Are you sure you want to delete the quote for ${quote.customerName}?`)) {
      deleteQuoteMutation.mutate(quote.id);
    }
  };

  const handleSendQuote = (quote: Quote) => {
    if (window.confirm(`Send quote to ${quote.customerEmail}?`)) {
      sendQuoteMutation.mutate(quote.id);
    }
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setShowQuoteDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Quote Management
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Quotes</p>
                  <p className="text-3xl font-bold">{quotes?.length || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-3xl font-bold">
                    {quotes?.filter(q => q.status === 'pending').length || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-3xl font-bold">
                    {quotes?.filter(q => q.status === 'completed').length || 0}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                  <p className="text-3xl font-bold">
                    KSh {quotes?.reduce((sum, q) => sum + parseFloat(q.totalAmount || "0"), 0).toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="admin-card mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quotes by customer, email, project type, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes List */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Quotes ({filteredQuotes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredQuotes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {quotes?.length === 0 ? "No quotes received yet." : "No quotes found matching your criteria."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-4">
                        <h3 className="font-semibold">Quote #{quote.id}</h3>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{quote.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{quote.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span>{quote.projectType} - {quote.areaSize}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(quote.createdAt!).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {quote.totalAmount && (
                        <div className="text-lg font-semibold text-blue-600">
                          KSh {parseFloat(quote.totalAmount).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewQuote(quote)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusChange(quote.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>

                      {quote.status !== 'sent' && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSendQuote(quote)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Send
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadQuote(quote)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quote Detail Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Quote #{selectedQuote?.id.slice(0, 8)} - {selectedQuote?.customerName}
            </DialogTitle>
            <DialogDescription>
              View and manage quote details, pricing, and customer information.
            </DialogDescription>
          </DialogHeader>
          {selectedQuote && <QuotePDF quote={selectedQuote} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
