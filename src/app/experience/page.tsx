import { experience } from "@/config/loader";
import { Section, SectionHeading } from "@/components/section";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";

export default function ExperiencePage() {
  return (
    <Section className="pt-24">
      <Reveal>
        <SectionHeading
          eyebrow="Career"
          title="Experience"
          subtitle="Roles I've held and what I worked on."
        />
      </Reveal>
      <Stagger gap={0.12}>
        <ol className="relative border-l border-border ml-3 space-y-10">
          {experience.map((job, i) => (
            <StaggerItem key={i} as="li" className="pl-8 relative block">
              <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-accent ring-4 ring-background" />
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                <h3 className="font-semibold text-lg">
                  {job.role}{" "}
                  <span className="text-muted-foreground font-normal">
                    · {job.company}
                  </span>
                </h3>
                <p className="text-sm text-muted-foreground">{job.period}</p>
              </div>
              {job.location && (
                <p className="text-sm text-muted-foreground">{job.location}</p>
              )}
              <p className="mt-3 text-foreground/90">{job.summary}</p>
              {job.highlights.length > 0 && (
                <ul className="mt-3 list-disc list-inside space-y-1 text-sm text-muted-foreground marker:text-accent">
                  {job.highlights.map((h, j) => (
                    <li key={j}>{h}</li>
                  ))}
                </ul>
              )}
              {job.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {job.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </StaggerItem>
          ))}
        </ol>
      </Stagger>
    </Section>
  );
}
