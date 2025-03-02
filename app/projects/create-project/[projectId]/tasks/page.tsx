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
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {/* Task list */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No tasks created yet.</p>
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    variant="link"
                    className="text-[#ff4d4f] mt-2"
                  >
                    Create your first task
                  </Button>
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-lg font-medium mb-2">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-600 mb-2">{task.description}</p>
                    )}
                    {task.prototypeLink && (
                      <a
                        href={task.prototypeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#ff4d4f] hover:underline text-sm"
                      >
                        View Prototype
                      </a>
                    )}
                  </div>
                ))
              )}
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
