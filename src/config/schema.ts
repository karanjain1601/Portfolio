import { z } from "zod";

export const Social = z.object({
  label: z.string(),
  url: z.string().url(),
  icon: z.string(),
});

export const Profile = z.object({
  name: z.string(),
  tagline: z.string(),
  photo: z.string(),
  location: z.string().optional(),
  shortBio: z.string(),
  longBio: z.string(),
  socials: z.array(Social).default([]),
});

export const Education = z.array(
  z.object({
    school: z.string(),
    degree: z.string(),
    period: z.string(),
    location: z.string().optional(),
    details: z.string().optional(),
  })
);

export const Achievements = z.array(
  z.object({
    title: z.string(),
    issuer: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  })
);

export const Experience = z.array(
  z.object({
    company: z.string(),
    role: z.string(),
    period: z.string(),
    location: z.string().optional(),
    logo: z.string().optional(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    tech: z.array(z.string()).default([]),
  })
);

export const Project = z.object({
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  description: z.string(),
  tech: z.array(z.string()).default([]),
  role: z.string().optional(),
  period: z.string().optional(),
  links: z
    .object({
      repo: z.string().url().optional(),
      demo: z.string().url().optional(),
    })
    .default({}),
  cover: z.string().optional(),
  gallery: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
});

export const Projects = z.array(Project);

export const Contact = z.object({
  email: z.string().email(),
  message: z.string(),
  showCopyButton: z.boolean().default(true),
});

export const Theme = z.object({
  site: z.object({
    title: z.string(),
    description: z.string(),
    url: z.string().url(),
  }),
  colors: z.object({
    accent: z.string(),
    accentForeground: z.string(),
  }),
  font: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  animations: z.object({
    intensity: z.enum(["off", "low", "medium", "high"]).default("medium"),
    smoothScroll: z.boolean().default(true),
    cursor: z.enum(["default", "magnetic"]).default("default"),
  }),
  three: z.object({
    enabled: z.boolean().default(false),
    hero: z.enum(["particles", "shader", "none"]).default("none"),
  }),
  nav: z.array(z.object({ label: z.string(), href: z.string() })),
});

export type ProfileT = z.infer<typeof Profile>;
export type EducationT = z.infer<typeof Education>;
export type AchievementsT = z.infer<typeof Achievements>;
export type ExperienceT = z.infer<typeof Experience>;
export type ProjectT = z.infer<typeof Project>;
export type ProjectsT = z.infer<typeof Projects>;
export type ContactT = z.infer<typeof Contact>;
export type ThemeT = z.infer<typeof Theme>;
