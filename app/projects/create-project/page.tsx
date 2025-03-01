"use client";

import { Inter } from "next/font/google";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function Page() {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [hasCompensation, setHasCompensation] = useState<"yes" | "no">("no");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      projectName,
      projectDescription,
      hasCompensation,
    });
    // Here you would typically save the project data
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-6 ${inter.className}`}>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            Project Overview
          </h1>
          <p className="text-sm text-gray-500">
            This prototype will be used throughout the test across all tasks.
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
              Are you providing compensation for testers that sign up for your
              project?
            </Label>
            <RadioGroup
              value={hasCompensation}
              onValueChange={(value: "yes" | "no") => setHasCompensation(value)}
              className="flex gap-4 mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <Button
            type="submit"
            className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
          >
            Save
          </Button>
        </form>
      </div>
    </div>
  );
}
