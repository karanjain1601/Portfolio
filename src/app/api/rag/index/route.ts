import { indexPortfolioContent } from "@/lib/rag/indexer";

export const runtime = "nodejs";

function unauthorized(): Response {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request): Promise<Response> {
  try {
    const expected = process.env.RAG_ADMIN_TOKEN?.trim();
    const provided = request.headers.get("x-rag-admin-token")?.trim();

    if (expected && provided !== expected) {
      return unauthorized();
    }

    const result = await indexPortfolioContent();
    return Response.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to index content";
    return Response.json({ error: message }, { status: 500 });
  }
}
