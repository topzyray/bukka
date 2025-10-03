import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import QueryClientProviders from "@/providers/query-client-provider";
import { envConfig } from "@/configs/env.config";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bukka",
  description: "AI-Powered Restaurant Finder",
  openGraph: {
    title: "Bukka",
    description: "AI-Powered Restaurant Finder",
    url: envConfig.NEXT_PUBLIC_DOMAIN_URL,
    siteName: "Bukka",
    images: [
      {
        url: `${envConfig.NEXT_PUBLIC_DOMAIN_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Bukka",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@bukka",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  envConfig.validateConfig();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${urbanist.className} antialiased`}>
        <QueryClientProviders>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster closeButton richColors position="top-center" />
          </ThemeProvider>
        </QueryClientProviders>
      </body>
    </html>
  );
}
