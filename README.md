<div align="center">

# 🛡️ AuditShield

### Automated Security Auditing for the Modern Enterprise

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Groq](https://img.shields.io/badge/AI-Groq%20Llama%203-F55036?style=flat-square)](https://groq.com)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

*Stop secret sprawl before it becomes a breach.*

</div>

---

## 📖 What is AuditShield?

AuditShield is a **continuous, automated security auditing platform** that connects to your company's data sources — GitHub, Google Drive, uploaded files — and instantly detects sensitive information leaks, exposed credentials, and compliance risks.

Think of it as a **24/7 security operations team** that never sleeps: scanning every commit, every file, every document in real time, so you don't have to.

---

## 🚨 The Problem: Secret Sprawl

Modern engineering teams move fast — and secrets leak faster.

| Risk | Example |
|------|---------|
| 🔑 Exposed credentials | AWS keys accidentally pushed to a public GitHub repo |
| 📂 Unprotected cloud files | PII spreadsheets shared publicly on Google Drive |
| 📄 Sensitive documents | Medical records or contracts stored without access controls |

Manual audits are **slow**, **inconsistent**, and **don't scale**. By the time a human reviewer catches a leak, the damage is already done.

---

## ✅ The Solution

AuditShield replaces manual audits with an always-on detection engine:

- **Connects** to GitHub, Google Drive, and file uploads
- **Scans** data in real time using pattern matching + AI
- **Alerts** your team instantly via Slack
- **Generates** audit reports for compliance and leadership

---

## ✨ Core Features

### 🔍 GitHub Live Monitoring
Detects secrets in code the moment they're pushed.

- Receives GitHub webhook events on every push
- Fetches changed file diffs via the GitHub API
- Runs **regex pattern matching** (e.g., `sk-`, `AIza`) and **entropy analysis** to catch unknown secret formats
- Stores alerts and triggers immediate notifications
- Can open an automated PR to remove the detected secret

### ☁️ Google Drive Integration
Finds sensitive files hiding in cloud storage.

- OAuth2-based connection to Google Drive API v3
- Recursively crawls folders for `.pdf`, `.docx`, `.txt`, and other file types
- Checks file permissions and sharing status
- Flags publicly accessible files containing sensitive content
- Suggests remediation: restrict access

### 🤖 AI-Powered Document Scanner
Catches what regex can't — complex, contextual sensitive data.

- Extracts text from PDFs (`pdfjs-dist`) and DOCX files (`mammoth`)
- Splits content into ~4,000-character chunks for LLM processing
- Sends each chunk to **Groq Llama-3** with a structured detection prompt
- Returns structured JSON identifying:
  - **PII** — names, IDs, credit cards, medical data
  - **Secrets** — tokens, credentials, private keys
  - **Policy violations** — confidential data handled improperly

### 📊 Automated Audit Reports
Turns raw alerts into executive-ready reports.

- Aggregates unresolved alerts with time-based filtering
- AI analyzes severity and frequency patterns
- Outputs a full report including:
  - **Security score**
  - **Risk summary**
  - **Recommended remediation actions**

### 🔔 Slack Notifications
Reduces mean time to respond (MTTR) by pushing alerts where your team already works.

- Triggers on every Medium or higher severity alert
- Uses Slack's Block Kit API for rich, formatted messages
- Includes a direct **"Investigate"** action button
- Webhook URL stored securely per user profile

---

## 🏗️ Architecture

AuditShield follows a **decoupled architecture** — a React frontend, a Node.js/Express backend engine, a Supabase database, and an AI layer powered by Groq.

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│         Dashboard · Alerts · Reports · Settings          │
└────────────────────────┬────────────────────────────────┘
                         │ REST API
┌────────────────────────▼────────────────────────────────┐
│                  Backend (Node.js / Express)              │
│   Webhook Handler · API Integrations · Scan Orchestrator  │
└──────┬──────────────────┬──────────────────┬────────────┘
       │                  │                  │
┌──────▼──────┐  ┌────────▼────────┐  ┌─────▼──────────┐
│  Supabase   │  │   GitHub API    │  │  Google Drive  │
│ (PostgreSQL)│  │  Webhooks + REST│  │   API v3       │
│             │  └─────────────────┘  └────────────────┘
│ · alerts    │
│ · repos     │  ┌─────────────────────────────────────┐
│ · profiles  │  │         AI Layer (Groq SDK)          │
└─────────────┘  │  Llama 3 · Document Classification  │
                 │  Report Generation · Risk Analysis   │
                 └─────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express |
| **Database** | Supabase (PostgreSQL) |
| **AI Model** | Groq SDK — Llama 3 |
| **Integrations** | GitHub API, Google Drive API v3, Slack Blocks API |
| **Auth** | OAuth2 (Google), Supabase Auth |
| **Document Parsing** | pdfjs-dist (PDF), mammoth (DOCX) |

---

## 🔄 User Flow

```
1. Onboard      →  Sign in → Connect GitHub + Google Drive
        ↓
2. Monitor      →  Backend listens for webhooks & file activity
        ↓
3. Detect       →  Developer pushes AWS key → Regex + entropy scan fires
        ↓
4. Alert        →  Alert saved to DB → Slack notification sent → Dashboard updated
        ↓
5. Remediate    →  User clicks "Neutralise" → AuditShield opens PR to remove secret
        ↓
6. Report       →  Generate audit report → Security score + fixes + risk summary
```

---

## 🗄️ Database Schema

| Table | Purpose |
|-------|---------|
| `alerts` | All detected security issues with severity, source, and status |
| `connected_repos` | GitHub repository integrations per user |
| `profiles` | User settings, Slack webhook URLs, and preferences |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Groq](https://groq.com) API key
- GitHub OAuth App (for webhook integration)
- Google Cloud project with Drive API v3 enabled

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/auditshield.git
cd auditshield

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# GitHub
GITHUB_WEBHOOK_SECRET=your_webhook_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google Drive
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

# Slack
SLACK_DEFAULT_WEBHOOK_URL=your_slack_webhook_url
```

### Running the App

```bash
# Start the backend
cd backend
npm run dev

# Start the frontend (in a new terminal)
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 📡 GitHub Webhook Setup

1. Go to your GitHub repository → **Settings → Webhooks → Add webhook**
2. Set the **Payload URL** to `https://your-domain.com/api/github/webhook`
3. Set **Content type** to `application/json`
4. Choose **Just the push event**
5. Add your `GITHUB_WEBHOOK_SECRET` to both GitHub and your `.env`

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built to keep secrets secret. 🔐

</div>
