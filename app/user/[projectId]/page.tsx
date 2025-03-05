"use client";

import { useState, useRef } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { FigmaEmbed } from "@/components/ui/figma-embed";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Instructions } from "@/components/ui/Instructions";
import { Button } from "@/components/ui/button";
import { UserTest, UserTestHandle } from "@/components/user-test";

export default function UserTestPage() {
  const router = useRouter();
  const [showLandingScreen, setShowLandingScreen] = useState(true);
  const [taskStarted, setTaskStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showFinalCompletion, setShowFinalCompletion] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [streamData, setStreamData] = useState<any[]>([]);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const [allTaskData, setAllTaskData] = useState<
    Array<{
      taskTitle: string;
      gptResponse: string | null;
      streamData: any[];
    }>
  >([]);
  const userTestRef = useRef<UserTestHandle>(null);
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const [error, setError] = useState<string | null>(null);

  // Get embed URL from URL parameters
  const embedUrl =
    searchParams.get("embedUrl") ||
    "https://embed.figma.com/proto/rIrwVJdIlOyVTMAuX5ahT3/HCI-A5-Group?node-id=35-32&scaling=scale-down&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A32&show-proto-sidebar=1&hide-ui=1&embed-host=share";

  // Define multiple instructions
  const instructionsList = [
    {
      title: "Choose a travel itinerary and save it to your profile",
      embedUrl:
        "https://embed.figma.com/proto/2ZR3DnUGe2OBBmys1d65gb/Rice-Design-a-thon-2025?page-id=0%3A1&node-id=1-432&viewport=220%2C112%2C0.17&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A432&show-proto-sidebar=0&embed-host=share",
    },
    {
      title: "Indicate your mood and update the itinerary accordingly",
      embedUrl:
        "https://embed.figma.com/proto/2ZR3DnUGe2OBBmys1d65gb/Rice-Design-a-thon-2025?page-id=0%3A1&node-id=1-4485&viewport=220%2C112%2C0.17&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A4101&embed-host=share&hide-ui=1&show-proto-sidebar=0",
    },
    {
      title: "Choose a mindfulness exercise and start engaging with it",
      embedUrl:
        "https://embed.figma.com/proto/2ZR3DnUGe2OBBmys1d65gb/Rice-Design-a-thon-2025?page-id=0%3A1&node-id=1-3889&viewport=220%2C112%2C0.17&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A3757&show-proto-sidebar=0&embed-host=share&hide-ui=1",
    },
  ];

  const currentInstruction = instructionsList[currentInstructionIndex];

  const handleStartFromLanding = () => {
    setShowLandingScreen(false);
    setTaskStarted(false);
    setIsCompleted(false);
  };

  const handleStartTask = () => {
    setTaskStarted(true);
    setIsCompleted(false);
  };

  const handleExitTask = () => {
    // If we're showing the final completion screen, exit to explore page
    if (showFinalCompletion) {
      router.push("/user/explore");
    } else {
      // Otherwise, show the final completion screen
      setShowFinalCompletion(true);
    }
  };

  const handleTaskComplete = async () => {
    // Show completion screen immediately
    setTaskStarted(false);
    setIsCompleted(true);

    try {
      // Process GPT response in background
      console.log("Before sending to GPT");

      if (!userTestRef.current) {
        console.error("UserTest ref is not available");
        return;
      }

      // Send data to GPT in background
      userTestRef.current
        .sendDataToGPT(`Task "${currentInstruction.title}"`)
        .then(async () => {
          // Add a small delay to ensure state updates have propagated
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Get the response and ensure it's properly typed
          const gptResponse = userTestRef.current?.getLastGPTResponse() ?? null;
          console.log("GPT Response:", {
            hasRef: true,
            rawResponse: gptResponse,
            responseType: typeof gptResponse,
            streamDataLength: streamData.length,
          });

          // Store this task's data
          const taskData = {
            taskTitle: currentInstruction.title,
            gptResponse: gptResponse,
            streamData: streamData,
          };
          console.log("Storing task data:", taskData);

          setAllTaskData((prev) => [...prev, taskData]);
          setStreamData([]); // Clear stream data for next task

          // If this was the final task, show the final completion screen
          if (currentInstructionIndex === instructionsList.length - 1) {
            setShowFinalCompletion(true);
          }
        })
        .catch((error) => {
          console.error("Error in background GPT processing:", error);
        });
    } catch (error) {
      console.error("Error in handleTaskComplete:", error);
      setError(
        error instanceof Error ? error.message : "Failed to complete task"
      );
    }
  };

  const handleContinue = async () => {
    if (currentInstructionIndex < instructionsList.length - 1) {
      // For intermediate tasks, move to next instruction immediately
      setCurrentInstructionIndex((prev) => prev + 1);
      setIsCompleted(false);
      setTaskStarted(false);
    } else {
      // Show loading screen
      setIsUploading(true);

      // For final task, wait for GPT summary and data upload
      try {
        // Generate final summary
        console.log("Generating final summary for all tasks...");
        const finalSummary = await userTestRef.current?.generateFinalSummary();
        console.log("Final summary generated:", finalSummary);

        if (!finalSummary) {
          throw new Error("Failed to generate final summary");
        }

        // Get the screen data vector
        const screenDataVector =
          await userTestRef.current?.getScreenDataVector();
        console.log("Screen data vector generated");

        console.log("Uploading test data:", {
          projectId,
          timestamp: new Date().toISOString(),
        });

        const response = await fetch("/api/upload-test-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
            screenDataVector,
            metadata: {
              whatWorkedWell: finalSummary.whatWorkedWell,
              commonPainPoints: finalSummary.commonPainPoints,
              behavioralAnalysis: finalSummary.behavioralAnalysis,
              recommendedNextSteps: finalSummary.recommendedNextSteps,
              timestamp: new Date().toISOString(),
            },
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(`Failed to upload test data: ${data.error}`);
        }

        console.log("Successfully uploaded test data");
        // Hide loading and show completion
        setIsUploading(false);
        setShowFinalCompletion(true);
      } catch (error) {
        console.error("Error in final task processing:", {
          error,
          message: error instanceof Error ? error.message : "Unknown error",
        });
        // Hide loading and show error
        setIsUploading(false);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to process final task"
        );
      }
    }
  };

  const handleDataChange = (data: any, error: string | null) => {
    if (data && !error) {
      setStreamData((prev) => [...prev, data]);
    }
  };

  const handleBackButton = () => {
    if (showFinalCompletion) {
      // From final completion, go back to last task completion
      setShowFinalCompletion(false);
      setIsCompleted(true);
    } else if (taskStarted) {
      // From active task, go back to task description
      setTaskStarted(false);
    } else if (isCompleted) {
      // From task completion, go back to active task
      setIsCompleted(false);
      setTaskStarted(true);
    } else if (!showLandingScreen && currentInstructionIndex > 0) {
      // From task description, go back to previous task completion
      setCurrentInstructionIndex((prev) => prev - 1);
      setIsCompleted(true);
    } else if (!showLandingScreen) {
      // From first task description, go back to landing
      setShowLandingScreen(true);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <NavigationSidebar />

      <div className="flex-1 flex flex-col">
        <TopBar
          projectName={projectId}
          showBackButton
          onBackClick={handleBackButton}
        />
        {!showLandingScreen && !showFinalCompletion && !isUploading && (
          <ProgressBar
            progress={
              showFinalCompletion
                ? 100
                : (currentInstructionIndex + 1) *
                  (100 / instructionsList.length)
            }
          />
        )}

        <div className="flex-1 overflow-auto">
          {isUploading ? (
            // Loading screen
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="max-w-lg text-center">
                <div className="mb-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF5A5F] mx-auto"></div>
                </div>
                <h1 className="text-2xl font-semibold mb-3">
                  Uploading your test results...
                </h1>
                <p className="text-gray-600">
                  Please wait while we process and save your feedback. This may
                  take a moment.
                </p>
              </div>
            </div>
          ) : showFinalCompletion ? (
            // Final completion screen
            <div className="flex-1 p-8 flex items-center justify-center">
              <div className="max-w-lg">
                <div className="mb-12">
                  <svg
                    width="49"
                    height="49"
                    viewBox="0 0 49 49"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-6"
                  >
                    <rect width="49" height="49" rx="5.71667" fill="#EFEFEF" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M20.4219 19.4694L20.5327 19.5663L30.433 29.4654C30.5628 29.5951 30.6602 29.7535 30.7172 29.9278C30.7743 30.1021 30.7895 30.2874 30.7615 30.4686C30.7336 30.6499 30.6633 30.822 30.5563 30.9711C30.4494 31.1201 30.3088 31.2418 30.146 31.3263L30.0107 31.3846L17.8949 35.8494C15.6175 36.6894 13.3997 34.5486 14.0915 32.2748L14.1499 32.1044L18.6135 19.9886C18.6725 19.8281 18.7661 19.6825 18.8876 19.5622C19.0091 19.4419 19.1556 19.3498 19.3167 19.2923C19.4777 19.2349 19.6494 19.2136 19.8197 19.2299C19.9899 19.2461 20.1544 19.2997 20.3017 19.3866L20.4219 19.4694ZM20.1722 22.5051L16.3397 32.9118C16.3041 33.0086 16.2947 33.1131 16.3127 33.2147C16.3307 33.3163 16.3752 33.4113 16.4419 33.4901C16.5085 33.5688 16.5949 33.6285 16.6921 33.663C16.7893 33.6975 16.894 33.7056 16.9954 33.6864L17.0887 33.6596L27.493 29.8259L20.1722 22.5051ZM30.958 24.5374C32.0209 24.5934 33.478 24.8174 34.745 25.5781C35.0019 25.7304 35.1906 25.9753 35.2722 26.2626C35.3539 26.5498 35.3223 26.8574 35.184 27.122C35.0457 27.3867 34.8112 27.5882 34.5288 27.6851C34.2464 27.7821 33.9375 27.767 33.6659 27.6431L33.5445 27.5789C32.7489 27.1006 31.7315 26.9139 30.8355 26.8673C30.4663 26.8469 30.0962 26.8484 29.7272 26.8719L29.3585 26.9081C29.0542 26.9474 28.7466 26.8652 28.5025 26.6793C28.2583 26.4934 28.0972 26.2188 28.0541 25.915C28.011 25.6111 28.0893 25.3026 28.2721 25.0561C28.4549 24.8096 28.7274 24.6451 29.0307 24.5981C29.6697 24.5157 30.3151 24.495 30.958 24.5363M33.3205 21.2859C33.6178 21.2866 33.9036 21.4006 34.1196 21.6049C34.3356 21.8091 34.4655 22.088 34.4828 22.3848C34.5 22.6816 34.4034 22.9737 34.2125 23.2016C34.0217 23.4295 33.751 23.576 33.4559 23.6111L33.3205 23.6193H32.4945C32.1973 23.6186 31.9115 23.5046 31.6955 23.3004C31.4795 23.0961 31.3496 22.8172 31.3323 22.5204C31.315 22.2236 31.4117 21.9315 31.6025 21.7036C31.7934 21.4757 32.064 21.3292 32.3592 21.2941L32.4945 21.2859H33.3205ZM29.6082 20.3911C29.8091 20.592 29.9297 20.8593 29.9476 21.1428C29.9654 21.4263 29.8792 21.7066 29.705 21.9311L29.6082 22.0408L28.3715 23.2786C28.1621 23.4901 27.8797 23.6135 27.5822 23.6236C27.2847 23.6337 26.9947 23.5297 26.7713 23.3329C26.548 23.1361 26.4084 22.8614 26.381 22.565C26.3535 22.2687 26.4404 21.973 26.6239 21.7386L26.7207 21.6289L27.9574 20.3923C28.0657 20.2838 28.1944 20.1977 28.336 20.139C28.4776 20.0803 28.6295 20.0501 28.7828 20.0501C28.9361 20.0501 29.0879 20.0803 29.2295 20.139C29.3712 20.1977 29.4998 20.2826 29.6082 20.3911ZM26.59 14.2486C27.1127 15.8189 26.8327 17.5386 26.506 18.7403C26.3105 19.4897 26.0408 20.2178 25.701 20.9138C25.5629 21.1907 25.3204 21.4014 25.0269 21.4995C24.7333 21.5977 24.4129 21.5752 24.1359 21.437C23.859 21.2989 23.6483 21.0564 23.5502 20.7628C23.4521 20.4693 23.4745 20.1489 23.6127 19.8719C23.8841 19.313 24.0991 18.7283 24.2544 18.1266C24.5192 17.1559 24.6522 16.1024 24.448 15.2391L24.3769 14.9871C24.326 14.8412 24.3047 14.6866 24.314 14.5324C24.3234 14.3782 24.3633 14.2274 24.4315 14.0887C24.4996 13.95 24.5946 13.8263 24.711 13.7246C24.8273 13.6229 24.9627 13.5454 25.1093 13.4965C25.2558 13.4476 25.4107 13.4283 25.5647 13.4397C25.7188 13.4511 25.8691 13.493 26.0069 13.563C26.1446 13.633 26.2671 13.7296 26.3672 13.8473C26.4673 13.965 26.5431 14.1014 26.59 14.2486ZM32.9075 17.0929C33.1262 17.3117 33.2491 17.6084 33.2491 17.9178C33.2491 18.2271 33.1262 18.5238 32.9075 18.7426L32.0827 19.5674C31.9751 19.6789 31.8463 19.7677 31.704 19.8289C31.5617 19.89 31.4086 19.9222 31.2537 19.9236C31.0988 19.9249 30.9451 19.8954 30.8017 19.8367C30.6584 19.7781 30.5281 19.6914 30.4186 19.5819C30.309 19.4724 30.2224 19.3421 30.1637 19.1987C30.1051 19.0553 30.0756 18.9017 30.0769 18.7468C30.0782 18.5919 30.1104 18.4388 30.1716 18.2965C30.2327 18.1541 30.3216 18.0254 30.433 17.9178L31.2579 17.0929C31.4766 16.8742 31.7733 16.7513 32.0827 16.7513C32.3921 16.7513 32.6887 16.8742 32.9075 17.0929Z"
                      fill="black"
                    />
                  </svg>
                  <h1 className="text-2xl font-semibold mb-3">
                    Thanks for completing {projectId}!
                  </h1>
                  <p className="text-gray-600">
                    Your testing results will be used by designers to make user
                    experience improvements.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 mb-8 flex items-center border border-gray-200">
                  <div className="flex items-center gap-6">
                    <div className="bg-[#F7F7F7] rounded-lg px-4 py-2">
                      <span className="text-[32px] font-semibold">$20</span>
                    </div>
                    <div className="text-gray-600 text-sm">
                      Your compensation will be sent
                      <br />
                      to you in the next 24 hours.
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleExitTask}
                    className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-8 py-2.5 text-sm rounded"
                  >
                    OK
                  </Button>
                </div>
              </div>
            </div>
          ) : showLandingScreen ? (
            // Landing Screen
            <div className="flex p-8 h-full">
              {/* Left side - Project Info */}
              <div className="flex-1 pr-8">
                <div className="max-w-2xl">
                  <h1 className="text-4xl font-semibold mb-4">{projectId}</h1>
                  <p className="text-gray-600 mb-8">
                    In this user test, you&apos;ll be exploring a travel
                    planning interface and completing {instructionsList.length}{" "}
                    tasks. We&apos;ll record your interactions to help improve
                    the user experience.
                  </p>

                  <div className="grid grid-cols-3 mb-12 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-4 border-r border-gray-200">
                      <div className="text-2xl font-semibold">$20</div>
                      <div className="text-gray-600">Compensation</div>
                    </div>
                    <div className="p-4 border-r border-gray-200">
                      <div className="text-2xl font-semibold">15 min</div>
                      <div className="text-gray-600">Expected Time</div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-semibold">Mobile</div>
                      <div className="text-gray-600">Device Type</div>
                    </div>
                  </div>

                  <Button
                    onClick={handleStartFromLanding}
                    className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-8 py-4 text-lg rounded-md"
                  >
                    Start Test
                  </Button>
                </div>
              </div>

              {/* Right side - Preview */}
              <div className="w-[600px]">
                <div className="w-full h-full bg-[#000000] rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="transform scale-[0.8]">
                    <FigmaEmbed
                      embedUrl={currentInstruction.embedUrl + "&hide-ui=1"}
                      width="375"
                      height="812"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] cursor-not-allowed" />
                </div>
              </div>
            </div>
          ) : taskStarted ? (
            // Active task view
            <div className="flex-1 p-6">
              <div className="w-full h-[calc(100vh-7rem)] bg-[#000000] rounded-2xl relative">
                {/* Instructions in top-left corner */}
                <div className="absolute left-6 top-6 z-10">
                  <Instructions
                    title={currentInstruction.title}
                    taskStarted={taskStarted}
                    onStartTask={handleExitTask}
                    onTaskComplete={handleTaskComplete}
                    currentStep={currentInstructionIndex + 1}
                    totalSteps={instructionsList.length}
                  />
                </div>

                {/* Centered Figma embed */}
                <div className="w-full h-full flex items-center justify-center">
                  <div className="transform scale-[0.95]">
                    <FigmaEmbed
                      embedUrl={currentInstruction.embedUrl + "&hide-ui=1"}
                      width="375"
                      height="652"
                    />
                  </div>
                </div>

                {/* Screenpipe stream data display */}
              </div>
            </div>
          ) : isCompleted ? (
            // Task completion screen
            <div className="flex h-full">
              {/* Left side - Completion message */}
              <div className="flex-1 p-8 flex items-center">
                <div className="max-w-2xl">
                  <h1 className="text-2xl font-semibold mb-4">
                    Great job! You completed this task.
                  </h1>
                  <Button
                    onClick={handleContinue}
                    className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-6 py-2 rounded-md"
                  >
                    {currentInstructionIndex === instructionsList.length - 1
                      ? "Finish"
                      : "Continue"}
                  </Button>
                </div>
              </div>

              {/* Right side - Preview */}
              <div className="px-8 flex items-center">
                <div className="w-[600px] h-[95%] bg-[#000000] rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="transform scale-[0.8]">
                    <FigmaEmbed
                      embedUrl={currentInstruction.embedUrl + "&hide-ui=1"}
                      width="450"
                      height="900"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] cursor-not-allowed" />
                </div>
              </div>
            </div>
          ) : (
            // Task description screen
            <div className="flex h-full">
              {/* Left side - Instructions */}
              <div className="flex-1 p-8 flex items-center">
                <div className="max-w-2xl">
                  <p className="uppercase text-sm text-gray-500 font-medium mb-4">
                    INSTRUCTIONS
                  </p>
                  <h1 className="text-2xl font-semibold mb-6">
                    {currentInstruction.title}
                  </h1>
                  <Button
                    onClick={handleStartTask}
                    className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-6 py-2 rounded-md"
                  >
                    Start Task
                  </Button>
                </div>
              </div>

              {/* Right side - Preview */}
              <div className="px-8 flex items-center">
                <div className="w-[600px] h-[95%] bg-[#000000] rounded-2xl flex items-center justify-center overflow-hidden relative">
                  <div className="transform scale-[0.8]">
                    <FigmaEmbed
                      embedUrl={currentInstruction.embedUrl + "&hide-ui=1"}
                      width="450"
                      height="900"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] cursor-not-allowed" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hidden UserTest component to handle streaming */}
        <div className="hidden">
          <UserTest
            ref={userTestRef}
            onDataChange={handleDataChange}
            autoStart={taskStarted}
            taskInstructions={currentInstruction.title}
          />
        </div>
      </div>
    </div>
  );
}
