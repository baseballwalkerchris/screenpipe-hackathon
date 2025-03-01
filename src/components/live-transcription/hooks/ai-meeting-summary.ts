import type { Settings } from "@screenpipe/browser"
import { LiveMeetingData } from "@/components/live-transcription/hooks/storage-for-live-meeting"
import { callOpenAI, createAiClient } from "./ai-client"

export async function generateMeetingSummary(
  meeting: LiveMeetingData,
  settings: Settings
): Promise<string> {
  const openai = createAiClient(settings)

  try {
    console.log(
      "generating ai summary for meeting:", 
      {
        startTime: meeting.startTime,
        chunks_count: meeting.chunks.length,
        notes_count: meeting.notes.length,
        total_transcript_length: meeting.mergedChunks.reduce((acc, s) => acc + s.text.length, 0),
        total_notes_length: meeting.notes.reduce((acc, n) => acc + n.text.length, 0)
      }
    )

    // Create prompt from meeting data using mergedChunks
    const transcriptContent = meeting.mergedChunks
      .map(
        (s) =>
          `[${meeting.speakerMappings[s.speaker || 'speaker_0'] || s.speaker || 'speaker_0'}]: ${meeting.editedMergedChunks[s.id] || s.text}`
      )
      .join("\n")

    console.log('Vision context for summary:', {
      totalChunks: meeting.visionChunks?.length || 0,
      mergedChunks: meeting.mergedVisionChunks?.length || 0,
      sampleChunks: meeting.mergedVisionChunks?.slice(0, 2) || []
    })

    // Convert vision chunks to formatted string
    const visionContext = meeting.mergedVisionChunks
      ?.map(chunk => {
        const parts = [];
        if (chunk.appName) parts.push(`App: ${chunk.appName}`);
        if (chunk.text) parts.push(`Content: ${chunk.text}`);
        return parts.join(', ');
      })
      .filter(text => text.length > 0)
      .join('\n') || ''

    console.log("Vision context formatted:", visionContext)

    // Add notes context if available
    const notesContext = meeting.notes.length > 0 
      ? `\nMeeting notes:\n${meeting.notes.map(n => n.text).join("\n")}`
      : ""

    const currentSummary = meeting.analysis?.summary
    const summaryContext = currentSummary 
      ? `\nCurrent summary: "${currentSummary}"\nPlease generate a new summary that might be more accurate.`
      : ""

    const currentTitle = meeting.title
    const titleContext = currentTitle 
      ? `\nMeeting title: "${currentTitle}"`
      : ""

    // First AI call for detailed analysis
    console.log("sending request to openai for meeting analysis")
    const response = await callOpenAI(openai, {
      model: settings.aiModel,
      messages: [
        {
          role: "system" as const,
          content: "you are a meeting participant. analyze our discussion to understand: who was there, what we talked about, what we decided, and what our next steps are. be specific but concise.",
        },
        {
          role: "user" as const,
          content: `Please describe to me what is on the screen. Here are the elements on the screen:\n${visionContext}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    }, {
      maxRetries: 3,
      initialDelay: 1500
    })

    console.log("response:", response)

    const summary = ('choices' in response 
      ? response.choices[0]?.message?.content?.trim() || "no summary available"
      : "no summary available")
      .replace(/\*\*/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/^\s*[-*]\s*/gm, '• ')
      .trim()


    return summary

  } catch (error) {
    console.error("error generating meeting summary:", error)
    return "failed to generate summary"
  } finally {
    console.log("ai summary generation complete")
  }
}
    