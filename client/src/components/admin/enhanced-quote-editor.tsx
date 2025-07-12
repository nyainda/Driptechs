import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Trash2, Save, Calculator, Download, FileText, Send, DollarSign, Package } from "lucide-react";
import type { Quote, Product } from "../../types/client-schema";

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface EnhancedQuoteEditorProps {
  quote: Quote;
  onSave: (updatedQuote: Quote) => void;
  onCancel: () => void;
}

export default function EnhancedQuoteEditor({ quote, onSave, onCancel }: EnhancedQuoteEditorProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Parse items from quote JSON
  const [items, setItems] = useState<QuoteItem[]>(() => {
    try {
      return Array.isArray(quote.items) ? quote.items : JSON.parse(quote.items || '[]');
    } catch {
      return [];
    }
  });
  
  const [quoteData, setQuoteData] = useState({
    customerName: quote.customerName || '',
    customerEmail: quote.customerEmail || '',
    customerPhone: quote.customerPhone || '',
    customerAddress: quote.customerAddress || '',
    location: quote.location || '',
    projectType: quote.projectType || '',
    areaSize: quote.areaSize || '',
    requirements: quote.requirements || '',
    budget: quote.budget || '',
    timeline: quote.timeline || '',
    status: quote.status || 'pending',
    notes: quote.notes || '',
    totalAmount: quote.totalAmount || '0',
    vatAmount: quote.vatAmount || '0',
    finalTotal: quote.finalTotal || '0'
  });

  // Get available products for quick add
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/admin/products"],
    queryFn: () => apiRequest("GET", "/api/admin/products"),
  });

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const vat = subtotal * 0.16; // 16% VAT
    const finalTotal = subtotal + vat;
    
    setQuoteData(prev => ({
      ...prev,
      totalAmount: subtotal.toString(),
      vatAmount: vat.toString(),
      finalTotal: finalTotal.toString()
    }));
  }, [items]);

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      description: '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: 0,
      total: 0
    };
    setItems([...items, newItem]);
  };

  const addProductItem = (product: Product) => {
    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: product.name,
      description: product.description || '',
      quantity: 1,
      unit: 'pcs',
      unitPrice: parseFloat(product.price || '0'),
      total: parseFloat(product.price || '0')
    };
    setItems([...items, newItem]);
    toast({ title: "Product Added", description: `${product.name} added to quote` });
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or unitPrice changed
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = (updatedItem.quantity || 0) * (updatedItem.unitPrice || 0);
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const duplicateItem = (id: string) => {
    const itemToDuplicate = items.find(item => item.id === id);
    if (itemToDuplicate) {
      const duplicatedItem = {
        ...itemToDuplicate,
        id: Math.random().toString(36).substr(2, 9)
      };
      setItems([...items, duplicatedItem]);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("PUT", `/api/admin/quotes/${quote.id}`, data);
    },
    onSuccess: (updatedQuote) => {
      toast({ title: "Success", description: "Quote updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      onSave(updatedQuote);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update quote",
        variant: "destructive",
      });
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", `/api/admin/quotes/${quote.id}/send`);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Quote sent to customer successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to send quote",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    const dataToSave = {
      ...quoteData,
      items: items,
      updatedAt: new Date()
    };
    updateMutation.mutate(dataToSave);
  };

  const handleSendQuote = () => {
    sendQuoteMutation.mutate();
  };

  const handleGenerateInvoice = () => {
    const invoiceUrl = `/api/admin/quotes/${quote.id}/invoice`;
    window.open(invoiceUrl, '_blank');
    toast({ title: "Invoice Generated", description: "Invoice will download shortly" });
  };

  const subtotal = parseFloat(quoteData.totalAmount);
  const vatAmount = parseFloat(quoteData.vatAmount);
  const finalTotal = parseFloat(quoteData.finalTotal);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Quote #{quote.id.slice(-8)}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Created: {new Date(quote.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSendQuote}
            disabled={sendQuoteMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Quote
          </Button>
          <Button
            onClick={handleGenerateInvoice}
            variant="outline"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Invoice
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer Name</Label>
                <Input
                  value={quoteData.customerName}
                  onChange={(e) => setQuoteData({...quoteData, customerName: e.target.value})}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={quoteData.customerEmail}
                  onChange={(e) => setQuoteData({...quoteData, customerEmail: e.target.value})}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={quoteData.customerPhone}
                  onChange={(e) => setQuoteData({...quoteData, customerPhone: e.target.value})}
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={quoteData.location}
                  onChange={(e) => setQuoteData({...quoteData, location: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label>Customer Address</Label>
              <Textarea
                value={quoteData.customerAddress}
                onChange={(e) => setQuoteData({...quoteData, customerAddress: e.target.value})}
                placeholder="Enter full customer address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Project Information */}
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Project Type</Label>
                <Select
                  value={quoteData.projectType}
                  onValueChange={(value) => setQuoteData({...quoteData, projectType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drip_irrigation">Drip Irrigation System</SelectItem>
                    <SelectItem value="sprinkler_system">Sprinkler System</SelectItem>
                    <SelectItem value="greenhouse_irrigation">Greenhouse Irrigation</SelectItem>
                    <SelectItem value="landscape_irrigation">Landscape Irrigation</SelectItem>
                    <SelectItem value="agricultural_irrigation">Agricultural Irrigation</SelectItem>
                    <SelectItem value="custom_solution">Custom Solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Area Size</Label>
                <Input
                  value={quoteData.areaSize}
                  onChange={(e) => setQuoteData({...quoteData, areaSize: e.target.value})}
                  placeholder="e.g., 2 acres, 500 sqm"
                />
              </div>
              <div>
                <Label>Budget Range</Label>
                <Input
                  value={quoteData.budget}
                  onChange={(e) => setQuoteData({...quoteData, budget: e.target.value})}
                  placeholder="e.g., KES 100,000 - 200,000"
                />
              </div>
              <div>
                <Label>Timeline</Label>
                <Input
                  value={quoteData.timeline}
                  onChange={(e) => setQuoteData({...quoteData, timeline: e.target.value})}
                  placeholder="e.g., 2-3 weeks"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={quoteData.status}
                  onValueChange={(value) => setQuoteData({...quoteData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
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
              <Label>Requirements</Label>
              <Textarea
                value={quoteData.requirements}
                onChange={(e) => setQuoteData({...quoteData, requirements: e.target.value})}
                placeholder="Detailed project requirements..."
                rows={3}
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={quoteData.notes}
                onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})}
                placeholder="Internal notes..."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quote Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Quote Items
            </CardTitle>
            <div className="flex gap-2">
              <Select onValueChange={(productId) => {
                const product = products.find(p => p.id === productId);
                if (product) addProductItem(product);
              }}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Add product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - KES {product.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addItem} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Custom Item
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-20">Qty</TableHead>
                <TableHead className="w-20">Unit</TableHead>
                <TableHead className="w-32">Unit Price</TableHead>
                <TableHead className="w-32">Total</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Item name"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={item.unit}
                      onValueChange={(value) => updateItem(item.id, 'unit', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                        <SelectItem value="sets">Sets</SelectItem>
                        <SelectItem value="units">Units</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                    />
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold">
                      KES {item.total.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => duplicateItem(item.id)}
                        title="Duplicate"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(item.id)}
                        title="Remove"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Totals Summary */}
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (16%):</span>
                  <span className="font-semibold">KES {vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>KES {finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button onClick={onCancel} variant="outline">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {updateMutation.isPending ? "Saving..." : "Save Quote"}
        </Button>
      </div>
    </div>
  );
}