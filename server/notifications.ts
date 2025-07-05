
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
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your Irrigation Quote - DripTech</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .quote-details { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .total { background: #22c55e; color: white; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌱 DripTech Irrigation Solutions</h1>
          <p>Your Professional Irrigation Quote</p>
        </div>
        
        <div class="content">
          <h2>Hello ${quote.customerName}!</h2>
          <p>Thank you for choosing DripTech! Your custom irrigation quote is ready.</p>
          
          <div class="quote-details">
            <h3>Quote #${quote.id} Details:</h3>
            <p><strong>Project Type:</strong> ${quote.projectType}</p>
            <p><strong>Area Size:</strong> ${quote.areaSize}</p>
            <p><strong>Location:</strong> ${quote.location}</p>
            <p><strong>Water Source:</strong> ${quote.waterSource || 'To be confirmed'}</p>
            ${quote.cropType ? `<p><strong>Crop Type:</strong> ${quote.cropType}</p>` : ''}
            ${quote.numberOfBeds ? `<p><strong>Number of Beds:</strong> ${quote.numberOfBeds}</p>` : ''}
            ${quote.budgetRange ? `<p><strong>Budget Range:</strong> ${quote.budgetRange}</p>` : ''}
          </div>
          
          ${quote.totalAmount ? `
          <div class="total">
            Estimated Total: KSh ${parseFloat(quote.totalAmount).toLocaleString()}
          </div>
          ` : `
          <div class="total">
            Custom Pricing - Our team will contact you within 2 hours
          </div>
          `}
          
          <h3>What's Next?</h3>
          <ul>
            <li>✅ Our irrigation specialist will call you within 2 hours</li>
            <li>📋 Free site visit and detailed system design</li>
            <li>💯 Professional installation with warranty</li>
            <li>🎓 Complete training on system operation</li>
          </ul>
          
          <p><strong>Questions?</strong> Reply to this email or call us at <strong>+254 700 123 456</strong></p>
        </div>
        
        <div class="footer">
          <p>DripTech - Transforming Agriculture Through Smart Irrigation</p>
          <p>📧 info@driptech.co.ke | 📱 +254 700 123 456</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }
}
