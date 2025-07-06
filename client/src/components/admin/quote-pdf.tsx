import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Printer, Edit, Mail } from "lucide-react";
import type { Quote } from "@shared/schema";

interface QuotePDFProps {
  quote: Quote;
}

export default function QuotePDF({ quote }: QuotePDFProps) {
  const formatCurrency = (amount: string) => {
    return `KSh ${parseFloat(amount).toLocaleString()}`;
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

  const handleDownloadPDF = () => {
    const printContent = document.querySelector('.quote-content')?.innerHTML || '';
    const originalContent = document.body.innerHTML;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quote #${quote.id} - DripTech Irrigation</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .company-header { display: flex; align-items: center; margin-bottom: 20px; }
            .company-logo { width: 48px; height: 48px; background: linear-gradient(to bottom right, #2563eb, #16a34a); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 18px; margin-right: 12px; }
            .company-info h1 { margin: 0; color: #2563eb; font-size: 24px; }
            .company-info p { margin: 2px 0; color: #6b7280; font-size: 14px; }
            .quote-header { text-align: right; margin-bottom: 30px; }
            .quote-header h2 { font-size: 28px; margin: 0 0 10px 0; }
            .customer-details { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f9fafb; font-weight: 600; }
            .text-right { text-align: right; }
            .total-section { margin-left: auto; width: 300px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #374151; padding-top: 8px; }
            .terms { margin-top: 30px; }
            .terms ul { list-style: none; padding: 0; }
            .terms li { margin-bottom: 8px; font-size: 14px; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="quote-document">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px;">
              <div>
                <div class="company-header">
                  <div class="company-logo">DT</div>
                  <div class="company-info">
                    <h1>DripTech</h1>
                    <p>Irrigation Solutions</p>
                  </div>
                </div>
                <div style="color: #6b7280; font-size: 14px;">
                  <p>Nairobi Industrial Area, Kenya</p>
                  <p>Phone: +254 700 123 456</p>
                  <p>Email: info@driptech.co.ke</p>
                  <p>Website: www.driptech.co.ke</p>
                </div>
              </div>
              <div class="quote-header">
                <h2>QUOTATION</h2>
                <div style="font-size: 14px;">
                  <p><strong>Quote #:</strong> ${quote.id}</p>
                  <p><strong>Date:</strong> ${new Date(quote.createdAt!).toLocaleDateString()}</p>
                  <p><strong>Valid Until:</strong> ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <hr style="margin: 30px 0;">

            <div class="customer-details">
              <div>
                <div class="section-title">Bill To:</div>
                <div>
                  <p style="font-weight: 500;">${quote.customerName}</p>
                  <p>${quote.customerEmail}</p>
                  <p>${quote.customerPhone}</p>
                  <p>${quote.location}</p>
                </div>
              </div>
              <div>
                <div class="section-title">Project Details:</div>
                <div>
                  <p><strong>Type:</strong> ${quote.projectType}</p>
                  <p><strong>Area Size:</strong> ${quote.areaSize}</p>
                  ${quote.cropType ? `<p><strong>Crop Type:</strong> ${quote.cropType}</p>` : ''}
                  <p><strong>Location:</strong> ${quote.location}</p>
                </div>
              </div>
            </div>

            ${quote.requirements ? `
              <div style="margin-bottom: 30px;">
                <div class="section-title">Project Requirements:</div>
                <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px;">
                  <p style="font-size: 14px; margin: 0;">${quote.requirements}</p>
                </div>
              </div>
            ` : ''}

            <div style="margin-bottom: 30px;">
              <div class="section-title">Quote Items:</div>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th class="text-right">Quantity</th>
                    <th class="text-right">Unit Price</th>
                    <th class="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div>
                        <p style="font-weight: 500; margin: 0;">${quote.projectType} Irrigation System</p>
                        <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0 0;">Complete irrigation system design and installation for ${quote.areaSize}</p>
                      </div>
                    </td>
                    <td class="text-right">1</td>
                    <td class="text-right">${quote.totalAmount ? `KSh ${parseFloat(quote.totalAmount).toLocaleString()}` : "TBD"}</td>
                    <td class="text-right">${quote.totalAmount ? `KSh ${parseFloat(quote.totalAmount).toLocaleString()}` : "TBD"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display: flex; justify-content: end; margin-bottom: 30px;">
              <div class="total-section">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>${quote.totalAmount ? `KSh ${parseFloat(quote.totalAmount).toLocaleString()}` : "TBD"}</span>
                </div>
                <div class="total-row">
                  <span>VAT (16%):</span>
                  <span>${quote.totalAmount ? `KSh ${(parseFloat(quote.totalAmount) * 0.16).toLocaleString()}` : "TBD"}</span>
                </div>
                <hr style="margin: 8px 0;">
                <div class="total-row total-final">
                  <span>Total:</span>
                  <span>${quote.totalAmount ? `KSh ${(parseFloat(quote.totalAmount) * 1.16).toLocaleString()}` : "TBD"}</span>
                </div>
              </div>
            </div>

            <div class="terms">
              <div class="section-title">Terms and Conditions:</div>
              <ul>
                <li>• This quotation is valid for 30 days from the date of issue.</li>
                <li>• Prices are in Kenyan Shillings (KSh) and include delivery within Nairobi.</li>
                <li>• Installation services include system setup, testing, and basic training.</li>
                <li>• All products come with manufacturer's warranty as specified.</li>
                <li>• Payment terms: 50% deposit, 50% on completion.</li>
                <li>• Project timeline will be confirmed upon order confirmation.</li>
              </ul>
            </div>

            <div class="footer">
              <p>Thank you for considering DripTech for your irrigation needs.</p>
              <p>For any questions regarding this quotation, please contact us at +254 700 123 456</p>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    const subject = `Quote #${quote.id} - DripTech Irrigation Solutions`;
    const body = `Dear ${quote.customerName},\n\nPlease find attached your irrigation system quote.\n\nBest regards,\nDripTech Team`;
    window.open(`mailto:${quote.customerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
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
          <Button variant="outline" size="sm" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
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
                  <p className="text-sm text-muted-foreground">Irrigation Solutions</p>
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
              <div className="text-sm space-y-1">
                <p><strong>Quote #:</strong> {quote.id}</p>
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
              <div className="space-y-1">
                <p className="font-medium">{quote.customerName}</p>
                <p>{quote.customerEmail}</p>
                <p>{quote.customerPhone}</p>
                <p>{quote.location}</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Project Details:</h3>
              <div className="space-y-1">
                <p><strong>Type:</strong> {quote.projectType}</p>
                <p><strong>Area Size:</strong> {quote.areaSize}</p>
                {quote.cropType && <p><strong>Crop Type:</strong> {quote.cropType}</p>}
                <p><strong>Location:</strong> {quote.location}</p>
              </div>
            </div>
          </div>

          {/* Project Requirements */}
          {quote.requirements && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Project Requirements:</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">{quote.requirements}</p>
              </div>
            </div>
          )}

          {/* Quote Items */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Quote Items:</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-right py-3 px-4">Quantity</th>
                    <th className="text-right py-3 px-4">Unit Price</th>
                    <th className="text-right py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items && Array.isArray(quote.items) && quote.items.length > 0 ? (
                    quote.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{item.name || `${quote.projectType} System`}</p>
                            <p className="text-sm text-muted-foreground">{item.description || 'Complete irrigation system design and installation'}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">{item.quantity || 1}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(item.unitPrice || quote.totalAmount || "0")}</td>
                        <td className="text-right py-3 px-4">{formatCurrency(item.total || quote.totalAmount || "0")}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{quote.projectType} Irrigation System</p>
                          <p className="text-sm text-muted-foreground">Complete irrigation system design and installation for {quote.areaSize}</p>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">1</td>
                      <td className="text-right py-3 px-4">{quote.totalAmount ? formatCurrency(quote.totalAmount) : "TBD"}</td>
                      <td className="text-right py-3 px-4">{quote.totalAmount ? formatCurrency(quote.totalAmount) : "TBD"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{quote.totalAmount ? formatCurrency(quote.totalAmount) : "TBD"}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (16%):</span>
                  <span>{quote.totalAmount ? formatCurrency((parseFloat(quote.totalAmount) * 0.16).toString()) : "TBD"}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>{quote.totalAmount ? formatCurrency((parseFloat(quote.totalAmount) * 1.16).toString()) : "TBD"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Terms and Conditions:</h3>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>• This quotation is valid for 30 days from the date of issue.</p>
              <p>• Prices are in Kenyan Shillings (KSh) and include delivery within Nairobi.</p>
              <p>• Installation services include system setup, testing, and basic training.</p>
              <p>• All products come with manufacturer's warranty as specified.</p>
              <p>• Payment terms: 50% deposit, 50% on completion.</p>
              <p>• Project timeline will be confirmed upon order confirmation.</p>
            </div>
          </div>

          {/* Footer */}
          <Separator className="mb-6" />
          <div className="text-center text-sm text-muted-foreground">
            <p>Thank you for considering DripTech for your irrigation needs.</p>
            <p>For any questions regarding this quotation, please contact us at +254 700 123 456</p>
          </div>
        </CardContent>
      </Card>

      {/* Additional Notes */}
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
