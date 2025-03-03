"use client";

import { useState } from "react";
import { TopBar } from "@/components/ui/TopBar";
import { ProjectStages } from "@/components/ui/ProjectStages";
import { NavigationSidebar } from "@/components/ui/NavigationSidebar";
import { Button } from "@/components/ui/button";
import { useParams, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Share, Globe, Lock, ChevronDown } from "lucide-react";

const LinkIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.00001 14.9999L15 8.99994M11 5.99994L11.463 5.46394C12.4008 4.52627 13.6727 3.99954 14.9989 3.99963C16.325 3.99973 17.5968 4.52663 18.5345 5.46444C19.4722 6.40224 19.9989 7.67413 19.9988 9.00029C19.9987 10.3265 19.4718 11.5983 18.534 12.5359L18 12.9999M13 17.9999L12.603 18.5339C11.654 19.4716 10.3736 19.9975 9.03951 19.9975C7.70538 19.9975 6.42502 19.4716 5.47601 18.5339C5.00813 18.0717 4.63665 17.5211 4.38311 16.9142C4.12958 16.3074 3.99902 15.6562 3.99902 14.9984C3.99902 14.3407 4.12958 13.6895 4.38311 13.0826C4.63665 12.4757 5.00813 11.9252 5.47601 11.4629L6.00001 10.9999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function SharePage() {
  const [permissionType, setPermissionType] = useState("link-only");
  const params = useParams();
  const searchParams = useSearchParams();
  const projectId = params.projectId as string;
  const projectName = searchParams.get("name") || "Project #1";

  const permissionOptions = {
    "link-only": {
      icon: Lock,
      title: "Link Only",
      description: "Only people with your testing link can test your project",
    },
    anyone: {
      icon: Globe,
      title: "Anyone",
      description:
        "Your project will be publicly available for users on Sensus",
    },
  };

  const selectedOption =
    permissionOptions[permissionType as keyof typeof permissionOptions];

  const handleCopyLink = () => {
    // In a real app, this would copy the actual testing link
    navigator.clipboard.writeText("https://sensus.ai/test/your-project-link");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <TopBar projectName={projectName} />
      <div className="flex flex-1">
        <NavigationSidebar />
        <ProjectStages currentStage={3} />

        {/* Main content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Share size={26} />
                </div>
                <h1 className="text-2xl font-semibold">Share Your Project</h1>
              </div>
              <p className="text-gray-600">
                Share a link to your project for users to test.
              </p>
            </div>

            {/* Permission Settings */}
            <div className="mb-8">
              <h2 className="text-sm font-medium mb-3">Permission Settings</h2>
              <Select value={permissionType} onValueChange={setPermissionType}>
                <SelectTrigger className="w-full px-4 py-3.5 [&>*:last-child]:hidden [&>svg]:hidden">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      {selectedOption.icon && (
                        <selectedOption.icon className="w-4 h-4" />
                      )}
                      <span>{selectedOption.title}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 opacity-50 ml-2 flex-shrink-0" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link-only">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Link Only</div>
                        <div className="text-sm text-gray-500">
                          Only people with your testing link can test your
                          project
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="anyone">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5" />
                      <div>
                        <div className="font-medium">Anyone</div>
                        <div className="text-sm text-gray-500">
                          Your project will be publicly available for users on
                          Sensus
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Copy Link Button */}
            <div className="inline-block border border-[#FD5A32] rounded-md">
              <Button
                onClick={handleCopyLink}
                className="w-auto text-[#FF5A5F] hover:text-[#FF4347] bg-transparent hover:bg-[#fff2f0] px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2"
              >
                <LinkIcon />
                Copy Testing Link
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
