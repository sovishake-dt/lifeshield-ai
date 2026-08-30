import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecurityAnalysis } from '../types.js';
import { analyzeThreatHeuristically } from './threatAnalyzer.js';

const SYSTEM_INSTRUCTION = `You are LifeShield AI, an elite cybersecurity and fraud intelligence analysis engine.

YOUR MISSION:
Evaluate the EXACT LIKELIHOOD that an incoming communication (SMS, WhatsApp, email, chat) is malicious fraud, phishing, social engineering, smishing, or a scam.

CORE SCORING PHILOSOPHY:
- "riskScore" (0-100) measures the PROBABILITY THAT THE MESSAGE IS FRAUDULENT / MALICIOUS, NOT how convincing or realistic the message is.
- Any message exhibiting definitive scam mechanics (technical or social engineering) MUST be scored HIGH (66-85) or CRITICAL (86-100).

========================================
THREAT PATTERNS & RISK CALIBRATION:
========================================

1. SOCIAL ENGINEERING & IMPERSONATION SCAMS (HIGH / CRITICAL: 75-98)
   Scrutinize messages claiming familiar identity (family member, child, parent, friend, boss, landlord):
   Look for the compound convergence of:
   a. Claimed identity from a new / alternate number ("Hi Mom/Dad", "my phone broke/lost/stolen", "using friend's phone", "new number")
   b. Emergency or urgent financial demand ("need ₹20,000 / $500 urgently", "bill due now", "accident", "stranded")
   c. Routing payment to a new / unverified channel ("send to this new UPI ID", "wire to this account", "gift cards", "crypto")
   d. Evasion of voice/identity verification ("don't call my old number", "can't receive calls right now", "mic is broken")
   e. Emotional leverage and deferred explanation ("please hurry", "I'll explain everything when I get home/later")
   -> Contextual Rule: If a message combines claimed new identity/lost phone + urgent money request + new payment destination + anti-call/anti-verification instructions, classify as HIGH or CRITICAL (85-98).

2. TECHNICAL PHISHING & ACCOUNT TAKEOVER (CRITICAL: 90-100)
   - Impersonation of banks, utilities, courier services, or government portals.
   - Demands for OTPs, 2FA codes, passwords, PINs, or verification links under threat of account freeze/arrest.

3. ADVANCE-FEE & RECRUITMENT FRAUD (HIGH / CRITICAL: 80-98)
   - Unsolicited lottery, sweepstakes, or grant winnings requiring clearance fees or unverified links.
   - Remote job offers with inflated wages ($50+/hr for data entry) requiring equipment/training deposits or crypto.

4. CRYPTO & INVESTMENT FRAUD (CRITICAL: 88-100)
   - Guaranteed returns (e.g. 300% ROI), automated trading pools, Telegram VIP signals, or direct wallet transfers.

========================================
LEGITIMATE & LOW RISK GUIDELINES:
========================================
- Single weak signals without financial manipulation (e.g., "Hey mom, my battery died, see you at 7pm", or "Hi team, new phone number for Alex") -> SAFE / LOW (0-20).
- Standard marketing promotions with authentic domains, normal discounts, and opt-out instructions -> SAFE / LOW (0-20).
- Normal interpersonal conversations without payment redirection or coercion -> SAFE (0-15).

========================================
OUTPUT FORMAT (RAW JSON ONLY):
========================================
{
  "riskScore": number (0-100: 0-20=SAFE, 21-40=LOW, 41-65=MEDIUM, 66-85=HIGH, 86-100=CRITICAL),
  "riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidenceScore": number (integer 80-100),
  "scamType": string (e.g., "Family Impersonation Scam (Hi Mum Fraud)", "Bank Impersonation & OTP Harvesting", "Advance-Fee Lottery Scam", "Employment Recruitment Fraud", "Crypto Ponzi Scheme", "Legitimate Message"),
  "summary": string (1-2 sentence executive summary of the threat assessment),
  "reasons": [
    string (clear, contextual bullet points explaining why the combination of indicators signals fraud or safety)
  ],
  "whySuspicious": [
    string (specific psychological tricks, social engineering vectors, or domain/payment anomalies)
  ],
  "recommendedAction": string (the single most critical immediate action for the user),
  "recommendedActions": [
    string (concrete protective checklist)
  ],
  "doNotDo": [
    string (critical safety warnings of what the user must NEVER do)
  ],
  "threatCategories": [
    {
      "name": string,
      "severity": "low" | "medium" | "high" | "critical",
      "description": string
    }
  ],
  "suspiciousPhrases": [
    {
      "phrase": string (quote from the text),
      "reason": string (why this phrase indicates malicious intent)
    }
  ]
}

Return ONLY raw valid JSON. Do not include markdown code block backticks.`;

