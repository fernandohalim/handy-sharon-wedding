import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { site, siteUrl, weddingJsonLd } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.fullNames }],
  creator: site.fullNames,
  publisher: site.fullNames,
  category: "Wedding",

  // Guests arrive on `/?to=<slug>`. Pointing every one of those at `/` keeps the
  // ranking signals on a single URL instead of scattering them across one
  // near-duplicate page per guest.
  alternates: { canonical: "/" },

  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.title,
    description: site.description,
    url: "/",
    locale: site.locale,
  },

  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  // The invitation carries no phone numbers or addresses that should become
  // tappable links — Safari's autodetection only mangles the typography.
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  // First paint is the dark cover, so the mobile browser chrome should match it.
  themeColor: "#33405c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body>
        {children}
        <script
          type="application/ld+json"
          // Serialised from a plain object we control, so there is no untrusted
          // input here; `<` is still escaped to keep it un-parseable as markup.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(weddingJsonLd()).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
