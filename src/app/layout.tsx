import type { Metadata } from "next";
import { DoubleCheckProvider } from "@/context/DoubleCheckProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "DoubleCheck",
  description: "A clickable prototype of DoubleCheck, an OS-level privacy feature for iOS and macOS.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DoubleCheckProvider>{children}</DoubleCheckProvider>
      </body>
    </html>
  );
}
