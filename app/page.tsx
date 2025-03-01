"use client";

import { SettingsProvider } from "@/lib/settings-provider";
import { PlaygroundCard } from "@/components/playground-card";
import { ClientOnly } from "@/lib/client-only";
import { Inter } from "next/font/google";
import healthStatusContent from "../content/health-status-card.json";
import { useEffect, useState } from "react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface Pipe {
  id: string;
  name: string;
  description: string;
}

export default function Page() {
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://screenpi.pe/api/plugins/registry")
      .then((res) => res.json())
      .then((data) => {
        const transformedPipes = data.map((pipe: any) => ({
          id: pipe.id,
          name: pipe.name,
          description: pipe.description?.split("\n")[0] || "",
        }));
        setPipes(transformedPipes);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pipes:", error);
        setLoading(false);
      });
  }, []);

  return (
    <SettingsProvider>
      <ClientOnly>
        <div
          className={`flex flex-col gap-6 items-center justify-center h-full mt-12 px-4 pb-12 ${inter.className}`}
        >
          {healthStatusContent.map((cardContent, index) => (
            <PlaygroundCard key={index} content={cardContent} />
          ))}
        </div>
      </ClientOnly>
    </SettingsProvider>
  );
}
