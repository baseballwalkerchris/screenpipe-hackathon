"use client";

import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { SearchBar } from "@/components/ui/SearchBar";
import { AppCard } from "@/components/ui/AppCard";
import { useState } from "react";

// Sample data - in a real app, this would come from an API
const SAMPLE_APPS = [
  {
    id: "app1",
    title: "Productivity App",
    embedUrl: "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share",
    expectedTime: "15 mins",
    compensation: "20"
  },
  {
    id: "app2",
    title: "Productivity App",
    embedUrl: "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share",
    expectedTime: "15 mins",
    compensation: "20"
  },
  {
    id: "app3",
    title: "Productivity App",
    embedUrl: "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share",
    expectedTime: "15 mins",
    compensation: "20"
  },
  {
    id: "app4",
    title: "Productivity App",
    embedUrl: "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share",
    expectedTime: "15 mins",
    compensation: "20"
  },
  {
    id: "app5",
    title: "Productivity App",
    embedUrl: "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share",
    expectedTime: "15 mins",
    compensation: "20"
  },
  {
    id: "app6",
    title: "Productivity App",
    embedUrl: "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share",
    expectedTime: "15 mins",
    compensation: "20"
  }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen overflow-hidden bg-secondary-background">
      <Sidebar activePage="explore" />
      
      <div className="flex-1 flex flex-col h-screen overflow-auto">
        <Header />
        
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold mb-8">
              Explore Projects to Test
            </h1>

            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar onChange={setSearchQuery} />
            </div>

            {/* App Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {SAMPLE_APPS.map((app) => (
                <AppCard
                  key={app.id}
                  projectId={app.id}
                  title={app.title}
                  embedUrl={app.embedUrl}
                  expectedTime={app.expectedTime}
                  compensation={app.compensation}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
