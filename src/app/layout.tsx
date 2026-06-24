import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import Provider from "./provider";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Anonymous Feed",
  description: "Anonymous Feed is a safe place to receive anonymous messages from friends, fans, or anyone. Share honestly, stay anonymous.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Provider>
        <body className={`${inter.className}  antialiased`}>
          <main>
            <Navbar />
            {children}
            <Footer />
          </main>
          <Toaster closeButton theme="light" richColors />
        </body>
      </Provider>
    </html>
  );
}
