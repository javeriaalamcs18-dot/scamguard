import { runScamAnalysisPipeline } from "../src/lib/ai/pipeline";

async function main() {
  const text = "Congratulations! You've won 50 MB data with SPIN the Wheel, valid until 11:59 pm. App up your life with UPTCL.";
  const res = await runScamAnalysisPipeline(text, { source: "SMS", language: "English" });
  console.log("RISK SCORE:", res.risk_score);
  console.log("RISK LEVEL:", res.risk_level);
  console.log("SCAM TYPES:", res.scam_types);
  console.log("SUMMARY:", res.summary);
}

main();
