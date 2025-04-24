import type { Metadata } from "next";
import { League_Spartan } from "next/font/google";
import LayoutProvider from "@/components/shared/LayoutProvider";
import "./globals.css";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-league-spartan",
});



export const metadata: Metadata = {
  title: "Media Player App",
  description: "Interactive media player for courses and videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${leagueSpartan.variable} font-league-spartan antialiased`}
      >
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
