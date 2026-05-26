const DEFAULT_CHAT_MODEL = "openai/gpt-4o-mini";
const DEFAULT_EMBED_MODEL = "openai/text-embedding-3-small";
const DEFAULT_COLLECTION = "portfolio_chunks";
const DEFAULT_TOP_K = 6;

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function optionalInt(name: string, fallback: number): number {
  const value = process.env[name]?.trim();
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return parsed;
}

export function getRagEnv() {
  return {
    openRouterApiKey: requiredEnv("OPENROUTER_API_KEY"),
    openRouterChatModel:
      optionalEnv("OPENROUTER_CHAT_MODEL") ?? DEFAULT_CHAT_MODEL,
    openRouterEmbeddingModel:
      optionalEnv("OPENROUTER_EMBED_MODEL") ?? DEFAULT_EMBED_MODEL,
    openRouterBaseUrl:
      optionalEnv("OPENROUTER_BASE_URL") ?? "https://openrouter.ai/api/v1",
    openRouterReferer: optionalEnv("OPENROUTER_REFERER"),
    openRouterAppName: optionalEnv("OPENROUTER_APP_NAME"),
    qdrantUrl: requiredEnv("QDRANT_URL"),
    qdrantApiKey: requiredEnv("QDRANT_API_KEY"),
    qdrantCollection:
      optionalEnv("QDRANT_COLLECTION") ?? DEFAULT_COLLECTION,
    ragTopK: optionalInt("RAG_TOP_K", DEFAULT_TOP_K),
    ragAdminToken: optionalEnv("RAG_ADMIN_TOKEN"),
  };
}
