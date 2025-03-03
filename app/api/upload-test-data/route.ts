import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createAiClient } from '../settings/route';
import { pipe } from "@screenpipe/js";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export async function POST(req: Request) {
  try {
    const { projectId, tasks, timestamp } = await req.json();

    // Get settings to create AI client
    const settings = await pipe.settings.getAll();
    const openai = createAiClient(settings);

    // Initialize Pinecone
    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const namespaceIndex = index.namespace(`project-${projectId}`);
    
    // Create embeddings using the shared OpenAI client
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: settings.aiProviderType === "screenpipe-cloud" 
        ? settings.user.token 
        : settings.openaiApiKey,
      configuration: {
        baseURL: settings.aiUrl,
      }
    });

    // Process each task
    const vectors = await Promise.all(tasks.map(async (task: any, i: number) => {
      const taskText = `
        Task: ${task.taskTitle}
        GPT Analysis: ${task.gptResponse}
        User Actions: ${JSON.stringify(task.streamData)}
      `;

      const [embedding] = await embeddings.embedDocuments([taskText]);

      return {
        id: `${projectId}-task-${i}-${timestamp}`,
        values: embedding,
        metadata: {
          projectId,
          taskTitle: task.taskTitle,
          gptResponse: task.gptResponse,
          streamData: task.streamData,
          timestamp,
          taskIndex: i
        }
      };
    }));

    // Upsert vectors to Pinecone
    await namespaceIndex.upsert(vectors);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error uploading to Pinecone:', error);
    return NextResponse.json(
      { error: 'Failed to upload test data' },
      { status: 500 }
    );
  }
} 