"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Bot, Send } from "lucide-react";

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");

  return (
    <div
      className={`fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out ${
        isExpanded ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Slide Panel */}
      <div
        className={`bg-white shadow-lg w-80 h-full ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-12 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-red-500" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <button onClick={() => setIsExpanded(false)}>
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-3rem)]">
          {/* Chat messages area */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Bot className="h-6 w-6 text-red-500 mt-1" />
                <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                  <p className="text-sm">
                    What do you want to know about your testing results?
                  </p>
                </div>
              </div>
              <button className="bg-gray-200 p-2 rounded-lg w-full text-left">
                Which tasks had the highest completion rates?
              </button>
              {/* Add more prompt buttons as needed */}
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt here..."
                className="flex-1"
              />
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600"
                onClick={() => {
                  console.log("Sending:", prompt);
                  setPrompt("");
                }}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Button to open the assistant */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 transition"
        >
          <Bot className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
