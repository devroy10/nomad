import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export interface Diagnosis {
  rootCause: string;
  fix: string;
  confidence: number;
  reasoning: string;
}

const SYSTEM = [
  "You are Nomad, an autonomous SRE agent for a Zerops-hosted application.",
  "Given the affected service, symptom, and recent log lines, return STRICT JSON:",
  '{"rootCause": string, "fix": string, "confidence": number 0-1, "reasoning": string}',
  "fix must be one actionable sentence (restart, rollback, config change, etc.).",
  "No markdown fences around the JSON.",
].join("\n");

function parse(text: string): Diagnosis {
  try {
    const parsed = JSON.parse(text) as Partial<Diagnosis>;
    return {
      rootCause: String(parsed.rootCause ?? "Unknown root cause"),
      fix: String(parsed.fix ?? "Restart the service"),
      confidence: Number(parsed.confidence ?? 0.5),
      reasoning: String(parsed.reasoning ?? ""),
    };
  } catch {
    return {
      rootCause: text.slice(0, 500),
      fix: "Restart the service and re-evaluate.",
      confidence: 0.4,
      reasoning: "Unstructured model output.",
    };
  }
}

export function fallbackDiagnosis(service: string): Diagnosis {
  return {
    rootCause: "No diagnosis performed — ANTHROPIC_API_KEY is not configured.",
    fix: `Restart the "${service}" service and watch for recurring error bursts.`,
    confidence: 0.3,
    reasoning:
      "Heuristic fallback: error burst on service without LLM diagnosis available.",
  };
}

export async function diagnose(
  service: string,
  symptom: string,
  contextLines: string[],
): Promise<Diagnosis> {
  const c = getClient();
  if (!c) return fallbackDiagnosis(service);

  const context = contextLines.slice(-40).join("\n");

  try {
    const response = await c.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: SYSTEM,
      messages: [
        {
          role: "user",
          content: `Service: ${service}\nSymptom: ${symptom}\n\nRecent log lines:\n${context}`,
        },
      ],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return parse(text);
  } catch (error) {
    console.error("[ai] diagnose failed, using fallback:", error);
    return {
      ...fallbackDiagnosis(service),
      reasoning: "LLM call failed; fell back to heuristic.",
    };
  }
}
