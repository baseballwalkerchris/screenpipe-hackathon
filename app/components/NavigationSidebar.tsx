"use client";

import { Search, Grid } from "lucide-react";

export function NavigationSidebar() {
  return (
    <div
      key="nav-sidebar"
      className="w-[72px] bg-white border-r border-gray-200 flex flex-col items-center py-4"
    >
      <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
        <Search className="w-5 h-5 text-gray-500" />
      </button>
      <button className="w-10 h-10 flex items-center justify-center rounded-lg mt-2 bg-[#fff2f0]">
        <Grid className="w-5 h-5 text-[#ff4d4f]" />
      </button>
    </div>
  );
}
