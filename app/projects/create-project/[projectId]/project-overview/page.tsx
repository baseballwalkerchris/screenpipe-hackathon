"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [hasCompensation, setHasCompensation] = useState<"yes" | "no">("no");
  const [compensationAmount, setCompensationAmount] = useState("");

  useEffect(() => {
    const nameFromUrl = searchParams.get("name");
    if (nameFromUrl) {
      setProjectName(decodeURIComponent(nameFromUrl));
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      projectName,
      projectDescription,
      hasCompensation,
    });

    // Get the projectId from the URL params
    const projectId = params.projectId as string;

    // Navigate to prototype page with project info
    router.push(
      `/projects/create-project/${projectId}/tasks?name=${encodeURIComponent(
        projectName
      )}`
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName={projectName || "Project #1"} />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={1} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Image
                    src="/book.svg"
                    alt="Project Overview"
                    width={26}
                    height={26}
                  />
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Project Overview
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-1">
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
                  placeholder="Project #1"
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
