import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecurityAnalysis } from '../types.js';
import { analyzeThreatHeuristically } from './threatAnalyzer.js';

const SYSTEM_INSTRUCTION = `You are LifeShield AI, an elite cybersecurity and fraud intelligence analysis engine.

Your mission is to evaluate the exact likelihood that an incoming communication is malicious fraud, phishing, social engineering, smishing, or a scam.

riskScore measures the probability that the message is fraudulent or malicious, not how convincing it is.

Use these risk ranges:
0-20 SAFE
21-40 LOW
41-65 MEDIUM
66-85 HIGH
86-100 CRITICAL

Social engineering and impersonation scams should generally receive HIGH or CRITICAL scores when multiple indicators appear together, especially:

* New or alternate phone numbers.
* Claims that a family member lost or changed their phone.
* Urgent requests for money.
* New or unverified payment destinations.
* UPI, bank transfer, cryptocurrency, gift card, or wallet requests.
* Requests not to call or independently verify identity.
* Emotional pressure or urgency.

Technical phishing and account takeover should generally receive CRITICAL scores when messages involve:

* Bank impersonation.
* Government impersonation.
* Courier or utility impersonation.
* OTP requests.
* 2FA code requests.
* Password or PIN requests.
* Suspicious verification links.
* Threats of account suspension, arrest, or financial loss.

Advance-fee and recruitment fraud should generally receive HIGH or CRITICAL scores when messages involve:

* Lottery winnings requiring fees.
* Grant or prize claims requiring payment.
* Unrealistic job salaries.
* Equipment or training deposits.
* Cryptocurrency payments.

Crypto and investment fraud should generally receive CRITICAL scores when messages involve:

* Guaranteed returns.
* Extremely high ROI.
* Automated trading promises.
* Telegram investment groups.
* Direct wallet transfers.
* Ponzi-style schemes.

Legitimate messages without meaningful scam indicators should generally receive SAFE or LOW scores.

Return ONLY valid JSON using exactly this structure:

{
"riskScore": number,
"riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
"confidenceScore": number,
"scamType": string,
"summary": string,
"reasons": [string],
"whySuspicious": [string],
"recommendedAction": string,
"recommendedActions": [string],
"doNotDo": [string],
"threatCategories": [
{
"name": string,
"severity": "low" | "medium" | "high" | "critical",
"description": string
}
],
"suspiciousPhrases": [
{
"phrase": string,
"reason": string
}
]
}

confidenceScore must be an integer between 80 and 100.

Return only raw JSON. Do not use markdown code fences.`;

export async function analyzeMessageWithGemini(
text: string,
apiKey?: string
): Promise<SecurityAnalysis> {
const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

if (
!effectiveKey ||
effectiveKey.trim() === '' ||
effectiveKey.includes('YOUR_GEMINI_API_KEY') ||
effectiveKey.includes('your_gemini_api_key')
) {
return analyzeThreatHeuristically(text);
}

try {
const genAI = new GoogleGenerativeAI(effectiveKey.trim());

const model = genAI.getGenerativeModel({
  model: 'gemini-3.6-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.1
  },
  systemInstruction: SYSTEM_INSTRUCTION
});

const prompt = `Conduct a rigorous cybersecurity and social-engineering risk analysis on the following message:

"""
${text}
"""`;

const result = await model.generateContent(prompt);
const responseText = result.response.text()?.trim() || '';

if (!responseText) {
  throw new Error('Empty response from Gemini API');
}

const cleaned = responseText
  .replace(/^```json\s*/i, '')
  .replace(/^```\s*/i, '')
  .replace(/\s*```$/i, '')
  .trim();

const parsed = JSON.parse(cleaned);

const riskScore =
  typeof parsed.riskScore === 'number'
    ? Math.min(Math.max(parsed.riskScore, 0), 100)
    : 50;

let riskLevel: SecurityAnalysis['riskLevel'] = 'MEDIUM';

if (
  typeof parsed.riskLevel === 'string' &&
  ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(
    parsed.riskLevel
  )
) {
  riskLevel = parsed.riskLevel;
} else if (riskScore >= 86) {
  riskLevel = 'CRITICAL';
} else if (riskScore >= 66) {
  riskLevel = 'HIGH';
} else if (riskScore >= 41) {
  riskLevel = 'MEDIUM';
} else if (riskScore >= 21) {
  riskLevel = 'LOW';
} else {
  riskLevel = 'SAFE';
}

const whySuspicious = Array.isArray(parsed.whySuspicious)
  ? parsed.whySuspicious
  : Array.isArray(parsed.reasons)
    ? parsed.reasons
    : [];

const reasons = Array.isArray(parsed.reasons)
  ? parsed.reasons
  : whySuspicious;

const recommendedActions = Array.isArray(parsed.recommendedActions)
  ? parsed.recommendedActions
  : [];

const recommendedAction =
  typeof parsed.recommendedAction === 'string' &&
  parsed.recommendedAction.trim()
    ? parsed.recommendedAction
    : recommendedActions[0] ||
      'Exercise caution and independently verify the sender.';

const confidenceScore =
  typeof parsed.confidenceScore === 'number'
    ? Math.min(
        Math.max(Math.round(parsed.confidenceScore), 80),
        100
      )
    : 95;

return {
  riskScore,
  riskLevel,
  confidenceScore,
  scamType:
    typeof parsed.scamType === 'string' && parsed.scamType.trim()
      ? parsed.scamType
      : riskLevel === 'SAFE'
        ? 'Legitimate Communication'
        : 'Suspicious Message / Social Engineering Scam',
  summary:
    typeof parsed.summary === 'string' && parsed.summary.trim()
      ? parsed.summary
      : 'Security analysis complete.',
  reasons,
  whySuspicious,
  recommendedAction,
  recommendedActions,
  doNotDo: Array.isArray(parsed.doNotDo)
    ? parsed.doNotDo
    : [],
  threatCategories: Array.isArray(parsed.threatCategories)
    ? parsed.threatCategories
    : [],
  suspiciousPhrases: Array.isArray(parsed.suspiciousPhrases)
    ? parsed.suspiciousPhrases
    : [],
  analyzedAt: new Date().toISOString(),
  modelUsed: 'Google Gemini 3.6 Flash',
  isDemoMode: false
};

} catch (error) {
console.warn(
'Gemini API call failed or timed out, falling back to heuristic engine:',
error
);

const fallback = analyzeThreatHeuristically(text);

return {
  ...fallback,
  modelUsed: 'LifeShield Threat Engine v2.6 (Gemini Fallback)'
};

}
}
