import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Printer, Edit, Mail, Plus, Trash2, Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Quote } from "@shared/schema";

interface QuoteItem {
  id?: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface QuotePDFProps {
  quote: Quote;
}

export default function QuotePDF({ quote }: QuotePDFProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuote, setEditedQuote] = useState(quote);
  const [isUpdating, setIsUpdating] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);

  const getServiceDescription = (projectType: string) => {
    const serviceDescriptions = {
      'system_design': 'Custom irrigation system design and planning',
      'installation': 'Professional installation and setup',
      'maintenance': 'Regular maintenance and system optimization',
      'training': 'User training and system operation guidance',
      'consulting': 'Expert consultation and advisory services',
      'support': 'Technical support and troubleshooting',
      'residential': 'Complete residential irrigation system',
      'commercial': 'Commercial irrigation system design and installation',
      'agricultural': 'Agricultural irrigation system for farming',
      'landscape': 'Landscape irrigation system design',
      'greenhouse': 'Greenhouse irrigation system setup',
      'orchard': 'Orchard irrigation system design and installation'
    };
    return serviceDescriptions[projectType as keyof typeof serviceDescriptions] || 'Complete irrigation system design and installation';
  };

  const [items, setItems] = useState<QuoteItem[]>(() => {
    if (quote.items && Array.isArray(quote.items) && quote.items.length > 0) {
      const initialItems = quote.items.map((item: any) => ({
        id: item.id || Math.random().toString(36).substr(2, 9),
        name: item.name || `${quote.projectType} System`,
        description: item.description || getServiceDescription(quote.projectType),
        quantity: parseFloat(item.quantity) || 1,
        unit: item.unit || 'pcs',
        unitPrice: parseFloat(item.unitPrice || "0"),
        total: parseFloat(item.total || (parseFloat(item.unitPrice || "0") * parseFloat(item.quantity || "1")))
      }));
      calculateTotals(initialItems); // Calculate initial totals
      return initialItems;
    }

    // Default items based on project type
    const defaultItems = [];
    const basePrice = parseFloat(quote.totalAmount || "100000");

    if (quote.projectType === 'system_design') {
      defaultItems.push({
        id: '1',
        name: 'System Design & Engineering',
        description: 'Complete irrigation system design with technical drawings and specifications',
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice * 0.4,
        total: basePrice * 0.4
      });
      defaultItems.push({
        id: '2',
        name: 'Site Survey & Analysis',
        description: 'Professional site assessment and soil analysis',
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice * 0.3,
        total: basePrice * 0.3
      });
      defaultItems.push({
        id: '3',
        name: 'Technical Documentation',
        description: 'Detailed drawings, specifications, and installation manual',
        quantity: 1,
        unit: 'set',
        unitPrice: basePrice * 0.3,
        total: basePrice * 0.3
      });
    } else if (quote.projectType === 'installation') {
      defaultItems.push({
        id: '1',
        name: 'Drip Irrigation Kit',
        description: `Complete drip irrigation system for ${quote.areaSize}`,
        quantity: 1,
        unit: 'system',
        unitPrice: basePrice * 0.5,
        total: basePrice * 0.5
      });
      defaultItems.push({
        id: '2',
        name: 'Installation Labor',
        description: 'Professional installation, testing, and commissioning',
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice * 0.3,
        total: basePrice * 0.3
      });
      defaultItems.push({
        id: '3',
        name: 'Materials & Fittings',
        description: 'Pipes, connectors, emitters, and other installation materials',
        quantity: 1,
        unit: 'lot',
        unitPrice: basePrice * 0.2,
        total: basePrice * 0.2
      });
    } else if (quote.projectType === 'maintenance') {
      defaultItems.push({
        id: '1',
        name: 'System Maintenance Service',
        description: 'Complete system inspection, cleaning, and optimization',
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice,
        total: basePrice
      });
    } else if (quote.projectType === 'orchard') {
      defaultItems.push({
        id: '1',
        name: 'Orchard Irrigation System',
        description: 'Complete drip irrigation system for orchard/fruit trees',
        quantity: 1,
        unit: 'system',
        unitPrice: basePrice * 0.6,
        total: basePrice * 0.6
      });
      defaultItems.push({
        id: '2',
        name: 'Installation & Setup',
        description: 'Professional installation and system commissioning',
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice * 0.25,
        total: basePrice * 0.25
      });
      defaultItems.push({
        id: '3',
        name: 'Training & Support',
        description: 'User training and 6-month support package',
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice * 0.15,
        total: basePrice * 0.15
      });
    } else {
      defaultItems.push({
        id: '1',
        name: `${quote.projectType.replace('_', ' ').toUpperCase()} Service`,
        description: getServiceDescription(quote.projectType),
        quantity: 1,
        unit: 'service',
        unitPrice: basePrice,
        total: basePrice
      });
    }
    calculateTotals(defaultItems);
    return defaultItems;
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateQuoteMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Sending update request with data:', data);
      setIsUpdating(true);

      try {
        const response = await apiRequest("PUT", `/api/admin/quotes/${quote.id}`, data);

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Update failed with response:', errorData);
          throw new Error(`Update failed: ${response.status} ${response.statusText} - ${errorData}`);
        }

        return response.json();
      } catch (error) {
        console.error('Update request failed:', error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    onSuccess: (data) => {
      console.log('Update successful:', data);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({
        title: "Quote Updated",
        description: "Quote has been updated successfully.",
      });
      setIsEditing(false);
      // Update the local state with the returned data
      setEditedQuote(data);
    },
    onError: (error: any) => {
      console.error('Update mutation error:', error);
      toast({
        title: "Error",
        description: `Failed to update quote: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const sendQuoteMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/admin/quotes/${quote.id}/send`);
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Send failed: ${response.status} ${response.statusText} - ${errorData}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({
        title: "Quote Sent",
        description: "Quote has been successfully sent to the customer.",
      });
    },
    onError: (error: any) => {
      console.error('Send quote error:', error);
      toast({
        title: "Error",
        description: `Failed to send quote: ${error.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `KSh ${num.toLocaleString()}`;
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
      case "sent":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const addItem = () => {
    const materialSuggestions = [
      { name: 'Drip Irrigation Kit', description: 'Complete drip irrigation system kit', unit: 'set', unitPrice: 25000 },
      { name: 'Main Water Tank', description: 'Water storage tank for irrigation system', unit: 'pcs', unitPrice: 15000 },
      { name: 'Pressure Pump', description: 'Water pressure pump for system', unit: 'pcs', unitPrice: 35000 },
      { name: 'Drip Lines', description: 'Drip irrigation lines and emitters', unit: 'meters', unitPrice: 50 },
      { name: 'PVC Pipes', description: 'Main distribution pipes', unit: 'meters', unitPrice: 150 },
      { name: 'Control Valves', description: 'System control and distribution valves', unit: 'pcs', unitPrice: 2500 },
      { name: 'Filter System', description: 'Water filtration system', unit: 'set', unitPrice: 8000 },
      { name: 'Installation Labor', description: 'Professional installation service', unit: 'service', unitPrice: 20000 },
      { name: 'System Testing', description: 'Complete system testing and commissioning', unit: 'service', unitPrice: 5000 },
      { name: 'User Training', description: 'Training on system operation and maintenance', unit: 'service', unitPrice: 3000 }
    ];

    const randomSuggestion = materialSuggestions[Math.floor(Math.random() * materialSuggestions.length)];

    const newItem: QuoteItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: randomSuggestion.name,
      description: randomSuggestion.description,
      quantity: 1,
      unit: randomSuggestion.unit,
      unitPrice: randomSuggestion.unitPrice,
      total: randomSuggestion.unitPrice
    };

    setItems([...items, newItem]);
    calculateTotals([...items, newItem]);
  };

  const calculateTotals = (itemsList = items) => {
    const subtotalValue = itemsList.reduce((sum, item) => sum + (item.total || 0), 0);
    const vatValue = subtotalValue * 0.16;
    const totalValue = subtotalValue + vatValue;

    setSubtotal(subtotalValue);
    setVat(vatValue);
    setTotal(totalValue);
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
    calculateTotals(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    calculateTotals(updatedItems);
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateVAT = () => {
    return calculateSubtotal() * 0.16;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateVAT();
  };

  const handleSave = () => {
    const subtotal = calculateSubtotal();
    const vat = calculateVAT();
    const totalAmount = calculateTotal();

    // Prepare the update data - only include fields that should be updated
    const updatedQuoteData = {
      customerName: editedQuote.customerName,
      customerEmail: editedQuote.customerEmail,
      customerPhone: editedQuote.customerPhone,
      location: editedQuote.location,
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        total: item.total
      })),
      totalAmount: subtotal.toString(),
      vatAmount: vat.toString(),
      finalTotal: totalAmount.toString(),
      // Don't include createdAt, updatedAt will be set by backend
    };

    console.log('Preparing to update quote with data:', updatedQuoteData);
    updateQuoteMutation.mutate(updatedQuoteData);
  };

  const handleDownloadPDF = () => {
    const subtotal = calculateSubtotal();
    const vat = calculateVAT();
    const totalAmount = calculateTotal();

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Quote #${quote.id.slice(0, 8)} - DripTech Irrigation</title>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: white; }
          .quote-container { max-width: 800px; margin: 0 auto; }
          .company-header { display: flex; align-items: center; margin-bottom: 30px; }
          .company-logo { width: 60px; height: 60px; background: linear-gradient(135deg, #2563eb, #16a34a); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px; margin-right: 15px; }
          .company-info h1 { margin: 0; color: #2563eb; font-size: 28px; }
          .company-info p { margin: 2px 0; color: #6b7280; font-size: 14px; }
          .quote-header { text-align: right; margin-bottom: 40px; }
          .quote-header h2 { font-size: 32px; margin: 0 0 15px 0; color: #1f2937; }
          .quote-number { background: #f3f4f6; padding: 10px; border-radius: 8px; display: inline-block; }
          .customer-section { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-bottom: 40px; }
          .section-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #1f2937; }
          .info-grid { display: grid; grid-template-columns: 120px 1fr; gap: 8px; }
          .info-label { font-weight: 600; color: #374151; }
          .items-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
          .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          .items-table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
          .items-table td { vertical-align: top; }
          .item-name { font-weight: 600; color: #1f2937; }
          .item-description { font-size: 12px; color: #6b7280; margin-top: 4px; }
          .text-right { text-align: right; }
          .totals-section { margin-left: auto; width: 350px; margin-top: 30px; }
          .total-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #374151; padding-top: 12px; margin-top: 8px; }
          .terms-section { margin-top: 40px; }
          .terms-list { list-style: none; padding: 0; }
          .terms-list li { margin-bottom: 8px; font-size: 14px; color: #374151; }
          .terms-list li:before { content: "•"; color: #2563eb; font-weight: bold; display: inline-block; width: 1em; }
          .footer { text-align: center; margin-top: 50px; padding-top: 30px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          .highlight-box { background: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; }
          @media print { 
            body { margin: 0; padding: 10px; } 
            .quote-container { max-width: 100%; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="quote-container">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 50px;">
            <div>
              <div class="company-header">
                <div class="company-logo">DT</div>
                <div class="company-info">
                  <h1>DripTech</h1>
                  <p>Professional Irrigation Solutions</p>
                </div>
              </div>
              <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                <p><strong>Address:</strong> Nairobi Industrial Area, Kenya</p>
                <p><strong>Phone:</strong> +254 700 123 456</p>
                <p><strong>Email:</strong> info@driptech.co.ke</p>
                <p><strong>Website:</strong> www.driptech.co.ke</p>
              </div>
            </div>
            <div class="quote-header">
              <h2>QUOTATION</h2>
              <div class="quote-number">
                <div style="font-size: 14px; margin-bottom: 5px;"><strong>Quote #:</strong> ${quote.id.slice(0, 8)}</div>
                <div style="font-size: 14px; margin-bottom: 5px;"><strong>Date:</strong> ${new Date(quote.createdAt!).toLocaleDateString()}</div>
                <div style="font-size: 14px;"><strong>Valid Until:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          <hr style="border: none; border-top: 2px solid #e5e7eb; margin: 30px 0;">

          <div class="customer-section">
            <div>
              <div class="section-title">Bill To:</div>
              <div style="background: #f9fafb; padding: 20px; border-radius: 8px;">
                <div style="font-size: 18px; font-weight: 600; margin-bottom: 10px;">${quote.customerName}</div>
                <div style="margin-bottom: 5px;">${quote.customerEmail}</div>
                <div style="margin-bottom: 5px;">${quote.customerPhone}</div>
                <div>${quote.location}</div>
              </div>
            </div>
            <div>
              <div class="section-title">Project Details:</div>
              <div class="info-grid">
                <div class="info-label">Type:</div>
                <div>${quote.projectType}</div>
                <div class="info-label">Area Size:</div>
                <div>${quote.areaSize}</div>
                ${quote.cropType ? `<div class="info-label">Crop Type:</div><div>${quote.cropType}</div>` : ''}
                <div class="info-label">Location:</div>
                <div>${quote.location}</div>
                <div class="info-label">Water Source:</div>
                <div>${quote.waterSource || 'N/A'}</div>
                ${quote.budgetRange ? `<div class="info-label">Budget:</div><div>${quote.budgetRange}</div>` : ''}
              </div>
            </div>
          </div>

          ${quote.requirements ? `
            <div style="margin-bottom: 30px;">
              <div class="section-title">Project Requirements:</div>
              <div class="highlight-box">
                <p style="margin: 0; font-size: 14px; line-height: 1.6;">${quote.requirements}</p>
              </div>
            </div>
          ` : ''}

          <div style="margin-bottom: 30px;">
            <div class="section-title">Materials & Services:</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 40%;">Description</th>
                  <th style="width: 10%; text-align: center;">Qty</th>
                  <th style="width: 10%; text-align: center;">Unit</th>
                  <th style="width: 20%; text-align: right;">Unit Price</th>
                  <th style="width: 20%; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(item => `
                  <tr>
                    <td>
                      <div class="item-name">${item.name}</div>
                      <div class="item-description">${item.description}</div>
                    </td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: center;">${item.unit}</td>
                    <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                    <td style="text-align: right;">${formatCurrency(item.total)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div style="display: flex; justify-content: end;">
            <div class="totals-section">
              <div class="total-row">
                <span>Subtotal:</span>
                <span>${formatCurrency(subtotal)}</span>
              </div>
              <div class="total-row">
                <span>VAT (16%):</span>
                <span>${formatCurrency(vat)}</span>
              </div>
              <div class="total-row total-final">
                <span>Total Amount:</span>
                <span style="color: #2563eb;">${formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <div class="terms-section">
            <div class="section-title">Terms and Conditions:</div>
            <ul class="terms-list">
              <li>This quotation is valid for 30 days from the date of issue.</li>
              <li>Prices are in Kenyan Shillings (KSh) and include delivery within Nairobi metropolitan area.</li>
              <li>Installation services include complete system setup, testing, commissioning, and user training.</li>
              <li>All equipment comes with manufacturer's warranty and 12 months service guarantee.</li>
              <li>Payment terms: 50% deposit upon order confirmation, 50% upon project completion.</li>
              <li>Project timeline will be confirmed upon order placement and site survey completion.</li>
              <li>Any additional work outside this scope will be quoted separately.</li>
              <li>Free maintenance visit included within first 6 months of installation.</li>
            </ul>
          </div>

          <div class="footer">
            <div style="margin-bottom: 10px; font-size: 16px; font-weight: 600; color: #2563eb;">
              Thank you for choosing DripTech for your irrigation needs!
            </div>
            <p>For any questions regarding this quotation, please contact us at +254 700 123 456</p>
            <p style="font-size: 12px; margin-top: 15px;">
              This quotation was generated electronically and is valid without signature.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `DripTech-Quote-${quote.id.slice(0, 8)}-${quote.customerName.replace(/\s+/g, '-')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "PDF Downloaded",
      description: "Quote has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    if (window.confirm(`Send updated quote to ${quote.customerEmail}?`)) {
      sendQuoteMutation.mutate();
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(quote.status)}>
            {quote.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Created: {new Date(quote.createdAt!).toLocaleDateString()}
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isEditing ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => {
              if (isEditing) {
                setIsEditing(false);
                setEditedQuote(quote);
                // Reset items to original state
                if (quote.items && Array.isArray(quote.items) && quote.items.length > 0) {
                  setItems(quote.items.map((item: any) => ({
                    id: item.id || Math.random().toString(36).substr(2, 9),
                    name: item.name || `${quote.projectType} System`,
                    description: item.description || getServiceDescription(quote.projectType),
                    quantity: parseFloat(item.quantity) || 1,
                    unit: item.unit || 'pcs',
                    unitPrice: parseFloat(item.unitPrice || "0"),
                    total: parseFloat(item.total || (parseFloat(item.unitPrice || "0") * parseFloat(item.quantity || "1")))
                  })));
                } else {
                  // Reset to default items
                  const basePrice = parseFloat(quote.totalAmount || "100000");
                  setItems([{
                    id: '1',
                    name: `${quote.projectType.replace('_', ' ').toUpperCase()} Service`,
                    description: getServiceDescription(quote.projectType),
                    quantity: 1,
                    unit: 'service',
                    unitPrice: basePrice,
                    total: basePrice
                  }]);
                }
              } else {
                setIsEditing(true);
              }
            }}
          >
            {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
          {isEditing && (
            <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={handleDownloadPDF} className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Quote Document */}
      <Card className="admin-card print:shadow-none print:border-none">
        <CardContent className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">DT</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-blue-600">DripTech</h1>
                  <p className="text-sm text-muted-foreground">Professional Irrigation Solutions</p>
                </div>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                <p>Nairobi Industrial Area, Kenya</p>
                <p>Phone: +254 700 123 456</p>
                <p>Email: info@driptech.co.ke</p>
                <p>Website: www.driptech.co.ke</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">QUOTATION</h2>
              <div className="text-sm space-y-1 bg-muted p-3 rounded-lg">
                <p><strong>Quote #:</strong> {quote.id.slice(0, 8)}</p>
                <p><strong>Date:</strong> {new Date(quote.createdAt!).toLocaleDateString()}</p>
                <p><strong>Valid Until:</strong> {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Bill To:</h3>
              <div className="bg-muted p-4 rounded-lg space-y-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editedQuote.customerName}
                      onChange={(e) => setEditedQuote({...editedQuote, customerName: e.target.value})}
                      className="font-medium"
                    />
                    <Input
                      value={editedQuote.customerEmail}
                      onChange={(e) => setEditedQuote({...editedQuote, customerEmail: e.target.value})}
                    />
                    <Input
                      value={editedQuote.customerPhone}
                      onChange={(e) => setEditedQuote({...editedQuote, customerPhone: e.target.value})}
                    />
                    <Input
                      value={editedQuote.location}
                      onChange={(e) => setEditedQuote({...editedQuote, location: e.target.value})}
                    />
                  </div>
                ) : (
                  <>
                    <p className="font-medium">{quote.customerName}</p>
                    <p>{quote.customerEmail}</p>
                    <p>{quote.customerPhone}</p>
                    <p>{quote.location}</p>
                  </>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Details:</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Type:</span>
                  <span>{quote.projectType}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Area Size:</span>
                  <span>{quote.areaSize}</span>
                </div>
                {quote.cropType && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Crop Type:</span>
                    <span>{quote.cropType}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <span className="font-medium">Water Source:</span>
                  <span>{quote.waterSource || 'N/A'}</span>
                </div>
                {quote.budgetRange && (
                  <div className="grid grid-cols-2 gap-2">
                    <span className="font-medium">Budget Range:</span>
                    <span>{quote.budgetRange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Requirements */}
          {quote.requirements && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Project Requirements:</h3>
              <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm">{quote.requirements}</p>
              </div>
            </div>
          )}

          {/* Materials & Services */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Materials & Services:</h3>
              {isEditing && (
                <Button size="sm" onClick={addItem} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left py-3 px-4 border border-border">Description</th>
                    <th className="text-center py-3 px-4 border border-border w-20">Qty</th>
                    <th className="text-center py-3 px-4 border border-border w-20">Unit</th>
                    <th className="text-right py-3 px-4 border border-border w-32">Unit Price</th>
                    <th className="text-right py-3 px-4 border border-border w-32">Total</th>
                    {isEditing && <th className="text-center py-3 px-4 border border-border w-20">Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border">
                      <td className="py-3 px-4 border border-border">
                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              value={item.name}
                              onChange={(e) => updateItem(item.id!, 'name', e.target.value)}
                              placeholder="Item name"
                              className="font-medium"
                            />
                            <Textarea
                              value={item.description}
                              onChange={(e) => updateItem(item.id!, 'description', e.target.value)}
                              placeholder="Item description"
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        )}
                      </td>
                      <td className="text-center py-3 px-4 border border-border">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id!, 'quantity', parseInt(e.target.value) || 0)}
                            className="text-center"
                            min="1"
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>
                      <td className="text-center py-3 px-4 border border-border">
                        {isEditing ? (
                          <Input
                            value={item.unit}
                            onChange={(e) => updateItem(item.id!, 'unit', e.target.value)}
                            className="text-center"
                          />
                        ) : (
                          item.unit
                        )}
                      </td>
                      <td className="text-right py-3 px-4 border border-border">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id!, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="text-right"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          formatCurrency(item.unitPrice)
                        )}
                      </td>
                      <td className="text-right py-3 px-4 border border-border font-medium">
                        {formatCurrency(item.total)}
                      </td>
                      {isEditing && (
                        <td className="text-center py-3 px-4 border border-border">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id!)}
                            disabled={items.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT (16%):</span>
                <span>{formatCurrency(vat)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Terms and Conditions:</h3>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>• This quotation is valid for 30 days from the date of issue.</p>
              <p>• Prices are in Kenyan Shillings (KSh) and include delivery within Nairobi metropolitan area.</p>
              <p>• Installation services include complete system setup, testing, commissioning, and user training.</p>
              <p>• All equipment comes with manufacturer's warranty and 12 months service guarantee.</p>
              <p>• Payment terms: 50% deposit upon order confirmation, 50% upon project completion.</p>
              <p>• Project timeline will be confirmed upon order placement and site survey completion.</p>
              <p>• Any additional work outside this scope will be quoted separately.</p>
              <p>• Free maintenance visit included within first 6 months of installation.</p>
            </div>
          </div>

          {/* Footer */}
          <Separator className="mb-6" />
          <div className="text-center text-sm text-muted-foreground">
            <p className="font-medium text-blue-600 mb-2">Thank you for choosing DripTech for your irrigation needs!</p>
            <p>For any questions regarding this quotation, please contact us at +254 700 123 456</p>
            <p className="text-xs mt-3">This quotation was generated electronically and is valid without signature.</p>
          </div>
        </CardContent>
      </Card>

      {/* Internal Notes */}
      {quote.notes && (
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Internal Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{quote.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}