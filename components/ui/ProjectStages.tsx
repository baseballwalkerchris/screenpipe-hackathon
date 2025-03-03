"use client";

import Image from "next/image";

interface Stage {
  id: number;
  name: string;
  isActive: boolean;
}

interface ProjectStagesProps {
  currentStage: number;
}

export function ProjectStages({ currentStage }: ProjectStagesProps) {
  const stages: Stage[] = [
    { id: 1, name: "Project Overview", isActive: currentStage === 1 },
    { id: 2, name: "Tasks", isActive: currentStage === 2 },
    { id: 3, name: "Share", isActive: currentStage === 3 },
    { id: 4, name: "Results", isActive: currentStage === 4 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="pt-40 px-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            className={`flex items-center p-3 rounded-lg mb-2 ${
              stage.isActive
                ? "bg-[#fff2f0] text-[#ff4d4f]"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <div
              className={`w-6 h-6 flex items-center justify-center mr-3 text-sm ${
                stage.isActive ? "text-[#ff4d4f]" : "text-gray-500"
              }`}
            >
              {stage.id === 1 ? (
                <Image
                  src="/book.svg"
                  alt="Project Overview"
                  width={26}
                  height={26}
                  className={""}
                />
              ) : stage.id === 2 ? (
                <Image
                  src="/checkboxes-stage.svg"
                  alt="Tasks"
                  width={40}
                  height={40}
                  className={""}
                />
              ) : stage.id === 3 ? (
                <Image
                  src="/share.svg"
                  alt="Share"
                  width={26}
                  height={26}
                  className={""}
                />
              ) : stage.id === 4 ? (
                <Image
                  src="/sparkles.svg"
                  alt="Results"
                  width={26}
                  height={26}
                  className={""}
                />
              ) : (
                stage.id
              )}
            </div>
            <span className="font-medium text-sm">{stage.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
