const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

// Product key → R2 file mapping
// Add new products here as they launch
const PRODUCT_FILES = {
  'KDP Novel Factory': 'kdp-novel-factory-v2.0.0.tar.gz',
  // 'Puzzle Factory': 'puzzle-factory-v1.0.0.tar.gz',
};

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function sendEmail(to, downloadUrl, productName) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'orders@clawfactories.com',
      to,
      subject: `Your ${productName} is ready to download`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px; color: #1a1a2e;">
          <h1 style="color: #1a1a2e; font-size: 24px; margin-bottom: 8px;">You're all set.</h1>
          <p style="color: #444; font-size: 16px; line-height: 1.6;">
            Your <strong>${productName}</strong> is ready. Click the button below to download — 
            this link expires in 24 hours.
          </p>
          <div style="margin: 32px 0;">
            <a href="${downloadUrl}" 
               style="background: #3B82F6; color: white; text-decoration: none; padding: 14px 28px; 
                      border-radius: 8px; font-size: 16px; font-weight: 700; display: inline-block;">
              ⬇ Download ${productName}
            </a>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            <strong>How to install:</strong> Extract the file, then install via OpenClaw 
            (Skills → Install from folder). Your Claw will walk you through setup — 
            pen name, API key, genre preference. Takes about 5 minutes.
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Questions? Ask your Claw first — it knows the system inside out.<br>
            Still stuck? Reply to this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
          <p style="color: #999; font-size: 12px;">
            ClawFactories.com · <a href="https://clawfactories.com" style="color: #3B82F6;">clawfactories.com</a>
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook error: ${err.message}` };
  }

  if (stripeEvent.type !== 'checkout.session.completed' &&
      stripeEvent.type !== 'payment_intent.succeeded') {
    return { statusCode: 200, body: 'Ignored' };
  }

  try {
    let customerEmail, productName;

    if (stripeEvent.type === 'checkout.session.completed') {
      const session = stripeEvent.data.object;
      customerEmail = session.customer_details?.email;

      // Get line items to find product name
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      productName = lineItems.data[0]?.description || 'KDP Novel Factory';
    } else {
      // payment_intent.succeeded — for payment links
      const pi = stripeEvent.data.object;
      customerEmail = pi.receipt_email || pi.metadata?.email;
      productName = pi.metadata?.product_name || 'KDP Novel Factory';
    }

    if (!customerEmail) {
      console.error('No customer email found in event');
      return { statusCode: 200, body: 'No email — skipped' };
    }

    // Find the right file for this product
    const fileName = PRODUCT_FILES[productName] || PRODUCT_FILES['KDP Novel Factory'];

    // Generate signed URL — expires in 24 hours
    const signedUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: 'clawfactories-products',
        Key: fileName,
      }),
      { expiresIn: 86400 }
    );

    // Send delivery email
    await sendEmail(customerEmail, signedUrl, productName);

    console.log(`Delivery sent to ${customerEmail} for ${productName}`);
    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('Delivery error:', err);
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
