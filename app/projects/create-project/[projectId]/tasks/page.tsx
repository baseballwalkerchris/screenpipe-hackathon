"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import Image from "next/image";
import { X } from "lucide-react";

export default function TasksPage() {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [prototypeLink, setPrototypeLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle task creation
    console.log({
      task,
      description,
      prototypeLink,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName="Project #1" />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={2} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-5xl mx-auto bg-white rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold">Create a Task</h1>
              <button className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Form section */}
              <div>
                <div className="mb-6">
                  <Label htmlFor="task">Task</Label>
                  <Input
                    id="task"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Write your task here. This is what users will see."
                    className="mt-2"
                  />
                </div>

                <div className="mb-6">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description for your task."
                    className="mt-2 min-h-[120px]"
                  />
                </div>

                <div className="mb-6">
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
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-lg font-medium mb-4">Preview</h2>
                <div className="flex items-center justify-center h-[400px]">
                  <div className="text-gray-500 flex flex-col items-center">
                    <svg
                      className="w-12 h-12 mb-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <p className="text-sm text-center">
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

            {/* Footer buttons */}
            <div className="flex justify-end gap-4 mt-8">
              <Button variant="outline">Cancel</Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
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
