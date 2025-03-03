import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});

export async function POST(req: Request) {
  try {
    console.log('Uploading test data...');
    const { projectId, screenDataVector, metadata } = await req.json();

    if (!projectId || !screenDataVector || !metadata) {
      console.error('Missing required fields:', { 
        projectId, 
        hasVector: !!screenDataVector, 
        hasMetadata: !!metadata 
      });
      return NextResponse.json(
        { error: 'Missing required fields', details: { 
          projectId, 
          hasVector: !!screenDataVector, 
          hasMetadata: !!metadata 
        }},
        { status: 400 }
      );
    }

    try {
      // Initialize Pinecone
      if (!process.env.PINECONE_INDEX) {
        throw new Error('PINECONE_INDEX environment variable is not set');
      }

      const index = pinecone.index(process.env.PINECONE_INDEX);
      const namespaceIndex = index.namespace(`project-${projectId}`);
      
      // Create vector with metadata
      const vector = {
        id: `${projectId}-${metadata.timestamp}`,
        values: screenDataVector,
        metadata: {
          projectId,
          ...metadata
        }
      };

      // Upload vector to Pinecone
      console.log('Upserting vector to Pinecone namespace:', `project-${projectId}`);
      await namespaceIndex.upsert([vector]);
      console.log('Successfully uploaded vector to Pinecone');

      return NextResponse.json({ 
        success: true,
        details: {
          projectId,
          timestamp: metadata.timestamp
        }
      });
    } catch (settingsError) {
      console.error('Error with Pinecone setup:', {
        error: settingsError,
        message: settingsError instanceof Error ? settingsError.message : 'Unknown error',
        stack: settingsError instanceof Error ? settingsError.stack : undefined
      });
      return NextResponse.json(
        { 
          error: 'Failed to initialize Pinecone',
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