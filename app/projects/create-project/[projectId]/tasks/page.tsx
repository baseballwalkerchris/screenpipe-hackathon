"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { CreateTaskModal } from "@/components/create-task-modal";
import { Plus } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  prototypeLink: string;
}

export default function TasksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks((prev) => [...prev, task]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName="Project #1" />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={2} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">Tasks</h1>
            </div>

            {/* Task list */}
            <div className="space-y-4 max-w-3xl">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border rounded-lg py-6 px-6 hover:shadow-md transition-shadow flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20 6L9 17L4 12"
                        stroke="#666666"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
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
