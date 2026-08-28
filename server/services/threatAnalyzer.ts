import { SecurityAnalysis, ThreatCategory, SuspiciousPhrase, RiskLevel } from '../types.js';

// Preset Scenarios with hand-curated deep security analysis for maximum competition realism
export const PRESET_ANALYSES: Record<string, SecurityAnalysis> = {
  lottery: {
    riskScore: 94,
    riskLevel: 'CRITICAL',
    confidenceScore: 98,
    scamType: 'Advance-Fee Lottery / Sweepstakes Scam',
    summary: 'Classic Advance-Fee / Lottery Scam attempting to exploit urgency and greed to extract personal info or advance processing fees.',
    threatCategories: [
      { name: 'Advance-Fee Fraud', severity: 'critical', description: 'Demands upfront payment or personal data to release fictitious funds.' },
      { name: 'Phishing / Smishing', severity: 'high', description: 'Deceptive link designed to harvest banking and identity credentials.' },
      { name: 'Urgency & Pressure Coercion', severity: 'high', description: 'Artificial 24-hour expiration to prevent critical verification.' }
    ],
    suspiciousPhrases: [
      { phrase: 'Congratulations! You won $1,000,000', reason: 'Unsolicited notification of winning a contest never entered.' },
      { phrase: 'claim your reward before it expires in 24 hours', reason: 'Manufactured deadline designed to induce panic and rash action.' },
      { phrase: 'Click here: http://claim-prize-intl.cc/win', reason: 'Unverified suspicious top-level domain (.cc) masquerading as official portal.' }
    ],
    whySuspicious: [
      'You cannot win a lottery or prize draw that you never purchased a ticket for or entered.',
      'Legitimate financial institutions and sweepstakes never distribute multi-million rewards via unverified short links.',
      'Scammers rely on tight time windows ("24 hours") so victims act impulsively without consulting family or authorities.',
      'The domain name (.cc) is heavily associated with disposable bulletproof hosting used by phishing syndicates.'
    ],
    reasons: [
      'Unsolicited notification of winning a prize draw never entered.',
      'Requires clicking an unverified external domain with suspicious TLD (.cc).',
      'Uses artificial 24-hour urgency to bypass critical thinking.',
      'Demands advance clearance fees or credential entry to release fake funds.'
    ],
    recommendedAction: 'Immediately delete the message, block the sender, and report the URL to cybercrime authorities.',
    recommendedActions: [
      'Immediately delete the message and block the sender phone number / email.',
      'Report the message to your cellular carrier (e.g., forward SMS to 1909 or 7726).',
      'Report the URL to Google Safe Browsing and national cybercrime portal (e.g., cybercrime.gov.in or ic3.gov).'
    ],
    doNotDo: [
      'DO NOT click the link under any circumstances.',
      'DO NOT reply with "STOP" or message them back (this verifies your number is active).',
      'DO NOT pay any "processing fee", "tax clearance", or "transfer fee".',
      'DO NOT share bank account, passport, or identification documents.'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'LifeShield Threat Engine v2.6 (Demo Mode)',
    isDemoMode: true
  },

  otp_theft: {
    riskScore: 98,
    riskLevel: 'CRITICAL',
    confidenceScore: 99,
    scamType: 'Bank Impersonation & Account Takeover (Smishing)',
    summary: 'Severe Account Takeover / Smishing attack impersonating a major financial institution to intercept One-Time Passwords (OTPs).',
    threatCategories: [
      { name: 'Account Takeover (ATO)', severity: 'critical', description: 'Direct attempt to breach online banking by intercepting 2FA credentials.' },
      { name: 'Brand Impersonation', severity: 'critical', description: 'Unauthorized spoofing of trusted bank communication headers.' },
      { name: 'Credential Harvesting', severity: 'high', description: 'Fake portal mimicking bank login flow.' }
    ],
    suspiciousPhrases: [
      { phrase: 'URGENT: Your account has been temporarily locked', reason: 'Fabricated security panic to trigger immediate non-critical reaction.' },
      { phrase: 'Reply with your OTP', reason: 'Banks never request OTPs via SMS or phone. OTPs are private keys.' },
      { phrase: 'http://secure-verify-bank.cc', reason: 'Typosquatting domain masquerading as authentic banking infrastructure.' }
    ],
    whySuspicious: [
      'Banks NEVER ask customers to reply with OTP, PIN, or password via SMS, email, or chat.',
      'The URL contains generic keywords ("secure-verify-bank") rather than the verified bank domain.',
      'The message uses high psychological fear ("account locked") to bypass standard user skepticism.',
      'SMS sender headers can be spoofed or distributed via international SIM boxes.'
    ],
    reasons: [
      'Direct solicitation of confidential 2FA One-Time Passwords (OTPs).',
      'Impersonates an authorized banking institution with urgency pressure.',
      'Directs victim to a spoofed external domain (.cc).'
    ],
    recommendedAction: 'Call your bank using the official customer care number on the back of your debit card immediately.',
    recommendedActions: [
      'If you already entered info, IMMEDIATELY call your bank\'s official customer care number on your physical debit card.',
      'Request your bank to temporarily freeze internet banking and cancel affected cards.',
      'Check your active login sessions and change your internet banking passwords from a clean device.'
    ],
    doNotDo: [
      'DO NOT send your OTP or PIN to anyone, even someone claiming to be bank staff.',
      'DO NOT click the verification link.',
      'DO NOT call any phone number provided inside the SMS body.',
      'DO NOT forward the message to others.'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'LifeShield Threat Engine v2.6 (Demo Mode)',
    isDemoMode: true
  },

  job_offer: {
    riskScore: 89,
    riskLevel: 'HIGH',
    confidenceScore: 95,
    scamType: 'Fake Employment & Advance-Fee Recruitment Scam',
    summary: 'Fake Employment & Advance-Fee Recruitment scam requesting upfront payment for work equipment or background checks.',
    threatCategories: [
      { name: 'Employment Fraud', severity: 'high', description: 'Fictitious high-paying job offer targeting job seekers.' },
      { name: 'Advance-Fee Scam', severity: 'critical', description: 'Requires payment for onboarding, equipment, or training kits.' },
      { name: 'Identity Theft Risk', severity: 'high', description: 'May harvest SSN, PAN, or banking details under guise of onboarding.' }
    ],
    suspiciousPhrases: [
      { phrase: 'selected for a Remote Data Entry Specialist position at Amazon! $65/hr', reason: 'Unrealistic salary for entry-level tasks with no prior formal interview.' },
      { phrase: 'Pay a $150 refundable equipment processing fee', reason: 'Legitimate employers never charge candidates for equipment or background checks.' },
      { phrase: 'pay via crypto / Apple Gift Card', reason: 'Irreversible, non-traceable payment methods typical of criminal syndicates.' }
    ],
    whySuspicious: [
      'Real Fortune 500 companies (like Amazon) do not extend formal job offers via unsolicited SMS or WhatsApp messages without interviews.',
      'The compensation ($65/hr for basic data entry) is disproportionate to standard market compensation.',
      'Requiring candidates to pay upfront fees (even if claimed to be "refundable") is the hallmark of recruitment scams.',
      'Demanding payment in gift cards or cryptocurrency guarantees the money cannot be reversed.'
    ],
    reasons: [
      'Unsolicited job offer with exorbitant salary without any formal interview process.',
      'Demands upfront processing fee for equipment or background checks.',
      'Directs communication to informal channels (Telegram) and non-reversible payment methods.'
    ],
    recommendedAction: 'Block the contact and report the recruitment account; never send money or gift cards for a job.',
    recommendedActions: [
      'Check the company’s official careers portal directly (e.g., amazon.jobs) to see if the job ID exists.',
      'Block the recruiter contact on Telegram/WhatsApp/SMS.',
      'Warn friends and report the account on the platform where contact occurred.'
    ],
    doNotDo: [
      'DO NOT send any money, cryptocurrency, or gift card codes.',
      'DO NOT provide copies of your government ID, passport, or bank statements.',
      'DO NOT install custom APKs or remote desktop software (e.g. AnyDesk, TeamViewer) at their request.',
      'DO NOT sign fake contracts sent via informal messaging apps.'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'LifeShield Threat Engine v2.6 (Demo Mode)',
    isDemoMode: true
  },

  crypto_investment: {
    riskScore: 92,
    riskLevel: 'CRITICAL',
    confidenceScore: 97,
    scamType: 'High-Yield Investment Program (HYIP) / Crypto Ponzi Fraud',
    summary: 'High-Yield Investment Program (HYIP) / Pig Butchering Ponzi scheme promising guaranteed astronomical returns with zero risk.',
    threatCategories: [
      { name: 'Ponzi / High-Yield Investment Fraud', severity: 'critical', description: 'Fraudulent investment pool with fabricated daily return promises.' },
      { name: 'Cryptocurrency Drainer / Wallet Theft', severity: 'critical', description: 'Direct transfer to unhosted criminal wallet address.' },
      { name: 'Social Engineering / VIP Group Lure', severity: 'medium', description: 'Uses exclusivity ("VIP Crypto Signals") to build false trust.' }
    ],
    suspiciousPhrases: [
      { phrase: 'Guaranteed 300% ROI in 7 days', reason: 'Guaranteed triple-digit returns in days are mathematically and financially impossible.' },
      { phrase: 'Join VIP Crypto Signals Telegram group', reason: 'Telegram/WhatsApp private groups are the primary medium for unregulated crypto scams.' },
      { phrase: 'Send minimum 0.5 ETH to wallet address', reason: 'Direct cryptocurrency transfers are irreversible and lack regulatory oversight.' }
    ],
    whySuspicious: [
      'All legitimate investments carry risk; no genuine broker or fund can legally guarantee 300% returns.',
      'Demanding direct cryptocurrency transfers to anonymous wallet addresses means zero legal recourse or chargeback capability.',
      'Initial "profits" shown on fake dashboards are simulated numbers to lure larger deposits before account withdrawal is blocked.'
    ],
    reasons: [
      'Promises guaranteed 300% investment returns with zero risk.',
      'Requests direct cryptocurrency transfer to an anonymous wallet address.',
      'Uses exclusive VIP chat group lures to create social engineering pressure.'
    ],
    recommendedAction: 'Do not transfer any cryptocurrency and report the Telegram/WhatsApp channel for fraud.',
    recommendedActions: [
      'Report the Telegram/WhatsApp channel or group for fraudulent financial activities.',
      'Verify if the entity is registered with financial regulators (e.g. SEC, FCA, SEBI).',
      'Educate peers on cryptocurrency transfer irreversibility.'
    ],
    doNotDo: [
      'DO NOT transfer any cryptocurrency or fiat currency.',
      'DO NOT connect your Web3 wallet (MetaMask, Phantom) to unverified dApps.',
      'DO NOT trust screenshots of user testimonials or payout slips (they are readily photoshopped).'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'LifeShield Threat Engine v2.6 (Demo Mode)',
    isDemoMode: true
  },

  legitimate_promo: {
    riskScore: 8,
    riskLevel: 'SAFE',
    confidenceScore: 94,
    scamType: 'Legitimate Retail Marketing Promotion',
    summary: 'Standard commercial promotional announcement from a recognized consumer brand with legitimate discount code and authentic domain.',
    threatCategories: [
      { name: 'Standard Marketing Message', severity: 'low', description: 'Promotional discount campaign with standard opt-out mechanics.' }
    ],
    suspiciousPhrases: [],
    whySuspicious: [
      'The message does not ask for passwords, OTPs, advance payments, or sensitive credentials.',
      'It references an official registered domain name with standard coupon redemption mechanics.',
      'The discount offered (40% off) is standard retail promo practice rather than outrageous financial promises.'
    ],
    reasons: [
      'Standard promotional discount from an established consumer brand.',
      'Uses official verified domain (dominos.com) with no credential harvesting.',
      'Includes standard regulatory SMS opt-out mechanism (Reply STOP).'
    ],
    recommendedAction: 'If interested, navigate directly to the verified official app or website.',
    recommendedActions: [
      'If you wish to redeem the offer, navigate directly to the official brand app or verified website.',
      'If you do not want marketing alerts, use standard SMS unsubscribe options provided by your provider.'
    ],
    doNotDo: [
      'No critical threat detected. Avoid entering payment details on any third-party copycat site.'
    ],
    analyzedAt: new Date().toISOString(),
    modelUsed: 'LifeShield Threat Engine v2.6 (Demo Mode)',
    isDemoMode: true
  }
};

export function analyzeThreatHeuristically(text: string): SecurityAnalysis {
  const normalized = text.toLowerCase().trim();

  // Match presets first
  if (normalized.includes('lottery') || normalized.includes('$1,000,000') || normalized.includes('claim-prize-intl.cc')) {
    return { ...PRESET_ANALYSES.lottery, analyzedAt: new Date().toISOString() };
  }
  if ((normalized.includes('otp') || normalized.includes('one-time password')) && (normalized.includes('bank') || normalized.includes('locked') || normalized.includes('hdfc') || normalized.includes('chase') || normalized.includes('secure-verify'))) {
    return { ...PRESET_ANALYSES.otp_theft, analyzedAt: new Date().toISOString() };
  }
  if ((normalized.includes('job') || normalized.includes('data entry') || normalized.includes('position')) && (normalized.includes('fee') || normalized.includes('equipment') || normalized.includes('$65/hr') || normalized.includes('crypto'))) {
    return { ...PRESET_ANALYSES.job_offer, analyzedAt: new Date().toISOString() };
  }
  if ((normalized.includes('roi') || normalized.includes('investment') || normalized.includes('crypto') || normalized.includes('eth') || normalized.includes('bitcoin')) && (normalized.includes('guaranteed') || normalized.includes('300%') || normalized.includes('telegram'))) {
    return { ...PRESET_ANALYSES.crypto_investment, analyzedAt: new Date().toISOString() };
  }
  if (normalized.includes('dominos') || normalized.includes('pizza40') || (normalized.includes('40% off') && normalized.includes('coupon'))) {
    return { ...PRESET_ANALYSES.legitimate_promo, analyzedAt: new Date().toISOString() };
  }

  // Feature Extraction
  const hasFamilyOrImpersonation = /\b(mom|mum|mummy|dad|papa|father|mother|son|daughter|sister|brother|friend|bro|sweetheart|boss|landlord)\b/i.test(normalized) || /\b(phone (?:stopped working|broke|broken|lost|stolen|damaged)|using (?:my )?friend'?s? phone|lost my phone|new number)\b/i.test(normalized);
  const hasMoneyOrPayment = /\b(\d+|₹|rs\.?|inr|\$|usd|bucks|rupees|money|cash|rent|bill|fee|payment)\b/i.test(normalized) && /\b(need|send|transfer|pay|wire|give me|borrow|urgently)\b/i.test(normalized);
  const hasNewPaymentChannel = /\b(upi|upi id|gpay|phonepe|paytm|bank account|account number|zelle|venmo|revolut|paypal|wallet|crypto)\b/i.test(normalized);
  const hasAntiVerification = /\b(don't call|do not call|can't (?:receive|take|make) calls|can't talk|mic (?:is )?broken|in a meeting|in class|call my old number|explain (?:everything )?(?:when I get home|later))\b/i.test(normalized);
  
  const hasLotteryOrPrize = /\b(won|winner|lottery|sweepstakes|prize|jackpot|selected for prize|reward|draw)\b/i.test(normalized);
  const hasLargeMoney = /\b(\$\d+|\d+\s*(?:dollars|usd|lakh|crore|millions|eth|btc))\b/i.test(normalized);
  const hasUpfrontFee = /\b(fee|processing fee|tax|registration fee|refundable fee|stamp clearance|advance|deposit|charges)\b/i.test(normalized);
  const hasUrgency = /\b(urgent|urgently|immediately|within \d+ hours|expires|limited time|act now|suspended|deactivated|police|arrest|lawsuit|action required)\b/i.test(normalized);
  const hasOtpOrCredentials = /\b(otp|one time password|pin|cvv|password|passcode|secret code)\b/i.test(normalized);
  const hasBankImpersonation = /\b(bank|account|chase|hdfc|wells fargo|sbi|paypal|credit card|debit card|locked|frozen)\b/i.test(normalized);
  const hasSuspiciousLink = /https?:\/\/[^\s]+|bit\.ly|tinyurl|\.cc|\.tk|\.top|\.xyz|\.ru|\.click/i.test(normalized);
  const hasJobScam = /\b(data entry|part-time|work from home|remote job|telegram task|hourly pay|\$50\/hr|\$65\/hr)\b/i.test(normalized);
  const hasCryptoOrGiftCards = /\b(crypto|bitcoin|ethereum|eth|usdt|gift card|apple card|google play)\b/i.test(normalized);
  const hasGuaranteedRoi = /\b(guaranteed \d+%\s*roi|guaranteed returns|300%|daily profit|zero risk)\b/i.test(normalized);

  let score = 5;
  let scamType = 'Unclassified Communication';
  const categories: ThreatCategory[] = [];
  const phrases: SuspiciousPhrase[] = [];
  const reasons: string[] = [];
  const actions: string[] = [];
  const doNots: string[] = [];

  // COMPOUND COMBINATION 1: Family / Interpersonal Impersonation Scam ("Hi Mum" / Friend Emergency Fraud)
  if (hasFamilyOrImpersonation && (hasMoneyOrPayment || hasNewPaymentChannel) && (hasAntiVerification || hasUrgency || hasNewPaymentChannel)) {
    score = 94;
    scamType = 'Family Impersonation Scam (Hi Mum/Dad Fraud)';
    categories.push({
      name: 'Interpersonal Social Engineering',
      severity: 'critical',
      description: 'Impersonates a child, family member, or close contact claiming an emergency from an unverified number.'
    });
    categories.push({
      name: 'Anti-Verification Evasion',
      severity: 'high',
      description: 'Instructs victim not to call known number to prevent direct identity verification.'
    });
    categories.push({
      name: 'Unverified Payment Redirection',
      severity: 'critical',
      description: 'Requests immediate funds transfer to a newly provided third-party payment handle (UPI/Bank).'
    });

    const quoteMatch = text.match(/\b(?:phone (?:stopped working|broke|broken|lost)|using (?:my )?friend'?s? phone|need [₹$0-9,]+|send it to this|don't call|explain (?:everything )?when I get home)\b[\w\s'₹$0-9,]{0,35}/i)?.[0];
    if (quoteMatch) {
      phrases.push({
        phrase: quoteMatch,
        reason: 'Convergence of broken phone excuse, urgent money demand, and instruction not to call.'
      });
    }

    reasons.push('Claims identity from an unknown device using the classic "lost/broken phone" excuse.');
    reasons.push('Creates artificial emotional pressure by requesting urgent financial transfer.');
    reasons.push('Directs payment to a newly introduced payment account (UPI/Bank) rather than verified family accounts.');
    reasons.push('Explicitly instructs the recipient not to call the original phone number, evading verification.');
    reasons.push('Defers detailed explanation until after the money is sent.');

    actions.push('IMMEDIATELY call the family member on their original phone number or reach out to other relatives/friends to confirm.');
    actions.push('Never send funds to newly created UPI IDs or bank accounts without live voice/video verification.');

    doNots.push('DO NOT send money or transfer funds to the provided UPI ID or bank account.');
    doNots.push('DO NOT follow instructions to avoid calling the original phone number.');
  }

  // COMPOUND COMBINATION 2: Lottery / Prize Scam (High/Critical)
  else if (hasLotteryOrPrize && (hasLargeMoney || hasUpfrontFee || hasSuspiciousLink || hasUrgency)) {
    score = 92;
    scamType = 'Advance-Fee Lottery / Sweepstakes Scam';
    categories.push({
      name: 'Advance-Fee Fraud',
      severity: 'critical',
      description: 'Promises large unearned monetary reward while soliciting fees or personal details.'
    });
    phrases.push({
      phrase: text.match(/\b(won|winner|lottery|prize|reward)[\w\s$0-9,]{0,35}\b/i)?.[0] || 'Unsolicited Prize Win',
      reason: 'Unsolicited notification of winning a contest or lottery you never entered.'
    });
    reasons.push('Combination of unsolicited prize announcement with urgency and external links is the classic signature of advance-fee fraud.');
    doNots.push('DO NOT click the link or pay any processing/stamp clearance fees.');
    actions.push('Block the sender and report the message to national anti-fraud registries.');
  }

  // COMPOUND COMBINATION 3: Bank Impersonation & OTP / Credential Harvesting (Critical)
  else if (hasOtpOrCredentials || (hasBankImpersonation && (hasUrgency || hasSuspiciousLink))) {
    score = 96;
    scamType = 'Bank Impersonation & Account Takeover';
    categories.push({
      name: 'Credential & OTP Harvesting',
      severity: 'critical',
      description: 'Direct attempt to extract one-time authentication tokens or financial credentials.'
    });
    if (hasOtpOrCredentials) {
      phrases.push({
        phrase: text.match(/\b(otp|one time password|pin|password)[\w\s]{0,30}\b/i)?.[0] || 'OTP Solicitation',
        reason: 'Financial institutions NEVER request OTPs, PINs, or passwords via text or phone.'
      });
    }
    reasons.push('The message uses psychological fear of account suspension to steal multi-factor authorization codes.');
    doNots.push('DO NOT share or forward your OTP or security PIN under any circumstance.');
    actions.push('Immediately contact your bank using the phone number on the back of your official debit/credit card.');
  }

  // COMPOUND COMBINATION 4: Remote Job / Task Recruitment Scam (High/Critical)
  else if (hasJobScam && (hasUpfrontFee || hasCryptoOrGiftCards || hasSuspiciousLink || hasLargeMoney)) {
    score = 88;
    scamType = 'Fake Employment & Advance-Fee Recruitment Scam';
    categories.push({
      name: 'Employment Recruitment Fraud',
      severity: 'high',
      description: 'Offers high compensation for simple tasks but requires upfront fees or gift card payments.'
    });
    phrases.push({
      phrase: text.match(/\b(?:selected for|salary|position|fee|equipment)[\w\s$0-9,]{0,35}\b/i)?.[0] || 'Job & Fee Solicitation',
      reason: 'Legitimate employers never charge candidates for equipment, software, or onboarding.'
    });
    reasons.push('Disproportionate salary promises combined with upfront equipment deposits or Telegram onboarding is a recruitment scam.');
    doNots.push('DO NOT pay for equipment, background checks, or send cryptocurrency/gift cards.');
    actions.push('Verify job openings exclusively through the employer’s official verified careers portal.');
  }

  // COMPOUND COMBINATION 5: High-Yield Crypto / Ponzi Scheme (Critical)
  else if (hasGuaranteedRoi || (hasCryptoOrGiftCards && hasLargeMoney)) {
    score = 94;
    scamType = 'High-Yield Investment / Crypto Ponzi Scheme';
    categories.push({
      name: 'Investment Fraud & Wallet Theft',
      severity: 'critical',
      description: 'Promises impossible guaranteed investment returns to steal cryptocurrency.'
    });
    reasons.push('Guaranteed returns in cryptocurrency are financially impossible and represent Ponzi / wallet drainer mechanics.');
    doNots.push('DO NOT send cryptocurrency or connect Web3 wallets to unverified platforms.');
    actions.push('Report the fraudulent investment scheme to securities regulators and anti-fraud groups.');
  }

  // COMPOUND COMBINATION 6: Suspicious Link with Artificial Urgency
  else if (hasSuspiciousLink && hasUrgency) {
    score = 82;
    scamType = 'Phishing / Social Engineering Campaign';
    categories.push({
      name: 'Urgent Phishing Attack',
      severity: 'high',
      description: 'Employs artificial panic and unverified external links to compel rash victim action.'
    });
    reasons.push('Combines aggressive urgency deadlines with untrusted external hyperlinks.');
    doNots.push('DO NOT click or open the link.');
    actions.push('Navigate directly to the official service via your browser rather than clicking message links.');
  }

  // LEGITIMATE / LOW RISK
  else {
    score = 10;
    scamType = 'Standard Communication / Benign Message';
    categories.push({
      name: 'No Significant Threat Detected',
      severity: 'low',
      description: 'Message does not display typical scam signatures or malicious vectors.'
    });
    reasons.push('The message lacks indicators of credential harvesting, advance-fee fraud, or deceptive links.');
    doNots.push('Avoid sharing private personal credentials if sender identity is unknown.');
    actions.push('Exercise standard communication caution.');
  }

  // Cap score between 0 and 100
  const finalScore = Math.min(Math.max(score, 0), 100);

  let riskLevel: RiskLevel = 'SAFE';
  if (finalScore >= 86) riskLevel = 'CRITICAL';
  else if (finalScore >= 66) riskLevel = 'HIGH';
  else if (finalScore >= 41) riskLevel = 'MEDIUM';
  else if (finalScore >= 21) riskLevel = 'LOW';
  else riskLevel = 'SAFE';

  const confidenceScore = Math.min(98, Math.max(88, 86 + Math.floor(text.length / 25)));
  const recommendedAction = actions[0] || 'Exercise standard caution when receiving messages from unfamiliar senders.';

  const summary = riskLevel === 'SAFE' || riskLevel === 'LOW'
    ? 'This message appears relatively benign, though standard caution is always advised with unexpected messages.'
    : `High-risk threat detected (${scamType}) with ${categories.map(c => c.name).join(', ')}. Strong indicators of malicious intent.`;

  return {
    riskScore: finalScore,
    riskLevel,
    confidenceScore,
    scamType,
    summary,
    threatCategories: categories,
    suspiciousPhrases: phrases,
    whySuspicious: reasons,
    reasons,
    recommendedAction,
    recommendedActions: actions,
    doNotDo: doNots,
    analyzedAt: new Date().toISOString(),
    modelUsed: 'LifeShield Threat Engine v2.6 (Demo Mode)',
    isDemoMode: true
  };
}
