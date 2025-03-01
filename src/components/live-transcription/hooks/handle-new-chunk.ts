import { TranscriptionChunk, VisionChunk, Note } from "../../meeting-history/types"
import { LiveMeetingData } from "./storage-for-live-meeting"
import { improveTranscription } from './ai-improve-chunk-transcription'
import { generateMeetingNote } from './ai-create-note-based-on-chunk'
import { diffWords } from 'diff'
import type { Settings } from "@screenpipe/browser"

interface DiffChunk {
    value: string
    added?: boolean
    removed?: boolean
}

export interface ImprovedChunk {
    text: string
    diffs: DiffChunk[] | null
}

interface HandleNewChunkDeps {
    setData: (fn: (currentData: LiveMeetingData | null) => LiveMeetingData | null) => void;
    setImprovingChunks: (fn: (prev: Record<number, boolean>) => Record<number, boolean>) => void;
    setRecentlyImproved: (fn: (prev: Record<number, boolean>) => Record<number, boolean>) => void;
    updateStore: (newData: LiveMeetingData) => Promise<boolean>;
    settings: Settings;
}

export function createHandleNewChunk(deps: HandleNewChunkDeps) {
    const { setData, updateStore, settings } = deps;
    
    // Buffers for raw transcription & vision chunks
    const noteBuffer: TranscriptionChunk[] = [];
    const visionBuffer: VisionChunk[] = [];

    async function tryGenerateNote() {
        const now = Date.now();
        const totalText = noteBuffer.map(chunk => chunk.text).join(' ');
        const wordCount = totalText.split(/\s+/).length;

        let shouldGenerate = false;
        let existingNotes: string[] = [];

        setData(currentData => {
            shouldGenerate = currentData?.isAiNotesEnabled ?? true;
            existingNotes = currentData?.notes?.map(n => n.text) || [];
            return currentData;
        });

        if (!shouldGenerate || wordCount < 50) {
            return;
        }

        const note = await generateMeetingNote(noteBuffer, settings, existingNotes).catch(error => {
            console.error('failed to generate note:', error);
            return null;
        });

        setData(current => {
            if (note && current) {
                const timestamp = noteBuffer.length > 0 
                    ? new Date(noteBuffer[0].timestamp)
                    : new Date(now);

                const newData = {
                    ...current,
                    notes: [...current.notes, {
                        id: `note-${now}`,
                        text: `• ${note}`,
                        timestamp,
                        type: 'auto'
                    }]
                };
                void updateStore(newData);
                return newData;
            }
            return current;
        });

        noteBuffer.length = 0; // Clear transcription buffer
    }

    async function tryProcessVisionData() {
        const now = Date.now();
        const totalVisionText = visionBuffer.map(chunk => chunk.text).join(' ');

        let shouldProcess = false;
        let existingVisionChunks: VisionChunk[] = [];
        let existingMergedVisionChunks: VisionChunk[] = [];

        setData(currentData => {
            if (!currentData) {
                console.log('No current data available for vision processing')
                return null;
            }
            shouldProcess = true;
            existingVisionChunks = currentData.visionChunks ?? [];
            existingMergedVisionChunks = currentData.mergedVisionChunks ?? [];
            return currentData;
        });

        if (!shouldProcess || visionBuffer.length === 0) {
            console.log('Skipping vision processing:', { shouldProcess, bufferLength: visionBuffer.length })
            return;
        }

        try {

            const allVisionChunks = [...existingVisionChunks, ...visionBuffer];
            const mergedVisionChunks = allVisionChunks.reduce<VisionChunk[]>((acc, curr) => {
                const prev = acc[acc.length - 1];

                if (prev && prev.text === curr.text) {
                    return acc;
                }

                acc.push({ ...curr });
                return acc;
            }, []);


            setData(current => {
                if (!current) return null;

                const newData = {
                    ...current,
                    visionChunks: allVisionChunks,
                    mergedVisionChunks
                };
                void updateStore(newData);
                return newData;
            });
        } catch (error) {
            console.error('Failed to process vision data:', error);
        } finally {
            visionBuffer.length = 0;
        }
    }

    async function handleNewChunk(chunk: TranscriptionChunk) {
        noteBuffer.push(chunk);
        void tryGenerateNote();

        setData(currentData => {
            if (!currentData) return null;

            const chunks = [...currentData.chunks, chunk];

            const mergedChunks = chunks.reduce<TranscriptionChunk[]>((acc, curr) => {
                const prev = acc[acc.length - 1];

                if (prev && prev.speaker === curr.speaker) {
                    prev.text += ' ' + curr.text;
                    return acc;
                }

                acc.push(Object.assign({}, curr));
                return acc;
            }, []);

            const newData: LiveMeetingData = {
                ...currentData,
                chunks,
                mergedChunks,
                lastProcessedIndex: chunks.length
            };

            void updateStore(newData);
            return newData;
        });
    }

    async function handleNewVisionChunk(chunk: VisionChunk) {
        visionBuffer.push(chunk);
        void tryProcessVisionData();
    }

    return { handleNewChunk, handleNewVisionChunk };
}