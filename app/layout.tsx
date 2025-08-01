import "./theme.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@coinbase/onchainkit/styles.css";
import { Providers } from "./providers";
import { Header } from "@/components/navigation/Header";
import { BottomNav } from "@/components/navigation/BottomNav";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SwipeWrapper } from "@/components/common/SwipeWrapper";
import { WelcomeModalHandler } from "@/components/common/WelcomeModalHandler";
import {
  getPageMetadata,
  getFrameMetadata,
  creatorScoreFrame,
} from "@/lib/app-metadata";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const pageMetadata = getPageMetadata();
  const frameMetadata = getFrameMetadata();

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    icons: {
      icon: "/favicon-64.png",
      shortcut: "/favicon-64.png",
      apple: "/favicon-64.png",
    },
    other: {
      "fc:frame": JSON.stringify(creatorScoreFrame),
      "og:title": frameMetadata.ogTitle,
      "og:description": frameMetadata.ogDescription,
      "og:image": frameMetadata.ogImageUrl,
      "twitter:card": "summary_large_image",
      "twitter:title": frameMetadata.ogTitle,
      "twitter:description": frameMetadata.ogDescription,
      "twitter:image": frameMetadata.ogImageUrl,
    },
  };
}

// Global error handling script
const globalErrorHandlingScript = `
  window.addEventListener('error', function(event) {
    // Filter out Next.js redirects which are normal behavior
    if (event.error && event.error.message && event.error.message.includes('NEXT_REDIRECT')) {
      return;
    }
    console.error('Global error:', event.error);
  });
  
  window.addEventListener('unhandledrejection', function(event) {
    // Filter out Next.js redirects which are normal behavior
    if (event.reason && event.reason.message && event.reason.message.includes('NEXT_REDIRECT')) {
      return;
    }
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/wip1dbu.css" />
      </head>
      <body className="min-h-full bg-white flex flex-col">
        <script
          dangerouslySetInnerHTML={{ __html: globalErrorHandlingScript }}
        />
        <div className="relative flex flex-col w-full bg-background my-0 md:my-0 md:bg-white md:shadow-none md:rounded-none md:overflow-hidden">
          <Providers>
            <ErrorBoundary>
              <Header />
              <SwipeWrapper className="flex-1 flex flex-col w-full relative overflow-y-auto">
                <main className="flex-1 flex flex-col w-full relative">
                  <ErrorBoundary>{children}</ErrorBoundary>
                </main>
              </SwipeWrapper>
              <BottomNav />
              <WelcomeModalHandler />
            </ErrorBoundary>
          </Providers>
        </div>
      </body>
    </html>
  );
}
