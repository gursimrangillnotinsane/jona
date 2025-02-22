import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Lobster, Pridi } from "next/font/google";

import "./globals.css";


const lobster = Lobster({
  variable: "--font-lobster",
  subsets: ["latin"],
  weight: "400"
});


const pridi = Pridi({
  variable: "--font-pridi",
  subsets: ["latin"],
  weight: "400"
});
export const metadata: Metadata = {
  title: "Love Secrets",
  description: "A place to share our love",
  icons: {
    icon: "/icon.ico", // Path to your favicon in the `public` folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body
        className={`${lobster.variable}  ${pridi.variable} antialiased`}
      ><StackProvider app={stackServerApp}><StackTheme>
        {children}
      </StackTheme></StackProvider></body>
    </html>
  );
}
