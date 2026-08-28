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

export interface SecurityAnalysis {
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  confidenceScore: number; // 0 to 100 percentage
  scamType: string; // Specific scam taxonomy name
  summary: string;
  threatCategories: ThreatCategory[];
  suspiciousPhrases: SuspiciousPhrase[];
  whySuspicious: string[];
  reasons: string[]; // Standardized reasons list
  recommendedActions: string[];
  recommendedAction: string; // Primary recommended action
  doNotDo: string[];
  analyzedAt: string;
  modelUsed: string;
  isDemoMode: boolean;
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
