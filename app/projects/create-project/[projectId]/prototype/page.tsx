"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { TopBar } from "@/app/components/TopBar";
import { ProjectStages } from "@/app/components/ProjectStages";
import { FigmaEmbed } from "@/components/ui/figma-embed";

export default function PrototypePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [figmaUrl, setFigmaUrl] = useState("");
  const [isEmbedVisible, setIsEmbedVisible] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!figmaUrl.trim()) {
      setError("Please enter a Figma URL");
      return;
    }

    // Check if it's a valid Figma URL
    if (!figmaUrl.includes('figma.com')) {
      setError("Please enter a valid Figma URL");
      return;
    }

    setError("");
    setIsEmbedVisible(true);
  };

  const handleNext = () => {
    if (figmaUrl) {
      const projectId = searchParams.get("projectId") || "";
      const projectName = searchParams.get("name") || "";
      router.push(`/projects/create-project/${projectId}/tasks?name=${projectName}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName={searchParams.get("name") || "Project #1"} />
      <div className="flex flex-1">
        <ProjectStages currentStage={2} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <div className="bg-[#ff4d4f] text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                  2
                </div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Add Your Prototype
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Paste your Figma prototype link below. Make sure your prototype is set to public or anyone with the link can view.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 mb-6">
              <div>
                <Label htmlFor="figmaUrl">Figma Prototype URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="figmaUrl"
                    value={figmaUrl}
                    onChange={(e) => {
                      setFigmaUrl(e.target.value);
                      setError("");
                    }}
                    placeholder="Paste your Figma embed code or URL here..."
                    className={`flex-1 ${error ? 'border-red-500' : ''}`}
                  />
                  <Button 
                    type="submit"
                    className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
                  >
                    Embed
                  </Button>
                </div>
                {error && (
                  <p className="text-red-500 text-sm mt-1">{error}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Tip: To get the embed code, click "Share" in Figma, go to the "Embed" tab, and copy the URL from the iframe code.
                </p>
              </div>
            </form>

            {isEmbedVisible && figmaUrl && (
              <div className="space-y-6">
                <FigmaEmbed 
                  embedUrl={figmaUrl}
                  width={800}
                  height={450}
                />
                
                <div className="flex justify-end">
                  <Button
                    onClick={handleNext}
                    className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white"
                  >
                    Next: Add Tasks
                  </Button>
                </div>
              </div>
            )}

            {!isEmbedVisible && (
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-500">
                  Your prototype will appear here after you paste a Figma URL and click Embed
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 