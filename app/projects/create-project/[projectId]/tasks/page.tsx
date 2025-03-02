"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { CreateTaskModal } from "@/components/create-task-modal";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  prototypeLink: string;
}

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const searchParams = useSearchParams();
  const params = useParams();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    if (nameFromUrl) {
      setProjectName(decodeURIComponent(nameFromUrl));
    }
  }, [searchParams]);

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks((prev) => [...prev, task]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName={projectName || "Project #1"} />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={2} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <Image
                    src="/tasks.svg"
                    alt="Tasks icon"
                    width={40}
                    height={40}
                  />
                  <h1 className="text-2xl font-semibold">Tasks</h1>
                </div>
                <p className="text-gray-600">
                  Tasks will appear as prompts throughout the test for users to
                  complete.
                </p>
              </div>
            </div>

            {/* Task list */}
            <div className="space-y-4 max-w-3xl">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border rounded-lg py-6 px-6 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <Image
                    src="/checkbox.svg"
                    alt="Checkbox"
                    width={48}
                    height={48}
                  />
                  <h3 className="text-lg font-medium">{task.title}</h3>
                </div>
              ))}

              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full border-2 border-[#ff4d4f] rounded-lg py-6 hover:bg-[#fff1f0] transition-colors"
              >
                <div className="flex items-center justify-center text-[#ff4d4f] gap-2">
                  <Plus size={20} />
                  <span className="text-lg">New Task</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
