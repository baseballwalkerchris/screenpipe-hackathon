"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  pipe,
  VisionEvent,
  type TranscriptionChunk,
} from "@screenpipe/browser";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { RealtimeAudio } from "./realtime-audio"; // Import with correct filename

export function RealtimeScreen({
  onDataChange,
}: {
  onDataChange?: (data: any, error: string | null) => void;
}) {
  const [visionEvent, setVisionEvent] = useState<VisionEvent | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionChunk | null>(
    null
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withOcr, setWithOcr] = useState(true);
  const [withImages, setWithImages] = useState(true);
  const streamRef = useRef<any>(null);

  const startStreaming = async () => {
    try {
      setError(null);
      setIsStreaming(true);

      const originalConsoleError = console.error;
      console.error = function (msg, ...args) {
        if (
          typeof msg === "string" &&
          (msg.includes("failed to fetch settings") ||
            msg.includes("ERR_CONNECTION_REFUSED"))
        ) {
          return;
        }
        originalConsoleError.apply(console, [msg, ...args]);
      };

      // Start vision streaming
      const stream = pipe.streamVision(withOcr);
      streamRef.current = stream;

      for await (const event of stream) {
        if (event.data && isValidVisionEvent(event.data)) {
          setVisionEvent(event.data);
          if (onDataChange) onDataChange(event.data, null);
        }
      }

      console.error = originalConsoleError;
    } catch (error) {
      console.error("vision stream failed:", error);
      setError(
        error instanceof Error
          ? `Failed to stream vision: ${error.message}`
          : "Failed to stream vision"
      );
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.return?.();
    }
    setIsStreaming(false);
  };

  useEffect(() => {
    return () => {
      stopStreaming();
    };
  }, []);

  const isValidVisionEvent = (event: VisionEvent): boolean => {
    return !!(
      (event.timestamp && !isNaN(new Date(event.timestamp).getTime())) ||
      (event.app_name && event.app_name !== "Unknown") ||
      (event.window_name && event.window_name !== "Unknown")
    );
  };

  const renderVisionContent = (event: VisionEvent) => (
    <div className="space-y-2 text-xs">
      <div className="flex flex-col text-slate-600">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-semibold">App:</span>{" "}
            <span>{event.app_name || "Not available"}</span>
          </div>
          <div>
            <span className="font-semibold">Timestamp:</span>{" "}
            <span>
              {event.timestamp
                ? new Date(event.timestamp).toLocaleString()
                : "Not available"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-semibold">Window:</span>{" "}
            <span>{event.window_name || "Not available"}</span>
          </div>
          <div>
            <span className="font-semibold">Type:</span> <span>Window</span>
          </div>
        </div>
      </div>

      {event.image && withImages && (
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-gray-200 mb-2">
          <Image
            src={`data:image/jpeg;base64,${event.image}`}
            alt="screen capture"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}

      {withOcr && event.text && (
        <div className="bg-slate-100 rounded p-2 overflow-auto h-[230px] whitespace-pre-wrap font-mono text-xs">
          {event.text}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Button
          onClick={isStreaming ? stopStreaming : startStreaming}
          size="sm"
        >
          {isStreaming ? (
            <>
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              Stop Streaming
            </>
          ) : (
            "Start Streaming"
          )}
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWithOcr(!withOcr)}
            className={`relative ${
              withOcr ? "border-black" : "border-gray-300"
            }`}
          >
            <span>OCR</span>
            <div
              className={`ml-2 w-8 h-4 rounded-full border transition-colors ${
                withOcr
                  ? "bg-black border-black"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div
                className={`absolute w-3 h-3 rounded-full transition-transform ${
                  withOcr ? "bg-white translate-x-4" : "bg-white translate-x-1"
                }`}
              ></div>
            </div>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setWithImages(!withImages)}
            className={`relative ${
              withImages ? "border-black" : "border-gray-300"
            }`}
          >
            <span>Images</span>
            <div
              className={`ml-2 w-8 h-4 rounded-full border transition-colors ${
                withImages
                  ? "bg-black border-black"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <div
                className={`absolute w-3 h-3 rounded-full transition-transform ${
                  withImages
                    ? "bg-white translate-x-4"
                    : "bg-white translate-x-1"
                }`}
              ></div>
            </div>
          </Button>
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {visionEvent && renderVisionContent(visionEvent)}

      {/* Realtime Audio Transcription */}
      <RealtimeAudio
        onDataChange={(data, err) => {
          if (err) {
            setError(err);
          } else {
            setTranscription(data as TranscriptionChunk);
          }
        }}
      />

      {/* Display transcription output */}
      {transcription && (
        <div className="bg-slate-100 rounded p-2 overflow-auto h-[130px] whitespace-pre-wrap font-mono text-xs mt-2">
          <div className="text-slate-600 font-semibold mb-1">
            Live Transcription:
          </div>
          {transcription.transcription}
        </div>
      )}

      <div className="flex items-center gap-1.5 text-right justify-end">
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            isStreaming ? "bg-green-500" : "bg-gray-400"
          }`}
        />
        <span className="text-xs text-gray-500 font-mono">
          {isStreaming ? "streaming" : "stopped"}
        </span>
      </div>
    </div>
  );
}
