"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Import the JSON data
import healthStatusCardData from "../content/health-status-card.json";

// Create a component registry that will be properly typed
const COMPONENT_REGISTRY: Record<string, any> = {};

// Define the content interface
interface PlaygroundCardContent {
  componentPath: string;
  endpoint_optional?: string;
  llmModel: string;
  llmUserPrompt: string;
  llmContextUrl: string;
  title?: string; // Optional title for the card
}

// Update component to accept content as props
export function PlaygroundCard({
  content,
}: {
  content: PlaygroundCardContent;
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [componentModule, setComponentModule] = useState<any>(null);

  // Destructure content props
  const { componentPath, title } = content;

  // Dynamically load the component based on the path
  useEffect(() => {
    const loadComponent = async () => {
      try {
        setLoading(true);

        // Extract the component name from the path
        const pathParts = componentPath.split("/");
        const fileName = pathParts[pathParts.length - 1].replace(".tsx", "");

        // Dynamically import the component
        const importedModule = await import(
          `./ready-to-use-examples/${fileName}`
        );

        // Store the module in state
        setComponentModule(importedModule);
        setLoading(false);
      } catch (err) {
        console.error("Error loading component:", err);
        setError(
          err instanceof Error ? err.message : "Unknown error loading component"
        );
        setLoading(false);
      }
    };

    // If the component is already in the registry, use it
    if (COMPONENT_REGISTRY[componentPath]) {
      setComponentModule(COMPONENT_REGISTRY[componentPath]);
      setLoading(false);
    } else {
      loadComponent();
    }
  }, [componentPath]);

  // Get the component from the module
  const DynamicComponent = componentModule
    ? componentModule.default ||
      getComponentFromModule(componentModule, componentPath)
    : null;

  // Helper function to extract component from module based on naming conventions
  function getComponentFromModule(module: any, path: string) {
    const pathParts = path.split("/");
    const fileName = pathParts[pathParts.length - 1].replace(".tsx", "");

    // Try camelCase (first letter lowercase)
    const camelCaseName = fileName
      .split("-")
      .map((part, i) =>
        i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");

    // Try PascalCase (all first letters uppercase)
    const pascalCaseName = fileName
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    return module[camelCaseName] || module[pascalCaseName];
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Component Showcase */}
      <Card className="border-2 border-slate-300 bg-slate-50 shadow-md dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          <CardTitle className="text-lg font-mono font-medium">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className="border border-slate-300 dark:border-slate-700 rounded-md p-3 h-[350px] bg-white dark:bg-slate-950 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse text-sm text-slate-500">
                  Loading component...
                </div>
              </div>
            ) : DynamicComponent ? (
              <DynamicComponent onDataChange={() => {}} />
            ) : (
              <div className="text-sm text-slate-500">
                No component found for path: {componentPath}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
