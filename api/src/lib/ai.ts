import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return client;
}

export interface Diagnosis {
  rootCause: string;
  fix: string;
  confidence: number;
  reasoning: string;
}

const DIAGNOSIS_SYSTEM = [
  "You are Nomad, an autonomous SRE agent for a Zerops-hosted application.",
  "You receive syslog bursts, anomaly context, and the affected service name.",
  "Return STRICT JSON with exactly these keys:",
  '{"rootCause": string, "fix": string, "confidence": number 0-1, "reasoning": string}',
  "fix must be one actionable sentence (restart, rollback, config change, etc.).",
  "Do not wrap the JSON in markdown fences or prose.",
].join("\n");

export function buildFallbackDiagnosis(service: string): Diagnosis {
  return {
    rootCause:
      "No diagnosis performed — ANTHROPIC_API_KEY is not configured.",
    fix: `Restart the "${service}" service and watch for recurring error bursts.`,
    confidence: 0.3,
    reasoning:
      "Heuristic fallback: error burst on service without LLM diagnosis available.",
  };
}

function parseDiagnosis(text: string): Diagnosis {
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

export async function diagnose(
  service: string,
  symptom: string,
  contextLines: string[],
): Promise<Diagnosis> {
  const c = getClient();
  if (!c) return buildFallbackDiagnosis(service);

  const context = contextLines.slice(-40).join("\n");

  try {
    const response = await c.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: DIAGNOSIS_SYSTEM,
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

    return parseDiagnosis(text);
  } catch (error) {
    console.error("[ai] diagnose failed, using fallback:", error);
    return {
      ...buildFallbackDiagnosis(service),
      reasoning: "LLM call failed; fell back to heuristic.",
    };
  }
}

export interface ChatAnswer {
  answer: string;
}

const CHAT_SYSTEM = [
  "You are Nomad, an SRE assistant for a Zerops project.",
  "Answer the operator's question about incident history, logs, and fixes",
  "using only the provided incident context. Be concise and specific.",
  "If you don't know, say you don't have that data.",
].join("\n");

export async function askAboutIncidents(
  question: string,
  incidentSummary: string,
): Promise<ChatAnswer> {
  const c = getClient();
  if (!c) {
    return {
      answer: "Chat requires ANTHROPIC_API_KEY to be configured.",
    };
  }

  try {
    const response = await c.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: CHAT_SYSTEM,
      messages: [
        {
          role: "user",
          content: `Incident context:\n${incidentSummary}\n\nQuestion: ${question}`,
        },
      ],
    });

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return { answer: text };
  } catch (error) {
    console.error("[ai] chat failed:", error);
    return {
      answer: "Chat failed — check that ANTHROPIC_API_KEY is valid.",
    };
  }
}
