import { GoogleGenerativeAI } from "@google/generative-ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { QdrantClient } from '@qdrant/js-client-rest';



if (!process.env.GOOGLE_API_KEY) {
  throw new Error("GOOGLE_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Define types and interfaces
interface EmbeddingFunction {
  (text: string): Promise<number[]>;
}

interface QdrantClientInterface {
  recreateCollection(params: { collection_name: string; vectors_config: VectorParams }): void;
  uploadCollection(params: { collection_name: string; vectors: number[][]; payload: { text: string }[]; ids: number[] }): Promise<void>;
}

interface VectorParams {
  size: number;
  distance: Distance;
}

enum Distance {
  COSINE = "Cosine"
}

// Embedding function to fetch embeddings from Google Generative AI
async function getEmbeddings(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Middleware function to create a vector store in Qdrant
async function createVectorStoreMiddleware(req: any, res: any, next: Function) {
  const { text, embeddingFunction, qdrantClient, collectionName = "documents" } = req.body;

  if (!text || !embeddingFunction || !qdrantClient) {
    return res.status(400).json({ error: 'Missing required parameters: text, embeddingFunction, or qdrantClient.' });
  }

  try {
    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200
    });
    const documents = await textSplitter.splitText(text);

    // Create embeddings for documents
    const embeddings = [];
    for (const doc of documents) {
      const embedding = await embeddingFunction(doc);
      embeddings.push(embedding);
    }

    // Create vector params for the Qdrant collection
    const vectorSize = embeddings[0].length;
    qdrantClient.recreateCollection({
      collection_name: collectionName,
      vectors_config: { size: vectorSize, distance: Distance.COSINE }
    });

    // Generate IDs for each document
    const ids = documents.map((_, index) => index);

    // Upload the vectors and documents into Qdrant
    await qdrantClient.uploadCollection({
      collection_name: collectionName,
      vectors: embeddings,
      payload: documents.map(doc => ({ text: doc })),
      ids: ids
    });

    // Pass control to the next middleware or route handler
    res.status(200).json({ message: 'Vector store created successfully' });

  } catch (error) {
    console.error('Error in creating vector store:', error);
    return res.status(500).json({ error: 'Error in creating vector store' });
  }
}
