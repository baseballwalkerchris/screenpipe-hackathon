"use client";

import { useState, useRef } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { FigmaEmbed } from "@/components/ui/figma-embed";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useParams, useSearchParams } from "next/navigation";
import { Instructions } from "@/components/ui/Instructions";
import { Button } from "@/components/ui/button";
import { UserTest, UserTestHandle } from "@/components/user-test";

export default function UserTestPage() {
  const [taskStarted, setTaskStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const userTestRef = useRef<UserTestHandle>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;

  // Get embed URL from URL parameters
  const embedUrl =
    searchParams.get("embedUrl") ||
    "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share";

  // Define multiple instructions
  const instructionsList = [
    {
      title: "Select a travel itinerary",
      description:
        "Browse through the available travel itineraries and select one that interests you.",
    },
    {
      title: "Save the itinerary",
      description:
        "Find and click the save button to add the itinerary to your profile.",
    },
    {
      title: "Review saved itinerary",
      description:
        "Navigate to your profile and verify that the itinerary was saved correctly.",
    },
  ];

  const currentInstruction = instructionsList[currentInstructionIndex];

  const handleStartTask = () => {
    setTaskStarted(true);
    setIsCompleted(false);
  };

  const handleExitTask = () => {
    setTaskStarted(false);
    setIsCompleted(false);
    setStreamData([]);
    setCurrentInstructionIndex(0); // Reset to first instruction
  };

  const handleTaskComplete = async () => {
    // Send current instruction's data to GPT
    await userTestRef.current?.sendDataToGPT(
      `Task "${currentInstruction.title}": ${currentInstruction.description}`
    );

    // Show completion screen
    setTaskStarted(false);
    setIsCompleted(true);
    setStreamData([]); // Clear stream data for next task
  };

  const handleContinue = () => {
    if (currentInstructionIndex < instructionsList.length - 1) {
      // Move to next instruction
      setCurrentInstructionIndex((prev) => prev + 1);
      setIsCompleted(false);
      setTaskStarted(true); // Automatically start the next task
    } else {
      // If this was the last instruction, reset everything
      setIsCompleted(false);
      setCurrentInstructionIndex(0);
    }
  };

  const handleDataChange = (data: any, error: string | null) => {
    if (data && !error) {
      setStreamData((prev) => [...prev, data]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <NavigationSidebar />

      <div className="flex-1 flex flex-col h-screen">
        <TopBar projectName={projectId} showBackButton />
        <ProgressBar
          progress={
            (currentInstructionIndex + 1) * (100 / instructionsList.length)
          }
        />

        <div className="flex flex-1 h-[calc(100vh-4rem)]">
          {taskStarted ? (
            // Expanded view when task is started
            <div className="flex-1 p-6">
              <div className="w-full h-[calc(100vh-7rem)] bg-[#000000] rounded-2xl relative">
                {/* Instructions in top-left corner */}
                <div className="absolute left-6 top-6 z-10">
                  <Instructions
                    title={currentInstruction.title}
                    description={currentInstruction.description}
                    taskStarted={taskStarted}
                    onStartTask={handleStartTask}
                    onExitTask={handleExitTask}
                    onTaskComplete={handleTaskComplete}
                    currentStep={currentInstructionIndex + 1}
                    totalSteps={instructionsList.length}
                  />
                </div>

                {/* Centered Figma embed */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="transform scale-[0.95]">
                    <FigmaEmbed embedUrl={embedUrl} width="375" height="652" />
                  </div>
                </div>

                {/* Screenpipe stream data display */}
                {taskStarted && (
                  <div className="absolute bottom-6 right-6 w-96 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 max-h-96 overflow-auto z-20">
                    <h3 className="font-semibold mb-2">
                      Step {currentInstructionIndex + 1}:{" "}
                      {currentInstruction.title}
                    </h3>
                    <div className="space-y-2">
                      {streamData.map((data, index) => (
                        <div
                          key={index}
                          className="text-sm border-b border-black/10 pb-2"
                        >
                          {data.transcription && (
                            <div className="text-blue-600">
                              Audio: {data.transcription}
                            </div>
                          )}
                          {data.text && (
                            <div className="text-green-600">
                              Vision: {data.text}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Left side - Instructions/Completion */}
              <div className="flex-1 p-8 flex items-center">
                {isCompleted ? (
                  <div className="max-w-2xl">
                    <h1 className="text-3xl font-semibold mb-6">
                      Great job! You completed the task:
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                      {currentInstruction.title}
                    </p>
                    <Button
                      onClick={handleContinue}
                      className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-8 text-base py-5"
                    >
                      {currentInstructionIndex < instructionsList.length - 1
                        ? "Continue to Next Task"
                        : "Finish"}
                    </Button>
                  </div>
                ) : (
                  <Instructions
                    title={currentInstruction.title}
                    description={currentInstruction.description}
                    taskStarted={taskStarted}
                    onStartTask={handleStartTask}
                    onExitTask={handleExitTask}
                    onTaskComplete={handleTaskComplete}
                    currentStep={currentInstructionIndex + 1}
                    totalSteps={instructionsList.length}
                  />
                )}
              </div>

              {/* Right side - Prototype Display */}
              <div className="px-8 flex items-center">
                <div className="w-[600px] h-[95%] bg-[#000000] rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="transform scale-[0.8]">
                    <FigmaEmbed embedUrl={embedUrl} width="375" height="812" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hidden UserTest component to handle streaming */}
        <div className="hidden">
          <UserTest
            ref={userTestRef}
            onDataChange={handleDataChange}
            autoStart={taskStarted}
            taskInstructions={`${currentInstruction.title}: ${currentInstruction.description}`}
          />
        </div>
      </div>
    </div>
  );
}
