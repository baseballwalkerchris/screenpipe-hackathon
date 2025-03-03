import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

export function SearchBar({ placeholder = "Search for projects by product type, compensation, etc.", onChange }: SearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      <input
        type="text"
        className="w-full h-12 pl-12 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-0 text-gray-800 placeholder-gray-400"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
} 