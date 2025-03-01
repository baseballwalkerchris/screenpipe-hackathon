import { Home, Grid } from "lucide-react";
import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-background text-sidebar-foreground p-4 border-r">
      <div className="font-bold text-lg mb-6">LOGO HERE</div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
              <Home className="w-5 h-5" />
              Explore
            </Link>
          </li>
          <li>
            <Link href="/projects" className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
              <Grid className="w-5 h-5" />
              Projects
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
