interface ProgressBarProps {
  progress: number; // 0 to 100
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="flex justify-center py-4">
      <div className="w-[1400px] h-2.5 bg-gray-200 rounded-full">
        <div 
          className="h-full bg-[#FF5A5F] rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 