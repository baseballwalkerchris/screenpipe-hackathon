import { Button } from "@/components/ui/button";

interface InstructionsProps {
  title: string;
  description?: string;
  taskStarted: boolean;
  onStartTask: () => void;
  onExitTask?: () => void;
  onTaskComplete?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export function Instructions({
  title,
  description,
  taskStarted,
  onStartTask,
  onExitTask = () => {},
  onTaskComplete = () => {},
  currentStep = 1,
  totalSteps = 1,
}: InstructionsProps) {
  return (
    <div
      className={`${
        taskStarted ? "bg-white rounded-lg shadow-lg w-[320px]" : "max-w-2xl"
      }`}
    >
      <div className={`${taskStarted ? "p-4" : ""}`}>
        <div className={`space-y-${taskStarted ? "2" : "5"}`}>
          <div className="flex justify-between items-center">
            <p className="text-sm uppercase text-gray-500 font-medium">
              INSTRUCTIONS
            </p>
            {totalSteps > 1 && (
              <p className="text-sm text-gray-500">
                Task {currentStep} of {totalSteps}
              </p>
            )}
          </div>
          <h1
            className={`${
              taskStarted ? "text-base" : "text-3xl"
            } font-semibold`}
          >
            {title}
          </h1>
          {!taskStarted && description && (
            <p className="text-base text-gray-600">{description}</p>
          )}
        </div>
      </div>

      <div
        className={
          taskStarted ? "mt-4 bg-gray-50 p-3 rounded-b-lg border-t" : "mt-7"
        }
      >
        {!taskStarted ? (
          <Button
            onClick={onStartTask}
            className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white px-8 text-base py-5"
          >
            Start Task
          </Button>
        ) : (
          <div className="flex gap-2 px-1">
            <Button
              onClick={onExitTask}
              variant="outline"
              className="text-gray-700 bg-white text-sm flex-1"
            >
              Exit Task
            </Button>
            <Button
              onClick={onTaskComplete}
              className="bg-[#FF5A5F] hover:bg-[#FF4347] text-white text-sm flex-1"
            >
              I'm Done!
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
