"use client";

import Link from "next/link";
import { Search, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface SidebarProps {
  activePage?: "explore" | "projects";
}

export default function Sidebar({ activePage }: SidebarProps) {
  return (
    <div className="w-[240px] border-r border-border bg-white flex flex-col">
      <div className="p-8">
        <Image
          src="/sensus.svg"
          alt="Sensus Logo"
          width={120}
          height={40}
          priority
        />
      </div>

      <div className="flex-1 px-4 space-y-4">
        <Link
          href="/user/explore"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            activePage === "explore"
              ? "bg-[#FFF3F3] text-[#FF5A5F]"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Search size={20} />
          Explore
        </Link>

        <Link
          href="/projects"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
            activePage === "projects"
              ? "bg-[#FFF3F3] text-[#FF5A5F]"
              : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <LayoutGrid size={20} />
          Projects
        </Link>
      </div>
    </div>
  );
}
