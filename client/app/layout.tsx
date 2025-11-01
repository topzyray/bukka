import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { envConfig } from "@/configs";
import { RootProvider } from "@/providers";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Explore Nearby Food Businesses | Bukka",
  description:
    "Discover and explore restaurants, bars, lounges, bakeries, and catering services near you with Bukka. Search by location, category, or ratings.",
  metadataBase: new URL(envConfig.NEXT_PUBLIC_DOMAIN_URL),
  openGraph: {
    title: "Explore Nearby Food Businesses | Bukka",
    description:
      "Find top-rated restaurants and hidden gems near you with Bukka.",
    url: envConfig.NEXT_PUBLIC_DOMAIN_URL,
    siteName: "Bukka",
    images: [
      {
        url: `${envConfig.NEXT_PUBLIC_DOMAIN_URL}/og-explore.png`,
        width: 1200,
        height: 630,
        alt: "Bukka Explore Page",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Nearby Food Businesses | Bukka",
    description:
      "Find top-rated restaurants and hidden gems near you with Bukka.",
    images: [
      "/images/og-explore.png",
      "/images/homepage.png",
      "find-business.png",
    ],
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bukka" />
      </head>
      <body className={`${urbanist.className} antialiased`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
