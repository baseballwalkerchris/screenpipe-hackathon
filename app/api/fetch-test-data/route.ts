import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

interface TestMetadata {
  projectId: string;
  taskTitle: string;
  gptResponse: string;
  timestamp: string;
  taskIndex: number;
  category?: string;
  content?: string;
  whatWorkedWell: string;
  commonPainPoints: string;
  behavioralAnalysis: string;
  recommendedNextSteps: string;
}

export async function GET(req: Request) {
  console.log('Fetch test data API route called');
  
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');
    console.log('Project ID:', projectId);

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    console.log('Initializing Pinecone index');
    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const namespaceIndex = index.namespace(`project-${projectId}`);
    
    try {
      console.log('Querying vectors from Pinecone');
      // Query all vectors for this project
      const queryResponse = await namespaceIndex.query({
        topK: 10000, // Adjust based on your needs
        includeMetadata: true,
        includeValues: true, // Include the actual vector embeddings
        vector: new Array(1536).fill(0) // Using a zero vector to match all records
      });

      console.log('Pinecone response:', queryResponse);

      if (!queryResponse.matches || queryResponse.matches.length === 0) {
        console.log('No matches found');
        return NextResponse.json({ results: [] });
      }

      // Extract and sort the results, now including analysis metadata
      const results = queryResponse.matches
        .map(match => ({
          ...(match.metadata as unknown as Partial<TestMetadata>),
          vector: match.values,
          whatWorkedWell: match.metadata?.whatWorkedWell || '',
          commonPainPoints: match.metadata?.commonPainPoints || '',
          behavioralAnalysis: match.metadata?.behavioralAnalysis || '',
          recommendedNextSteps: match.metadata?.recommendedNextSteps || ''
        }))
        .sort((a, b) => {
          if (a.timestamp === b.timestamp) {
            return (a.taskIndex ?? 0) - (b.taskIndex ?? 0);
          }
          return new Date(b.timestamp ?? '').getTime() - new Date(a.timestamp ?? '').getTime();
        });

      console.log('Processed results:', results);
      return NextResponse.json({ results });
    } catch (pineconeError) {
      console.error('Pinecone query error:', pineconeError);
      return NextResponse.json(
        { error: 'Failed to fetch data from vector database' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in fetch-test-data route:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 