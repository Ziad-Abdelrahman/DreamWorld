import * as fs from 'fs';
import * as path from 'path';
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import dotenv from 'dotenv';
import { Double } from 'mongoose';
import { z } from 'zod';

// Load environment variables
dotenv.config();



const model = new ChatOpenAI({ model: "gpt-4.1", apiKey: process.env.OPENAI_API_KEY});


// Define paths
const MODELS_DIR = path.join(__dirname, 'Models');
const JSONS_DIR = path.join(__dirname, 'Jsons');
const SCREENSHOTS_DIR = path.join(__dirname, 'Screenshots');
const OUTPUT_DIR = path.join(__dirname, 'Embeddings');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Interface for the bounds data from JSON
interface BoundsData {
  name: string;
  bounds: {
        min: {
            x: Double,
            z: Double
        },
        max: {
             x: Double,
             z: Double
        }
    }
}

enum ITypes{
    Environment = "Environment",
    Building = "Building",
    NPC = "NPC",
    Item = "Item"
}

// Interface for the output embedding data
interface EmbeddingData {
  prefabPath: string;
  type:ITypes;
  description: string;
  size:{
    x:Double,
    z:Double
  }
};

// Define the Types enum for Zod
const TypesEnum = z.enum([
    ITypes.Environment,
    ITypes.Building,
    ITypes.NPC,
    ITypes.Item
  ]);
  
  // Define the Zod schema for embedding data
  const ModelSchema = z.object({
    type: TypesEnum.describe('Type of the 3D model (Environment, Building, NPC, or Item)'),
    description: z.string().describe('Detailed description of the 3D model'),
  });

  const structuredModel = model.withStructuredOutput(ModelSchema);

/**
 * Process a single model file
 */
async function processModel(modelFile: string): Promise<EmbeddingData | null> {
  try {
    const baseName = path.basename(modelFile, '.json');
    console.log(`Processing ${baseName}...`);

    // Get the corresponding JSON file
    const jsonPath = path.join(JSONS_DIR, `${baseName}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.warn(`JSON file not found for ${baseName}, skipping...`);
      return null;
    }

    // Get the corresponding screenshot files
    const frontScreenshotPath = path.join(SCREENSHOTS_DIR, `${baseName}_Front.png`);
    const sideScreenshotPath = path.join(SCREENSHOTS_DIR, `${baseName}_Side.png`);
    
    if (!fs.existsSync(frontScreenshotPath) || !fs.existsSync(sideScreenshotPath)) {
      console.warn(`Screenshots not found for ${baseName}, skipping...`);
      return null;
    }

    // Read the JSON data
    const jsonData: BoundsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    // Read the screenshots as base64
    const frontScreenshot = fs.readFileSync(frontScreenshotPath).toString('base64');
    const sideScreenshot = fs.readFileSync(sideScreenshotPath).toString('base64');

    // Create prompt for GPT
    const response = await structuredModel.invoke([
      {
        role: "system",
        content: "You are an expert 3D asset analyst specializing in virtual environments and game development. Your task is to create comprehensive, detailed descriptions of 3D models for an embedding database. These descriptions will be used for semantic search and asset retrieval in a virtual world application. Your analysis should be thorough, technical when appropriate, and focus on both visual characteristics and functional applications. Consider how each asset would fit into different virtual environments and scenarios."
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze this 3D model named "${baseName}" with the following spatial dimensions: X: ${jsonData.bounds.min.x} to ${jsonData.bounds.max.x}, Z: ${jsonData.bounds.min.z} to ${jsonData.bounds.max.z}.

Please provide:
1. A detailed visual description including colors, textures, materials, and distinctive features
2. Architectural or design style (if applicable)
3. Scale and proportions relative to a human character
4. Potential use cases in different virtual environments (urban, rural, fantasy, sci-fi, etc.)
5. How this asset might interact with users or other objects in a virtual world
6. Any notable characteristics that would make this asset unique or particularly useful

You are provided with front and side view images of the model. Use these to inform your detailed description.`
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${frontScreenshot}`,
              detail: "high"
            }
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${sideScreenshot}`,
              detail: "high"
            }
          }
        ]
      }
    ]);

    // Extract the description from the response
    const description = response.description;

    // Determine model type
    const type = response.type;

    // Calculate size
    const sizeX = jsonData.bounds.max.x;
    const sizeZ = jsonData.bounds.max.z;

    // Create the embedding data
    const embeddingData: EmbeddingData = {
      prefabPath: modelFile,
      type: type,
      description: description,
      size: {
        x: sizeX,
        z: sizeZ
      }
    };
    
    console.log(`Successfully processed ${baseName}`);
    return embeddingData;
  } catch (error) {
    console.error(`Error processing ${modelFile}:`, error);
    return null;
  }
}





/**
 * Main function to process all models
 */
async function processAllModels(): Promise<void> {
  try {
    // Get all prefab files in the Models directory
    const modelFiles = fs.readdirSync(JSONS_DIR)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(JSONS_DIR, file));

    console.log(`Found ${modelFiles.length} model files to process`);

    // Array to store all embedding data
    const allEmbeddings: Promise<EmbeddingData | null>[] = [];

    // Process each model file sequentially to avoid rate limiting
    for (const modelFile of modelFiles) {
      const embeddingData = processModel(modelFile);
      if (embeddingData) {
        allEmbeddings.push(embeddingData);
      }
    // Add a delay to avoid hitting API rate limits
        await new Promise(resolve => setTimeout(resolve, 2500));
   
    }
    // Wait for all embeddings to be processed
    const allEmbeddingsData = await Promise.all(allEmbeddings);

    // Filter out null values
    const validEmbeddings = allEmbeddingsData.filter(embedding => embedding !== null) as EmbeddingData[];

    // Save all embeddings to a single file
    const outputPath = path.join(OUTPUT_DIR, 'all_embeddings.json');
    fs.writeFileSync(outputPath, JSON.stringify(validEmbeddings, null, 2));
    
    console.log(`All models processed successfully! Total valid embeddings: ${validEmbeddings.length}`);
    console.log(`Saved all embeddings to ${outputPath}`);
  } catch (error) {
    console.error('Error processing models:', error);
  }
}

// Run the main function
processAllModels().catch(console.error);