"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { TopBar } from "@/app/components/TopBar";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const stages = [
  { id: 1, name: "Project Overview", isActive: true },
  { id: 2, name: "Prototype", isActive: false },
  { id: 3, name: "Tasks", isActive: false },
  { id: 4, name: "Share", isActive: false },
];

export default function Page() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [hasCompensation, setHasCompensation] = useState<"yes" | "no">("no");
  const [compensationAmount, setCompensationAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      projectName,
      projectDescription,
      hasCompensation,
    });
    router.push("/projects/create-project/prototype");
    // Here you would typically save the project data
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar projectName={projectName || "Project #1"} />
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <div className="space-y-2">
            {stages.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center p-3 rounded-lg ${
                  stage.isActive
                    ? "bg-[#fff2f0] text-[#ff4d4f]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                    stage.isActive ? "bg-[#ff4d4f] text-white" : "bg-gray-200"
                  }`}
                >
                  {stage.id}
                </div>
                <span className="font-medium">{stage.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Project Overview
              </h1>
              <p className="text-sm text-gray-500">
                This prototype will be used throughout the test across all
                tasks.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Project"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="projectDescription">
                  Project Description (optional)
                </Label>
                <Textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Add description to project"
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label>
                  Are you providing compensation for testers that sign up for
                  your project?
                </Label>
                <div className="flex gap-4 mt-2">
                  <Button
                    type="button"
                    variant={hasCompensation === "yes" ? "default" : "outline"}
                    onClick={() => setHasCompensation("yes")}
                    className={
                      hasCompensation === "yes"
                        ? "bg-[#ffa39e] hover:bg-[#ffb4ae] text-white"
                        : ""
                    }
                  >
                    Yes
                  </Button>
                  <Button
                    type="button"
                    variant={hasCompensation === "no" ? "default" : "outline"}
                    onClick={() => setHasCompensation("no")}
                    className={
                      hasCompensation === "no"
                        ? "bg-[#ffa39e] hover:bg-[#ffb4ae] text-white"
                        : ""
                    }
                  >
                    No
                  </Button>
                </div>
              </div>

              {hasCompensation === "yes" && (
                <div className="mt-4">
                  <Label htmlFor="compensationAmount">
                    Compensation Amount
                  </Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      id="compensationAmount"
                      type="number"
                      value={compensationAmount}
                      onChange={(e) => setCompensationAmount(e.target.value)}
                      className="pl-7"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
              >
                Save
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
