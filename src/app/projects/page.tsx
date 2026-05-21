import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { projects } from "@/config/loader";
import { Section, SectionHeading } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export default function ProjectsPage() {
  return (
    <Section className="pt-24">
      <Reveal>
        <SectionHeading
          eyebrow="Work"
          title="Projects"
          subtitle="Things I've built — for work, for fun, and to learn."
        />
      </Reveal>
      <Stagger className="grid gap-5 sm:grid-cols-2">
        {projects.map((p) => (
          <StaggerItem
            key={p.slug}
            as="article"
            className="group rounded-xl border border-border bg-card p-6 hover:border-accent/60 hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <Link
                href={`/projects/${p.slug}`}
                className="font-semibold text-lg group-hover:text-accent transition-colors"
              >
                {p.title}
              </Link>
              <div className="flex items-center gap-2 text-muted-foreground">
                {p.links.repo && (
                  <a
                    href={p.links.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Repository"
                    className="hover:text-foreground"
                  >
                    <GithubIcon size={16} />
                  </a>
                )}
                {p.links.demo && (
                  <a
                    href={p.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Live demo"
                    className="hover:text-foreground"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground flex-1">
              {p.summary}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            {p.period && (
              <p className="mt-4 text-xs text-muted-foreground">{p.period}</p>
            )}
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
