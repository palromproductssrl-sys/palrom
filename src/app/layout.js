import { Inter, Outfit, Poppins } from "next/font/google";
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
  title: "Palrom Products | Fabrikant van Beukenhouten Meubelcomponenten",
  description: "B2B-fabrikant van beukenhouten pluggen, profielen en meubelcomponenten. 100% FSC®-gecertificeerd lokaal hout.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${outfit.variable} ${poppins.variable}`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
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

