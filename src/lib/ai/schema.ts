import { z } from "zod";

export const EvidenceItemSchema = z.object({
  signal: z.string().min(1),
  explanation: z.string().min(1),
});

export const ManipulationTacticSchema = z.object({
  tactic: z.string().min(1),
  explanation: z.string().min(1),
});

export const AttackPathStepSchema = z.object({
  step: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const DamageControlSchema = z.object({
  clicked_link: z.array(z.string()).default([]),
  shared_credentials: z.array(z.string()).default([]),
  shared_otp: z.array(z.string()).default([]),
  shared_bank_card: z.array(z.string()).default([]),
  sent_money: z.array(z.string()).default([]),
  downloaded_file: z.array(z.string()).default([]),
});

export const ScamAnalysisResultSchema = z.object({
  risk_score: z.number().min(0).max(100),
  risk_level: z.enum(["low", "medium", "high", "very_high"]),
  confidence: z.enum(["low", "medium", "high"]),
  summary: z.string().min(1),
  scam_types: z.array(z.string()).min(1),
  evidence: z.array(EvidenceItemSchema).default([]),
  manipulation_tactics: z.array(ManipulationTacticSchema).default([]),
  possible_objectives: z.array(z.string()).default([]),
  attack_path: z.array(AttackPathStepSchema).default([]),
  do_not_share: z.array(z.string()).default([]),
  safe_verification: z.array(z.string()).default([]),
  immediate_actions: z.array(z.string()).default([]),
  damage_control: DamageControlSchema,
  educational_explanation: z.string().min(1),
  disclaimer: z.string().min(1),
  extracted_urls: z.array(z.string()).optional(),
  detected_language: z.enum(["English", "Roman Urdu", "Urdu", "Other"]).optional(),
});

export type ValidatedScamAnalysisResult = z.infer<typeof ScamAnalysisResultSchema>;
