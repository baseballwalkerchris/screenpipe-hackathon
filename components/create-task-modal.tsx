import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X, Trash2 } from "lucide-react";
import { FigmaEmbed } from "@/components/ui/figma-embed";

interface Task {
  id: string;
  title: string;
  description: string;
  prototypeLink: string;
}

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, "id">) => void;
  editingTask?: Task | null;
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreateTask,
  editingTask,
}: CreateTaskModalProps) {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [prototypeLink, setPrototypeLink] = useState("");
  const [selectedSource, setSelectedSource] = useState<
    "figma" | "xd" | "sketch" | null
  >(null);
  const [validFigmaUrl, setValidFigmaUrl] = useState("");

  // Validate and transform Figma URL
  const isValidFigmaUrl = (url: string) => {
    return (
      url.startsWith("https://www.figma.com/embed") ||
      url.startsWith("https://embed.figma.com") ||
      url.startsWith("https://www.figma.com/file") ||
      url.startsWith("https://www.figma.com/proto")
    );
  };

  const getEmbedUrl = (url: string) => {
    if (
      url.startsWith("https://www.figma.com/embed") ||
      url.startsWith("https://embed.figma.com")
    ) {
      return url;
    }

    // Convert file URLs
    if (url.includes("/file/")) {
      return url.replace(
        "https://www.figma.com/file/",
        "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/"
      );
    }

    // Convert prototype URLs
    if (url.includes("/proto/")) {
      return url.replace(
        "https://www.figma.com/proto/",
        "https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/proto/"
      );
    }

    return url;
  };

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask.title);
      setDescription(editingTask.description);
      setPrototypeLink(editingTask.prototypeLink);
      if (isValidFigmaUrl(editingTask.prototypeLink)) {
        setSelectedSource("figma");
        setValidFigmaUrl(getEmbedUrl(editingTask.prototypeLink));
      }
    } else {
      setTask("");
      setDescription("");
      setPrototypeLink("");
      setSelectedSource(null);
      setValidFigmaUrl("");
    }
  }, [editingTask]);

  useEffect(() => {
    if (
      selectedSource === "figma" &&
      prototypeLink &&
      isValidFigmaUrl(prototypeLink)
    ) {
      setValidFigmaUrl(getEmbedUrl(prototypeLink));
    } else {
      setValidFigmaUrl("");
    }
  }, [prototypeLink, selectedSource]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateTask({
      title: task,
      description,
      prototypeLink,
    });
    onClose();
  };

  const handleEnterClick = () => {
    if (prototypeLink && isValidFigmaUrl(prototypeLink)) {
      setSelectedSource("figma");
      setValidFigmaUrl(getEmbedUrl(prototypeLink));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="bg-white w-[1200px] h-full animate-slide-in">
        <div className="p-12 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b">
            <h1 className="text-2xl font-semibold">
              {editingTask ? "Edit Task" : "Create Task"}
            </h1>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-2 gap-12 mb-8">
            {/* Form section */}
            <div className="flex flex-col gap-8">
              <div>
                <Label htmlFor="task">Task</Label>
                <Input
                  id="task"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Write your task here. This is what users will see."
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a description for your task."
                  className="mt-2 min-h-[120px]"
                />
              </div>

              <div>
                <Label htmlFor="prototypeLink">Prototype Link</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="prototypeLink"
                    value={prototypeLink}
                    onChange={(e) => setPrototypeLink(e.target.value)}
                    placeholder="Enter prototype link"
                  />
                  <Button
                    type="button"
                    onClick={handleEnterClick}
                    className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white px-6 shrink-0"
                  >
                    Enter
                  </Button>
                </div>
                <div className="mt-4">
                  <Label>Prototype source options</Label>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedSource("figma")}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedSource === "figma"
                          ? "border-[#ff4d4f] bg-[#fff2f0]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src="/figma-logo.svg"
                        alt="Figma"
                        width={24}
                        height={24}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSource("xd")}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedSource === "xd"
                          ? "border-[#ff4d4f] bg-[#fff2f0]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src="/xd-logo.svg"
                        alt="Adobe XD"
                        width={24}
                        height={24}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSource("sketch")}
                      className={`p-3 rounded-lg border transition-all ${
                        selectedSource === "sketch"
                          ? "border-[#ff4d4f] bg-[#fff2f0]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src="/sketch-logo.svg"
                        alt="Sketch"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview section */}
            <div>
              <h2 className="text-lg font-medium mb-2">Preview</h2>
              <div className="bg-[#000000] rounded-lg p-4 flex items-center justify-center h-[520px] w-full">
                <div className="relative w-[240px] h-[480px]">
                  {selectedSource === "figma" && validFigmaUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FigmaEmbed
                        embedUrl={validFigmaUrl}
                        width="360"
                        height="520"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white rounded-[32px] p-2 shadow-xl">
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100px] h-[20px] bg-black rounded-b-[16px]"></div>
                      <div className="w-full h-full bg-gray-50 rounded-[28px] flex items-center justify-center">
                        <p className="text-sm text-gray-500 text-center">
                          A preview of your prototype and task
                          <br />
                          will appear here once your inputted
                          <br />
                          information has been processed.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex justify-between mt-auto pt-8">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2 text-red-500 border-red-500 hover:bg-red-50"
            >
              <Trash2 size={16} /> Delete Task
            </Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-[#ff4d4f] hover:bg-[#ff7875] text-white px-8"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
