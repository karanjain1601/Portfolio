import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  profile,
  education,
  achievements,
  featuredProjects,
  theme,
} from "@/config/loader";
import { Section, SectionHeading } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HeroBackground } from "@/components/three/hero-background";

export default function HomePage() {
  return (
    <>
      <Section className="pt-24 pb-16 relative">
        <HeroBackground accent={theme.colors.accent} />
        <Reveal>
          <p className="text-sm text-muted-foreground mb-4">Hi, I&apos;m</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight">
            {profile.name}
            <span className="text-accent">.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl">
            {profile.tagline}
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl leading-relaxed text-foreground/90 whitespace-pre-line">
            {profile.shortBio}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded-md bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              See my work <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </Reveal>
      </Section>

      <Section id="about">
        <Reveal>
          <SectionHeading eyebrow="About" title="A bit about me" />
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line max-w-3xl">
            {profile.longBio}
          </p>
        </Reveal>
      </Section>

      <Section id="education">
        <Reveal>
          <SectionHeading eyebrow="Education" title="Where I studied" />
        </Reveal>
        <Stagger className="space-y-6">
          {education.map((e, i) => (
            <StaggerItem
              key={i}
              className="rounded-xl border border-border bg-card p-6 hover:border-accent/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="font-semibold text-lg">{e.school}</h3>
                <p className="text-sm text-muted-foreground">{e.period}</p>
              </div>
              <p className="text-sm text-foreground/90 mt-1">{e.degree}</p>
              {e.location && (
                <p className="text-sm text-muted-foreground">{e.location}</p>
              )}
              {e.details && (
                <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                  {e.details}
                </p>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section id="achievements">
        <Reveal>
          <SectionHeading eyebrow="Achievements" title="Highlights" />
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {achievements.map((a, i) => (
            <StaggerItem
              key={i}
              className="rounded-xl border border-border bg-card p-5 hover:border-accent/40 transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-medium">{a.title}</h3>
                {a.date && (
                  <span className="text-xs text-muted-foreground shrink-0">
                    {a.date}
                  </span>
                )}
              </div>
              {a.issuer && (
                <p className="text-sm text-muted-foreground mt-1">{a.issuer}</p>
              )}
              {a.description && (
                <p className="text-sm text-foreground/80 mt-2">
                  {a.description}
                </p>
              )}
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {featuredProjects.length > 0 && (
        <Section id="featured">
          <Reveal>
            <SectionHeading
              eyebrow="Selected work"
              title="Featured projects"
              subtitle="A few things I'm proud of. See the projects page for the full list."
            />
          </Reveal>
          <Stagger className="grid gap-4 sm:grid-cols-2">
            {featuredProjects.map((p) => (
              <StaggerItem key={p.slug}>
                <Link
                  href={`/projects/${p.slug}`}
                  className="block group rounded-xl border border-border bg-card p-5 hover:border-accent/60 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <h3 className="font-semibold group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.1}>
            <div className="mt-8">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
              >
                View all projects <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </Section>
      )}
    </>
  );
}
