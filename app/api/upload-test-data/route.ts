import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

// Helper function to clean and truncate text
function prepareTextForEmbedding(text: string): string {
  // Remove extra whitespace and normalize
  const cleaned = text.replace(/\s+/g, ' ').trim();
  // Truncate to approximately 8000 characters (safe limit for embedding)
  return cleaned.slice(0, 8000);
}

export async function POST(req: Request) {
  try {
    console.log('Uploading test data...');
    const { projectId, tasks, timestamp } = await req.json();

    if (!projectId || !tasks || !timestamp) {
      console.error('Missing required fields:', { projectId, hasTasks: !!tasks, timestamp });
      return NextResponse.json(
        { error: 'Missing required fields', details: { projectId, hasTasks: !!tasks, timestamp } },
        { status: 400 }
      );
    }

    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }

      console.log('Creating OpenAI client...');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log('OpenAI client created');

      // Initialize Pinecone
      if (!process.env.PINECONE_INDEX) {
        throw new Error('PINECONE_INDEX environment variable is not set');
      }

      const index = pinecone.index(process.env.PINECONE_INDEX);
      const namespaceIndex = index.namespace(`project-${projectId}`);
      
      // Process each task
      console.log(`Processing ${tasks.length} tasks for project ${projectId}`);
      const vectors = await Promise.all(tasks.map(async (task: any, i: number) => {
        let taskText: string = '';
        try {
          // Clean and prepare the task data
          const cleanedGptResponse = task.gptResponse ? task.gptResponse.toString() : '';
          const cleanedStreamData = task.streamData ? JSON.stringify(task.streamData) : '';
          
          taskText = prepareTextForEmbedding(`
            Task: ${task.taskTitle || ''}
            GPT Analysis: ${cleanedGptResponse}
            User Actions: ${cleanedStreamData}
          `);

          console.log(`Task ${i + 1} text length: ${taskText.length} characters`);

          // Generate embedding using OpenAI directly
          const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: taskText
          });
          
          console.log(`Generated embedding for task ${i + 1}/${tasks.length} (dimension: ${embeddingResponse.data[0].embedding.length})`);

          return {
            id: `${projectId}-task-${i}-${timestamp}`,
            values: embeddingResponse.data[0].embedding,
            metadata: {
              projectId,
              taskTitle: task.taskTitle || '',
              gptResponse: cleanedGptResponse,
              streamData: task.streamData,
              timestamp,
              taskIndex: i
            }
          };
        } catch (taskError) {
          console.error(`Error processing task ${i}:`, {
            error: taskError,
            task: {
              title: task.taskTitle,
              textLength: taskText?.length,
              hasGptResponse: !!task.gptResponse,
              hasStreamData: !!task.streamData
            }
          });
          throw taskError;
        }
      }));

      // Upsert vectors to Pinecone
      console.log(`Upserting ${vectors.length} vectors to Pinecone namespace: project-${projectId}`);
      await namespaceIndex.upsert(vectors);
      console.log('Successfully uploaded vectors to Pinecone');

      return NextResponse.json({ 
        success: true,
        details: {
          projectId,
          tasksProcessed: tasks.length,
          vectorsUploaded: vectors.length
        }
      });
    } catch (settingsError) {
      console.error('Error with settings or AI setup:', {
        error: settingsError,
        message: settingsError instanceof Error ? settingsError.message : 'Unknown error',
        stack: settingsError instanceof Error ? settingsError.stack : undefined
      });
      return NextResponse.json(
        { 
          error: 'Failed to initialize AI services',
          details: settingsError instanceof Error ? settingsError.message : 'Unknown error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in upload-test-data:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to upload test data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 