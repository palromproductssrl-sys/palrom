import { Inter, Outfit, Poppins } from "next/font/google";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./globals.css";
import { InquiryProvider } from "@/components/InquiryContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import FloatingWidget from "@/components/FloatingWidget";
import CookieConsent from "@/components/CookieConsent";
import ScrollObserver from "@/components/ScrollObserver";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Palrom Products | Fabrikant van Beukenhouten Stokken, Latten en Profielen",
  description: "B2B-fabrikant van beukenhouten bestekken, stokken, latten en profielen. FSC®-gecertificeerd lokaal beukenhout.",
};

export const viewport = {
  themeColor: "#fdf7f2",
  colorScheme: "light",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${poppins.variable}`}
    >
      <head />
      <body>
        <InquiryProvider>
          <ScrollObserver />
          <Header />
          {children}
          <CartSidebar />
          <FloatingWidget />
          <CookieConsent />
          <Footer />
        </InquiryProvider>
      </body>
    </html>
  );
}

