import Sidebar from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import ProjectsTable from "@/components/ui/projecttable";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  return (
    <div className="flex h-screen bg-secondary-background">
      {/* Sidebar Navigation */}
      <Sidebar />
        <div className="flex-1 flex flex-col">
            <Header />
            <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Projects</h1>
                <Button variant="orange">+ New Project</Button>
            </div>
            <ProjectsTable />
          </main>
        </div>
    </div>
  )
}