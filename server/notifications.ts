import type { Quote } from "@shared/schema";

export class NotificationService {
  static async sendQuoteEmail(quote: Quote): Promise<void> {
    // In production, integrate with email services like SendGrid, Mailgun, etc.
    const emailContent = this.generateQuoteEmail(quote);

    console.log(`📧 Email sent to ${quote.customerEmail}`);
    console.log("Email content:", emailContent);

    // TODO: Replace with actual email service integration
    // await emailService.send({
    //   to: quote.customerEmail,
    //   subject: `Your Irrigation Quote #${quote.id} - DripTech`,
    //   html: emailContent
    // });
  }

  static async sendWhatsAppNotification(quote: Quote): Promise<void> {
    // In production, integrate with WhatsApp Business API
    const message = `Hi ${quote.customerName}! Your irrigation quote #${quote.id} is ready. 

💧 Project: ${quote.projectType} for ${quote.areaSize}
📍 Location: ${quote.location}
💰 Estimated Cost: ${quote.totalAmount ? `KSh ${quote.totalAmount}` : 'Custom pricing'}

Check your email for the detailed quote. Questions? Reply to this message!

- DripTech Team`;

    console.log(`📱 WhatsApp sent to ${quote.customerPhone}`);
    console.log("Message:", message);
  }

  static async sendSMSNotification(quote: Quote): Promise<void> {
    // In production, integrate with SMS services like Twilio, Africa's Talking
    const message = `DripTech: Your irrigation quote #${quote.id} is ready! Check your email: ${quote.customerEmail}. Total: ${quote.totalAmount ? `KSh ${quote.totalAmount}` : 'Custom'}. Questions? Call +254 700 123 456`;

    console.log(`📱 SMS sent to ${quote.customerPhone}`);
    console.log("Message:", message);
  }

