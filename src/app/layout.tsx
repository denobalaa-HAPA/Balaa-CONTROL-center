import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Balaa Control Center",
  description: "Multi-vendor platform management dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}