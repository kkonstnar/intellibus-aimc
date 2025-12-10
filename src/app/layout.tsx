import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PostHogProvider from "@/src/providers/PostHogProvider";
import { NotificationProvider } from "@/src/contexts/NotificationContext";
import NotificationContainer from "@/src/components/NotificationContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Masterclass - NYU & Intellibus",
  description: "Learn how executives and business leaders can effectively think about, strategize, and implement AI in their organizations.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/AIMC_Angled_Horiz_w Title_Violet.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/AIMC_Angled_Horiz_w Title_Violet.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PostHogProvider>
          <NotificationProvider>
            {children}
            <NotificationContainer />
          </NotificationProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}