  private static generateQuoteEmail(quote: Quote): string {
    // Calculate totals from items if available
  const subtotal = quote.items && Array.isArray(quote.items) 
    ? quote.items.reduce((sum: number, item: any) => sum + (item.total || 0), 0)
    : parseFloat(quote.totalAmount || "0");
  const vat = subtotal * 0.16;
  const total = subtotal + vat;

  const itemsHTML = quote.items && Array.isArray(quote.items) && quote.items.length > 0
    ? quote.items.map((item: any) => {
        const itemQuantity = parseFloat(item.quantity) || 1;
        const itemUnitPrice = parseFloat(item.unitPrice) || 0;
        const itemTotal = parseFloat(item.total) || (itemQuantity * itemUnitPrice);
        
        return `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px; text-align: left;">
            <strong style="color: #1f2937; font-size: 14px;">${item.name}</strong><br>
            <small style="color: #6b7280; font-size: 12px; line-height: 1.4;">${item.description}</small>
          </td>
          <td style="padding: 12px 8px; text-align: center; font-weight: 500;">${itemQuantity}</td>
          <td style="padding: 12px 8px; text-align: center; color: #6b7280;">${item.unit}</td>
          <td style="padding: 12px 8px; text-align: right; color: #374151;">KSh ${itemUnitPrice.toLocaleString()}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #1f2937;">KSh ${itemTotal.toLocaleString()}</td>
        </tr>
      `;
      }).join('')
    : `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px; text-align: left;">
            <strong style="color: #1f2937; font-size: 14px;">${quote.projectType.replace('_', ' ').toUpperCase()} Irrigation System</strong><br>
            <small style="color: #6b7280; font-size: 12px; line-height: 1.4;">Complete irrigation system design and installation for ${quote.areaSize}</small>
          </td>
          <td style="padding: 12px 8px; text-align: center; font-weight: 500;">1</td>
          <td style="padding: 12px 8px; text-align: center; color: #6b7280;">system</td>
          <td style="padding: 12px 8px; text-align: right; color: #374151;">KSh ${subtotal.toLocaleString()}</td>
          <td style="padding: 12px 8px; text-align: right; font-weight: bold; color: #1f2937;">KSh ${subtotal.toLocaleString()}</td>
        </tr>
      `;

  const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your Professional Irrigation Quote - DripTech</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 700px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #2563eb, #16a34a); color: white; padding: 30px 20px; text-align: center; }
        .logo { font-size: 28px; font-weight: bold; margin-bottom: 5px; }
        .content { padding: 30px 20px; }
        .quote-info { background: #f8fafc; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 0 8px 8px 0; }
        .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb; }
        .items-table th { background: #f9fafb; padding: 12px 8px; text-align: left; border-bottom: 1px solid #e5e7eb; font-weight: bold; }
        .totals { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .total-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .total-final { font-size: 18px; font-weight: bold; color: #2563eb; border-top: 2px solid #2563eb; padding-top: 12px; margin-top: 12px; }
        .next-steps { background: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .step { margin: 10px 0; padding-left: 25px; position: relative; }
        .step::before { content: "✓"; position: absolute; left: 0; color: #22c55e; font-weight: bold; }
        .footer { background: #f8fafc; text-align: center; padding: 30px 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
        .contact-info { background: #fff7ed; border-left: 4px solid #f97316; padding: 15px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌱 DripTech</div>
          <div style="font-size: 16px; opacity: 0.9;">Professional Irrigation Solutions</div>
          <div style="font-size: 20px; margin-top: 10px;">Your Custom Quote is Ready!</div>
        </div>

        <div class="content">
          <h2 style="color: #1f2937; margin-bottom: 20px;">Dear ${quote.customerName},</h2>

          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for choosing DripTech for your irrigation needs. We've prepared a comprehensive 
            quote tailored specifically for your project requirements.
          </p>

          <div class="quote-info">
            <h3 style="color: #2563eb; margin-top: 0;">Quote #${quote.id.slice(0, 8)} - Project Details</h3>
            <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div>
                  <strong>Service Type:</strong> ${quote.projectType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}<br>
                  <strong>Area Size:</strong> ${quote.areaSize}<br>
                  <strong>Location:</strong> ${quote.location}
                </div>
                <div>
                  <strong>Water Source:</strong> ${quote.waterSource || 'N/A'}<br>
                  ${quote.cropType ? `<strong>Crop Type:</strong> ${quote.cropType}<br>` : ''}
                  ${quote.budgetRange ? `<strong>Budget Range:</strong> ${quote.budgetRange}` : ''}
                </div>
              </div>
            </div>
          </div>

          ${quote.requirements ? `
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
              <h4 style="margin-top: 0; color: #1e40af;">Your Requirements:</h4>
              <p style="margin-bottom: 0;">${quote.requirements}</p>
            </div>
          ` : ''}

          <h3 style="color: #1f2937;">Materials & Services Breakdown:</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Unit</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>KSh ${subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>VAT (16%):</span>
              <span>KSh ${vat.toLocaleString()}</span>
            </div>
            <div class="total-row total-final">
              <span>Total Investment:</span>
              <span>KSh ${total.toLocaleString()}</span>
            </div>
            <p style="font-size: 14px; color: #6b7280; margin-top: 15px; margin-bottom: 0;">
              *Price includes delivery within Nairobi metropolitan area
            </p>
          </div>

          <div class="next-steps">
            <h3 style="color: #16a34a; margin-top: 0;">What Happens Next?</h3>
            <div class="step">Our irrigation specialist will contact you within 2 business hours</div>
            <div class="step">Free comprehensive site survey and system design consultation</div>
            <div class="step">Professional installation with complete system testing</div>
            <div class="step">Comprehensive training on system operation and maintenance</div>
            <div class="step">12-month warranty and free maintenance visit</div>
          </div>

          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <h4 style="margin-top: 0; color: #92400e;">⏰ Special Offer Valid for 30 Days</h4>
            <p style="margin-bottom: 0;">This quotation is valid until ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}. 
            Contact us today to secure these prices and schedule your installation!</p>
          </div>

          <div class="contact-info">
            <h4 style="margin-top: 0; color: #ea580c;">📞 Ready to Proceed? Contact Us Now!</h4>
            <p style="margin-bottom: 0;">
              <strong>Phone:</strong> +254 700 123 456<br>
              <strong>Email:</strong> info@driptech.co.ke<br>
              <strong>WhatsApp:</strong> Available for quick consultations
            </p>
          </div>
        </div>

        <div class="footer">
          <div style="font-size: 16px; font-weight: bold; color: #2563eb; margin-bottom: 10px;">
            DripTech - Transforming Agriculture Through Smart Irrigation
          </div>
          <p style="margin: 10px 0;">📧 info@driptech.co.ke | 📱 +254 700 123 456 | 🌐 www.driptech.co.ke</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This quote was generated on ${new Date().toLocaleDateString()} and is valid for 30 days.<br>
            DripTech - Your trusted partner in sustainable irrigation solutions.
          </p>
        </div>
      </div>
    </body>
    </html>
    `;
    return emailHTML;
  }
}