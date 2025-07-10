import sgMail from '@sendgrid/mail';
import type { Quote } from '@shared/schema';

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('SENDGRID_API_KEY not configured');
    return false;
  }

  try {
    await sgMail.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generateQuoteEmailHTML(quote: Quote): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .quote-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; }
        .button { 
          display: inline-block; 
          background: #2563eb; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 6px;
          margin: 20px 0;
        }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        th { background: #f8f9fa; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>DripTech Irrigation Solutions</h1>
        <p>Your Quote is Ready!</p>
      </div>
      
      <div class="content">
        <h2>Dear ${quote.customerName},</h2>
        
        <p>Thank you for your interest in our irrigation solutions. We've prepared a customized quote based on your requirements.</p>
        
        <div class="quote-details">
          <h3>Quote Details</h3>
          <table>
            <tr><th>Project Type:</th><td>${quote.projectType}</td></tr>
            <tr><th>Location:</th><td>${quote.location}</td></tr>
            <tr><th>Area Size:</th><td>${quote.areaSize}</td></tr>
            ${quote.cropType ? `<tr><th>Crop Type:</th><td>${quote.cropType}</td></tr>` : ''}
            ${quote.waterSource ? `<tr><th>Water Source:</th><td>${quote.waterSource}</td></tr>` : ''}
            ${quote.budgetRange ? `<tr><th>Budget Range:</th><td>${quote.budgetRange}</td></tr>` : ''}
            ${quote.totalAmount ? `<tr><th>Total Amount:</th><td>${quote.currency} ${parseFloat(quote.totalAmount || '0').toLocaleString()}</td></tr>` : ''}
          </table>
        </div>
        
        ${quote.requirements ? `
          <div class="quote-details">
            <h3>Your Requirements</h3>
            <p>${quote.requirements}</p>
          </div>
        ` : ''}
        
        ${quote.notes ? `
          <div class="quote-details">
            <h3>Additional Notes</h3>
            <p>${quote.notes}</p>
          </div>
        ` : ''}
        
        <p>Our team will contact you within 24 hours to discuss the next steps and answer any questions you may have.</p>
        
        <a href="tel:+254700000000" class="button">Call Us: +254 700 000 000</a>
        <a href="mailto:info@driptech.co.ke" class="button">Email Us</a>
      </div>
      
      <div class="footer">
        <p><strong>DripTech Irrigation Solutions</strong></p>
        <p>Professional irrigation systems for modern agriculture</p>
        <p>Email: info@driptech.co.ke | Phone: +254 700 000 000</p>
        <p>Visit us: www.driptech.co.ke</p>
      </div>
    </body>
    </html>
  `;
}

export async function sendQuoteEmail(quote: Quote): Promise<boolean> {
  const emailHTML = generateQuoteEmailHTML(quote);
  
  return await sendEmail({
    to: quote.customerEmail,
    from: process.env.SENDGRID_FROM_EMAIL || 'quotes@driptech.co.ke',
    subject: `Your DripTech Irrigation Quote - ${quote.projectType}`,
    html: emailHTML,
    text: `Dear ${quote.customerName},\n\nThank you for your interest in our irrigation solutions. Your quote for ${quote.projectType} in ${quote.location} is ready.\n\nProject Details:\n- Area Size: ${quote.areaSize}\n${quote.cropType ? `- Crop Type: ${quote.cropType}\n` : ''}${quote.totalAmount ? `- Total Amount: ${quote.currency} ${parseFloat(quote.totalAmount || '0').toLocaleString()}\n` : ''}\nOur team will contact you within 24 hours.\n\nBest regards,\nDripTech Irrigation Solutions\nPhone: +254 700 000 000\nEmail: info@driptech.co.ke`
  });
}