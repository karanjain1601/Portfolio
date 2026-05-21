import { contact, profile } from "@/config/loader";
import { Section, SectionHeading } from "@/components/section";
import { CopyEmail } from "@/components/copy-email";
import { Reveal } from "@/components/motion/reveal";
import Link from "next/link";

export default function ContactPage() {
  return (
    <Section className="pt-24 max-w-3xl">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="Get in touch"
          subtitle={contact.message}
        />
      </Reveal>

      <Reveal delay={0.05}>
        {contact.showCopyButton ? (
          <CopyEmail email={contact.email} />
        ) : (
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center rounded-md bg-accent text-accent-foreground px-4 py-2 text-sm font-medium"
          >
            {contact.email}
          </a>
        )}
      </Reveal>

      {profile.socials.length > 0 && (
        <Reveal delay={0.1}>
          <div className="mt-12">
            <p className="text-sm text-muted-foreground mb-4">Or find me on</p>
            <ul className="flex flex-wrap gap-3">
              {profile.socials.map((s) => (
                <li key={s.url}>
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
