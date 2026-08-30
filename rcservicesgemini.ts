[1mdiff --git a/server/services/gemini.ts b/server/services/gemini.ts[m
[1mindex 2f2fc0c..c9b519c 100644[m
[1m--- a/server/services/gemini.ts[m
[1m+++ b/server/services/gemini.ts[m
[36m@@ -2,238 +2,423 @@[m [mimport { GoogleGenerativeAI } from '@google/generative-ai';[m
 import { SecurityAnalysis } from '../types.js';[m
 import { analyzeThreatHeuristically } from './threatAnalyzer.js';[m
 [m
[31m-const SYSTEM_INSTRUCTION = `You are LifeShield AI, an elite cybersecurity and fraud intelligence analysis engine.[m
[31m-[m
[31m-Your mission is to evaluate the exact likelihood that an incoming communication is malicious fraud, phishing, social engineering, smishing, or a scam.[m
[31m-[m
[31m-riskScore measures the probability that the message is fraudulent or malicious, not how convincing it is.[m
[31m-[m
[31m-Use these risk ranges:[m
[31m-0-20 SAFE[m
[31m-21-40 LOW[m
[31m-41-65 MEDIUM[m
[31m-66-85 HIGH[m
[32m+[m[32mconst SYSTEM_INSTRUCTION = `[m
[32m+[m[32mYou are LifeShield AI, an advanced cybersecurity, fraud detection, phishing detection, smishing detection, and social-engineering analysis engine.[m
[32m+[m
[32m+[m[32mYour task is to analyze the COMPLETE message provided by the user and determine how likely it is to be fraudulent, malicious, deceptive, or meaningfully unsafe.[m
[32m+[m
[32m+[m[32mIMPORTANT:[m
[32m+[m[32mAnalyze the entire message, not just individual keywords.[m
[32m+[m
[32m+[m[32mConsider:[m
[32m+[m[32m- wording and intent[m
[32m+[m[32m- context[m
[32m+[m[32m- claims being made[m
[32m+[m[32m- requested actions[m
[32m+[m[32m- URLs and domains[m
[32m+[m[32m- financial offers[m
[32m+[m[32m- urgency[m
[32m+[m[32m- threats[m
[32m+[m[32m- impersonation[m
[32m+[m[32m- social engineering[m
[32m+[m[32m- requests for sensitive information[m
[32m+[m[32m- suspicious promises[m
[32m+[m[32m- unusual financial claims[m
[32m+[m[32m- sender identity when provided[m
[32m+[m[32m- combinations of multiple warning signs[m
[32m+[m[32m- signals that suggest the message may be legitimate[m
[32m+[m
[32m+[m[32mDo NOT classify a message as a scam based on one keyword alone.[m
[32m+[m
[32m+[m[32mDo NOT classify a message as safe merely because it does not request an OTP, password, PIN, payment, or personal information.[m
[32m+[m
[32m+[m[32mA message may still be suspicious because of deceptive claims, suspicious financial solicitation, impersonation, unrealistic promises, or dangerous links.[m
[32m+[m
[32m+[m[32mURL ANALYSIS:[m
[32m+[m[32m- A URL is NOT automatically malicious.[m
[32m+[m[32m- A shortened, tracking, redirect, or unfamiliar URL is a warning signal but is not by itself proof of fraud.[m
[32m+[m[32m- Do not claim that a domain is malicious unless there is sufficient evidence in the message or known context.[m
[32m+[m[32m- Consider the URL together with the rest of the message.[m
[32m+[m
[32m+[m[32mFINANCIAL MESSAGE ANALYSIS:[m
[32m+[m[32mPay particular attention to:[m
[32m+[m[32m- unsolicited loan offers[m
[32m+[m[32m- home-loan offers[m
[32m+[m[32m- personal-loan offers[m
[32m+[m[32m- credit-card offers[m
[32m+[m[32m- pre-approved or pre-qualified claims[m
[32m+[m[32m- unusually attractive interest rates[m
[32m+[m[32m- 0% interest claims[m
[32m+[m[32m- guaranteed approval[m
[32m+[m[32m- unusually large financial amounts[m
[32m+[m[32m- guaranteed returns[m
[32m+[m[32m- investment opportunities[m
[32m+[m[32m- refunds[m
[32m+[m[32m- rewards[m
[32m+[m[32m- grants[m
[32m+[m[32m- prizes[m
[32m+[m[32m- recruitment offers[m
[32m+[m[32m- requests for processing fees[m
[32m+[m[32m- requests for advance payments[m
[32m+[m[32m- unidentified or unclear financial institutions[m
[32m+[m[32m- suspicious financial links[m
[32m+[m
[32m+[m[32mDo not automatically classify every financial advertisement as a scam.[m
[32m+[m
[32m+[m[32mInstead, evaluate the combination of evidence.[m
[32m+[m
[32m+[m[32mFor example, a message containing a financial offer, an unusually attractive promise, an unclear sender/lender, and an external or shortened link should receive more scrutiny than a normal promotional message from a clearly identified organization.[m
[32m+[m
[32m+[m[32mPHISHING AND ACCOUNT TAKEOVER:[m
[32m+[m[32mPay special attention to:[m
[32m+[m[32m- bank impersonation[m
[32m+[m[32m- government impersonation[m
[32m+[m[32m- password requests[m
[32m+[m[32m- PIN requests[m
[32m+[m[32m- OTP requests[m
[32m+[m[32m- CVV/card requests[m
[32m+[m[32m- account verification[m
[32m+[m[32m- KYC requests[m
[32m+[m[32m- suspicious login links[m
[32m+[m[32m- account suspension threats[m
[32m+[m[32m- password reset requests[m
[32m+[m[32m- requests to confirm identity[m
[32m+[m[32m- credential harvesting[m
[32m+[m
[32m+[m[32mSOCIAL ENGINEERING:[m
[32m+[m[32mAnalyze:[m
[32m+[m[32m- urgency[m
[32m+[m[32m- fear[m
[32m+[m[32m- threats[m
[32m+[m[32m- authority impersonation[m
[32m+[m[32m- emotional manipulation[m
[32m+[m[32m- artificial deadlines[m
[32m+[m[32m- pressure to click[m
[32m+[m[32m- pressure to transfer money[m
[32m+[m[32m- pressure to disclose information[m
[32m+[m[32m- promises of rewards or benefits[m
[32m+[m[32m- attempts to bypass normal procedures[m
[32m+[m
[32m+[m[32mOTHER SCAM CATEGORIES:[m
[32m+[m[32mAnalyze for:[m
[32m+[m[32m- phishing[m
[32m+[m[32m- smishing[m
[32m+[m[32m- financial scams[m
[32m+[m[32m- loan scams[m
[32m+[m[32m- investment scams[m
[32m+[m[32m- crypto scams[m
[32m+[m[32m- job/recruitment scams[m
[32m+[m[32m- lottery scams[m
[32m+[m[32m- prize scams[m
[32m+[m[32m- grant scams[m
[32m+[m[32m- refund scams[m
[32m+[m[32m- delivery scams[m
[32m+[m[32m- government impersonation[m
[32m+[m[32m- bank impersonation[m
[32m+[m[32m- account takeover[m
[32m+[m[32m- identity theft[m
[32m+[m[32m- credential theft[m
[32m+[m[32m- malware/social engineering[m
[32m+[m[32m- advance-fee scams[m
[32m+[m
[32m+[m[32mLEGITIMATE MESSAGE ANALYSIS:[m
[32m+[m[32mAlso look for evidence that a message may be legitimate, including:[m
[32m+[m[32m- clearly identified organization[m
[32m+[m[32m- normal transactional notification[m
[32m+[m[32m- expected account activity[m
[32m+[m[32m- ordinary service notification[m
[32m+[m[32m- normal marketing language[m
[32m+[m[32m- absence of meaningful manipulation[m
[32m+[m[32m- absence of suspicious requests[m
[32m+[m[32m- recognizable legitimate context[m
[32m+[m
[32m+[m[32mDo not invent information that is not present in the message.[m
[32m+[m
[32m+[m[32mDo not assume a sender, company, URL, or domain is legitimate or malicious without evidence.[m
[32m+[m
[32m+[m[32mRISK SCORE:[m
[32m+[m
[32m+[m[32mriskScore represents the estimated likelihood that the message is fraudulent, malicious, deceptive, or meaningfully unsafe.[m
[32m+[m
[32m+[m[32m0-20   = SAFE[m
[32m+[m[32m21-40  = LOW[m
[32m+[m[32m41-65  = MEDIUM[m
[32m+[m[32m66-85  = HIGH[m
[32m+[m[32m86-100 = CRITICAL[m
[32m+[m
[32m+[m[32mSCORING GUIDANCE:[m
[32m+[m
[32m+[m[32mSAFE:[m
[32m+[m[32mNormal communication with no meaningful scam indicators.[m
[32m+[m
[32m+[m[32mLOW:[m
[32m+[m[32mMostly legitimate-looking communication with one minor, weak, or uncertain warning sign.[m
[32m+[m
[32m+[m[32mMEDIUM:[m
[32m+[m[32mMultiple warning signs or suspicious characteristics exist, but evidence is not strong enough to conclude that the message is highly likely to be a scam.[m
[32m+[m
[32m+[m[32mHIGH:[m
[32m+[m[32mSeveral strong indicators of fraud, phishing, social engineering, deceptive financial solicitation, impersonation, or suspicious links appear together.[m
[32m+[m
[32m+[m[32mCRITICAL:[m
[32m+[m[32mThere is strong evidence of an active scam, phishing attack, credential theft, account takeover, malicious impersonation, payment fraud, or severe social-engineering manipulation.[m
[32m+[m
[32m+[m[32mIMPORTANT SCORING RULE:[m
[32m+[m[32mDo not artificially increase the score simply because the message contains words such as:[m
[32m+[m[32m"loan", "bank", "offer", "free", "link", "urgent", or "OTP".[m
[32m+[m
[32m+[m[32mEvaluate the COMPLETE message and the combination of indicators.[m
[32m+[m
[32m+[m[32mA single weak signal should usually produce a low score.[m
[32m+[m
[32m+[m[32mSeveral independent strong signals can justify a high or critical score.[m
[32m+[m
[32m+[m[32mIf the evidence is ambiguous, reflect that uncertainty in the risk score, confidence score, and explanation.[m
[32m+[m
[32m+[m[32mRISK LEVEL CONSISTENCY:[m
[32m+[m[32mThe riskLevel MUST correspond to riskScore:[m
[32m+[m
[32m+[m[32m0-20   SAFE[m
[32m+[m[32m21-40  LOW[m
[32m+[m[32m41-65  MEDIUM[m
[32m+[m[32m66-85  HIGH[m
 86-100 CRITICAL[m
 [m
[31m-Social engineering and impersonation scams should generally receive HIGH or CRITICAL scores when multiple indicators appear together, especially:[m
[31m-[m
[31m-* New or alternate phone numbers.[m
[31m-* Claims that a family member lost or changed their phone.[m
[31m-* Urgent requests for money.[m
[31m-* New or unverified payment destinations.[m
[31m-* UPI, bank transfer, cryptocurrency, gift card, or wallet requests.[m
[31m-* Requests not to call or independently verify identity.[m
[31m-* Emotional pressure or urgency.[m
[31m-[m
[31m-Technical phishing and account takeover should generally receive CRITICAL scores when messages involve:[m
[31m-[m
[31m-* Bank impersonation.[m
[31m-* Government impersonation.[m
[31m-* Courier or utility impersonation.[m
[31m-* OTP requests.[m
[31m-* 2FA code requests.[m
[31m-* Password or PIN requests.[m
[31m-* Suspicious verification links.[m
[31m-* Threats of account suspension, arrest, or financial loss.[m
[31m-[m
[31m-Advance-fee and recruitment fraud should generally receive HIGH or CRITICAL scores when messages involve:[m
[31m-[m
[31m-* Lottery winnings requiring fees.[m
[31m-* Grant or prize claims requiring payment.[m
[31m-* Unrealistic job salaries.[m
[31m-* Equipment or training deposits.[m
[31m-* Cryptocurrency payments.[m
[31m-[m
[31m-Crypto and investment fraud should generally receive CRITICAL scores when messages involve:[m
[31m-[m
[31m-* Guaranteed returns.[m
[31m-* Extremely high ROI.[m
[31m-* Automated trading promises.[m
[31m-* Telegram investment groups.[m
[31m-* Direct wallet transfers.[m
[31m-* Ponzi-style schemes.[m
[31m-[m
[31m-Legitimate messages without meaningful scam indicators should generally receive SAFE or LOW scores.[m
[31m-[m
 Return ONLY valid JSON using exactly this structure:[m
 [m
 {[m
[31m-"riskScore": number,[m
[31m-"riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",[m
[31m-"confidenceScore": number,[m
[31m-"scamType": string,[m
[31m-"summary": string,[m
[31m-"reasons": [string],[m
[31m-"whySuspicious": [string],[m
[31m-"recommendedAction": string,[m
[31m-"recommendedActions": [string],[m
[31m-"doNotDo": [string],[m
[31m-"threatCategories": [[m
[31m-{[m
[31m-"name": string,[m
[31m-"severity": "low" | "medium" | "high" | "critical",[m
[31m-"description": string[m
[31m-}[m
[31m-],[m
[31m-"suspiciousPhrases": [[m
[31m-{[m
[31m-"phrase": string,[m
[31m-"reason": string[m
[32m+[m[32m  "riskScore": number,[m
[32m+[m[32m  "riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",[m
[32m+[m[32m  "confidenceScore": number,[m
[32m+[m[32m  "scamType": string,[m
[32m+[m[32m  "summary": string,[m
[32m+[m[32m  "reasons": [string],[m
[32m+[m[32m  "whySuspicious": [string],[m
[32m+[m[32m  "recommendedAction": string,[m
[32m+[m[32m  "recommendedActions": [string],[m
[32m+[m[32m  "doNotDo": [string],[m
[32m+[m[32m  "threatCategories": [[m
[32m+[m[32m    {[m
[32m+[m[32m      "name": string,[m
[32m+[m[32m      "severity": "low" | "medium" | "high" | "critical",[m
[32m+[m[32m      "description": string[m
[32m+[m[32m    }[m
[32m+[m[32m  ],[m
[32m+[m[32m  "suspiciousPhrases": [[m
[32m+[m[32m    {[m
[32m+[m[32m      "phrase": string,[m
[32m+[m[32m      "reason": string[m
[32m+[m[32m    }[m
[32m+[m[32m  ][m
 }[m
[31m-][m
[31m-}[m
[31m-[m
[31m-confidenceScore must be an integer between 80 and 100.[m
 [m
[31m-Return only raw JSON. Do not use markdown code fences.`;[m
[32m+[m[32mOUTPUT REQUIREMENTS:[m
[32m+[m
[32m+[m[32m- riskScore must be an integer from 0 to 100.[m
[32m+[m[32m- riskLevel must exactly match the riskScore range.[m
[32m+[m[32m- confidenceScore must be an integer from 0 to 100.[m
[32m+[m[32m- reasons must contain the strongest evidence supporting the score.[m
[32m+[m[32m- whySuspicious must contain suspicious indicators when present.[m
[32m+[m[32m- recommendedAction must provide a practical safety recommendation.[m
[32m+[m[32m- recommendedActions must contain useful safety steps.[m
[32m+[m[32m- doNotDo must contain actions the user should avoid.[m
[32m+[m[32m- threatCategories must contain only relevant categories.[m
[32m+[m[32m- suspiciousPhrases must quote only short phrases that actually appear in the message.[m
[32m+[m[32m- Do not invent suspicious phrases.[m
[32m+[m[32m- Do not invent facts about the sender, company, domain, or URL.[m
[32m+[m[32m- If the message appears legitimate, clearly explain why.[m
[32m+[m[32m- If the message is ambiguous, clearly state the uncertainty.[m
[32m+[m[32m- Return JSON only.[m
[32m+[m[32m- Do not use Markdown.[m
[32m+[m[32m- Do not use code fences.[m
[32m+[m[32m`;[m
 [m
 export async function analyzeMessageWithGemini([m
[31m-text: string,[m
[31m-apiKey?: string[m
[32m+[m[32m  text: string,[m
[32m+[m[32m  apiKey?: string[m
 ): Promise<SecurityAnalysis> {[m
[31m-const effectiveKey = apiKey || process.env.GEMINI_API_KEY;[m
[31m-[m
[31m-if ([m
[31m-!effectiveKey ||[m
[31m-effectiveKey.trim() === '' ||[m
[31m-effectiveKey.includes('YOUR_GEMINI_API_KEY') ||[m
[31m-effectiveKey.includes('your_gemini_api_key')[m
[31m-) {[m
[31m-return analyzeThreatHeuristically(text);[m
[31m-}[m
[32m+[m[32m  const effectiveKey = apiKey || process.env.GEMINI_API_KEY;[m
[32m+[m
[32m+[m[32m  if ([m
[32m+[m[32m    !effectiveKey ||[m
[32m+[m[32m    effectiveKey.trim() === '' ||[m
[32m+[m[32m    effectiveKey.includes('YOUR_GEMINI_API_KEY') ||[m
[32m+[m[32m    effectiveKey.includes('your_gemini_api_key')[m
[32m+[m[32m  ) {[m
[32m+[m[32m    return analyzeThreatHeuristically(text);[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  try {[m
[32m+[m[32m    const genAI = new GoogleGenerativeAI(effectiveKey.trim());[m
[32m+[m
[32m+[m[32m    const model = genAI.getGenerativeModel({[m
[32m+[m[32m      model: 'gemini-3.6-flash',[m
[32m+[m[32m      generationConfig: {[m
[32m+[m[32m        responseMimeType: 'application/json',[m
[32m+[m[32m        temperature: 0.1[m
[32m+[m[32m      },[m
[32m+[m[32m      systemInstruction: SYSTEM_INSTRUCTION[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m    const prompt = `[m
[32m+[m[32mAnalyze the following message completely.[m
[32m+[m
[32m+[m[32mDo not analyze only individual words.[m
[32m+[m
[32m+[m[32mEvaluate:[m
[32m+[m[32m- overall meaning[m
[32m+[m[32m- intent[m
[32m+[m[32m- context[m
[32m+[m[32m- claims[m
[32m+[m[32m- requested actions[m
[32m+[m[32m- URLs[m
[32m+[m[32m- financial content[m
[32m+[m[32m- social-engineering signals[m
[32m+[m[32m- impersonation signals[m
[32m+[m[32m- suspicious promises[m
[32m+[m[32m- legitimate explanations[m
[32m+[m
[32m+[m[32mMessage:[m
 [m
[31m-try {[m
[31m-const genAI = new GoogleGenerativeAI(effectiveKey.trim());[m
[32m+[m[32m"""[m
[32m+[m[32m${text}[m
[32m+[m[32m"""[m
[32m+[m[32m`;[m
 [m
[31m-const model = genAI.getGenerativeModel({[m
[31m-  model: 'gemini-3.6-flash',[m
[31m-  generationConfig: {[m
[31m-    responseMimeType: 'application/json',[m
[31m-    temperature: 0.1[m
[31m-  },[m
[31m-  systemInstruction: SYSTEM_INSTRUCTION[m
[31m-});[m
[32m+[m[32m    const result = await model.generateContent(prompt);[m
[32m+[m[32m    const responseText = result.response.text()?.trim() || '';[m
 [m
[31m-const prompt = `Conduct a rigorous cybersecurity and social-engineering risk analysis on the following message:[m
[32m+[m[32m    if (!responseText) {[m
[32m+[m[32m      throw new Error('Empty response from Gemini API');[m
[32m+[m[32m    }[m
 [m
[31m-"""[m
[31m-${text}[m
[31m-"""`;[m
[32m+[m[32m    const usage = result.response.usageMetadata;[m
 [m
[31m-const result = await model.generateContent(prompt);[m
[31m-const responseText = result.response.text()?.trim() || '';[m
[32m+[m[32m    const cleaned = responseText[m
[32m+[m[32m      .replace(/^```json\s*/i, '')[m
[32m+[m[32m      .replace(/^```\s*/i, '')[m
[32m+[m[32m      .replace(/\s*```$/i, '')[m
[32m+[m[32m      .trim();[m
 [m
[31m-if (!responseText) {[m
[31m-  throw new Error('Empty response from Gemini API');[m
[31m-}[m
[32m+[m[32m    const parsed = JSON.parse(cleaned);[m
 [m
[31m-const cleaned = responseText[m
[31m-  .replace(/^```json\s*/i, '')[m
[31m-  .replace(/^```\s*/i, '')[m
[31m-  .replace(/\s*```$/i, '')[m
[31m-  .trim();[m
[31m-[m
[31m-const parsed = JSON.parse(cleaned);[m
[31m-[m
[31m-const riskScore =[m
[31m-  typeof parsed.riskScore === 'number'[m
[31m-    ? Math.min(Math.max(parsed.riskScore, 0), 100)[m
[31m-    : 50;[m
[31m-[m
[31m-let riskLevel: SecurityAnalysis['riskLevel'] = 'MEDIUM';[m
[31m-[m
[31m-if ([m
[31m-  typeof parsed.riskLevel === 'string' &&[m
[31m-  ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes([m
[31m-    parsed.riskLevel[m
[31m-  )[m
[31m-) {[m
[31m-  riskLevel = parsed.riskLevel;[m
[31m-} else if (riskScore >= 86) {[m
[31m-  riskLevel = 'CRITICAL';[m
[31m-} else if (riskScore >= 66) {[m
[31m-  riskLevel = 'HIGH';[m
[31m-} else if (riskScore >= 41) {[m
[31m-  riskLevel = 'MEDIUM';[m
[31m-} else if (riskScore >= 21) {[m
[31m-  riskLevel = 'LOW';[m
[31m-} else {[m
[31m-  riskLevel = 'SAFE';[m
[31m-}[m
[32m+[m[32m    // Debug: shows exactly what Gemini returned.[m
[32m+[m[32m    console.log('GEMINI RESULT:', parsed);[m
 [m
[31m-const whySuspicious = Array.isArray(parsed.whySuspicious)[m
[31m-  ? parsed.whySuspicious[m
[31m-  : Array.isArray(parsed.reasons)[m
[31m-    ? parsed.reasons[m
[31m-    : [];[m
[31m-[m
[31m-const reasons = Array.isArray(parsed.reasons)[m
[31m-  ? parsed.reasons[m
[31m-  : whySuspicious;[m
[31m-[m
[31m-const recommendedActions = Array.isArray(parsed.recommendedActions)[m
[31m-  ? parsed.recommendedActions[m
[31m-  : [];[m
[31m-[m
[31m-const recommendedAction =[m
[31m-  typeof parsed.recommendedAction === 'string' &&[m
[31m-  parsed.recommendedAction.trim()[m
[31m-    ? parsed.recommendedAction[m
[31m-    : recommendedActions[0] ||[m
[31m-      'Exercise caution and independently verify the sender.';[m
[31m-[m
[31m-const confidenceScore =[m
[31m-  typeof parsed.confidenceScore === 'number'[m
[31m-    ? Math.min([m
[31m-        Math.max(Math.round(parsed.confidenceScore), 80),[m
[31m-        100[m
[31m-      )[m
[31m-    : 95;[m
[31m-[m
[31m-return {[m
[31m-  riskScore,[m
[31m-  riskLevel,[m
[31m-  confidenceScore,[m
[31m-  scamType:[m
[31m-    typeof parsed.scamType === 'string' && parsed.scamType.trim()[m
[31m-      ? parsed.scamType[m
[31m-      : riskLevel === 'SAFE'[m
[31m-        ? 'Legitimate Communication'[m
[31m-        : 'Suspicious Message / Social Engineering Scam',[m
[31m-  summary:[m
[31m-    typeof parsed.summary === 'string' && parsed.summary.trim()[m
[31m-      ? parsed.summary[m
[31m-      : 'Security analysis complete.',[m
[31m-  reasons,[m
[31m-  whySuspicious,[m
[31m-  recommendedAction,[m
[31m-  recommendedActions,[m
[31m-  doNotDo: Array.isArray(parsed.doNotDo)[m
[31m-    ? parsed.doNotDo[m
[31m-    : [],[m
[31m-  threatCategories: Array.isArray(parsed.threatCategories)[m
[31m-    ? parsed.threatCategories[m
[31m-    : [],[m
[31m-  suspiciousPhrases: Array.isArray(parsed.suspiciousPhrases)[m
[31m-    ? parsed.suspiciousPhrases[m
[31m-    : [],[m
[31m-  analyzedAt: new Date().toISOString(),[m
[31m-  modelUsed: 'Google Gemini 3.6 Flash',[m
[31m-  isDemoMode: false[m
[31m-};[m
[31m-[m
[31m-} catch (error) {[m
[31m-console.warn([m
[31m-'Gemini API call failed or timed out, falling back to heuristic engine:',[m
[31m-error[m
[31m-);[m
[31m-[m
[31m-const fallback = analyzeThreatHeuristically(text);[m
[31m-[m
[31m-return {[m
[31m-  ...fallback,[m
[31m-  modelUsed: 'LifeShield Threat Engine v2.6 (Gemini Fallback)'[m
[31m-};[m
[32m+[m[32m    const riskScore =[m
[32m+[m[32m      typeof parsed.riskScore === 'number'[m
[32m+[m[32m        ? Math.min(Math.max(Math.round(parsed.riskScore), 0), 100)[m
[32m+[m[32m        : 50;[m
 [m
[31m-}[m
[31m-}[m
[32m+[m[32m    let riskLevel: SecurityAnalysis['riskLevel'];[m
[32m+[m
[32m+[m[32m    if ([m
[32m+[m[32m      typeof parsed.riskLevel === 'string' &&[m
[32m+[m[32m      ['SAFE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes([m
[32m+[m[32m        parsed.riskLevel[m
[32m+[m[32m      )[m
[32m+[m[32m    ) {[m
[32m+[m[32m      riskLevel = parsed.riskLevel as SecurityAnalysis['riskLevel'];[m
[32m+[m[32m    } else if (riskScore >= 86) {[m
[32m+[m[32m      riskLevel = 'CRITICAL';[m
[32m+[m[32m    } else if (riskScore >= 66) {[m
[32m+[m[32m      riskLevel = 'HIGH';[m
[32m+[m[32m    } else if (riskScore >= 41) {[m
[32m+[m[32m      riskLevel = 'MEDIUM';[m
[32m+[m[32m    } else if (riskScore >= 21) {[m
[32m+[m[32m      riskLevel = 'LOW';[m
[32m+[m[32m    } else {[m
[32m+[m[32m      riskLevel = 'SAFE';[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const whySuspicious = Array.isArray(parsed.whySuspicious)[m
[32m+[m[32m      ? parsed.whySuspicious[m
[32m+[m[32m      : Array.isArray(parsed.reasons)[m
[32m+[m[32m        ? parsed.reasons[m
[32m+[m[32m        : [];[m
[32m+[m
[32m+[m[32m    const reasons = Array.isArray(parsed.reasons)[m
[32m+[m[32m      ? parsed.reasons[m
[32m+[m[32m      : whySuspicious;[m
[32m+[m
[32m+[m[32m    const recommendedActions = Array.isArray(parsed.recommendedActions)[m
[32m+[m[32m      ? parsed.recommendedActions[m
[32m+[m[32m      : [];[m
[32m+[m
[32m+[m[32m    const recommendedAction =[m
[32m+[m[32m      typeof parsed.recommendedAction === 'string' &&[m
[32m+[m[32m      parsed.recommendedAction.trim()[m
[32m+[m[32m        ? parsed.recommendedAction[m
[32m+[m[32m        : recommendedActions[0] ||[m
[32m+[m[32m          'Exercise caution and independently verify the sender.';[m
[32m+[m
[32m+[m[32m    const confidenceScore =[m
[32m+[m[32m      typeof parsed.confidenceScore === 'number'[m
[32m+[m[32m        ? Math.min([m
[32m+[m[32m            Math.max(Math.round(parsed.confidenceScore), 0),[m
[32m+[m[32m            100[m
[32m+[m[32m          )[m
[32m+[m[32m        : 75;[m
[32m+[m
[32m+[m[32m    return {[m
[32m+[m[32m      riskScore,[m
[32m+[m[32m      riskLevel,[m
[32m+[m[32m      confidenceScore,[m
[32m+[m
[32m+[m[32m      scamType:[m
[32m+[m[32m        typeof parsed.scamType === 'string' && parsed.scamType.trim()[m
[32m+[m[32m          ? parsed.scamType[m
[32m+[m[32m          : riskLevel === 'SAFE'[m
[32m+[m[32m            ? 'Legitimate Communication'[m
[32m+[m[32m            : 'Suspicious Message / Social Engineering Scam',[m
[32m+[m
[32m+[m[32m      summary:[m
[32m+[m[32m        typeof parsed.summary === 'string' && parsed.summary.trim()[m
[32m+[m[32m          ? parsed.summary[m
[32m+[m[32m          : 'Security analysis complete.',[m
[32m+[m
[32m+[m[32m      reasons,[m
[32m+[m[32m      whySuspicious,[m
[32m+[m[32m      recommendedAction,[m
[32m+[m[32m      recommendedActions,[m
[32m+[m
[32m+[m[32m      doNotDo: Array.isArray(parsed.doNotDo)[m
[32m+[m[32m        ? parsed.doNotDo[m
[32m+[m[32m        : [],[m
[32m+[m
[32m+[m[32m      threatCategories: Array.isArray(parsed.threatCategories)[m
[32m+[m[32m        ? parsed.threatCategories[m
[32m+[m[32m        : [],[m
[32m+[m
[32m+[m[32m      suspiciousPhrases: Array.isArray(parsed.suspiciousPhrases)[m
[32m+[m[32m        ? parsed.suspiciousPhrases[m
[32m+[m[32m        : [],[m
[32m+[m
[32m+[m[32m      analyzedAt: new Date().toISOString(),[m
[32m+[m
[32m+[m[32m      modelUsed: 'Google Gemini 3.6 Flash',[m
[32m+[m
[32m+[m[32m      isDemoMode: false,[m
[32m+[m
[32m+[m[32m      geminiUsage: usage[m
[32m+[m[32m        ? {[m
[32m+[m[32m            promptTokens: usage.promptTokenCount,[m
[32m+[m[32m            responseTokens: usage.candidatesTokenCount,[m
[32m+[m[32m            totalTokens: usage.totalTokenCount[m
[32m+[m[32m          }[m
[32m+[m[32m        : undefined[m
[32m+[m[32m    };[m
[32m+[m[32m  } catch (error) {[m
[32m+[m[32m    console.warn([m
[32m+[m[32m      'Gemini API call failed or timed out, falling back to heuristic engine:',[m
[32m+[m[32m      error[m
[32m+[m[32m    );[m
[32m+[m
[32m+[m[32m    const fallback = analyzeThreatHeuristically(text);[m
[32m+[m
[32m+[m[32m    return {[m
[32m+[m[32m      ...fallback,[m
[32m+[m[32m      modelUsed: 'LifeShield Threat Engine v2.6 (Gemini Fallback)'[m
[32m+[m[32m    };[m
[32m+[m[32m  }[m
[32m+[m[32m}[m
\ No newline at end of file[m
