import { z } from "zod";
import { getRagEnv } from "@/lib/rag/env";
import { embedTexts, chatWithContext } from "@/lib/rag/openrouter";
import { searchChunks } from "@/lib/rag/qdrant";

export const runtime = "nodejs";

const RequestSchema = z.object({
  message: z.string().min(1).max(4000),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .max(12)
    .optional(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = RequestSchema.parse(await request.json());
    const env = getRagEnv();

    const [queryVector] = await embedTexts([body.message]);
    const hits = await searchChunks(queryVector, env.ragTopK);

    const contextBlocks = hits
      .filter((hit) => hit.text)
      .map(
        (hit, index) =>
          `Source ${index + 1} (${hit.section}/${hit.source}, score=${hit.score.toFixed(3)}):\n${hit.text}`
      );

    const answer = await chatWithContext({
      prompt: body.message,
      history: body.history,
      contextBlocks,
    });

    return Response.json({
      answer,
      citations: hits.map((hit) => ({
        source: hit.source,
        section: hit.section,
        score: hit.score,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Chat request failed";
    return Response.json({ error: message }, { status: 400 });
  }
}
