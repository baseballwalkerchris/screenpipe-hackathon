"use client";

import { useRouter } from "next/navigation";
import { BackButton } from "@/components/ui/back-button";

interface TopBarProps {
  projectName: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function TopBar({
  projectName,
  showBackButton,
  onBackClick,
}: TopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <div className="h-16 border-b flex items-center px-8 bg-white">
      {showBackButton && <BackButton onClick={handleBack} />}
      <h1 className="text-lg font-semibold">{projectName}</h1>
    </div>
  );
}
