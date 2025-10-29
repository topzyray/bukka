import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { envConfig } from "@/configs";
import {
  AuthProvider,
  GlobalStateProvider,
  ReactQueryProvider,
  ThemeProvider,
  UserLocationProvider,
} from "@/providers";
import { SessionExpirationModal } from "@/events/session-event-listener";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Explore Nearby Food Businesses | Bukka",
  description:
    "Discover and explore restaurants, bars, lounges, bakeries, and catering services near you with Bukka. Search by location, category, or ratings.",
  openGraph: {
    title: "Explore Nearby Food Businesses | Bukka",
    description:
      "Find top-rated restaurants and hidden gems near you with Bukka.",
    url: envConfig.NEXT_PUBLIC_DOMAIN_URL,
    siteName: "Bukka",
    images: [
      {
        url: `${envConfig.NEXT_PUBLIC_DOMAIN_URL}/og-image.jpg`,
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
    images: ["/images/og-explore.jpg"],
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
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SessionExpirationModal />
            <UserLocationProvider>
              <AuthProvider>
                <GlobalStateProvider>
                  {children}
                  <Toaster richColors position="top-right" />
                </GlobalStateProvider>
              </AuthProvider>
            </UserLocationProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        {/* <BackgroundIcons /> */}
      </body>
    </html>
  );
}
