# 🌾 Agri-Reasoning Interface

A modern, Open-WebUI inspired chat interface for agricultural advisory generation using LLM models. Built with React, Tailwind CSS, and supports both **Google Gemini API** and **OpenAI-compatible APIs** (like lit-gpt).

![Interface Preview](https://img.shields.io/badge/React-18.2-61DAFB?logo=react) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite) ![Gemini](https://img.shields.io/badge/Gemini-2.0-4285F4?logo=google)

## ✨ Features

- **Dark Theme UI** - Open-WebUI inspired modern dark interface
- **Dual API Support** - Google Gemini 2.0 Flash or local Lit-GPT
- **Collapsible Input Sections** - Organized input parameters (Basic, Weather, Soil, Advanced)
- **Streaming Responses** - Real-time streaming from LLM API
- **Thinking Token Support** - Displays "Thinking..." animation for `<think>...</think>` tokens
- **Environment-based Configuration** - API keys read from `.env` file
- **Responsive Design** - Works on desktop and tablet devices

## 📋 Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **API Access** - One of the following:
  - **Saarthi Agri-Model** (Default) - In-house OpenWebUI at chat.soket.ai
  - Google Gemini API key
  - Local lit-gpt server

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Saarthi Agri-Model Configuration (In-house OpenWebUI - chat.soket.ai)
# Pre-configured - no changes needed for default setup
VITE_SAARTHI_API_KEY=sk-9d09b7df9cbd5daebca67cbbb45e9f0c
VITE_SAARTHI_BASE_URL=https://chat.soket.ai/api/chat/completions

# Gemini API Configuration (optional - get key from https://aistudio.google.com/apikey)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Local Lit-GPT Configuration (optional)
VITE_LITGPT_BASE_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000`

### 4. Select API Provider

In the interface sidebar, use the **API Provider** dropdown to choose:
- **✨ Gemini 2.0 Flash** - Uses Google's Gemini API (requires API key)
- **🔧 Lit-GPT (Local)** - Uses local OpenAI-compatible server

### 5. Build for Production

```bash
npm run build
```

Production files will be in the `dist/` directory.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SAARTHI_API_KEY` | Saarthi API key | Pre-configured |
| `VITE_SAARTHI_BASE_URL` | Saarthi API endpoint | `https://chat.soket.ai/api/chat/completions` |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | (optional) |
| `VITE_LITGPT_BASE_URL` | Lit-GPT server URL | `http://localhost:8000` |

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

### API Configuration in Code

The API configuration is in `src/agri_advisory_interface.tsx`:

```typescript
const API_CONFIG = {
  // Saarthi Agri-Model (In-house OpenWebUI)
  saarthiApiKey: import.meta.env.VITE_SAARTHI_API_KEY || 'sk-9d09b7df9cbd5daebca67cbbb45e9f0c',
  saarthiBaseUrl: import.meta.env.VITE_SAARTHI_BASE_URL || 'https://chat.soket.ai/api/chat/completions',
  saarthiModel: 'Saarthi Agri-Model',
  
  // Gemini API
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  geminiModel: 'gemini-2.0-flash',
  geminiBaseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
  
  // Lit-GPT / OpenAI-compatible API (fallback)
  litgptBaseUrl: import.meta.env.VITE_LITGPT_BASE_URL || 'http://localhost:8000',
  litgptModel: 'agri-reasoning',
};
```

### Vite Proxy Configuration

The `vite.config.js` includes proxy settings for local development with lit-gpt:

```javascript
proxy: {
  '/v1': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
  '/api': {
    target: 'http://localhost:8000',
    changeOrigin: true,
  },
}
```

## 📡 API Endpoints

### Saarthi Agri-Model (Default)

**POST** `https://chat.soket.ai/api/chat/completions`

OpenAI-compatible chat completions with streaming. Requires Bearer token authentication.

```bash
curl -X POST https://chat.soket.ai/api/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-9d09b7df9cbd5daebca67cbbb45e9f0c" \
  -d '{
    "model": "Saarthi Agri-Model",
    "messages": [
      {"role": "system", "content": "You are an expert agricultural advisor..."},
      {"role": "user", "content": "Generate advisory for Crop: Cotton..."}
    ],
    "stream": true,
    "temperature": 0.7
  }'
```

### Gemini API (Alternative)

**POST** `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent`

Streaming content generation with Gemini.

```json
{
  "contents": [
    {
      "parts": [{ "text": "Generate agricultural advisory..." }]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "maxOutputTokens": 4096
  }
}
```

### Lit-GPT / OpenAI-Compatible API (Alternative)

**POST** `/v1/chat/completions`

OpenAI-compatible chat completions endpoint with streaming support.

```json
{
  "model": "agri-reasoning",
  "messages": [
    {"role": "system", "content": "You are an expert agricultural advisor..."},
    {"role": "user", "content": "Generate advisory for Crop: Cotton, Region: Punjab..."}
  ],
  "stream": true,
  "temperature": 0.7,
  "max_tokens": 2048
}
```

## 🎨 Input Parameters

### Basic Information
- **Crop** (required) - e.g., Cotton, Wheat, Rice
- **Region** (required) - e.g., Punjab, Maharashtra
- **Language** - Response language (English, Hindi, Punjabi, etc.)
- **Season** - Kharif, Rabi, Zaid, Year-round

### Weather Conditions
- **Average Temperature** (°C)
- **Humidity** (%)
- **Rainfall** (mm)

### Soil Information
- **Soil Type** - Alluvial, Black, Red, Laterite, etc.
- **Soil pH**
- **Soil Moisture** (%)

### Advanced Settings
- **Growth Stage** - Pre-sowing, Germination, Vegetative, etc.
- **Irrigation Type** - Drip, Sprinkler, Flood, etc.
- **Previous Crop**
- **Farm Size** (acres)

## 🧠 Thinking Token Support

The interface handles reasoning models that output thinking tokens:

```
<think>
Analyzing the crop requirements for cotton in Punjab region...
Considering the soil type and weather conditions...
</think>

Based on my analysis, here are my recommendations...
```

- During `<think>...</think>` blocks, displays animated "Thinking..." indicator
- After completion, thinking content is available in a collapsible section

## 📁 Project Structure

```
frontend/
├── index.html              # Entry HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── src/
    ├── main.jsx                    # React entry point
    ├── index.css                   # Global styles
    └── agri_advisory_interface.tsx # Main application component
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔌 Backend Setup (lit-gpt Example)

If using lit-gpt, ensure your server is running with OpenAI-compatible API:

```bash
# Example lit-gpt server start
python -m litgpt.serve --model your-agri-model --port 8000
```

The server should expose:
- `POST /v1/chat/completions` - Chat completions with streaming support

## 🐛 Troubleshooting

### Gemini API Key Not Working
1. Verify your API key is correct in the `.env` file
2. Ensure the key has access to the Gemini API
3. Check that `VITE_GEMINI_API_KEY` is prefixed correctly (Vite requires `VITE_` prefix)
4. Restart the dev server after changing `.env` files

### CORS Issues (Lit-GPT)
If you encounter CORS errors with local Lit-GPT, ensure your backend allows requests from `http://localhost:3000` or configure the Vite proxy.

### Port Already in Use
Vite will automatically try the next available port if 3000 is in use.

### API Connection Failed
**For Gemini:**
1. Check your internet connection
2. Verify API key is set in `.env`
3. Ensure you haven't exceeded API rate limits

**For Lit-GPT:**
1. Verify your LLM backend is running
2. Check the `VITE_LITGPT_BASE_URL` in `.env`
3. Ensure the model name matches your deployed model

### Environment Variables Not Loading
1. Make sure `.env` file is in the `frontend/` directory
2. All variables must be prefixed with `VITE_`
3. Restart the dev server after changes

## 📄 License

MIT License - feel free to use and modify for your projects.

---

**Built for Agricultural Advisory Systems** 🌱 | Powered by Saarthi Agri-Model, Google Gemini & Lit-GPT
