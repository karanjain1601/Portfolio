import { createHash } from "node:crypto";
import {
  profile,
  education,
  achievements,
  experience,
  projects,
} from "@/config/loader";

export type RagChunk = {
  id: string;
  text: string;
  source: string;
  section: string;
};

function chunkId(source: string, text: string): string {
  const hex = createHash("sha256")
    .update(`${source}::${text}`)
    .digest("hex")
    .slice(0, 32);

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function splitText(text: string, maxChars = 700): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];

  const sentences = cleaned.split(/(?<=[.!?])\s+/g);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    if (!sentence) continue;
    const next = current ? `${current} ${sentence}` : sentence;
    if (next.length <= maxChars) {
      current = next;
      continue;
    }

    if (current) chunks.push(current);

    if (sentence.length <= maxChars) {
      current = sentence;
      continue;
    }

    for (let i = 0; i < sentence.length; i += maxChars) {
      chunks.push(sentence.slice(i, i + maxChars));
    }
    current = "";
  }

  if (current) chunks.push(current);
  return chunks;
}

export function buildPortfolioChunks(): RagChunk[] {
  const raw: Array<Pick<RagChunk, "source" | "section" | "text">> = [];

  raw.push({
    source: "profile",
    section: "about",
    text: `${profile.name}. ${profile.tagline}. ${profile.shortBio} ${profile.longBio}`,
  });

  for (const [index, e] of education.entries()) {
    raw.push({
      source: `education/${index}`,
      section: "education",
      text: `${e.school}. ${e.degree}. ${e.period}. ${e.location ?? ""}. ${e.details ?? ""}`,
    });
  }

  for (const [index, a] of achievements.entries()) {
    raw.push({
      source: `achievements/${index}`,
      section: "achievements",
      text: `${a.title}. ${a.issuer ?? ""}. ${a.date ?? ""}. ${a.description ?? ""}`,
    });
  }

  for (const [index, e] of experience.entries()) {
    raw.push({
      source: `experience/${index}`,
      section: "experience",
      text: `${e.role} at ${e.company}. ${e.period}. ${e.location ?? ""}. ${e.summary}. Highlights: ${e.highlights.join("; ")}. Tech: ${e.tech.join(", ")}`,
    });
  }

  for (const p of projects) {
    raw.push({
      source: `projects/${p.slug}`,
      section: "projects",
      text: `${p.title}. ${p.summary}. ${p.description}. Role: ${p.role ?? ""}. Period: ${p.period ?? ""}. Tech: ${p.tech.join(", ")}`,
    });
  }

  return raw.flatMap((item) =>
    splitText(item.text).map((text) => ({
      id: chunkId(item.source, text),
      text,
      source: item.source,
      section: item.section,
    }))
  );
}
