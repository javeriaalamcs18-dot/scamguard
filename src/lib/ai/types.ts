export type RiskLevel = "low" | "medium" | "high" | "very_high";
export type ConfidenceLevel = "low" | "medium" | "high";

export interface EvidenceItem {
  signal: string;
  explanation: string;
}

export interface ManipulationTacticItem {
  tactic: string;
  explanation: string;
}

export interface AttackPathStep {
  step: number;
  title: string;
  description: string;
}

export interface DamageControlActions {
  clicked_link: string[];
  shared_credentials: string[];
  shared_otp: string[];
  shared_bank_card: string[];
  sent_money: string[];
  downloaded_file: string[];
}

export interface ScamAnalysisResult {
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  confidence: ConfidenceLevel;
  summary: string;
  scam_types: string[];
  evidence: EvidenceItem[];
  manipulation_tactics: ManipulationTacticItem[];
  possible_objectives: string[];
  attack_path: AttackPathStep[];
  do_not_share: string[];
  safe_verification: string[];
  immediate_actions: string[];
  damage_control: DamageControlActions;
  educational_explanation: string;
  disclaimer: string;
  extracted_urls?: string[];
  detected_language?: "English" | "Roman Urdu" | "Urdu" | "Other";
}

export interface AnalysisContext {
  source: string;
  language: string;
  userId?: string;
  userPlan?: string;
}

export interface AIProvider {
  name: string;
  analyzeScam(message: string, context: AnalysisContext): Promise<ScamAnalysisResult>;
}
