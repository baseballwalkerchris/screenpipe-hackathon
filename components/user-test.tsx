"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  pipe,
  VisionEvent,
  type TranscriptionChunk,
  type Settings as ScreenpipeSettings,
} from "@screenpipe/browser";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { usePipeSettings } from "@/lib/hooks/use-pipe-settings";
import { createAiClient } from "@/app/api/settings/route";

interface StreamChunk {
  timestamp: string;
  type: "vision" | "audio";
  text: string;
}

export function UserTest({
  onDataChange,
}: {
  onDataChange?: (data: any, error: string | null) => void;
}) {
  const { settings, loading } = usePipeSettings();
  const [visionEvent, setVisionEvent] = useState<VisionEvent | null>(null);
  const [transcription, setTranscription] = useState<TranscriptionChunk | null>(
    null
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withOcr, setWithOcr] = useState(true);
  const [withImages, setWithImages] = useState(true);
  const [history, setHistory] = useState("");
  const [streamData, setStreamData] = useState<StreamChunk[]>([]);
  const [isProcessingGPT, setIsProcessingGPT] = useState(false);
  const [gptResponse, setGptResponse] = useState<string | null>(null);
  const historyRef = useRef(history);
  const visionStreamRef = useRef<any>(null);
  const audioStreamRef = useRef<any>(null);

  // Update ref when history changes
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const startStreaming = async () => {
    try {
      setError(null);
      setIsStreaming(true);
      setStreamData([]); // Reset stream data when starting new stream

      // Check if realtime transcription is enabled
      if (!settings?.screenpipeAppSettings?.enableRealtimeAudioTranscription) {
        const errorMsg =
          "Realtime audio transcription is not enabled in settings. Go to account -> settings -> recording -> enable realtime audiotranscription -> models to use: screenpipe cloud. Then refresh.";
        console.error(errorMsg);
        setError(errorMsg);
        setIsStreaming(false);
        return;
      }

      console.log("Settings check passed, audio transcription is enabled");

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

      // Start both streams
      try {
        console.log("Attempting to start vision stream...");
        // Start vision streaming
        const visionStream = pipe.streamVision(withOcr);
        visionStreamRef.current = visionStream;
        console.log("Vision stream initialized successfully");

        console.log("Attempting to start audio stream...");
        // Start audio streaming
        const audioStream = await pipe.streamTranscriptions();
        audioStreamRef.current = audioStream;
        console.log("Audio stream initialized successfully");

        // Handle vision stream
        (async () => {
          try {
            console.log("Starting vision stream loop");
            for await (const event of visionStream) {
              if (event.data && isValidVisionEvent(event.data)) {
                console.log("Received valid vision event:", event.data);
                setVisionEvent(event.data);

                // Add vision data to stream collection
                if (event.data.text) {
                  setStreamData((prev) => [
                    ...prev,
                    {
                      timestamp:
                        event.data.timestamp || new Date().toISOString(),
                      type: "vision",
                      text: event.data.text,
                    },
                  ]);
                }

                if (onDataChange) onDataChange(event.data, null);
              }
            }
          } catch (error) {
            if (isStreaming) {
              console.error("Vision stream failed:", error);
              setError(
                error instanceof Error
                  ? `Vision stream error: ${error.message}`
                  : "Vision stream failed"
              );
            }
          }
        })();

        // Handle audio stream
        (async () => {
          try {
            console.log("Starting audio stream loop");
            for await (const event of audioStream) {
              console.log("Received audio event:", event);
              if (event.choices?.[0]?.text) {
                const chunk: TranscriptionChunk = {
                  transcription: event.choices[0].text,
                  timestamp:
                    event.metadata?.timestamp || new Date().toISOString(),
                  device: event.metadata?.device || "unknown",
                  is_input: event.metadata?.isInput || false,
                  is_final: event.choices[0].finish_reason !== null,
                };

                console.log("Processing audio chunk:", chunk);
                setTranscription(chunk);

                // Add audio data to stream collection
                setStreamData((prev) => [
                  ...prev,
                  {
                    timestamp: chunk.timestamp,
                    type: "audio",
                    text: chunk.transcription,
                  },
                ]);

                const newHistory =
                  historyRef.current + " " + chunk.transcription;
                setHistory(newHistory);

                if (onDataChange) {
                  onDataChange(chunk, null);
                }
              }
            }
          } catch (error) {
            if (isStreaming) {
              console.error("Audio stream failed:", error);
              setError(
                error instanceof Error
                  ? `Audio stream error: ${error.message}`
                  : "Audio stream failed"
              );
            }
          }
        })();
      } catch (error) {
        console.error("Failed to start streams:", error);
        setError(
          error instanceof Error
            ? `Failed to start streams: ${error.message}`
            : "Failed to start streams"
        );
        setIsStreaming(false);
      }

      console.error = originalConsoleError;
    } catch (error) {
      console.error("Stream initialization failed:", error);
      setError(
        error instanceof Error
          ? `Failed to initialize streaming: ${error.message}`
          : "Failed to initialize streaming"
      );
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    if (visionStreamRef.current) {
      visionStreamRef.current.return?.();
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.return?.();
    }

    // Process collected stream data
    if (streamData.length > 0) {
      const sortedData = [...streamData].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      const formattedData = sortedData
        .map(
          (chunk) =>
            `[${new Date(chunk.timestamp).toLocaleTimeString()}] (${
              chunk.type
            }): ${chunk.text}`
        )
        .join("\n");
      console.log("Formatted data for GPT:", formattedData);
    }
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

  const sendToGPT = async (formattedData: string) => {
    try {
      setIsProcessingGPT(true);
      setGptResponse(null);
      setError(null);

      if (!settings?.screenpipeAppSettings) {
        throw new Error("Screenpipe settings not available");
      }

      const aiClient = createAiClient(settings.screenpipeAppSettings);

      const completion = await aiClient.chat.completions.create({
        model: "gpt-4", // Using GPT-4 since we're using the screenpipe cloud client
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant analyzing a stream of vision and audio data from a screen recording session. The data includes OCR text from the screen (vision) and transcribed audio. Please analyze this data and provide a concise summary of the key points and any interesting patterns or insights you notice. Format your response in clear sections.",
          },
          {
            role: "user",
            content: `Please analyze this stream of vision and audio data as a user testing a designer's product. Point out things that 
            the user did not like or did not understand, and also point out things that the user liked or appreciated. :\n\n${formattedData}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      setGptResponse(completion.choices[0].message.content);
    } catch (err) {
      console.error("Error calling GPT:", err);
      setError(
        err instanceof Error ? err.message : "Failed to process with GPT"
      );
    } finally {
      setIsProcessingGPT(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
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

          {!isStreaming && streamData.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const formattedData = streamData
                  .sort(
                    (a, b) =>
                      new Date(a.timestamp).getTime() -
                      new Date(b.timestamp).getTime()
                  )
                  .map(
                    (chunk) =>
                      `[${new Date(chunk.timestamp).toLocaleTimeString()}] (${
                        chunk.type
                      }): ${chunk.text}`
                  )
                  .join("\n");
                sendToGPT(formattedData);
              }}
              disabled={isProcessingGPT}
            >
              {isProcessingGPT ? (
                <>
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Processing...
                </>
              ) : (
                "Send to GPT"
              )}
            </Button>
          )}
        </div>

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

      {/* Display transcription output */}
      {transcription && (
        <div className="bg-slate-100 rounded p-2 overflow-auto h-[130px] whitespace-pre-wrap font-mono text-xs mt-2">
          <div className="text-slate-600 font-semibold mb-1">
            Live Transcription:
          </div>
          {transcription.transcription}
          {history && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <div className="text-slate-600 font-semibold mb-1">History:</div>
              {history}
            </div>
          )}
        </div>
      )}

      {/* Display collected stream chunks */}
      {streamData.length > 0 && (
        <div className="bg-slate-100 rounded p-2 overflow-auto max-h-[300px] whitespace-pre-wrap font-mono text-xs mt-2">
          <div className="text-slate-600 font-semibold mb-2">
            Collected Stream Data ({streamData.length} chunks):
          </div>
          <div className="space-y-1">
            {[...streamData]
              .sort(
                (a, b) =>
                  new Date(a.timestamp).getTime() -
                  new Date(b.timestamp).getTime()
              )
              .map((chunk, index) => (
                <div
                  key={index}
                  className={`p-1 rounded ${
                    chunk.type === "vision" ? "bg-blue-50" : "bg-green-50"
                  }`}
                >
                  <span className="text-gray-500">
                    [{new Date(chunk.timestamp).toLocaleTimeString()}]
                  </span>{" "}
                  <span
                    className={`font-semibold ${
                      chunk.type === "vision"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    ({chunk.type})
                  </span>
                  : {chunk.text}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Display GPT Response */}
      {gptResponse && (
        <div className="bg-yellow-50 rounded p-3 overflow-auto max-h-[300px] whitespace-pre-wrap text-sm mt-2 border border-yellow-200">
          <div className="text-slate-600 font-semibold mb-2">GPT Analysis:</div>
          <div className="prose prose-sm max-w-none">{gptResponse}</div>
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
