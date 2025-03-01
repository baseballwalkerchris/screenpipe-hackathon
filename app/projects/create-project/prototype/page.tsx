"use client";

import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const stages = [
  { id: 1, name: "Project Overview", isActive: false },
  { id: 2, name: "Prototype", isActive: true },
  { id: 3, name: "Tasks", isActive: false },
  { id: 4, name: "Share", isActive: false },
];

export default function PrototypePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-2">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`flex items-center p-3 rounded-lg ${
                stage.isActive
                  ? "bg-[#fff2f0] text-[#ff4d4f]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                  stage.isActive ? "bg-[#ff4d4f] text-white" : "bg-gray-200"
                }`}
              >
                {stage.id}
              </div>
              <span className="font-medium">{stage.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Prototype
            </h1>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
