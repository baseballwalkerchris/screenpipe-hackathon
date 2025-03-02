"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AIAssistant } from "@/components/ui/AIAssistant";

interface Question {
  text: string;
  completed: boolean;
}

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"summary" | "question">("summary");
  const [questions] = useState<Question[]>([
    {
      text: "Select a travel itinerary that interests you and save it to your profile.",
      completed: true,
    },
    {
      text: "Search for a 10-day travel itinerary to Japan.",
      completed: true,
    },
    {
      text: "Search for a 10-day travel itinerary to Japan.",
      completed: true,
    },
    {
      text: "Search for a 10-day travel itinerary to Japan.",
      completed: true,
    },
  ]);

  const [expandedSections, setExpandedSections] = useState({
    whatWorkedWell: true,
    commonPainPoints: false,
    behavioralAnalysis: false,
    recommendedNextSteps: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName="Project #1" />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={4} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
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
                          <div>
                            <h4 className="font-medium text-red-400">
                              Smooth Flight Booking (88% Success Rate)
                            </h4>
                            <p className="text-sm text-gray-600 ml-4">
                              - 14 out of 16 users easily found and booked a
                              flight.
                            </p>
                            <p className="text-sm text-gray-600 ml-4">
                              - Users appreciated the "Compare Flights" feature
                              for price differences.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-red-400">
                              Clear Pricing & Transparent Fees
                            </h4>
                            <p className="text-sm text-gray-600 ml-4">
                              - 13 out of 16 users mentioned the upfront pricing
                              clarity as a strong positive.
                            </p>
                          </div>
                          <div>
                            <h4 className="font-medium text-red-400">
                              Fast Checkout Process
                            </h4>
                            <p className="text-sm text-gray-600 ml-4">
                              - 12 out of 16 testers found the final booking
                              experience intuitive and smooth.
                            </p>
                          </div>
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
                        <div className="p-4">
                          {/* Add pain points content here */}
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
                    {questions.map((question, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 bg-zinc-50 p-4 rounded-lg"
                      >
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="bg-white">
                            ✓
                          </Badge>
                        </div>
                        <p>{question.text}</p>
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
