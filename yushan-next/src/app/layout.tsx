import type { Metadata, Viewport } from "next";
import { Newsreader, Public_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { EmailPopup } from "@/components/EmailPopup";
import { CookieConsent } from "@/components/CookieConsent";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-public-sans",
  display: "swap",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yushancolour.com"),
  title: {
    default: "Yushan Colour Co. | Hand-milled watercolour, Taipei",
    template: "%s | Yushan Colour Co.",
  },
  description:
    "Sixteen of eighteen colours single-pigment. Two house minerals found nowhere else. Every Colour Index code and Blue Wool lightfastness result published, including the weak ones.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2032%2032'%3E%3Crect%20width='32'%20height='32'%20fill='%231A1815'/%3E%3Cpath%20d='M2%2025%20L12%209%20L17%2017%20L23%205%20L31%2025%20Z'%20fill='%23F7F6F2'/%3E%3C/svg%3E",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Yushan Colour Co.",
    title: "Yushan Colour Co. | Hand-milled watercolour, Taipei",
    description:
      "Sixteen of eighteen colours single-pigment. Two house minerals found nowhere else. Every Colour Index code and Blue Wool lightfastness result published, including the weak ones.",
    images: ["/images/palette-mixing-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yushan Colour Co. | Hand-milled watercolour, Taipei",
    description: "Sixteen of eighteen colours single-pigment. Two house minerals found nowhere else.",
    images: ["/images/palette-mixing-hero.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1815",
};

const organizationJsonLd = {
  "@context": "https://schema.org/",
  "@type": "Organization",
  name: "Yushan Colour Co.",
  alternateName: "玉山",
  url: "https://yushancolour.com/",
  logo: "https://yushancolour.com/icons/icon-512.png",
  description:
    "Hand-milled watercolour from a two-person workshop in Datong District, Taipei. Every Colour Index code and lightfastness result published, including the weak ones.",
  email: "hello@yushancolour.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Datong District",
    addressRegion: "Taipei",
    addressCountry: "TW",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${publicSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      </head>
      <body>
        <a className="visually-hidden" href="#main">
          Skip to content
        </a>
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <EmailPopup />
        </CartProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
