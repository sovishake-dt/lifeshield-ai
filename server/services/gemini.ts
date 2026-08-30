import { GoogleGenerativeAI } from '@google/generative-ai';
import { SecurityAnalysis } from '../types.js';

const SYSTEM_INSTRUCTION = `
You are LifeShield AI, an advanced cybersecurity, fraud detection, phishing detection, smishing detection, and social-engineering analysis engine.

Your task is to analyze the COMPLETE message provided by the user and determine how likely it is to be fraudulent, malicious, deceptive, or meaningfully unsafe.

IMPORTANT:
Analyze the entire message, not just individual keywords.

Consider:
- wording and intent
- context
- claims being made
- requested actions
- URLs and domains
- financial offers
- urgency
- threats
- impersonation
- social engineering
- requests for sensitive information
- suspicious promises
- unusual financial claims
- sender identity when provided
- combinations of multiple warning signs
- signals that suggest the message may be legitimate

Do NOT classify a message as a scam based on one keyword alone.

Do NOT classify a message as safe merely because it does not request an OTP, password, PIN, payment, or personal information.

A message may still be suspicious because of deceptive claims, suspicious financial solicitation, impersonation, unrealistic promises, or dangerous links.

URL ANALYSIS:
- A URL is NOT automatically malicious.
- A shortened, tracking, redirect, or unfamiliar URL is a warning signal but is not by itself proof of fraud.
- Do not claim that a domain is malicious unless there is sufficient evidence in the message or known context.
- Consider the URL together with the rest of the message.

FINANCIAL MESSAGE ANALYSIS:
Pay particular attention to:
- unsolicited loan offers
- home-loan offers
- personal-loan offers
- credit-card offers
- pre-approved or pre-qualified claims
- unusually attractive interest rates
- 0% interest claims
- guaranteed approval
- unusually large financial amounts
- guaranteed returns
- investment opportunities
- refunds
- rewards
- grants
- prizes
- recruitment offers
- requests for processing fees
- requests for advance payments
- unidentified or unclear financial institutions
- suspicious financial links

Do not automatically classify every financial advertisement as a scam.

Instead, evaluate the combination of evidence.

For example, a message containing a financial offer, an unusually attractive promise, an unclear sender/lender, and an external or shortened link should receive more scrutiny than a normal promotional message from a clearly identified organization.

PHISHING AND ACCOUNT TAKEOVER:
Pay special attention to:
- bank impersonation
- government impersonation
- password requests
- PIN requests
- OTP requests
- CVV/card requests
- account verification
- KYC requests
- suspicious login links
- account suspension threats
- password reset requests
- requests to confirm identity
- credential harvesting

SOCIAL ENGINEERING:
Analyze:
- urgency
- fear
- threats
- authority impersonation
- emotional manipulation
- artificial deadlines
- pressure to click
- pressure to transfer money
- pressure to disclose information
- promises of rewards or benefits
- attempts to bypass normal procedures

OTHER SCAM CATEGORIES:
Analyze for:
- phishing
- smishing
- financial scams
- loan scams
- investment scams
- crypto scams
- job/recruitment scams
- lottery scams
- prize scams
- grant scams
- refund scams
- delivery scams
- government impersonation
- bank impersonation
- account takeover
- identity theft
- credential theft
- malware/social engineering
- advance-fee scams

LEGITIMATE MESSAGE ANALYSIS:
Also look for evidence that a message may be legitimate, including:
- clearly identified organization
- normal transactional notification
- expected account activity
- ordinary service notification
- normal marketing language
- absence of meaningful manipulation
- absence of suspicious requests
- recognizable legitimate context

Do not invent information that is not present in the message.

Do not assume a sender, company, URL, or domain is legitimate or malicious without evidence.

RISK SCORE:

riskScore represents the estimated likelihood that the message is fraudulent, malicious, deceptive, or meaningfully unsafe.

0-20   = SAFE
21-40  = LOW
41-65  = MEDIUM
66-85  = HIGH
86-100 = CRITICAL

SCORING GUIDANCE:

SAFE:
Normal communication with no meaningful scam indicators.

LOW:
Mostly legitimate-looking communication with one minor, weak, or uncertain warning sign.

MEDIUM:
Multiple warning signs or suspicious characteristics exist, but evidence is not strong enough to conclude that the message is highly likely to be a scam.

HIGH:
Several strong indicators of fraud, phishing, social engineering, deceptive financial solicitation, impersonation, or suspicious links appear together.

CRITICAL:
There is strong evidence of an active scam, phishing attack, credential theft, account takeover, malicious impersonation, payment fraud, or severe social-engineering manipulation.

IMPORTANT SCORING RULE:
Do not artificially increase the score simply because the message contains words such as:
"loan", "bank", "offer", "free", "link", "urgent", or "OTP".

Evaluate the COMPLETE message and the combination of indicators.

A single weak signal should usually produce a low score.

Several independent strong signals can justify a high or critical score.

If the evidence is ambiguous, reflect that uncertainty in the risk score, confidence score, and explanation.

RISK LEVEL CONSISTENCY:
The riskLevel MUST correspond to riskScore:

0-20   SAFE
21-40  LOW
41-65  MEDIUM
66-85  HIGH
86-100 CRITICAL

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

OUTPUT REQUIREMENTS:

- riskScore must be an integer from 0 to 100.
- riskLevel must exactly match the riskScore range.
- confidenceScore must be an integer from 0 to 100.
- reasons must contain the strongest evidence supporting the score.
- whySuspicious must contain suspicious indicators when present.
- recommendedAction must provide a practical safety recommendation.
- recommendedActions must contain useful safety steps.
- doNotDo must contain actions the user should avoid.
- threatCategories must contain only relevant categories.
- suspiciousPhrases must quote only short phrases that actually appear in the message.
- Do not invent suspicious phrases.
- Do not invent facts about the sender, company, domain, or URL.
- If the message appears legitimate, clearly explain why.
- If the message is ambiguous, clearly state the uncertainty.
- Return JSON only.
- Do not use Markdown.
- Do not use code fences.
`;

