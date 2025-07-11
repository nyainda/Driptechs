import sgMail from '@sendgrid/mail';

// Set SendGrid API key if available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail(params) {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.log('SendGrid API key not configured. Email would be sent to:', params.to);
      return true;
    }

    const msg = {
      to: params.to,
      from: params.from || 'quotes@driptech.co.ke',
      subject: params.subject,
      text: params.text,
      html: params.html,
    };

    await sgMail.send(msg);
    console.log(\`Email sent successfully to \${params.to}\`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generateQuoteEmailHTML(quote) {
  const currentDate = new Date().toLocaleDateString();
  
  return \`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quote from DripTech Irrigation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: #16a34a; color: white; padding: 20px; text-align: center; }
        .content { padding: 30px; }
        .quote-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 14px; color: #666; }
        .btn { display: inline-block; background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .highlight { color: #16a34a; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>DripTech Irrigation Solutions</h1>
          <p>Premium Irrigation Systems for Kenya</p>
        </div>
        
        <div class="content">
          <h2>Dear \${quote.customerName},</h2>
          
          <p>Thank you for your interest in our irrigation solutions. We're pleased to provide you with a customized quote for your <span class="highlight">\${quote.projectType}</span> project.</p>
          
          <div class="quote-details">
            <h3>Quote Details</h3>
            <p><strong>Quote ID:</strong> \${quote.id}</p>
            <p><strong>Project Type:</strong> \${quote.projectType}</p>
            <p><strong>Area Size:</strong> \${quote.areaSize}</p>
            <p><strong>Location:</strong> \${quote.location}</p>
            \${quote.cropType ? \`<p><strong>Crop Type:</strong> \${quote.cropType}</p>\` : ''}
            \${quote.totalAmount ? \`<p><strong>Total Amount:</strong> \${quote.currency} \${quote.totalAmount}</p>\` : ''}
            <p><strong>Date:</strong> \${currentDate}</p>
          </div>
          
          \${quote.requirements ? \`
          <div class="quote-details">
            <h3>Your Requirements</h3>
            <p>\${quote.requirements}</p>
          </div>
          \` : ''}
          
          <p>Our team has carefully analyzed your requirements and prepared a solution that will maximize your crop yield while optimizing water usage.</p>
          
          <p><strong>Next Steps:</strong></p>
          <ul>
            <li>Review the quote details</li>
            <li>Contact us for any clarifications</li>
            <li>Schedule a site visit if needed</li>
            <li>Confirm your order to begin installation</li>
          </ul>
          
          <p>We're committed to providing you with the best irrigation solution for your needs. Our expert team is ready to support you throughout the entire process.</p>
          
          <a href="tel:+254700000000" class="btn">Call Us: +254 700 000 000</a>
          <a href="mailto:info@driptech.co.ke" class="btn">Email Us</a>
        </div>
        
        <div class="footer">
          <p><strong>DripTech Irrigation Solutions</strong></p>
          <p>Email: info@driptech.co.ke | Phone: +254 700 000 000</p>
          <p>Website: www.driptech.co.ke</p>
          <p>Transforming Agriculture, One Drop at a Time</p>
        </div>
      </div>
    </body>
    </html>
  \`;
}

export async function sendQuoteEmail(quote) {
  const subject = \`Your Irrigation Quote - \${quote.projectType} Project\`;
  const html = generateQuoteEmailHTML(quote);
  const text = \`
Dear \${quote.customerName},

Thank you for your interest in DripTech Irrigation Solutions. 

Quote Details:
- Quote ID: \${quote.id}
- Project Type: \${quote.projectType}
- Area Size: \${quote.areaSize}
- Location: \${quote.location}
\${quote.totalAmount ? \`- Total Amount: \${quote.currency} \${quote.totalAmount}\` : ''}

We look forward to working with you on this project.

Best regards,
DripTech Irrigation Solutions
Phone: +254 700 000 000
Email: info@driptech.co.ke
  \`;

  return await sendEmail({
    to: quote.customerEmail,
    from: 'quotes@driptech.co.ke',
    subject,
    text,
    html,
  });
}