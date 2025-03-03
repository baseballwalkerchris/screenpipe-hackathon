import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

interface Metadata {
  category: string;
  content: string;
  timestamp?: string;
}

interface Analysis {
  whatWorkedWell: string[];
  commonPainPoints: string[];
  behavioralAnalysis: string[];
  recommendedNextSteps: string[];
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const namespace = index.namespace(`project-${projectId}`);

    const queryResponse = await namespace.query({
      topK: 10,
      includeMetadata: true,
      vector: new Array(1536).fill(0) // Placeholder vector to get all results
    });

    const analysis: Analysis = {
      whatWorkedWell: [],
      commonPainPoints: [],
      behavioralAnalysis: [],
      recommendedNextSteps: []
    };

    queryResponse.matches.forEach(match => {
      const metadata = match.metadata as unknown as Metadata;
      if (metadata?.category === 'success') {
        analysis.whatWorkedWell.push(metadata.content);
      } else if (metadata?.category === 'pain_point') {
        analysis.commonPainPoints.push(metadata.content);
      } else if (metadata?.category === 'behavior') {
        analysis.behavioralAnalysis.push(metadata.content);
      } else if (metadata?.category === 'next_steps') {
        analysis.recommendedNextSteps.push(metadata.content);
      }
    });

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analysis' },
      { status: 500 }
    );
  }
} 