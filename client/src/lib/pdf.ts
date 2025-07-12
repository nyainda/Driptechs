import type { Quote, Product } from "@shared/schema.ts";

// PDF generation utilities for DripTech documents
export class PDFGenerator {
  private static formatCurrency(amount: string): string {
    return `KSh ${parseFloat(amount).toLocaleString()}`;
  }

  private static formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static async generateQuotePDF(quote: Quote): Promise<void> {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    const html = this.generateQuoteHTML(quote);
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      printWindow.print();
      // Close window after printing (optional)
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  }

  private static generateQuoteHTML(quote: Quote): string {
    const subtotal = parseFloat(quote.totalAmount || "0");
    const vat = subtotal * 0.16;
    const total = subtotal + vat;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Quote #${quote.id} - DripTech</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }
          
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
          }
          
          .logo-section {
            flex: 1;
          }
          
          .logo {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
          }
          
          .logo-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #2563eb, #10b981);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
            margin-right: 12px;
          }
          
          .logo-text h1 {
            font-size: 28px;
            color: #2563eb;
            font-weight: bold;
          }
          
          .logo-text p {
            color: #6b7280;
            font-size: 14px;
          }
          
          .company-info {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.5;
          }
          
          .quote-info {
            text-align: right;
          }
          
          .quote-info h2 {
            font-size: 36px;
            color: #1f2937;
            margin-bottom: 16px;
          }
          
          .quote-details {
            font-size: 14px;
            line-height: 1.5;
          }
          
          .quote-details strong {
            color: #1f2937;
          }
          
          .customer-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
          }
          
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 16px;
          }
          
          .customer-info, .project-info {
            font-size: 14px;
            line-height: 1.6;
          }
          
          .customer-info p:first-child,
          .project-info p:first-child {
            font-weight: 600;
            color: #1f2937;
          }
          
          .requirements-section {
            margin-bottom: 40px;
          }
          
          .requirements-content {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            font-size: 14px;
            color: #4b5563;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          
          .items-table th {
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: #1f2937;
          }
          
          .items-table th:last-child,
          .items-table td:last-child {
            text-align: right;
          }
          
          .items-table td {
            border: 1px solid #e5e7eb;
            padding: 12px;
            font-size: 14px;
          }
          
          .item-description {
            color: #6b7280;
            font-size: 12px;
            margin-top: 4px;
          }
          
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 40px;
          }
          
          .totals-table {
            width: 320px;
          }
          
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .totals-row:last-child {
            border-bottom: 2px solid #1f2937;
            font-weight: bold;
            font-size: 18px;
            color: #1f2937;
            padding-top: 12px;
          }
          
          .terms-section {
            margin-bottom: 40px;
          }
          
          .terms-list {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
          }
          
          .terms-list li {
            margin-bottom: 8px;
          }
          
          .footer {
            text-align: center;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
            font-size: 14px;
            color: #6b7280;
          }
          
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .container {
              padding: 20px 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <div class="logo">
                <div class="logo-icon">DT</div>
                <div class="logo-text">
                  <h1>DripTech</h1>
                  <p>Irrigation Solutions</p>
                </div>
              </div>
              <div class="company-info">
                <p>Nairobi Industrial Area, Kenya</p>
                <p>Phone: +254 700 123 456</p>
                <p>Email: info@driptech.co.ke</p>
                <p>Website: www.driptech.co.ke</p>
              </div>
            </div>
            <div class="quote-info">
              <h2>QUOTATION</h2>
              <div class="quote-details">
                <p><strong>Quote #:</strong> ${quote.id}</p>
                <p><strong>Date:</strong> ${this.formatDate(quote.createdAt!)}</p>
                <p><strong>Valid Until:</strong> ${this.formatDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))}</p>
              </div>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="customer-section">
            <div>
              <h3 class="section-title">Bill To:</h3>
              <div class="customer-info">
                <p>${quote.customerName}</p>
                <p>${quote.customerEmail}</p>
                <p>${quote.customerPhone}</p>
                <p>${quote.location}</p>
              </div>
            </div>
            <div>
              <h3 class="section-title">Project Details:</h3>
              <div class="project-info">
                <p><strong>Type:</strong> ${quote.projectType}</p>
                <p><strong>Area Size:</strong> ${quote.areaSize}</p>
                ${quote.cropType ? `<p><strong>Crop Type:</strong> ${quote.cropType}</p>` : ''}
                <p><strong>Location:</strong> ${quote.location}</p>
              </div>
            </div>
          </div>

          ${quote.requirements ? `
          <!-- Requirements -->
          <div class="requirements-section">
            <h3 class="section-title">Project Requirements:</h3>
            <div class="requirements-content">
              ${quote.requirements}
            </div>
          </div>
          ` : ''}

          <!-- Quote Items -->
          <h3 class="section-title">Quote Items:</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${quote.projectType} Irrigation System</strong>
                  <div class="item-description">Complete irrigation system design and installation for ${quote.areaSize}</div>
                </td>
                <td>1</td>
                <td>${quote.totalAmount ? this.formatCurrency(quote.totalAmount) : "TBD"}</td>
                <td>${quote.totalAmount ? this.formatCurrency(quote.totalAmount) : "TBD"}</td>
              </tr>
            </tbody>
          </table>

          <!-- Totals -->
          <div class="totals-section">
            <div class="totals-table">
              <div class="totals-row">
                <span>Subtotal:</span>
                <span>${quote.totalAmount ? this.formatCurrency(quote.totalAmount) : "TBD"}</span>
              </div>
              <div class="totals-row">
                <span>VAT (16%):</span>
                <span>${quote.totalAmount ? this.formatCurrency(vat.toFixed(2)) : "TBD"}</span>
              </div>
              <div class="totals-row">
                <span>Total:</span>
                <span>${quote.totalAmount ? this.formatCurrency(total.toFixed(2)) : "TBD"}</span>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="terms-section">
            <h3 class="section-title">Terms and Conditions:</h3>
            <ul class="terms-list">
              <li>This quotation is valid for 30 days from the date of issue.</li>
              <li>Prices are in Kenyan Shillings (KSh) and include delivery within Nairobi.</li>
              <li>Installation services include system setup, testing, and basic training.</li>
              <li>All products come with manufacturer's warranty as specified.</li>
              <li>Payment terms: 50% deposit, 50% on completion.</li>
              <li>Project timeline will be confirmed upon order confirmation.</li>
            </ul>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>Thank you for considering DripTech for your irrigation needs.</p>
            <p>For any questions regarding this quotation, please contact us at +254 700 123 456</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  static async generateBOQ(quote: Quote, products: Product[]): Promise<void> {
    // Similar implementation for Bill of Quantities
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window');
    }

    const html = this.generateBOQHTML(quote, products);
    
    printWindow.document.write(html);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    };
  }

  private static generateBOQHTML(quote: Quote, products: Product[]): string {
    // Generate detailed Bill of Quantities HTML
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>BOQ #${quote.id} - DripTech</title>
        <style>
          /* Similar styles to quote PDF */
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; color: #2563eb; }
          /* Add more specific BOQ styles */
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">BILL OF QUANTITIES</h1>
          <p>Quote #${quote.id} - ${quote.customerName}</p>
        </div>
        <!-- BOQ content would go here -->
      </body>
      </html>
    `;
  }

  // Utility method to download PDF as file (requires a PDF library in production)
  static downloadPDF(html: string, filename: string): void {
    // In production, use a library like jsPDF or Puppeteer
    // For now, this opens the print dialog
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

// Export helper functions
export const generateQuotePDF = PDFGenerator.generateQuotePDF.bind(PDFGenerator);
export const generateBOQ = PDFGenerator.generateBOQ.bind(PDFGenerator);
export const downloadPDF = PDFGenerator.downloadPDF.bind(PDFGenerator);
