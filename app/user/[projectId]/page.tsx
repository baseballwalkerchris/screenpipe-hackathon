"use client";

import { useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { FigmaEmbed } from "@/components/ui/figma-embed";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { Instructions } from "@/components/ui/Instructions";
import { Button } from "@/components/ui/button";

export default function UserTestPage() {
  const [taskStarted, setTaskStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  
  const handleExitTask = () => {
    setTaskStarted(false);
    setIsCompleted(false);
  };

  const handleTaskComplete = () => {
    setTaskStarted(false);
    setIsCompleted(true);
  };

  const handleContinue = () => {
    setIsCompleted(false);
  };

  // Get embed URL and instructions from URL parameters
  const embedUrl = searchParams.get('embedUrl') || "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share";
  const instructions = searchParams.get('instructions') || "Select a travel itinerary that interests you and save it to your profile.";
  const description = searchParams.get('description') || "";

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col h-screen">
        <TopBar projectName={projectId} showBackButton />
        <ProgressBar progress={25} />
        
        <div className="flex flex-1 h-[calc(100vh-4rem)]">
          {taskStarted ? (
            // Expanded view when task is started
            <div className="flex-1 p-6">
              <div className="w-full h-[calc(100vh-7rem)] bg-[#000000] rounded-2xl relative">
                {/* Instructions in top-left corner */}
                <div className="absolute left-6 top-6 z-10">
                  <Instructions 
                    title={instructions}
                    description={description}
                    taskStarted={taskStarted}
                    onStartTask={() => setTaskStarted(true)}
                    onExitTask={handleExitTask}
                    onTaskComplete={handleTaskComplete}
                  />
                </div>
                
                {/* Centered Figma embed */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="transform scale-[0.95]">
                    <FigmaEmbed 
                      embedUrl={embedUrl}
                      width="375"
                      height="652"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Left side - Instructions/Completion */}
              <div className="flex-1 p-8 flex items-center">
                {isCompleted ? (
                  <div className="max-w-2xl">
                    <h1 className="text-3xl font-semibold mb-6">
                      Great job! You completed this task.
                    </h1>
                    <Button 
                      onClick={handleContinue}
                      className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-8 text-base py-5"
                    >
                      Continue
                    </Button>
                  </div>
                ) : (
                  <Instructions 
                    title={instructions}
                    description={description}
                    taskStarted={taskStarted}
                    onStartTask={() => setTaskStarted(true)}
                    onExitTask={handleExitTask}
                    onTaskComplete={handleTaskComplete}
                  />
                )}
              </div>

              {/* Right side - Prototype Display */}
              <div className="px-8 flex items-center">
                <div className="w-[600px] h-[95%] bg-[#000000] rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="transform scale-[0.8]">
                    <FigmaEmbed 
                      embedUrl={embedUrl}
                      width="375"
                      height="812"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 