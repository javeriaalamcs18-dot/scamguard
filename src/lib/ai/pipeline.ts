import { AIProvider, AnalysisContext, ScamAnalysisResult } from "./types";
import { OpenAIProvider } from "./openai-provider";
import { extractAndAnalyzeUrls } from "./heuristics";
import { ScamAnalysisResultSchema } from "./schema";

let defaultProvider: AIProvider = new OpenAIProvider();

export function setAIProvider(provider: AIProvider) {
  defaultProvider = provider;
}

export function getAIProvider(): AIProvider {
  return defaultProvider;
}

export interface PipelineValidationResult {
  isValid: boolean;
  error?: string;
  wordCount: number;
  characterCount: number;
}

export function validateInputMessage(message: string): PipelineValidationResult {
  const trimmed = message.trim();
  const characterCount = trimmed.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  if (characterCount === 0) {
    return {
      isValid: false,
      error: "Please enter or paste a suspicious message to analyze.",
      wordCount: 0,
      characterCount: 0,
    };
  }

  if (characterCount > 15000) {
    return {
      isValid: false,
      error: "Message is too large. Please limit input to under 15,000 characters.",
      wordCount,
      characterCount,
    };
  }

  return {
    isValid: true,
    wordCount,
    characterCount,
  };
}

export async function runScamAnalysisPipeline(
  rawMessage: string,
  context: AnalysisContext
): Promise<ScamAnalysisResult> {
  // Step 1: Input Validation
  const validation = validateInputMessage(rawMessage);
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  // Step 2: Normalization
  const normalizedMessage = rawMessage.trim();

  // Step 3: Extract URLs deterministically
  const urlAnalyses = extractAndAnalyzeUrls(normalizedMessage);
  const detectedUrls = urlAnalyses.map((u) => u.url);

  // Step 4: Execute Provider (OpenAI or configured provider)
  const provider = getAIProvider();
  const analysisResult = await provider.analyzeScam(normalizedMessage, context);

  // Step 5: Merge deterministic URL findings if any were detected and not already captured
  if (detectedUrls.length > 0 && (!analysisResult.extracted_urls || analysisResult.extracted_urls.length === 0)) {
    analysisResult.extracted_urls = detectedUrls;
  }

  // Step 6: Validate output schema strictly
  const validated = ScamAnalysisResultSchema.parse(analysisResult);
  return validated;
}
