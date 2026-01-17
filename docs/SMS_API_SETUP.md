# SMS API Setup Guide - DPI Platform

This guide explains how to obtain SMS API keys from popular Indian SMS service providers for the DPI notification service.

## 📱 Popular SMS API Providers in India

### 1. **MSG91** (Recommended for India)
- **Best for:** Indian market, government projects
- **Features:** DLT (Distributed Ledger Technology) compliant, high deliverability
- **Website:** https://msg91.com
- **Pricing:** Pay-as-you-go, volume discounts available

#### How to get MSG91 API Key:

1. **Sign up for MSG91:**
   - Go to https://msg91.com/signup
   - Create an account with your email/business details
   - Verify your email and phone number

2. **Complete KYC (Know Your Customer):**
   - Upload business documents (GST certificate, PAN, etc.)
   - Verify your business profile (required for production use)

3. **Get API Key:**
   - Log in to MSG91 dashboard
   - Go to **API** → **Authentication** or **Settings** → **API Keys**
   - Click **Generate New API Key**
   - Copy the API key (you'll see it only once - save it securely)

4. **Get Sender ID:**
   - Go to **Sender ID** section
   - Request a sender ID (e.g., "DPIGOV", "INDIA-GOV")
   - Note: Sender ID approval may take 24-48 hours

#### Environment Variables for MSG91:
```env
SMS_PROVIDER=msg91
SMS_API_KEY=your-msg91-api-key-here
SMS_API_URL=https://control.msg91.com/api/v5/flow/
SMS_SENDER_ID=DPIGOV
```

---

### 2. **Kaleyra** (formerly KAPSYSTEM)
- **Best for:** Enterprise solutions, international reach
- **Features:** Multi-channel messaging, analytics dashboard
- **Website:** https://www.kaleyra.com
- **Pricing:** Volume-based pricing

#### How to get Kaleyra API Key:

1. **Sign up:**
   - Visit https://www.kaleyra.com/signup
   - Create account with business details
   - Complete email verification

2. **Access Dashboard:**
   - Log in to Kaleyra dashboard
   - Navigate to **API & Integration** → **API Credentials**

3. **Generate API Key:**
   - Click **Generate New API Key**
   - Copy and save the API key securely

4. **Get Sender ID:**
   - Request sender ID from **Settings** → **Sender IDs**

#### Environment Variables for Kaleyra:
```env
SMS_PROVIDER=kaleyra
SMS_API_KEY=your-kaleyra-api-key-here
SMS_API_URL=https://api.kaleyra.io/v1/
SMS_SENDER_ID=DPIGOV
```

---

### 3. **Twilio** (International provider with India coverage)
- **Best for:** Global reach, developer-friendly
- **Features:** Excellent documentation, webhook support
- **Website:** https://www.twilio.com
- **Pricing:** Pay-per-message, free trial available

#### How to get Twilio API Key:

1. **Sign up:**
   - Go to https://www.twilio.com/try-twilio
   - Create free account (comes with trial credits)
   - Verify phone number

2. **Get Credentials:**
   - Go to **Console** → **Account** → **API Keys & Tokens**
   - You'll see:
     - **Account SID** (not secret, can be public)
     - **Auth Token** (keep secret!)
   - Or create new API key: **Create New API Key**

3. **Get Phone Number:**
   - Buy Indian phone number from **Phone Numbers** → **Buy a Number**
   - Or use Alphanumeric Sender ID (requires verification)

#### Environment Variables for Twilio:
```env
SMS_PROVIDER=twilio
SMS_API_KEY=your-twilio-account-sid
SMS_API_SECRET=your-twilio-auth-token
SMS_API_URL=https://api.twilio.com/2010-04-01/Accounts
SMS_FROM_NUMBER=+91XXXXXXXXXX
```

---

### 4. **TextLocal** (Affordable option for India)
- **Best for:** Cost-effective, simple integration
- **Features:** Bulk SMS, transactional SMS
- **Website:** https://www.textlocal.in
- **Pricing:** Low cost per SMS

#### How to get TextLocal API Key:

1. **Sign up:**
   - Visit https://www.textlocal.in/signup
   - Create account
   - Verify email and mobile

2. **Get API Key:**
   - Log in to dashboard
   - Go to **API** → **API Keys**
   - Generate new API key

3. **Get Sender ID:**
   - Request sender ID from dashboard

#### Environment Variables for TextLocal:
```env
SMS_PROVIDER=textlocal
SMS_API_KEY=your-textlocal-api-key-here
SMS_API_URL=https://api.textlocal.in/send/
SMS_SENDER_ID=TXTLCL
```

---

## 🔧 Configuration in .env File

Add these variables to your `.env` file:

### For MSG91 (Recommended):
```env
# SMS Configuration
SMS_PROVIDER=msg91
SMS_API_KEY=your-msg91-api-key-here
SMS_API_URL=https://control.msg91.com/api/v5/flow/
SMS_SENDER_ID=DPIGOV
SMS_ROUTE=4  # 1=Promotional, 4=Transactional
```

### For Kaleyra:
```env
SMS_PROVIDER=kaleyra
SMS_API_KEY=your-kaleyra-api-key
SMS_API_URL=https://api.kaleyra.io/v1/
SMS_SENDER_ID=DPIGOV
```

### For Twilio:
```env
SMS_PROVIDER=twilio
SMS_API_KEY=your-account-sid
SMS_API_SECRET=your-auth-token
SMS_API_URL=https://api.twilio.com/2010-04-01/Accounts
SMS_FROM_NUMBER=+91XXXXXXXXXX
```

### For TextLocal:
```env
SMS_PROVIDER=textlocal
SMS_API_KEY=your-textlocal-api-key
SMS_API_URL=https://api.textlocal.in/send/
SMS_SENDER_ID=TXTLCL
```

---

## 🧪 Testing SMS API

### Test with curl (MSG91 example):
```bash
curl -X POST https://control.msg91.com/api/v5/flow/ \
  -H "authkey: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "template_id": "your-template-id",
    "sender": "DPIGOV",
    "short_url": "0",
    "mobiles": "91XXXXXXXXXX",
    "VARIABLE_NAME": "value"
  }'
```

### Test with curl (Twilio example):
```bash
curl -X POST "https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json" \
  --data-urlencode "From=+91XXXXXXXXXX" \
  --data-urlencode "Body=Test message from DPI" \
  --data-urlencode "To=+91XXXXXXXXXX" \
  -u YOUR_ACCOUNT_SID:YOUR_AUTH_TOKEN
```

---

## 📋 Important Notes for India

### DLT (Distributed Ledger Technology) Compliance:
- **All SMS providers in India must be DLT compliant** (mandatory since 2021)
- You need to register templates on DLT portal before sending SMS
- Templates must be approved by telecom operators
- Each template has a unique template ID

### Steps for DLT Compliance:

1. **Register on DLT Portal:**
   - Visit https://dltconnect.in or provider-specific DLT portal
   - Register your entity/business

2. **Register Sender ID:**
   - Register your 6-character sender ID
   - Link to your business entity

3. **Register Templates:**
   - Create templates for each message type
   - Examples:
     - OTP: `Your DPI OTP is {{otp}}. Valid for 5 minutes.`
     - Appointment: `Your appointment with {{doctor}} on {{date}} is confirmed.`
   - Submit for approval (takes 2-7 days)

4. **Use Template ID:**
   - Use approved template ID in API calls
   - Replace variables with actual values

---

## 🔒 Security Best Practices

1. **Never commit API keys to Git:**
   - Keep `.env` file in `.gitignore`
   - Use environment variables in production

2. **Rotate API keys regularly:**
   - Change keys every 90 days
   - Revoke old keys after generating new ones

3. **Use different keys for dev/staging/production:**
   - Separate API keys for each environment
   - Monitor usage per environment

4. **Limit API key permissions:**
   - Some providers allow permission restrictions
   - Use read-only keys for monitoring, write keys for sending

---

## 💡 Recommendation for DPI Platform

**For Production (Government Project):**
- **Use MSG91** - Best DLT compliance, government-grade reliability
- Has experience with government projects
- Good support and documentation

**For Development/Testing:**
- **Use Twilio trial account** - Free credits, easy to test
- **Or MSG91 sandbox** - Test without consuming balance

---

## 📞 Support Resources

- **MSG91 Support:** support@msg91.com, +91-120-4004100
- **Kaleyra Support:** support@kaleyra.com
- **Twilio Support:** https://support.twilio.com
- **TextLocal Support:** support@textlocal.in

---

## 🚀 Quick Start

1. Choose a provider (MSG91 recommended for India)
2. Sign up and complete KYC
3. Generate API key from dashboard
4. Register sender ID and templates on DLT portal
5. Add credentials to `.env` file
6. Test with a sample SMS
7. Integrate into notification service

---

**Note:** For government projects, ensure your chosen provider has experience with government contracts and DLT compliance. MSG91 and Kaleyra are both good options.
