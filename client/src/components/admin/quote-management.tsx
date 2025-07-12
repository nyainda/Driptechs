import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Eye, FileText, Download, Calculator, DollarSign, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Quote, Product } from "../../types/client-schema";
import EnhancedQuoteEditor from "./enhanced-quote-editor";

const quoteSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().optional(),
  customerAddress: z.string().optional(),
  projectType: z.string().min(1, "Project type is required"),
  areaSize: z.string().min(1, "Area size is required"),
  location: z.string().min(1, "Location is required"),
  requirements: z.string().min(1, "Requirements are required"),
  budget: z.string().min(1, "Budget is required"),
  timeline: z.string().min(1, "Timeline is required"),
  status: z.enum(["pending", "reviewed", "approved", "rejected", "completed"]),
  totalAmount: z.number().min(0, "Total amount must be positive"),
  notes: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  quote?: Quote | null;
  onSuccess: () => void;
  onCancel: () => void;
}

function QuoteForm({ quote, onSuccess, onCancel }: QuoteFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      customerName: quote?.customerName || "",
      customerEmail: quote?.customerEmail || "",
      customerPhone: quote?.customerPhone || "",
      customerAddress: quote?.customerAddress || "",
      projectType: quote?.projectType || "",
      areaSize: quote?.areaSize || "",
      location: quote?.location || "",
      requirements: quote?.requirements || "",
      budget: quote?.budget || "",
      timeline: quote?.timeline || "",
      status: quote?.status || "pending",
      totalAmount: quote?.totalAmount || 0,
      notes: quote?.notes || "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      return await apiRequest("POST", "/api/admin/quotes", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Quote created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create quote",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      return await apiRequest("PUT", `/api/admin/quotes/${quote?.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Quote updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update quote",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuoteFormData) => {
    if (quote) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              {...form.register('customerName', { required: 'Customer name is required' })}
              placeholder="Enter customer name"
            />
            {form.formState.errors.customerName && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.customerName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="customerEmail">Customer Email *</Label>
            <Input
              id="customerEmail"
              type="email"
              {...form.register('customerEmail', { 
                required: 'Customer email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              placeholder="Enter customer email"
            />
          {form.formState.errors.customerEmail && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.customerEmail.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="customerPhone">Customer Phone</Label>
          <Input
            id="customerPhone"
            {...form.register("customerPhone")}
            placeholder="Enter customer phone"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register("location")}
            placeholder="Enter project location"
          />
          {form.formState.errors.location && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="projectType">Project Type *</Label>
          <Input
            id="projectType"
            {...form.register('projectType', { required: 'Project type is required' })}
            placeholder="e.g., Drip Irrigation, Greenhouse Setup"
          />
          {form.formState.errors.projectType && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.projectType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="areaSize">Area Size</Label>
          <Input
            id="areaSize"
            {...form.register("areaSize")}
            placeholder="Enter area size"
          />
          {form.formState.errors.areaSize && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.areaSize.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            {...form.register("budget")}
            placeholder="Enter budget range"
          />
          {form.formState.errors.budget && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.budget.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="timeline">Timeline</Label>
          <Input
            id="timeline"
            {...form.register("timeline")}
            placeholder="Enter timeline"
          />
          {form.formState.errors.timeline && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.timeline.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="totalAmount">Total Amount</Label>
          <Input
            id="totalAmount"
            type="number"
            {...form.register("totalAmount", { valueAsNumber: true })}
            placeholder="Enter total amount"
          />
          {form.formState.errors.totalAmount && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.totalAmount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={form.watch("status")} onValueChange={(value) => form.setValue("status", value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="customerAddress">Customer Address</Label>
        <Textarea
          id="customerAddress"
          {...form.register("customerAddress")}
          placeholder="Enter customer address"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          {...form.register("requirements")}
          placeholder="Enter project requirements"
          rows={3}
        />
        {form.formState.errors.requirements && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.requirements.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...form.register("notes")}
          placeholder="Enter additional notes"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Saving..." : quote ? "Update Quote" : "Create Quote"}
        </Button>
      </div>
    </div>
  );
}

export default function QuoteManagement() {
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: quotes, isLoading } = useQuery<Quote[]>({
    queryKey: ["/api/admin/quotes"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/quotes");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/quotes/${id}`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Quote deleted successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete quote",
        variant: "destructive",
      });
    },
  });

  const generateInvoice = async (quote: Quote) => {
    try {
      const response = await apiRequest("POST", `/api/admin/quotes/${quote.id}/invoice`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `invoice-${quote.id}.html`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Success", description: "Invoice generated successfully" });
      } else {
        throw new Error("Failed to generate invoice");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate invoice",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
  };

  const handleEnhancedEdit = (quote: Quote) => {
    setEditingQuote(quote);
  };

  const handleCreate = () => {
    setSelectedQuote(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleDelete = (quote: Quote) => {
    if (window.confirm("Are you sure you want to delete this quote?")) {
      deleteMutation.mutate(quote.id);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedQuote(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedQuote(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "reviewed": return "bg-blue-100 text-blue-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "completed": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (editingQuote) {
    return (
      <EnhancedQuoteEditor
        quote={editingQuote}
        onSave={(updatedQuote) => {
          setEditingQuote(null);
          queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
        }}
        onCancel={() => setEditingQuote(null)}
      />
    );
  }

  if (showForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {formMode === "create" ? "Create New Quote" : "Edit Quote"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteForm
            quote={selectedQuote}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quote Management</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Quote
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading quotes...</div>
          ) : quotes && quotes.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Project Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.customerName}</div>
                          <div className="text-sm text-gray-500">{quote.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{quote.projectType}</TableCell>
                      <TableCell>{quote.location}</TableCell>
                      <TableCell>{quote.budget}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(quote.status)}>
                          {quote.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold">
                          KES {parseFloat(quote.finalTotal || quote.totalAmount || '0').toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(quote)}
                            title="Edit Quote with Full Editor"
                          >
                            <Calculator className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => generateInvoice(quote)}
                            title="Generate Invoice"
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={async () => {
                              try {
                                await apiRequest("POST", `/api/admin/quotes/${quote.id}/send`);
                                toast({ title: "Success", description: "Quote sent to customer" });
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
                              } catch (error) {
                                toast({ title: "Error", description: "Failed to send quote", variant: "destructive" });
                              }
                            }}
                            title="Send Quote to Customer"
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(quote)}
                            title="Delete Quote"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No quotes found. Create your first quote to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}