import { PresetScenario } from '../types';

export const PRESETS: PresetScenario[] = [
  {
    id: 'lottery',
    title: 'Fake Prize / Lottery Scam',
    category: 'Advance-Fee Fraud',
    badgeColor: 'text-rose-400 bg-rose-950/40 border-rose-800/60',
    iconName: 'gift',
    expectedRisk: 'CRITICAL',
    description: 'Unsolicited notification claiming the recipient has won a massive cash prize expiring in 24 hours.',
    sampleText: `🎉 Congratulations! You have been chosen as the lucky grand winner of $1,000,000 in the International Mobile Rewards Lottery Draw 2026! 

To claim your cash prize before your winning ticket expires in 24 hours, click the official link below and submit your processing verification form:
👉 http://claim-prize-intl.cc/win?id=99281

Note: A refundable stamp clearance fee of $49 is required for international bank wire transfer. Do not ignore!`
  },
  {
    id: 'otp_theft',
    title: 'Fake Bank OTP Request',
    category: 'Smishing & Account Takeover',
    badgeColor: 'text-red-400 bg-red-950/40 border-red-800/60',
    iconName: 'shield-alert',
    expectedRisk: 'CRITICAL',
    description: 'Urgent notification pretending to be a bank warning of account lock and soliciting OTP verification.',
    sampleText: `URGENT SECURITY ALERT: Your bank account ending in **4821 has been temporarily suspended due to suspicious login attempts from an unknown device in Moscow.

To restore full banking access and prevent permanent deactivation, verify your identity immediately:
Visit: http://secure-verify-bank.cc/auth or reply to this SMS with the 6-digit One-Time Password (OTP) just sent to your phone.

FAILURE TO VERIFY WITHIN 15 MINUTES WILL RESULT IN TOTAL ACCOUNT FREEZE.`
  },
  {
    id: 'job_offer',
    title: 'Fake Job Offer',
    category: 'Recruitment & Advance-Fee Scam',
    badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    iconName: 'briefcase',
    expectedRisk: 'HIGH',
    description: 'Unsolicited high-paying remote job offer demanding an upfront fee for work equipment or training.',
    sampleText: `Dear Candidate, 

We are pleased to inform you that your resume was shortlisted by Amazon HR Global! You have been selected for the position of Remote Data Entry Specialist / AI Reviewer.

💰 Salary: $65.00 / hour (20-30 hrs/week, flexible hours)
🏠 Location: 100% Work from Home

To complete your onboarding package and dispatch your company Apple MacBook & monitor workstation, you must pay a $150 refundable equipment processing fee via Crypto (USDT) or Apple Gift Card.

Contact Senior Talent Manager on Telegram: @AmazonGlobalRecruitment_HR to proceed.`
  },
  {
    id: 'crypto_investment',
    title: 'Suspicious Investment Message',
    category: 'Ponzi & High-Yield Fraud',
    badgeColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    iconName: 'trending-up',
    expectedRisk: 'CRITICAL',
    description: 'Guaranteed 300% ROI scheme requiring upfront crypto deposits to an unregulated wallet.',
    sampleText: `🚀 EXCLUSIVE VIP INVESTMENT OPPORTUNITY — ZERO RISK!

Join our elite algorithmic trading pool and earn GUARANTEED 300% ROI in 7 DAYS! Over 12,500 active investors receiving automated daily payouts directly into their wallets.

🔹 Minimum deposit: 0.5 ETH ($1,500)
🔹 Guaranteed payout: 2.0 ETH in 7 days
🔹 100% Capital Insurance protection

Deposit today before the private syndicate round closes at midnight! Send ETH to wallet: 0x71C...a89B or join our secret Telegram channel: t.me/VIP_Crypto_Signals_Daily`
  },
  {
    id: 'legitimate_promo',
    title: 'Legitimate Promotional Message',
    category: 'Authentic Retail Promotion',
    badgeColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
    iconName: 'check-circle',
    expectedRisk: 'SAFE',
    description: 'Real marketing discount from a recognized brand with authentic domain and standard coupon mechanics.',
    sampleText: `Domino's Pizza: Craving hot cheesy pizza? 🍕 Get 40% OFF on all medium and large pizzas this weekend only!

Use coupon code PIZZA40 at checkout on the Domino's app or online at https://www.dominos.com. Minimum order value $20. Valid till Sunday 11:59 PM.

Reply STOP to opt-out of promotional alerts.`
  }
];
