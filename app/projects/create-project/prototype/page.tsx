"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { TopBar } from "@/app/components/TopBar";
import { ProjectStages } from "@/app/components/ProjectStages";
import { NavigationSidebar } from "@/app/components/NavigationSidebar";

export default function Page() {
  const router = useRouter();
  const [prototypeLink, setPrototypeLink] = useState("");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      prototypeLink,
      selectedSource,
    });
    router.push("/projects/create-project/tasks");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName="Project #1" />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={2} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-[#ff4d4f] text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                  2
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Add Prototype to Project
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This prototype will be used throughout the test across all
                tasks.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="prototypeLink">Prototype Link</Label>
                <Input
                  id="prototypeLink"
                  value={prototypeLink}
                  onChange={(e) => setPrototypeLink(e.target.value)}
                  placeholder="Enter prototype link"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Prototype source options</Label>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSource("figma")}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      selectedSource === "figma"
                        ? "border-[#ff4d4f] bg-[#fff2f0]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src="/figma-logo.svg"
                      alt="Figma"
                      width={24}
                      height={24}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSource("sketch")}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      selectedSource === "sketch"
                        ? "border-[#ff4d4f] bg-[#fff2f0]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src="/sketch-logo.svg"
                      alt="Sketch"
                      width={24}
                      height={24}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSource("xd")}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      selectedSource === "xd"
                        ? "border-[#ff4d4f] bg-[#fff2f0]"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Image
                      src="/xd-logo.svg"
                      alt="Adobe XD"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
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
      </div>
    </div>
  );
}
