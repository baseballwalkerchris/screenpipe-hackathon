"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Bot, Send } from "lucide-react";

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<
    Array<{
      type: "bot" | "user";
      message: string;
      isPrompt?: boolean;
    }>
  >([
    {
      type: "bot",
      message: "What do you want to know about your testing results?",
      isPrompt: false,
    },
    {
      type: "bot",
      message: "Which tasks had the highest completion rates?",
      isPrompt: true,
    },
    {
      type: "bot",
      message: "What were the most common user complaints?",
      isPrompt: true,
    },
    {
      type: "bot",
      message: "How does the completion time compare to previous tests?",
      isPrompt: true,
    },
  ]);

  const handleSendMessage = (message: string) => {
    // Add user message
    setChatHistory((prev) => [
      ...prev,
      { type: "user", message, isPrompt: false },
    ]);

    // Simulate bot response
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          message: "This is a sample response from the AI assistant.",
          isPrompt: false,
        },
      ]);
    }, 1000);

    setPrompt("");
  };

  const handlePromptClick = (promptMessage: string) => {
    handleSendMessage(promptMessage);
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full transition-transform duration-300 ease-in-out ${
        isExpanded ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Slide Panel - made wider */}
      <div
        className={`bg-white shadow-lg w-96 h-full ${
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
            <div className="space-y-6">
              {/* Main question */}
              <div className="text-xl font-bold">
                What do you want to know about your testing results?
              </div>

              {/* Example prompts at the bottom */}
              <div className="space-y-3 mt-auto">
                {chatHistory
                  .filter((chat) => chat.isPrompt)
                  .map((chat, index) => (
                    <button
                      key={index}
                      onClick={() => handlePromptClick(chat.message)}
                      className="bg-gray-50 p-4 rounded-xl w-full text-left text-base hover:bg-gray-100 border border-gray-100"
                    >
                      {chat.message}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Input area */}
          <div className="p-4 bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a prompt here..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && prompt.trim()) {
                    handleSendMessage(prompt);
                  }
                }}
              />
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600 rounded-full"
                onClick={() => {
                  if (prompt.trim()) {
                    handleSendMessage(prompt);
                  }
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
