# Cloudflare Deployment Guide

This guide provides step-by-step instructions for deploying the Aisend Voice Demo to Cloudflare Pages.

## Prerequisites

Before you begin, ensure you have:

1. A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works)
2. A [Groq API key](https://console.groq.com/) (for AI/LLM)
3. A [Deepgram API key](https://console.deepgram.com/) (for text-to-speech)
4. This repository forked or accessible from your GitHub account

## Quick Start (Cloudflare Dashboard)

This is the recommended method for first-time deployment.

### Step 1: Connect Repository to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on **Workers & Pages** in the left sidebar
3. Click **Create application**
4. Select the **Pages** tab
5. Click **Connect to Git**
6. Authorize Cloudflare to access your GitHub account (if not already done)
7. Select the `aisend-voice-demo` repository
8. Click **Begin setup**

### Step 2: Configure Build Settings

On the setup page, configure the following:

- **Project name**: `aisend-voice-demo` (or your preferred name)
- **Production branch**: `main`
- **Framework preset**: None
- **Build command**: (leave empty)
- **Build output directory**: `public`

Click **Save and Deploy**

### Step 3: Add Environment Variables

After the initial deployment (it will fail without API keys):

1. Go to your Pages project in the Cloudflare dashboard
2. Click on **Settings** > **Environment variables**
3. Under **Production** tab, add:
   - Variable name: `GROQ_API_KEY`
     - Value: Your Groq API key
     - Click **Add variable**
   - Variable name: `DEEPGRAM_API_KEY`
     - Value: Your Deepgram API key
     - Click **Add variable**
4. Click **Save**

### Step 4: Redeploy

1. Go to **Deployments** tab
2. Click **Manage deployment** on the latest deployment
3. Click **Retry deployment**

Your application should now be live! 🎉

## Alternative: Deploy via Wrangler CLI

### Step 1: Install Wrangler

```bash
npm install -g wrangler
```

### Step 2: Authenticate

```bash
wrangler login
```

This will open a browser window to authenticate with Cloudflare.

### Step 3: Create the Project (First Time Only)

If you haven't created the project via the dashboard, create it now:

```bash
wrangler pages project create aisend-voice-demo
```

When prompted:
- Choose "public" as the production branch
- Choose "public" as the build output directory

### Step 4: Set Secrets

```bash
# Set Groq API key
wrangler pages secret put GROQ_API_KEY --project-name=aisend-voice-demo

# Set Deepgram API key
wrangler pages secret put DEEPGRAM_API_KEY --project-name=aisend-voice-demo
```

You'll be prompted to enter each secret value.

### Step 5: Deploy

```bash
wrangler pages deploy public --project-name=aisend-voice-demo
```

Your application will be deployed and you'll receive a deployment URL.

## Automated Deployments with GitHub Actions

This repository includes a GitHub Actions workflow that automatically deploys to Cloudflare Pages on every push to the `main` branch.

### Setup GitHub Actions

1. **Get your Cloudflare API Token:**
   - Go to [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - Click **Create Token**
   - Use the **Edit Cloudflare Workers** template
   - Add **Cloudflare Pages — Edit** permission
   - Click **Continue to summary** > **Create Token**
   - Copy the token (you won't be able to see it again!)

2. **Get your Cloudflare Account ID:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click on **Workers & Pages**
   - Your Account ID is displayed in the right sidebar

3. **Add GitHub Secrets:**
   - Go to your GitHub repository
   - Click **Settings** > **Secrets and variables** > **Actions**
   - Click **New repository secret**
   - Add:
     - Name: `CLOUDFLARE_API_TOKEN`, Value: (your API token from step 1)
     - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: (your account ID from step 2)

4. **Trigger Deployment:**
   - Push to the `main` branch, or
   - Manually trigger from **Actions** tab in GitHub

### Secrets in Cloudflare

Remember to also set the `GROQ_API_KEY` and `DEEPGRAM_API_KEY` secrets in Cloudflare Pages (see Step 3 in Quick Start above).

## Local Development

### Option 1: Using Wrangler Dev

```bash
# Install wrangler globally
npm install -g wrangler

# Create .dev.vars file
cp .dev.vars.example .dev.vars

# Edit .dev.vars and add your API keys
# Then run:
wrangler pages dev public
```

Open `http://localhost:8788` in your browser.

### Option 2: Using a Simple HTTP Server

If you don't need to test the API functions locally:

```bash
# Using Python
python -m http.server 8000 -d public

# Or using Node.js (if you have npx)
npx http-server public -p 8000
```

Open `http://localhost:8000` in your browser.

**Note:** The API functions won't work with this method.

## Verifying Deployment

After deployment, your app will be available at:
- Production: `https://aisend-voice-demo.pages.dev` (or your custom domain)
- Preview: `https://<branch-name>.aisend-voice-demo.pages.dev`

Test the application by:
1. Opening the URL in your browser
2. Entering a magic number (101-105)
3. Clicking "Call"
4. Verifying you receive an AI response with audio

## Custom Domain (Optional)

To add a custom domain:

1. Go to your Pages project in Cloudflare Dashboard
2. Click **Custom domains**
3. Click **Set up a custom domain**
4. Enter your domain name
5. Follow the DNS configuration instructions

## Troubleshooting

### Deployment fails

- **Check build logs** in the Cloudflare Pages dashboard
- Ensure your repository structure matches the expected format
- Verify `wrangler.toml` is valid

### API not working

- **Check environment variables** are set correctly in Cloudflare Pages
- Verify API keys are valid and have sufficient credits
- Check the Functions logs in Cloudflare Dashboard

### Functions not found (404)

- Ensure the `functions` directory is in the repository root
- Verify the function file is at `functions/api/chat.js`
- Check that functions are not excluded in `.gitignore`

### Local development issues

- Ensure `.dev.vars` file exists and contains valid API keys
- Verify Wrangler is installed correctly: `wrangler --version`
- Try clearing cache: `rm -rf .wrangler`

## Monitoring and Logs

To view logs:

1. Go to Cloudflare Dashboard
2. Navigate to your Pages project
3. Click on **Functions** tab
4. Click on **Real-time logs** or **Logs** to see function execution logs

## Updating the Application

### Via GitHub Actions (Automatic)

Simply push changes to the `main` branch:

```bash
git add .
git commit -m "Update application"
git push origin main
```

### Via Wrangler CLI (Manual)

```bash
wrangler pages deploy public --project-name=aisend-voice-demo
```

## Support

For Cloudflare-specific issues:
- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
- [Cloudflare Community](https://community.cloudflare.com/)

For application issues:
- Open an issue in the GitHub repository
