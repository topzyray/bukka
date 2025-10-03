import "./globals.css";
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import QueryClientProviders from "@/providers/query-client-provider";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bukka",
  description: "AI-Powered Restaurant Finder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
