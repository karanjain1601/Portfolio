import { buildPortfolioChunks } from "@/lib/rag/content";
import { embedTexts } from "@/lib/rag/openrouter";
import { ensureCollection, upsertChunks } from "@/lib/rag/qdrant";

export async function indexPortfolioContent() {
  const chunks = buildPortfolioChunks();

  if (chunks.length === 0) {
    return {
      indexed: 0,
      message: "No chunks were generated from portfolio content.",
    };
  }

  const vectors = await embedTexts(chunks.map((chunk) => chunk.text));
  await ensureCollection(vectors[0].length);
  await upsertChunks(chunks, vectors);

  return {
    indexed: chunks.length,
    vectorSize: vectors[0].length,
  };
}
