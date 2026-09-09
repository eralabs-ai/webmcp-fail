import type { Metadata } from "next";
import { Libre_Baskerville } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { entry } from "@/content/entry";
import "./globals.css";

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(entry.url),
  title: entry.headword,
  description: entry.definition,
  openGraph: {
    title: entry.headword,
    description: entry.definition,
    url: entry.url,
    siteName: "webmcp.fail",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: entry.headword,
    description: entry.definition,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={baskerville.variable}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
