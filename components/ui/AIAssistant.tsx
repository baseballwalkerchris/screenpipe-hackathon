"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { createAiClient, callOpenAI } from "@/app/api/settings/route";
import { Settings } from "@screenpipe/browser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, ChevronLeft, Bot, Send, Loader2 } from "lucide-react";

interface Message {
  type: "bot" | "user";
  message: string;
  isPrompt?: boolean;
}

export function AIAssistant() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();
  const { toast } = useToast();
  const projectId = params.projectId as string;
  const [chatHistory, setChatHistory] = useState<Message[]>([
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

  const fetchRelevantContext = async (query: string) => {
    try {
      const response = await fetch("/api/context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, projectId }),
      });

      if (!response.ok) throw new Error("Failed to fetch context");
      const data = await response.json();
      return data.context;
    } catch (error) {
      console.error("Error fetching context:", error);
      return "";
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    setChatHistory((prev) => [
      ...prev,
      { type: "user", message, isPrompt: false },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const context = await fetchRelevantContext(message);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an AI assistant analyzing user testing data. Use the following context from test recordings to inform your responses: \n\n${context}`,
            },
            ...chatHistory
              .filter((msg) => !msg.isPrompt)
              .map((msg) => ({
                role:
                  msg.type === "user"
                    ? ("user" as const)
                    : ("assistant" as const),
                content: msg.message,
              })),
            { role: "user", content: message },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", message: data.content, isPrompt: false },
      ]);
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to generate response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
      <div
        className={`bg-white shadow-lg w-96 h-full ${
          isExpanded ? "block" : "hidden"
        }`}
      >
        <div className="flex items-center justify-between px-4 h-12 border-b">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-red-500" />
            <span className="font-medium">AI Assistant</span>
          </div>
          <button onClick={() => setIsExpanded(false)}>
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-3rem)]">
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-6">
              {chatHistory.map((chat, index) =>
                chat.isPrompt ? (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(chat.message)}
                    className="bg-gray-50 p-4 rounded-xl w-full text-left text-base hover:bg-gray-100 border border-gray-100"
                  >
                    {chat.message}
                  </button>
                ) : (
                  <div
                    key={index}
                    className={`flex ${
                      chat.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 max-w-[80%] ${
                        chat.type === "user"
                          ? "bg-red-500 text-white"
                          : "bg-gray-50"
                      }`}
                    >
                      {chat.message}
                    </div>
                  </div>
                )
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing test data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a prompt here..."
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    handleSendMessage(input);
                  }
                }}
              />
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600 rounded-full"
                onClick={() => {
                  if (input.trim()) {
                    handleSendMessage(input);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

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
