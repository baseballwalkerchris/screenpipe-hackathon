"use client";

import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

interface TopBarProps {
  projectName: string;
  showBackButton?: boolean;
}

export function TopBar({ projectName, showBackButton }: TopBarProps) {
  const router = useRouter();

  return (
    <div className="h-16 border-b flex items-center px-6 bg-white">
      {showBackButton && (
        <BackButton onClick={() => router.back()} />
      )}
      <h1 className="text-lg font-semibold">{projectName}</h1>
    </div>
  );
}
