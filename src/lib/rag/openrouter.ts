import { getRagEnv } from "@/lib/rag/env";

type EmbeddingResponse = {
  data?: Array<{ embedding?: number[] }>;
};

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

function baseHeaders(): HeadersInit {
  const env = getRagEnv();
  return {
    Authorization: `Bearer ${env.openRouterApiKey}`,
    "Content-Type": "application/json",
    ...(env.openRouterReferer ? { "HTTP-Referer": env.openRouterReferer } : {}),
    ...(env.openRouterAppName ? { "X-Title": env.openRouterAppName } : {}),
  };
}

export async function embedTexts(inputs: string[]): Promise<number[][]> {
  const env = getRagEnv();
  const response = await fetch(`${env.openRouterBaseUrl}/embeddings`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({
      model: env.openRouterEmbeddingModel,
      input: inputs,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenRouter embeddings failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as EmbeddingResponse;
  const vectors = (data.data ?? [])
    .map((item) => item.embedding)
    .filter((v): v is number[] => Array.isArray(v));

  if (vectors.length !== inputs.length) {
    throw new Error("Embedding response size did not match input size");
  }

  return vectors;
}

export async function chatWithContext(args: {
  prompt: string;
  contextBlocks: string[];
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<string> {
  const env = getRagEnv();

  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are a concise portfolio assistant. Use the provided context first. If context is insufficient, say so briefly and answer from general knowledge only when clearly marked.",
    },
    {
      role: "system",
      content: `RAG context:\n${args.contextBlocks.join("\n\n---\n\n") || "No context found."}`,
    },
  ];

  for (const turn of args.history ?? []) {
    messages.push({ role: turn.role, content: turn.content });
  }

  messages.push({ role: "user", content: args.prompt });

  const response = await fetch(`${env.openRouterBaseUrl}/chat/completions`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify({
      model: env.openRouterChatModel,
      messages,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenRouter chat failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as ChatResponse;
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