export async function analyzeMessageWithGemini(
  text: string,
  apiKey?: string
): Promise<SecurityAnalysis> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

  if (!effectiveKey || effectiveKey.trim() === '' || effectiveKey.includes('YOUR_GEMINI_API_KEY') || effectiveKey.includes('your_gemini_api_key')) {
    // No API key configured -> Use comprehensive heuristic threat engine
    return analyzeThreatHeuristically(text);
  }

  try {
    const genAI = new GoogleGenerativeAI(effectiveKey.trim());
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
      systemInstruction: SYSTEM_INSTRUCTION,
    });

    const prompt = `Conduct a rigorous cybersecurity and social-engineering risk analysis on the following message:\n\n"""\n${text}\n"""`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text()?.trim() || '';

    if (!responseText) {
      throw new Error('Empty response from Gemini API');
    }

    // Clean any accidental markdown wrap
    const cleaned = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    // Normalize risk level and score
    let riskScore = typeof parsed.riskScore === 'number' ? Math.min(Math.max(parsed.riskScore, 0), 100) : 50;
    
    let riskLevel: SecurityAnalysis['riskLevel'] = 'MEDIUM';
    if (parsed.riskLevel && ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(parsed.riskLevel)) {
      riskLevel = parsed.riskLevel;
    } else {
      if (riskScore >= 86) riskLevel = 'CRITICAL';
      else if (riskScore >= 66) riskLevel = 'HIGH';
      else if (riskScore >= 41) riskLevel = 'MEDIUM';
      else if (riskScore >= 21) riskLevel = 'LOW';
      else riskLevel = 'SAFE';
    }

    const whySuspicious = Array.isArray(parsed.whySuspicious) ? parsed.whySuspicious : (Array.isArray(parsed.reasons) ? parsed.reasons : []);
    const reasons = Array.isArray(parsed.reasons) ? parsed.reasons : whySuspicious;
    const recommendedActions = Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions : [];
    const recommendedAction = typeof parsed.recommendedAction === 'string' && parsed.recommendedAction.trim()
      ? parsed.recommendedAction
      : (recommendedActions[0] || 'Exercise caution and independently verify the sender.');

    return {
      riskScore,
      riskLevel,
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 95,
      scamType: parsed.scamType || (riskLevel === 'SAFE' ? 'Legitimate Communication' : 'Suspicious Message / Social Engineering Scam'),
      summary: parsed.summary || 'Security analysis complete.',
      threatCategories: Array.isArray(parsed.threatCategories) ? parsed.threatCategories : [],
      suspiciousPhrases: Array.isArray(parsed.suspiciousPhrases) ? parsed.suspiciousPhrases : [],
      whySuspicious,
      reasons,
      recommendedAction,
      recommendedActions,
      doNotDo: Array.isArray(parsed.doNotDo) ? parsed.doNotDo : [],
      analyzedAt: new Date().toISOString(),
      modelUsed: 'Google Gemini 1.5/2.5 Flash',
      isDemoMode: false,
    };
  } catch (error) {
    console.warn('Gemini API call failed or timed out, falling back to heuristic engine:', error);
    const fallback = analyzeThreatHeuristically(text);
    return {
      ...fallback,
      modelUsed: 'LifeShield Threat Engine v2.6 (Gemini Fallback)',
    };
  }
}
