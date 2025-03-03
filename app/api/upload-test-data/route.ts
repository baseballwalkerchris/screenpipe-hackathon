import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from '@langchain/openai';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export async function POST(req: Request) {
  try {
    const { projectId, tasks, timestamp } = await req.json();

    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY
    });

    // Process each task
    const vectors = await Promise.all(tasks.map(async (task: any, i: number) => {
      // Create a combined text representation of the task data
      const taskText = `
        Task: ${task.taskTitle}
        GPT Analysis: ${task.gptResponse}
        User Actions: ${JSON.stringify(task.streamData)}
      `;

      // Generate embedding for the task data
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
    const namespaceIndex = index.namespace(`project-${projectId}`);
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