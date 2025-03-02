"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { NewProjectModal } from '@/components/new-project-modal';
import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import ProjectsTable from "@/components/ui/projecttable";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleCreateProject = (projectName: string) => {
    // TODO: Implement project creation logic
    console.log('Creating project:', projectName);
    
    // Navigate to the project overview page
    const projectId = encodeURIComponent(projectName.toLowerCase().replace(/\s+/g, '-'));
    router.push(`/projects/create-project/${projectId}/project-overview?name=${encodeURIComponent(projectName)}`);
  };

  return (
    <div className="flex h-screen bg-secondary-background">
      {/* Sidebar Navigation */}
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Your Projects</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#FF5A5F] text-white rounded-md hover:bg-[#FF4347] flex items-center gap-2"
            >
              <span>+ New Project</span>
            </button>
          </div>

          <NewProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleCreateProject}
          />

          <ProjectsTable />
        </main>
      </div>
    </div>
  );
}