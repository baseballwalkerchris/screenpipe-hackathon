import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";
import { createAiClient } from "@/app/api/settings/route";
import { Settings } from "@screenpipe/browser";

export async function POST(req: Request) {
  try {
    const { query, projectId } = await req.json();
    
    // Get embeddings
    const aiClient = createAiClient({
      aiProviderType: "screenpipe-cloud",
      aiUrl: "https://api.openai.com/v1",
      user: { token: process.env.OPENAI_API_KEY! },
      openaiApiKey: process.env.OPENAI_API_KEY!,
    } as Settings);

    const embedding = await aiClient.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    });

    // Query Pinecone
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const index = pinecone.index(process.env.PINECONE_INDEX!);
    const namespace = index.namespace(`project-${projectId}`);

    const queryResponse = await namespace.query({
      vector: embedding.data[0].embedding,
      topK: 5,
      includeMetadata: true,
    });

    return NextResponse.json({
      context: queryResponse.matches
        .map((match) => match.metadata?.content || "")
        .join("\n\n")
    });
  } catch (error) {
    console.error("Error in context route:", error);
    return NextResponse.json(
      { error: "Failed to fetch context" },
      { status: 500 }
    );
  }
} 