export async function analyzeMessageWithGemini(
  text: string,
  apiKey?: string
): Promise<SecurityAnalysis> {
  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;

  /*
   * IMPORTANT:
   * Do NOT use the heuristic analyzer here.
   *
   * If Gemini is unavailable, the error must reach the backend.
   * This allows the frontend to show:
   *
   * "AI Analysis Temporarily Unavailable"
   *
   * instead of showing a fake/fallback risk score.
   */

  if (
    !effectiveKey ||
    effectiveKey.trim() === '' ||
    effectiveKey.includes('YOUR_GEMINI_API_KEY') ||
    effectiveKey.includes('your_gemini_api_key')
  ) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
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

    const prompt = `
Analyze the following message completely.

Do not analyze only individual words.

Evaluate:
- overall meaning
- intent
- context
- claims
- requested actions
- URLs
- financial content
- social-engineering signals
- impersonation signals
- suspicious promises
- legitimate explanations

Message:

"""
${text}
"""
`;

    const result = await model.generateContent(prompt);

    const responseText =
      result.response.text()?.trim() || '';

    if (!responseText) {
      throw new Error('EMPTY_GEMINI_RESPONSE');
    }

    const usage = result.response.usageMetadata;

    const cleaned = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsed = JSON.parse(cleaned);

    console.log('GEMINI RESULT:', parsed);

    const riskScore =
      typeof parsed.riskScore === 'number'
        ? Math.min(
            Math.max(
              Math.round(parsed.riskScore),
              0
            ),
            100
          )
        : 50;

    let riskLevel: SecurityAnalysis['riskLevel'];

    if (
      typeof parsed.riskLevel === 'string' &&
      [
        'SAFE',
        'LOW',
        'MEDIUM',
        'HIGH',
        'CRITICAL'
      ].includes(parsed.riskLevel)
    ) {
      riskLevel =
        parsed.riskLevel as SecurityAnalysis['riskLevel'];
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

    const whySuspicious =
      Array.isArray(parsed.whySuspicious)
        ? parsed.whySuspicious
        : Array.isArray(parsed.reasons)
          ? parsed.reasons
          : [];

    const reasons =
      Array.isArray(parsed.reasons)
        ? parsed.reasons
        : whySuspicious;

    const recommendedActions =
      Array.isArray(parsed.recommendedActions)
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
            Math.max(
              Math.round(parsed.confidenceScore),
              0
            ),
            100
          )
        : 75;

    return {
      riskScore,
      riskLevel,
      confidenceScore,

      scamType:
        typeof parsed.scamType === 'string' &&
        parsed.scamType.trim()
          ? parsed.scamType
          : riskLevel === 'SAFE'
            ? 'Legitimate Communication'
            : 'Suspicious Message / Social Engineering Scam',

      summary:
        typeof parsed.summary === 'string' &&
        parsed.summary.trim()
          ? parsed.summary
          : 'Security analysis complete.',

      reasons,

      whySuspicious,

      recommendedAction,

      recommendedActions,

      doNotDo:
        Array.isArray(parsed.doNotDo)
          ? parsed.doNotDo
          : [],

      threatCategories:
        Array.isArray(parsed.threatCategories)
          ? parsed.threatCategories
          : [],

      suspiciousPhrases:
        Array.isArray(parsed.suspiciousPhrases)
          ? parsed.suspiciousPhrases
          : [],

      analyzedAt: new Date().toISOString(),

      modelUsed: 'Google Gemini 3.6 Flash',

      isDemoMode: false,

      geminiUsage: usage
        ? {
            promptTokens:
              usage.promptTokenCount,

            responseTokens:
              usage.candidatesTokenCount,

            totalTokens:
              usage.totalTokenCount
          }
        : undefined
    };
  } catch (error) {
    /*
     * VERY IMPORTANT:
     *
     * Do NOT call analyzeThreatHeuristically()
     * here.
     *
     * Every Gemini error, including:
     *
     * 429 Too Many Requests
     * quota exceeded
     * network error
     * authentication error
     * timeout
     *
     * must be passed to the backend.
     */

    console.warn(
      'Gemini API request failed:',
      error
    );

    throw error;
  }
}