import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import {
  Profile,
  Education,
  Achievements,
  Experience,
  Projects,
  Contact,
  Theme,
} from "./schema";

const ROOT = path.join(process.cwd(), "content");

function read<T>(file: string, schema: { parse: (x: unknown) => T }): T {
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  const parsed = YAML.parse(raw);
  try {
    return schema.parse(parsed);
  } catch (e) {
    console.error(`\n[content] Validation failed for ${file}:`);
    throw e;
  }
}

// Cached at module load — fine for SSG. Edit YAML → restart dev server.
export const profile = read("profile.yaml", Profile);
export const education = read("education.yaml", Education);
export const achievements = read("achievements.yaml", Achievements);
export const experience = read("experience.yaml", Experience);
export const projects = read("projects.yaml", Projects);
export const contact = read("contact.yaml", Contact);
export const theme = read("theme.yaml", Theme);

export const featuredProjects = projects.filter((p) => p.featured);
export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
