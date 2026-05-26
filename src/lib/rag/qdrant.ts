import { QdrantClient } from "@qdrant/js-client-rest";
import { getRagEnv } from "@/lib/rag/env";
import type { RagChunk } from "@/lib/rag/content";

function getClient(): QdrantClient {
  const env = getRagEnv();
  return new QdrantClient({
    url: env.qdrantUrl,
    apiKey: env.qdrantApiKey,
  });
}

export async function ensureCollection(vectorSize: number): Promise<void> {
  const env = getRagEnv();
  const client = getClient();

  const existing = await client.getCollections();
  const hasCollection = existing.collections.some(
    (c) => c.name === env.qdrantCollection
  );

  if (!hasCollection) {
    await client.createCollection(env.qdrantCollection, {
      vectors: {
        size: vectorSize,
        distance: "Cosine",
      },
    });
  }
}

export async function upsertChunks(
  chunks: RagChunk[],
  vectors: number[][]
): Promise<void> {
  const env = getRagEnv();
  const client = getClient();

  await client.upsert(env.qdrantCollection, {
    wait: true,
    points: chunks.map((chunk, index) => ({
      id: chunk.id,
      vector: vectors[index],
      payload: {
        text: chunk.text,
        source: chunk.source,
        section: chunk.section,
      },
    })),
  });
}

export type SearchHit = {
  id: string | number;
  score: number;
  text: string;
  source: string;
  section: string;
};

export async function searchChunks(
  vector: number[],
  limit: number
): Promise<SearchHit[]> {
  const env = getRagEnv();
  const client = getClient();

  const result = await client.search(env.qdrantCollection, {
    vector,
    limit,
    with_payload: true,
  });

  return result.map((hit) => {
    const payload = (hit.payload ?? {}) as Record<string, unknown>;
    return {
      id: hit.id,
      score: hit.score,
      text: typeof payload.text === "string" ? payload.text : "",
      source: typeof payload.source === "string" ? payload.source : "unknown",
      section:
        typeof payload.section === "string" ? payload.section : "unknown",
    };
  });
}
