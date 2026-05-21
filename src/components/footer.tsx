import Link from "next/link";
import { Mail, Globe } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./brand-icons";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  mail: Mail,
  twitter: TwitterIcon,
  globe: Globe,
};

export function Footer({
  name,
  socials,
}: {
  name: string;
  socials: { label: string; url: string; icon: string }[];
}) {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-5xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} {name}. Built with Next.js.
        </p>
        <div className="flex items-center gap-4">
          {socials.map((s) => {
            const Icon = ICONS[s.icon] ?? Globe;
            return (
              <Link
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="hover:text-foreground transition-colors"
              >
                <Icon size={18} />
              </Link>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
