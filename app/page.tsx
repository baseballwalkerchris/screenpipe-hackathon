"use client";

import { SettingsProvider } from "@/lib/settings-provider";
import { ClientOnly } from "@/lib/client-only";
import { Inter } from "next/font/google";
import { UserTest } from "@/components/user-test";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function Page() {
  return (
    <SettingsProvider>
      <ClientOnly>
        <div className={`h-full ${inter.className}`}>
          <UserTest onDataChange={() => {}} />
        </div>
      </ClientOnly>
    </SettingsProvider>
  );
}
