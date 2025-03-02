import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  prototypeLink: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, "id">) => void;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreateTask,
}: CreateTaskModalProps) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [prototypeLink, setPrototypeLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTask({
      title: task,
      description,
      prototypeLink,
    });
    setTask("");
    setDescription("");
    setPrototypeLink("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-[1200px] h-full animate-slide-in">
        <div className="p-12 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b">
            <h1 className="text-2xl font-semibold">Edit Task</h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            {/* Form section */}
            <div className="flex flex-col gap-8">
              <div>
                <Label htmlFor="task">Task</Label>
                <Input
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Write your task here. This is what users will see."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for your task."
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="prototypeLink">Prototype Link</Label>
                <Input
                  id="prototypeLink"
                  value={prototypeLink}
                  onChange={(e) => setPrototypeLink(e.target.value)}
                  placeholder="Enter prototype link"
                  className="mt-2"
                />
                <div className="mt-4">
                  <Label>Prototype source options</Label>
                  <div className="flex gap-4 mt-2">
                    <Image
                      src="/figma-logo.svg"
                      alt="Figma"
                      width={24}
                      height={24}
                    />
                    <Image
                      src="/xd-logo.svg"
                      alt="Adobe XD"
                      width={24}
                      height={24}
                    />
                    <Image
                      src="/sketch-logo.svg"
                      alt="Sketch"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview section */}
            <div>
              <h2 className="text-lg font-medium mb-4">Preview</h2>
              <div className="bg-[#1a1a1a] rounded-lg p-6 flex items-center justify-center">
                <div className="relative w-[240px] h-[480px] bg-white rounded-[32px] p-2 shadow-xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100px] h-[20px] bg-black rounded-b-[16px]"></div>
                  <div className="w-full h-full bg-gray-50 rounded-[28px] flex items-center justify-center">
                    <p className="text-sm text-gray-500 text-center">
                      A preview of your prototype and task
                      <br />
                      will appear here once your inputted
                      <br />
                      information has been processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between mt-auto pt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
            >
              <Trash2 size={16} /> Delete Task
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white px-8"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
