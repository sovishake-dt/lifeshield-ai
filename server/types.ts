export type RiskLevel = 'SAFE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface ThreatCategory {
  name: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface SuspiciousPhrase {
  phrase: string;
  reason: string;
}

export interface GeminiUsage {
  promptTokens?: number;
  responseTokens?: number;
  totalTokens?: number;
}

export interface SecurityAnalysis {
  riskScore: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  scamType: string;
  summary: string;
  threatCategories: ThreatCategory[];
  suspiciousPhrases: SuspiciousPhrase[];
  whySuspicious: string[];
  reasons: string[];
  recommendedActions: string[];
  recommendedAction: string;
  doNotDo: string[];
  analyzedAt: string;
  modelUsed: string;
  isDemoMode: boolean;
  geminiUsage?: GeminiUsage;
}

export interface PresetScenario {
  id: string;
  title: string;
  category: string;
  badgeColor: string;
  iconName: 'gift' | 'shield-alert' | 'briefcase' | 'trending-up' | 'check-circle';
  expectedRisk: RiskLevel;
  sampleText: string;
  description: string;
}

export interface SystemHealth {
  status: string;
  engine: string;
  hasGeminiKey: boolean;
}

export interface AnalyzeRequest {
  text: string;
  forceDemo?: boolean;
  apiKey?: string;
}