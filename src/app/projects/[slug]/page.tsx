import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/brand-icons";
import { projects, projectBySlug } from "@/config/loader";
import { Section } from "@/components/section";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  return (
    <Section className="pt-24 max-w-3xl">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft size={14} /> All projects
      </Link>

      <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>
      <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {project.links.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm rounded-md border border-border px-3 py-1.5 hover:bg-muted"
          >
            <GithubIcon size={14} /> Repository
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm rounded-md bg-accent text-accent-foreground px-3 py-1.5 hover:opacity-90"
          >
            <ExternalLink size={14} /> Live demo
          </a>
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
        {project.role && (
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        {project.period && (
          <div>
            <dt className="text-muted-foreground">Period</dt>
            <dd>{project.period}</dd>
          </div>
        )}
        <div>
          <dt className="text-muted-foreground">Stack</dt>
          <dd>{project.tech.join(", ")}</dd>
        </div>
      </dl>

      <div className="mt-10 prose prose-invert max-w-none whitespace-pre-line text-foreground/90 leading-relaxed">
        {project.description}
      </div>
    </Section>
  );
}
