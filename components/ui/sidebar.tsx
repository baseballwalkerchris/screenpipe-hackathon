"use client";

import { SearchIcon, GridIcon } from "../icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-48 min-w-[12rem] h-screen bg-background text-sidebar-foreground p-4 border-r flex flex-col items-center">
      <div className="font-bold text-lg mb-6 text-center w-full">LOGO HERE</div>
      <nav className="w-full">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/" 
              className={`flex items-center gap-2 p-2 rounded-md justify-center w-full ${
                pathname === "/" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
              }`}
            >
              <SearchIcon className="w-5 h-5" />
              Explore
            </Link>
          </li>
          <li>
            <Link 
              href="/projects" 
              className={`flex items-center gap-2 p-2 rounded-md justify-center w-full ${
                pathname === "/projects" ? "bg-sidebar-accent" : "hover:bg-sidebar-accent"
              }`}
            >
              <GridIcon className="w-5 h-5" />
              Projects
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
