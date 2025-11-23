# Chapa Payment Gateway Integration Guide

**Chapa** is a leading payment gateway in Ethiopia and East Africa, supporting multiple payment methods including cards, mobile money, and bank transfers.

---

## 🚀 Quick Start

### 1. Create Chapa Account

1. Visit [Chapa Dashboard](https://dashboard.chapa.co)
2. Sign up for a business account
3. Complete KYC verification
4. Get your API keys from the dashboard

### 2. Get API Keys

**Test Mode** (for development):

```
CHAPA_SECRET_KEY=CHASECK_TEST-xxxxxxxxxxxxxxxxxx
```

**Live Mode** (for production):

```
CHAPA_SECRET_KEY=CHASECK-xxxxxxxxxxxxxxxxxx
```

---

## 💳 Supported Payment Methods

Chapa supports multiple payment methods:

1. **Credit/Debit Cards**

   - Visa
   - Mastercard
   - American Express

2. **Mobile Money**

   - Telebirr (Ethiopia)
   - M-Pesa (Kenya)
   - MTN Mobile Money (Uganda)
   - Airtel Money

3. **Bank Transfer**
   - Direct bank transfers from Ethiopian banks

---

## 🔧 Backend Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Development
CHAPA_SECRET_KEY=CHASECK_TEST-your-test-key
BACKEND_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3001

# Production
CHAPA_SECRET_KEY=CHASECK-your-live-key
BACKEND_URL=https://your-backend.up.railway.app
FRONTEND_URL=https://your-app.vercel.app
```

### Webhook Configuration

In your Chapa Dashboard:

1. Go to **Settings** → **Webhooks**
2. Add webhook URL:
   ```
   https://your-backend.up.railway.app/api/chapa/webhook
   ```
3. Select events to receive notifications for:
   - `charge.success`
   - `charge.failed`

---

## 📱 Frontend Integration

### Using the Chapa Payment Component

```typescript
import ChapaPayment from "@/components/ChapaPayment";

function CheckoutPage() {
  const handleSuccess = (orderId: string) => {
    console.log("Payment successful!", orderId);
    router.push(`/orders/${orderId}/success`);
  };

  const handleError = (error: string) => {
    console.error("Payment failed:", error);
  };

  return (
    <ChapaPayment
      amount={totalAmount}
      cartId={cartId}
      userEmail="customer@example.com"
      userPhone="+251912345678"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
}
```

---

## 🔄 Payment Flow

### 1. Initialize Payment

**Endpoint**: `POST /api/chapa/initialize`

**Request**:

```json
{
  "amount": 1000,
  "currency": "ETB",
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+251912345678",
  "cartId": "cart_id_here"
}
```

**Response**:

```json
{
  "success": true,
  "orderId": "order_id_here",
  "checkoutUrl": "https://checkout.chapa.co/checkout/web/...",
  "txRef": "ADDISCART-1234567890-abc123"
}
```

### 2. Redirect to Checkout

Frontend redirects user to `checkoutUrl` where they complete payment.

### 3. Payment Callback

After payment, Chapa redirects user back to:

```
https://your-app.vercel.app/orders/{orderId}/success
```

### 4. Verify Payment

**Endpoint**: `GET /api/chapa/verify/:txRef`

**Response**:

```json
{
  "success": true,
  "order": { ... },
  "payment": {
    "status": "success",
    "amount": 1000,
    "currency": "ETB",
    "txRef": "ADDISCART-1234567890-abc123"
  }
}
```

---

## 🧪 Testing

### Test Cards

Chapa provides test cards for different scenarios:

**Successful Payment**:

```
Card Number: 4200 0000 0000 0000
CVV: Any 3 digits
Expiry: Any future date
```

**Failed Payment**:

```
Card Number: 4100 0000 0000 0000
CVV: Any 3 digits
Expiry: Any future date
```

### Test Mobile Money

Use the test phone numbers provided in Chapa dashboard for mobile money testing.

### Test Bank Transfer

In test mode, bank transfers are automatically approved after a few seconds.

---

## 📊 Currency Support

Chapa supports multiple currencies:

- **ETB** - Ethiopian Birr (Primary)
- **KES** - Kenyan Shilling
- **UGX** - Ugandan Shilling
- **TZS** - Tanzanian Shilling
- **USD** - US Dollar

**Currency Conversion**: Chapa automatically handles currency conversion based on current exchange rates.

---

## 🔐 Security Best Practices

### 1. **Never Expose Secret Key**

```bash
# ❌ Don't do this
const chapa = new Chapa('CHASECK-your-secret-key');

# ✅ Use environment variables
const chapa = new Chapa(process.env.CHAPA_SECRET_KEY);
```

### 2. **Verify Webhook Signatures**

Always verify that webhook requests come from Chapa:

```javascript
const crypto = require("crypto");

function verifyWebhookSignature(payload, signature) {
  const hash = crypto
    .createHmac("sha256", process.env.CHAPA_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest("hex");

  return hash === signature;
}
```

### 3. **Validate Payment Amounts**

Always verify the payment amount matches your order:

```javascript
if (payment.amount !== order.total) {
  throw new Error("Payment amount mismatch");
}
```

### 4. **Use HTTPS**

Ensure all API endpoints use HTTPS in production.

---

## 🎯 API Endpoints

### 1. Initialize Payment

```
POST /api/chapa/initialize
```

Creates a new payment session and returns checkout URL.

### 2. Verify Payment

```
GET /api/chapa/verify/:txRef
```

Verifies payment status and updates order.

### 3. Webhook Handler

```
POST /api/chapa/webhook
```

Receives payment notifications from Chapa.

### 4. Get Payment Methods

```
GET /api/chapa/payment-methods
```

Returns available payment methods.

### 5. Get Banks

```
GET /api/chapa/banks
```

Returns list of supported banks for bank transfers.

---

## 🐛 Troubleshooting

### Issue: Payment Initialization Fails

**Symptoms**: `POST /api/chapa/initialize` returns error

**Solutions**:

1. Verify `CHAPA_SECRET_KEY` is set correctly
2. Check that all required fields are provided
3. Ensure amount is a valid number > 0
4. Verify phone number includes country code (e.g., +251)

### Issue: Webhook Not Receiving Events

**Symptoms**: Order status not updating after payment

**Solutions**:

1. Verify webhook URL is configured in Chapa dashboard
2. Check webhook URL is accessible (use ngrok for local testing)
3. Ensure webhook endpoint accepts POST requests
4. Check server logs for errors

### Issue: Payment Verification Fails

**Symptoms**: `GET /api/chapa/verify/:txRef` returns error

**Solutions**:

1. Verify transaction reference is correct
2. Wait a few seconds after payment before verifying
3. Check Chapa dashboard for transaction status
4. Ensure API key has necessary permissions

### Issue: Amount Mismatch

**Symptoms**: Different amount charged than expected

**Solutions**:

1. Verify currency is correctly specified
2. Check for currency conversion fees
3. Ensure amount is sent in the smallest currency unit
4. Review Chapa fee structure

---

## 💰 Pricing & Fees

Chapa charges transaction fees:

- **Ethiopian Cards**: 2.5%
- **International Cards**: 3.5%
- **Mobile Money**: 2%
- **Bank Transfer**: 1.5%

**Minimum Fee**: No minimum  
**Maximum Fee**: No maximum

_Fees are subject to change. Check [Chapa Pricing](https://chapa.co/pricing) for latest rates._

---

## 📞 Support

### Chapa Support

- **Email**: support@chapa.co
- **Phone**: +251 11 xxx xxxx
- **Dashboard**: https://dashboard.chapa.co
- **Documentation**: https://developer.chapa.co

### Technical Issues

- Check [Chapa Status](https://status.chapa.co) for service status
- Review [API Documentation](https://developer.chapa.co/docs)
- Contact Chapa technical support

---

## 🚀 Going Live

### Pre-Launch Checklist

- [ ] KYC verification completed
- [ ] Business bank account linked
- [ ] Live API keys obtained
- [ ] Webhook configured with production URL
- [ ] Test transactions completed successfully
- [ ] Payment flow tested end-to-end
- [ ] Error handling implemented
- [ ] Security best practices followed
- [ ] SSL certificate installed
- [ ] Compliance requirements met

### Production Configuration

```bash
# Railway/Vercel Environment Variables
CHAPA_SECRET_KEY=CHASECK-your-live-key
BACKEND_URL=https://your-backend.up.railway.app
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Monitoring

Set up monitoring for:

- Payment success rate
- Failed payment reasons
- Webhook delivery status
- API response times
- Error rates

---

## 📝 Example Implementation

### Complete Checkout Flow

```typescript
// 1. Frontend: Initialize payment
const initiatePayment = async () => {
  const response = await fetch("/api/chapa/initialize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: 1000,
      currency: "ETB",
      email: "customer@example.com",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+251912345678",
      cartId: "cart123",
    }),
  });

  const data = await response.json();

  // Redirect to Chapa checkout
  window.location.href = data.checkoutUrl;
};

// 2. Backend: Handle webhook
router.post("/webhook", async (req, res) => {
  const { tx_ref, status } = req.body;

  const order = await Order.findOne({ txRef: tx_ref });

  if (status === "success") {
    order.paymentStatus = "paid";
    order.status = "confirmed";
    await order.save();

    // Send confirmation email
    await sendOrderConfirmation(order);
  }

  res.json({ message: "Webhook processed" });
});

// 3. Frontend: Verify payment on success page
useEffect(() => {
  const verifyPayment = async () => {
    const response = await fetch(`/api/chapa/verify/${txRef}`);
    const data = await response.json();

    if (data.success) {
      setOrderConfirmed(true);
    }
  };

  verifyPayment();
}, [txRef]);
```

---

## 🎓 Best Practices

1. **Always verify payments server-side** - Never trust client-side verification alone
2. **Handle all payment statuses** - success, pending, failed, cancelled
3. **Implement idempotency** - Handle duplicate webhook events gracefully
4. **Log all transactions** - Keep detailed logs for debugging and auditing
5. **Test thoroughly** - Test all payment methods and edge cases
6. **Monitor actively** - Set up alerts for failed payments
7. **Provide clear feedback** - Show users clear payment status messages
8. **Handle errors gracefully** - Implement retry logic and fallback options

---

## 📚 Additional Resources

- [Chapa Developer Documentation](https://developer.chapa.co)
- [Chapa Node.js SDK](https://www.npmjs.com/package/chapa)
- [Payment Integration Guide](https://developer.chapa.co/docs/integration-guide)
- [Webhook Documentation](https://developer.chapa.co/docs/webhooks)
- [Security Guidelines](https://developer.chapa.co/docs/security)

---

**Last Updated**: November 23, 2025  
**Integration Version**: 1.0.0
