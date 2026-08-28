# LifeShield AI 🛡️

> **"Understand suspicious messages before they cost you."**

LifeShield AI is an intelligent cybersecurity threat intelligence platform built for **PromptWars × Parul University**. It analyzes suspicious SMS, WhatsApp messages, emails, fake job offers, bank OTP requests, and high-yield investment schemes to protect everyday users from social engineering, identity theft, and financial fraud.

---

## 🚀 Key Features

- **Cybersecurity-Grade Risk Scoring (0–100)**: Instant threat gauge with color-coded risk levels:
  - 🟢 **SAFE** (0–20)
  - 🔵 **LOW** (21–40)
  - 🟡 **MEDIUM** (41–65)
  - 🟠 **HIGH** (66–85)
  - 🔴 **CRITICAL** (86–100)
- **Deep Threat Categorization**: Multi-vector classification (Phishing/Smishing, OTP & 2FA Harvesting, Advance-Fee Fraud, Recruitment Scams, Crypto Ponzi Schemes, Domain Typosquatting, Urgent Coercion).
- **Suspicious Phrase Highlighting**: Extracts exact red-flag quotes from messages and provides specific security reasons.
- **Why It Is Suspicious**: Plain-English breakdown of psychological triggers, scam mechanics, and spoofed vectors.
- **Actionable Countermeasures**:
  - ✅ **Recommended Actions**: Clear step-by-step instructions (e.g. reporting to 1909 / cybercrime portal, contacting card providers).
  - 🚫 **Do NOT Do This**: High-visibility warnings highlighting dangerous actions (e.g. never sharing OTPs, clicking links, or paying advance fees).
- **Judge & Demo Mode (Zero-Config Required)**:
  - **Works 100% offline & without any API key**.
  - Includes **5 Competition Presets**:
    1. Fake prize/lottery scam
    2. Fake bank OTP request
    3. Fake job offer
    4. Suspicious investment message
    5. Legitimate promotional message
- **Live Google Gemini 2.5 Flash Engine**: Secure backend integration with structured JSON analysis schema when `GEMINI_API_KEY` is provided.
- **Zero-Storage Privacy Architecture**: Analyzed messages are evaluated in ephemeral memory and never stored in any database.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Backend API**: Express.js, TypeScript (`tsx`), CORS, Dotenv.
- **AI / LLM**: Google Gemini 2.5 Flash API (`@google/genai`).
- **Heuristic Threat Engine**: Rule-based pattern matching, regex analysis, domain spoof detection, and credential solicitation detection.

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18 or higher recommended; v24 tested)
- npm

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Configure Environment Variables (Optional)
To use live Google Gemini AI, copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
```
In `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```
*(Note: If no API key is provided, LifeShield AI automatically runs in Judge Demo Mode with complete heuristic capabilities).*

### 4. Run Development Server
Start both the backend API and the Vite frontend simultaneously:
```bash
npm run dev
```
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

---

## 🧪 Testing Scenarios for Judges

Click any of the **5 Preset Scenarios** on the dashboard:
1. **Fake Prize / Lottery Scam** → Evaluates advance-fee fraud, urgent 24-hr deadline, suspicious `.cc` domain.
2. **Fake Bank OTP Request** → Detects critical account takeover (ATO) attempt, OTP solicitation, spoofed urgency.
3. **Fake Job Offer** → Identifies recruitment scam, unrealistic $65/hr pay, and $150 refundable equipment deposit demand.
4. **Suspicious Investment Message** → Flags guaranteed 300% ROI Ponzi scheme, irreversible crypto transfer, and VIP Telegram group lures.
5. **Legitimate Promotional Message** → Verifies authentic brand promo, standard discount codes, and low risk score (SAFE).

---

## 🔒 Security & Privacy

- **No Frontend API Key Exposure**: The Gemini API key is accessed strictly by the backend server.
- **Repository Size Compliance**: Clean repository structure (< 2 MB source code). `node_modules`, `dist`, and `.env` are strictly excluded in `.gitignore`.

---

## 🏆 PromptWars × Parul University
Developed for PromptWars 2026 at Parul University.
LifeShield AI — *"Understand suspicious messages before they cost you."*
