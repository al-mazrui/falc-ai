import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FALC.AI — Portfolio Intelligence",
  description: "Deal & Contract Management for Private Capital",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Arsenal:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
