# Aisend Voice Demo

A voice AI demonstration application showcasing South African voice assistants for various scenarios including restaurants, medical clinics, estate agents, couriers, and solar consultants.

## Features

- 🎤 Interactive voice AI with South African accents and local phrases
- 🔊 Real-time text-to-speech using Deepgram
- 🤖 AI-powered conversations using Groq LLaMA
- 📱 Mobile-friendly phone UI interface
- 🎨 Visual cards and metadata display for different scenarios

## Scenarios

- **101** - Restaurant booking and ordering (TableBot)
- **102** - Medical clinic appointments (Sister Thandi)
- **103** - Real estate consultation (Sarah)
- **104** - Courier tracking (Sipho)
- **105** - Solar power consulting (David)

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Backend**: Cloudflare Pages Functions
- **AI/LLM**: Groq (LLaMA 3)
- **TTS**: Deepgram
- **Hosting**: Cloudflare Pages

## Deployment

### Prerequisites

1. A Cloudflare account
2. API keys for:
   - Groq API (for LLM)
   - Deepgram API (for text-to-speech)

### Deploy to Cloudflare Pages

#### Option 1: Using Cloudflare Dashboard (Recommended for first-time setup)

1. **Connect your repository to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Workers & Pages** > **Create application** > **Pages**
   - Connect your GitHub account and select this repository
   - Configure the build settings:
     - **Production branch**: `main`
     - **Build command**: (leave empty - static site)
     - **Build output directory**: `public`
   - Click **Save and Deploy**

2. **Set up environment variables:**
   - In the Cloudflare Pages project settings, go to **Settings** > **Environment variables**
   - Add the following secrets for **Production** environment:
     - `GROQ_API_KEY`: Your Groq API key
     - `DEEPGRAM_API_KEY`: Your Deepgram API key
   - Click **Save**

3. **Redeploy** to apply the environment variables

#### Option 2: Using GitHub Actions (Automated)

1. **Set up GitHub Secrets:**
   - Go to your repository's **Settings** > **Secrets and variables** > **Actions**
   - Add the following repository secrets:
     - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token (create one at [API Tokens](https://dash.cloudflare.com/profile/api-tokens) with "Cloudflare Pages — Edit" permissions)
     - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID (found in Cloudflare dashboard)

2. **Set up Cloudflare Pages Secrets:**
   - After the first deployment, go to your Pages project settings
   - Add the same environment variables as in Option 1

3. **Deploy:**
   - Push to the `main` branch, and GitHub Actions will automatically deploy
   - Or manually trigger the workflow from the Actions tab

#### Option 3: Using Wrangler CLI (For local testing and manual deployment)

1. **Install Wrangler:**
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare:**
   ```bash
   wrangler login
   ```

3. **Create secrets (first time only):**
   ```bash
   wrangler pages secret put GROQ_API_KEY --project-name=aisend-voice-demo
   wrangler pages secret put DEEPGRAM_API_KEY --project-name=aisend-voice-demo
   ```

4. **Deploy:**
   ```bash
   wrangler pages deploy public --project-name=aisend-voice-demo
   ```

5. **Test locally (optional):**
   ```bash
   wrangler pages dev public
   ```
   Note: For local testing with secrets, create a `.dev.vars` file:
   ```
   GROQ_API_KEY=your_groq_api_key
   DEEPGRAM_API_KEY=your_deepgram_api_key
   ```

### Continuous Deployment

Once set up with Option 1 or 2, every push to the `main` branch will automatically deploy to Cloudflare Pages.

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── functions/
│   └── api/
│       └── chat.js             # Cloudflare Pages Function for AI chat API
├── public/
│   ├── assets/                 # Static assets (images, etc.)
│   ├── index.html              # Main application page
│   └── style.css               # Styles
├── wrangler.toml               # Cloudflare configuration
└── README.md
```

## API Endpoints

- `POST /api/chat` - Main chat endpoint
  - Request body: `{ "scenario_id": "101" }` or `{ "scenario": "restaurant" }`
  - Response: `{ "text": "AI response", "audio": "base64-encoded-mp3", "metadata": {...} }`

## Configuration

The `wrangler.toml` file contains the Cloudflare Pages configuration:

```toml
name = "aisend-voice-demo"
pages_build_output_dir = "./public"
compatibility_date = "2024-06-01"
```

## Getting API Keys

### Groq API Key

1. Sign up at [Groq Console](https://console.groq.com/)
2. Navigate to API Keys section
3. Create a new API key
4. Copy and save it securely

### Deepgram API Key

1. Sign up at [Deepgram Console](https://console.deepgram.com/)
2. Navigate to API Keys section
3. Create a new API key with TTS permissions
4. Copy and save it securely

## Local Development

For local development without deploying:

1. Install Wrangler: `npm install -g wrangler`
2. Create `.dev.vars` file with your API keys (see format above)
3. Run: `wrangler pages dev public`
4. Open `http://localhost:8788` in your browser

## Troubleshooting

### "Invalid JSON" error
- Check that API keys are properly set in Cloudflare Pages environment variables
- Verify the request is sending valid JSON

### "Unknown scenario" error
- Ensure you're using valid magic numbers (101-105)
- Check the `chat.js` function for scenario definitions

### No audio playback
- Check that DEEPGRAM_API_KEY is set correctly
- Verify browser supports audio playback
- Check browser console for errors

### AI unavailable
- Verify GROQ_API_KEY is set correctly
- Check Groq API status and rate limits
- Verify you have sufficient credits

## License

This is a demonstration project for Aisend Enterprise.

## Support

For issues or questions, please open an issue in the GitHub repository.
