import type { Metadata } from "next";
import { headers } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, CommandPalette } from "@/components";
import { SITE_URL } from "@/lib/site-url";
import { ensureDbReady } from "@/lib/db/ensure";
import { getAllPublishedPosts } from "@/lib/db/blog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Felix Sanchez - Ingeniero de Software",
    template: "%s | Felix Sanchez",
  },
  description: "Desarrollador Full Stack especializado en Java, .NET, Node.js | Backend Developer | Santo Domingo, RD",
  keywords: ["Felix Sanchez", "Desarrollador", "Backend", "Java", ".NET", "Node.js", "Oracle", "Spring Boot"],
  authors: [{ name: "Felix Sanchez" }],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Felix Sanchez - Ingeniero de Software",
    description: "Desarrollador Full Stack especializado en Java, .NET, Node.js",
    type: "website",
    locale: "es_DO",
    url: SITE_URL,
    siteName: "Felix Sanchez",
  },
  twitter: {
    card: "summary_large_image",
    title: "Felix Sanchez - Ingeniero de Software",
    description: "Desarrollador Full Stack especializado en Java, .NET, Node.js",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  ensureDbReady();
  const posts = getAllPublishedPosts().map((p) => ({
    title: p.title,
    slug: p.slug,
  }));

  // Read CSP nonce from middleware header
  const headersList = await headers();
  const nonce = headersList.get('x-csp-nonce') || '';

  return (
    <html lang="es" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Prevent flash of wrong theme - nonce allows this inline script via CSP */}
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
          <CommandPalette posts={posts} />
        </ThemeProvider>
      </body>
    </html>
  );
}
