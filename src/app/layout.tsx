import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { MotionConfigProvider } from "@/components/motion/config";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { PageTransition } from "@/components/motion/page-transition";
import { ChatLauncher } from "@/components/chat/chat-launcher";
import { profile, theme } from "@/config/loader";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: theme.site.title,
  description: theme.site.description,
  metadataBase: new URL(theme.site.url),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const chatApiBaseUrl = process.env.NEXT_PUBLIC_CHAT_API_URL;

  return (
    <html
      lang="en"
      className={`${geist.variable} dark`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      style={{
        // Expose accent to CSS so Tailwind utilities and inline styles can use it
        ["--accent" as string]: theme.colors.accent,
        ["--accent-foreground" as string]: theme.colors.accentForeground,
      }}
    >
      <body className="min-h-screen flex flex-col antialiased">
        <ThemeProvider>
          <MotionConfigProvider
            animations={theme.animations}
            three={theme.three}
          >
            <SmoothScroll />
            <Navbar name={profile.name} links={theme.nav} />
            <main className="flex-1">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer name={profile.name} socials={profile.socials} />
            <ChatLauncher name={profile.name} apiBaseUrl={chatApiBaseUrl} />
          </MotionConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
