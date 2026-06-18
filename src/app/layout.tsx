import type { Metadata } from "next";
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "box.love.pk — Customized Boxes Made with Love | FSD Based",
  description: "Order personalized custom black boxes with golden or silver writing. Handmade with love. Based in Faisalabad, Pakistan. Pay via JazzCash / Easypaisa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} h-full scroll-smooth`}
    >
      <body className="min-h-full font-sans-inter antialiased">
        {children}
      </body>
    </html>
  );
}
