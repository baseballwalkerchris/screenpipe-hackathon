"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AIAssistant } from "@/components/ui/AIAssistant";
import { useParams } from "next/navigation";

interface TestResult {
  projectId: string;
  taskTitle: string;
  gptResponse: string;
  streamData: any;
  timestamp: string;
  taskIndex: number;
  vector?: number[];
}

export default function ResultsPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [activeTab, setActiveTab] = useState<"summary" | "question">("summary");
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedSections, setExpandedSections] = useState({
    whatWorkedWell: true,
    commonPainPoints: false,
    behavioralAnalysis: false,
    recommendedNextSteps: false,
  });

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await fetch(
          `/api/fetch-test-data?projectId=${projectId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to fetch test data");
        }

        const data = await response.json();
        console.log("Fetched test data:", data);
        setTestResults(data.results);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchTestData();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const analyzeResults = (results: TestResult[]) => {
    // Group tasks by title to analyze success rates
    const taskAnalysis = results.reduce((acc: any, result) => {
      const { taskTitle, gptResponse } = result;
      if (!acc[taskTitle]) {
        acc[taskTitle] = {
          total: 0,
          successful: 0,
          responses: [],
        };
      }

      acc[taskTitle].total += 1;
      // Assuming a positive GPT response indicates success
      if (gptResponse.toLowerCase().includes("success")) {
        acc[taskTitle].successful += 1;
      }
      acc[taskTitle].responses.push(gptResponse);

      return acc;
    }, {});

    return taskAnalysis;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  const taskAnalysis = analyzeResults(testResults);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName="Project #1" />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={4} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Debug section for testing */}
            <div className="mb-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-mono text-sm mb-2">
                Debug: Raw Results Data
              </h3>
              <div className="space-y-4">
                {testResults.map((result, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h4 className="font-mono text-xs font-semibold mb-2">
                      Result {index + 1}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-mono text-xs text-gray-500 mb-1">
                          Metadata
                        </h5>
                        <pre className="whitespace-pre-wrap text-xs">
                          {JSON.stringify(
                            {
                              projectId: result.projectId,
                              taskTitle: result.taskTitle,
                              gptResponse: result.gptResponse,
                              timestamp: result.timestamp,
                              taskIndex: result.taskIndex,
                            },
                            null,
                            2
                          )}
                        </pre>
                      </div>
                      <div>
                        <h5 className="font-mono text-xs text-gray-500 mb-1">
                          Vector ({result.vector?.length || 0} dimensions)
                        </h5>
                        <div className="text-xs overflow-auto max-h-[100px]">
                          <div className="font-mono">
                            [
                            {result.vector
                              ?.slice(0, 5)
                              .map((v) => v.toFixed(4))
                              .join(", ")}
                            {result.vector && result.vector.length > 5
                              ? ", ..."
                              : ""}
                            ]
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-[#ff4d4f] text-white w-8 h-8 rounded-full flex items-center justify-center font-medium">
                    4
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    Results
                  </CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">
                  Results are AI-generated based on the performance of users who
                  complete your test.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <button
                    className={`pb-2 ${
                      activeTab === "summary"
                        ? "border-b-2 border-[#FF5A5F] text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("summary")}
                  >
                    Summary
                  </button>
                  <button
                    className={`pb-2 ${
                      activeTab === "question"
                        ? "border-b-2 border-[#FF5A5F] text-foreground"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => setActiveTab("question")}
                  >
                    Question
                  </button>
                </div>

                <Separator className="mb-4" />

                {activeTab === "summary" ? (
                  <div className="space-y-4">
                    {/* What Worked Well Section */}
                    <div className="rounded-lg border bg-card text-card-foreground">
                      <button
                        className="w-full flex items-center justify-between p-4 bg-[#ecfdf3] rounded-lg"
                        onClick={() => toggleSection("whatWorkedWell")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">✓</span>
                          <span className="font-medium">What Worked Well</span>
                        </div>
                        {expandedSections.whatWorkedWell ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </button>

                      {expandedSections.whatWorkedWell && (
                        <div className="p-4 space-y-3">
                          {Object.entries(taskAnalysis).map(
                            ([task, analysis]: [string, any]) => {
                              const successRate =
                                (analysis.successful / analysis.total) * 100;
                              if (successRate >= 70) {
                                return (
                                  <div key={task}>
                                    <h4 className="font-medium text-red-400">
                                      {task} ({successRate.toFixed(0)}% Success
                                      Rate)
                                    </h4>
                                    <p className="text-sm text-gray-600 ml-4">
                                      - {analysis.successful} out of{" "}
                                      {analysis.total} users completed this task
                                      successfully.
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }
                          )}
                        </div>
                      )}
                    </div>

                    {/* Common Pain Points Section */}
                    <div className="rounded-lg border bg-card text-card-foreground">
                      <button
                        className="w-full flex items-center justify-between p-4 bg-[#fff7e6] rounded-lg"
                        onClick={() => toggleSection("commonPainPoints")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-orange-500">⚠</span>
                          <span className="font-medium">
                            Common Pain Points
                          </span>
                        </div>
                        {expandedSections.commonPainPoints ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </button>
                      {expandedSections.commonPainPoints && (
                        <div className="p-4 space-y-3">
                          {Object.entries(taskAnalysis).map(
                            ([task, analysis]: [string, any]) => {
                              const successRate =
                                (analysis.successful / analysis.total) * 100;
                              if (successRate < 70) {
                                return (
                                  <div key={task}>
                                    <h4 className="font-medium text-orange-500">
                                      {task} ({successRate.toFixed(0)}% Success
                                      Rate)
                                    </h4>
                                    <p className="text-sm text-gray-600 ml-4">
                                      - Only {analysis.successful} out of{" "}
                                      {analysis.total} users completed this task
                                      successfully.
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }
                          )}
                        </div>
                      )}
                    </div>

                    {/* Behavioral Analysis Section */}
                    <div className="rounded-lg border bg-card text-card-foreground">
                      <button
                        className="w-full flex items-center justify-between p-4 bg-[#e6f4ff] rounded-lg"
                        onClick={() => toggleSection("behavioralAnalysis")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-blue-500">📊</span>
                          <span className="font-medium">
                            Behavioral Analysis
                          </span>
                        </div>
                        {expandedSections.behavioralAnalysis ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </button>
                      {expandedSections.behavioralAnalysis && (
                        <div className="p-4">
                          {/* Add behavioral analysis content here */}
                        </div>
                      )}
                    </div>

                    {/* Recommended Next Steps Section */}
                    <div className="rounded-lg border bg-card text-card-foreground">
                      <button
                        className="w-full flex items-center justify-between p-4 bg-[#f0f0ff] rounded-lg"
                        onClick={() => toggleSection("recommendedNextSteps")}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-purple-500">📋</span>
                          <span className="font-medium">
                            Recommended Next Steps
                          </span>
                        </div>
                        {expandedSections.recommendedNextSteps ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </button>
                      {expandedSections.recommendedNextSteps && (
                        <div className="p-4">
                          {/* Add recommended next steps content here */}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-zinc-50 p-4 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="bg-white">
                            {result.gptResponse
                              .toLowerCase()
                              .includes("success")
                              ? "✓"
                              : "✗"}
                          </Badge>
                        </div>
                        <div>
                          <p className="font-medium">{result.taskTitle}</p>
                          <p className="text-sm text-gray-600">
                            {result.gptResponse}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Assistant */}
        <AIAssistant />
      </div>
    </div>
  );
}
