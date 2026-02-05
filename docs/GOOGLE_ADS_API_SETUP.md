# Google Ads API Setup Guide

**Last Updated:** February 5, 2026  
**Status:** Active

This guide walks you through setting up Google Ads API integration for the Mosquito Curtains attribution system.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Get Developer Token](#step-1-get-developer-token)
3. [Step 2: Create Google Cloud Project](#step-2-create-google-cloud-project)
4. [Step 3: Enable Google Ads API](#step-3-enable-google-ads-api)
5. [Step 4: Create OAuth Credentials](#step-4-create-oauth-credentials)
6. [Step 5: Get Refresh Token](#step-5-get-refresh-token)
7. [Step 6: Find Your Customer ID](#step-6-find-your-customer-id)
8. [Step 7: Configure Environment Variables](#step-7-configure-environment-variables)
9. [Step 8: Test the Connection](#step-8-test-the-connection)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before starting, ensure you have:

- [ ] Access to a Google Ads account (manager account preferred)
- [ ] A Google Cloud Platform account
- [ ] Admin access to the Google Ads account

---

## Step 1: Get Developer Token

The developer token is required for all Google Ads API calls.

1. **Go to Google Ads**
   - Log into [ads.google.com](https://ads.google.com)
   - Use a **Manager Account** (MCC) if you have one

2. **Navigate to API Center**
   - Click the **Tools & Settings** icon (wrench) in the top right
   - Under "Setup", click **API Center**
   - If you don't see API Center, you may need to create a Manager Account

3. **Apply for Developer Token**
   - Click **Apply for access**
   - Fill out the application form
   - Select **Basic Access** (sufficient for reading campaign data)

4. **Copy Your Developer Token**
   - Once approved, you'll see a 22-character alphanumeric token
   - Save this as `GOOGLE_ADS_DEVELOPER_TOKEN`

> **Note:** New tokens start as "pending" but can be used immediately with test accounts. Production use requires Google approval (usually 1-3 business days).

---

## Step 2: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)

2. **Create a New Project**
   - Click the project dropdown at the top
   - Click **New Project**
   - Name: `mosquito-curtains-ads` (or similar)
   - Click **Create**

3. **Select the Project**
   - Make sure your new project is selected in the dropdown

---

## Step 3: Enable Google Ads API

1. **Go to API Library**
   - In the left sidebar, click **APIs & Services** → **Library**

2. **Search for Google Ads API**
   - Type "Google Ads API" in the search bar
   - Click on **Google Ads API**

3. **Enable the API**
   - Click the blue **Enable** button

---

## Step 4: Create OAuth Credentials

1. **Go to Credentials**
   - In the left sidebar, click **APIs & Services** → **Credentials**

2. **Configure OAuth Consent Screen** (if not done)
   - Click **Configure Consent Screen**
   - Choose **External** (or Internal if using Google Workspace)
   - Fill in required fields:
     - App name: `Mosquito Curtains Analytics`
     - User support email: your email
     - Developer contact: your email
   - Click **Save and Continue**
   - Skip Scopes (not needed for this flow)
   - Add yourself as a test user
   - Click **Save and Continue**

3. **Create OAuth Client ID**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Mosquito Curtains Ads Client`
   - Authorized redirect URIs: Add `https://developers.google.com/oauthplayground`
   - Click **Create**

4. **Save Credentials**
   - Copy the **Client ID** → `GOOGLE_ADS_CLIENT_ID`
   - Copy the **Client Secret** → `GOOGLE_ADS_CLIENT_SECRET`

---

## Step 5: Get Refresh Token

The refresh token allows the server to access the API without user interaction.

1. **Go to OAuth Playground**
   - Visit [developers.google.com/oauthplayground](https://developers.google.com/oauthplayground)

2. **Configure OAuth Playground**
   - Click the **gear icon** (⚙️) in the top right
   - Check **"Use your own OAuth credentials"**
   - Enter your **Client ID** and **Client Secret**
   - Close the settings

3. **Select Google Ads API Scope**
   - In the left panel, find and expand **Google Ads API**
   - Check: `https://www.googleapis.com/auth/adwords`
   - Click **Authorize APIs**

4. **Sign In and Grant Access**
   - Sign in with the Google account that has access to your Google Ads
   - Click **Allow** to grant permissions
   - If you see a warning about unverified app, click **Advanced** → **Go to app**

5. **Exchange Authorization Code**
   - After redirect, click **Exchange authorization code for tokens**
   - Copy the **Refresh Token** → `GOOGLE_ADS_REFRESH_TOKEN`

> **Important:** The refresh token is long-lived. Keep it secure and never commit it to git.

---

## Step 6: Find Your Customer ID

1. **Go to Google Ads**
   - Log into [ads.google.com](https://ads.google.com)

2. **Find Customer ID**
   - Look at the top right, next to your account name
   - You'll see a number like `123-456-7890`
   - Remove the dashes: `1234567890`
   - Save as `GOOGLE_ADS_CUSTOMER_ID`

3. **If Using Manager Account (MCC)**
   - You'll also need the manager account ID
   - Save as `GOOGLE_ADS_LOGIN_CUSTOMER_ID`
   - The `CUSTOMER_ID` is the specific account you want to pull data from

---

## Step 7: Configure Environment Variables

Add these to your `.env.local`:

```bash
# Google Ads API Configuration
GOOGLE_ADS_DEVELOPER_TOKEN=your-22-character-token
GOOGLE_ADS_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your-client-secret
GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
GOOGLE_ADS_CUSTOMER_ID=1234567890
# Optional: If using manager account
GOOGLE_ADS_LOGIN_CUSTOMER_ID=9876543210
```

---

## Step 8: Test the Connection

1. **Run the test endpoint**
   ```bash
   curl -X GET http://localhost:3001/api/google-ads/test
   ```

2. **Expected Response**
   ```json
   {
     "success": true,
     "message": "Google Ads API connected successfully",
     "accountName": "Mosquito Curtains",
     "currency": "USD"
   }
   ```

3. **Trigger a manual sync**
   ```bash
   curl -X POST http://localhost:3001/api/google-ads/sync \
     -H "Content-Type: application/json" \
     -d '{"days": 7}'
   ```

---

## Troubleshooting

### "Developer token is not approved"
- New tokens work with test accounts immediately
- Production accounts require Google approval (1-3 days)
- Apply at: Google Ads → Tools → API Center

### "Invalid client_id"
- Ensure the OAuth client is type "Web application"
- Check that `https://developers.google.com/oauthplayground` is in redirect URIs

### "Invalid refresh token"
- Refresh tokens can expire if unused for 6 months
- Regenerate using OAuth Playground (Step 5)
- Make sure you're signed into the correct Google account

### "Customer not found"
- Verify the customer ID has no dashes
- If using MCC, ensure `LOGIN_CUSTOMER_ID` is set
- Confirm the OAuth user has access to the account

### "Insufficient permissions"
- The Google account used in OAuth must have at least **Read** access
- Check: Google Ads → Admin → Access and security

---

## What Data Gets Synced

Once configured, the daily sync pulls:

| Metric | Description |
|--------|-------------|
| `campaign_name` | Campaign name |
| `campaign_id` | Google Ads campaign ID |
| `cost_micros` | Spend in micros (divide by 1,000,000 for dollars) |
| `impressions` | Ad impressions |
| `clicks` | Ad clicks |
| `conversions` | Tracked conversions |
| `conversion_value` | Value of conversions |

Data is stored in `google_ads_campaigns` table and synced daily via Vercel cron.

---

## Next Steps

After setup:

1. Run initial backfill: `POST /api/google-ads/sync?days=90`
2. Verify data in Supabase: `SELECT * FROM google_ads_campaigns`
3. View in dashboard: `/admin/mc-sales/analytics`
