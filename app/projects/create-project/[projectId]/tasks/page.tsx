"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { CreateTaskModal } from "@/components/create-task-modal";
import { Plus, MoreVertical, Trash } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  prototypeLink: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const searchParams = useSearchParams();
  const params = useParams();
  const [projectName, setProjectName] = useState("");
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    if (nameFromUrl) {
      setProjectName(decodeURIComponent(nameFromUrl));
    }
  }, [searchParams]);

  const handleCreateTask = (newTask: Omit<Task, "id">) => {
    if (editingTask) {
      // Update existing task
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...task, ...newTask } : task
        )
      );
      setEditingTask(null);
    } else {
      // Create new task
      const task: Task = {
        ...newTask,
        id: Math.random().toString(36).substr(2, 9),
      };
      setTasks((prev) => [...prev, task]);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle options click - can be expanded later
  };

  const handleSaveAndContinue = () => {
    if (tasks.length === 0) {
      alert("Please create at least one task before continuing.");
      return;
    }
    // Navigate to the share screen with the project name
    router.push(
      `/projects/create-project/${
        params.projectId
      }/share?name=${encodeURIComponent(projectName)}`
    );
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
            <div className="mb-8">
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

            {/* Task list and actions container */}
            <div className="space-y-8 max-w-3xl">
              {/* Task list */}
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="group bg-white border rounded-lg py-6 px-6 hover:shadow-md transition-all flex items-center gap-4 cursor-pointer hover:border-[#ff4d4f] relative"
                    onClick={() => handleEditTask(task)}
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                  >
                    <Image
                      src="/checkbox.svg"
                      alt="Checkbox"
                      width={48}
                      height={48}
                    />
                    <h3 className="text-lg font-medium">{task.title}</h3>

                    {/* Hover Controls */}
                    {hoveredTaskId === task.id && (
                      <div className="absolute right-2 top-2 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.1)] rounded-md z-10">
                        <button
                          onClick={(e) => handleDeleteTask(e, task.id)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md"
                        >
                          <Trash size={14} className="text-gray-500" />
                          <span>Delete Task</span>
                        </button>
                        <button
                          onClick={handleOptionsClick}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-md"
                        >
                          <MoreVertical size={14} className="text-gray-500" />
                          <span>More Options</span>
                        </button>
                      </div>
                    )}
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

              {/* Save & Continue button */}
              <div className="flex justify-end pt-4">
                <Button
                  onClick={handleSaveAndContinue}
                  className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-8 py-2.5 text-sm rounded"
                >
                  Save & Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreateTask={handleCreateTask}
        editingTask={editingTask}
      />
    </div>
  );
}
