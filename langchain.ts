import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import type { Document } from "@langchain/core/documents";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import OpenAI from "openai"
import * as fs from 'fs';



const resources = [
        {
            "prefabPath": "BlondViking",
            "type": "NPC",
            "description": "Blonde viking prefab with red shirt and red pants and white horn",
            "size": {
                "x": 1,
                "z": 1
            }
        },
        {
            "prefabPath": "BlueButcher",
            "type": "NPC",
            "description": "Butcher prefab with blue shirt and brown pants and white apron",
            "size": {
                "x": 1,
                "z": 1
            }
        },
        {
            "prefabPath": "GreenButcher",
            "type": "NPC",
            "description": "Butcher prefab with green shirt and brown pants and white apron",
            "size": {
                "x": 1,
                "z": 1
            }
        },
        {
            "prefabPath": "BlueKnight",
            "type": "NPC",
            "description": "A Knight prefab with a brown beard and a  blue shirt and blue pants and sword on his back",
            "size": {
                "x": 1,
                "z": 1
            }
        },
        {
            "prefabPath": "Crate",
            "type": "Environment",
            "description": "A crate prefab with a brown color",
            "size": {
                "x": 0.6,
                "z": 0.6
            }
        },
        {
            "prefabPath": "Tree",
            "type": "Environment",
            "description": "A tree prefab with a brown trunk and green leaves",
            "size": {
                "x": 3.2,
                "z": 2.8
            }
        },
        {
            "prefabPath": "Tree2",
            "type": "Environment",
            "description": "A tree prefab with a brown trunk and no leaves",
            "size": {
                "x": 4.3,
                "z": 4.3
            }
        },
        {
            "prefabPath": "SnowHut",
            "type": "Environment",
            "description": "A small brown wooden house with snowy roof",
            "size": {
                "x": 5.2,
                "z": 6.3
            }
        },
        {
            "prefabPath": "DairyMarket",
            "type": "Environment",
            "description": "A small wooden stand market with half red roof and has cheese, pumpkin, meat and flour products",
            "size": {
                "x": 3,
                "z": 3
            }
        },
        {
            "prefabPath": "FruitMarket",
            "type": "Environment",
            "description": "A small wooden stand market with yellow roof and has cheese, pumpkin, pepper, apples, flour and potions products",
            "size": {
                "x": 3.5,
                "z": 3
            }
        },
        {
            "prefabPath": "PotionMarket",
            "type": "Environment",
            "description": "A small wooden stand market with red roof and has potions products",
            "size": {
                "x": 3.5,
                "z": 3
            }
        },
        {
            "prefabPath": "Blacksmith",
            "type": "Environment",
            "description": "A small wooden stand market with green roof and has weapons products",
            "size": {
                "x": 3,
                "z": 3
            }
        },
        {
            "prefabPath": "LongFence",
            "type": "Environment",
            "description": "A medium sized wooden fence",
            "size": {
                "x": 3.1,
                "z": 0.25
            }
        },
        {
            "prefabPath": "SnowLongFence",
            "type": "Environment",
            "description": "A medium sized wooden fence with snow",
            "size": {
                "x": 3.1,
                "z": 0.25
            }
        },
        {
            "prefabPath": "SmallFence",
            "type": "Environment",
            "description": "A small sized wooden fence",
            "size": {
                "x": 1.6,
                "z": 0.2
            }
        },
        {
            "prefabPath": "SnowSmallFence",
            "type": "Environment",
            "description": "A small sized wooden fence with snow",
            "size": {
                "x": 1.6,
                "z": 0.2
            }
        },
        {
            "prefabPath": "Building",
            "type": "Environment",
            "description": "An apartment building with a gray color",
            "size": {
                "x": 16,
                "z": 16
            }
        },
        {
            "prefabPath": "OfficeMan",
            "type": "NPC",
            "description": "A white bearded man with white shirt and black pants and red tie",
            "size": {
                "x": 1,
                "z": 1
            }
        },
        {
            "prefabPath": "RedDressLady",
            "type": "NPC",
            "description": "A blonde lady wearing a red coat with high heals",
            "size": {
                "x": 1,
                "z": 1
            }
        },
        {
            "prefabPath": "BossLady",
            "type": "NPC",
            "description": "A blonde girl wearing a black suit and glasses",
            "size": {
                "x": 1,
                "z": 1
            }
        }
    ]


const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
});

const environmentVectorStore = new Chroma(embeddings, {
    collectionName: "environment-assets",
    url: "http://localhost:8000",
    collectionMetadata: {
        "hnsw:space": "cosine"
    }
});

const npcVectorStore = new Chroma(embeddings, {
    collectionName: "npc-assets",
    url: "http://localhost:8000",
    collectionMetadata: {
        "hnsw:space": "cosine"
    }
});

const model = new ChatOpenAI({ model: "gpt-4.1" });
const dialogueModelPath = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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"
})



const dialogueSchema = z.object({
    INIT: z.array(z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Use -1 to exit dialogue, or index number to navigate to next dialogue in INIT array. Only INIT can have branching paths."),
            responseType: z.enum(["Normal", "QuestStart", "QuestGiveEnd", "QuestStealEnd"])
        }))
    })),
    QUEST: z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Always -1 to exit dialogue after quest choices"),
            responseType: z.enum(["Normal", "QuestGiveEnd", "QuestStealEnd"])
        }))
    }),
    SUCCESS: z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Always -1 to exit dialogue after success"),
            responseType: z.enum(["Normal"])
        }))
    }),
    FAIL: z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Always -1 to exit dialogue after failure"),
            responseType: z.enum(["Normal"])
        }))
    })
});

const dialoguePrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are an NPC dialogue generator that creates contextual responses based on player merit.
Consider the following merit score interpretation:
- 1-3: Hostile/Aggressive dialogue
- 4-6: Neutral/Reserved dialogue
- 7-10: Friendly/Welcoming dialogue

NPC Information:
- Appearance: {npcDescription}
- Name: {npcName}
- Location in Scene: {npcLocation}

Generate dialogue that:
1. Matches the emotional tone implied by the merit score
2. Includes appropriate greetings and reactions that fit the NPC's appearance and role
3. References the player's perceived reputation
4. Incorporates the NPC's location and surroundings into the dialogue
5. Uses dialogue style and vocabulary fitting the NPC's appearance (e.g., a Viking speaks differently than a merchant)
6. Returns response in the following structure:
   - INIT: Array of dialogue nodes representing the main plotline
     * Should contain multiple dialogue nodes (4-6 nodes recommended)
     * Each node can have up to 3 choices
     * At least one choice in INIT must have responseType="QuestStart"
     * nextId can be -1 to exit dialogue or an index number to navigate to another INIT dialogue
     * Only INIT section can have branching paths with different nextId values
     * Create a rich, branching narrative with multiple paths and outcomes
     * Each branch should feel meaningful and consequential
   - QUEST: Single dialogue node with exactly 3 preset choices
     * Choice 1: "Give All Collected Items" with responseType="QuestGiveEnd"
     * Choice 2: "Steal Items" with responseType="QuestStealEnd"
     * Choice 3: "Continue collecting Items" with responseType="Normal"
     * All choices must have nextId = -1 to exit dialogue after selection
   - SUCCESS: Single dialogue node with 1 "Continue" choice
     * Must have nextId = -1 to exit dialogue
   - FAIL: Single dialogue node with 1 "Try Again" choice
     * Must have nextId = -1 to exit dialogue

Note: 
- All dialogue should match both the merit score's emotional tone AND the NPC's character
- INIT is the main plotline, so make it rich and engaging with multiple paths
- Ensure at least one INIT branch leads to the quest
- QUEST choices must match their specific responseTypes
- Create meaningful consequences for different dialogue choices in INIT
- Ensure each INIT branch tells a complete story segment
- Reference the NPC's surroundings and nearby objects/characters in dialogue
- Keep the NPC's personality consistent throughout all dialogue options`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Generate appropriate dialogue for an NPC with these details:
Description: {npcDescription}
Name: {npcName}
Location: {npcLocation}
Player Merit Score: {meritScore}`
    ),
]);


const assetRecommendationSchema = z.object({
    merit_score: z.number().describe("Merit score based on your judgment on the player for the scene (1-10)"),
    environment_keywords: z.array(z.string()).describe("Keywords that describe the mood of the new scene"),
    npc_keywords: z.array(z.string()).describe("Keywords that describe the mood of the npcs in the new scene"),
});

const sceneGraphSchema = z.object({
    objects: z.array(z.object({
        type: z.enum(["Environment", "NPC"]),
        prefabName: z.string(),
        npcName: z.string().nullable(),
        position: z.object({
            x: z.number(),
            z: z.number(),
            y: z.number().describe("Position is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
        }),
        rotation: z.object({
            x: z.number().describe("Rotation is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
            z: z.number().describe("Rotation is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
            y: z.number().describe("Rotation is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
        })
    })),
});

const assetRecommendationPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are "The Dream Architect" an AI that observes a player's actions and generates keywords for asset recommendations.
        Based on the player's actions, generate:
        1. Merit score (1-10)
        2. Environment keywords (generate 6-8 keywords) that match the mood
        3. NPC keywords (generate 4-6 keywords) that match the situation
        
        For each keyword category:
        - Use varied keywords to match different asset types
        - Each keyword can be used multiple times to get duplicates
        - Aim for a rich, populated scene`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `The player recently:
{actions}

Based on these actions, judge their Merit Score and describe how the next scene appears by giving keywords.`
    ),
]);

const sceneDescriberPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a master scene architect that creates vivid, detailed scene descriptions.
        Your task is to:
        1. Analyze the merit score (1-10) where 1 is Chaotic and 10 is Peaceful
        2. Create a detailed scene description that reflects the mood through asset placement and relationships
        3. For each asset, describe:
           - Its exact position relative to other assets using precise measurements
           - Account for object sizes when describing positions (objects are placed from their center point)
           - Its state (e.g., tilted, damaged)
           - Its role in the scene
           - Required clearance zone (minimum = object size + 4 units)
        4. Space Utilization Rules:
           - Valid placement area: X(0 to -40), Z(0 to -60)
           - Account for object sizes when placing near boundaries
           - For an object of size S, its center must be at least S/2 + 2 units from any boundary
           - Divide space into quadrants for even distribution
        5. Overlap Prevention:
           - Specify exact distances between object centers
           - Minimum distance between centers = sum of object radii + 4 units
           - Define clear paths between object groups (minimum 5 units wide)
        6. Distribution Guidelines:
           - NPCs must be at least 8 units apart (reduced from 10)
           - Buildings must have their centers at least 16 units apart (reduced from 20)
           - Market stalls must have 5 units between centers (reduced from 8)
           - Trees must remain grounded, only buildings can be elevated in chaotic scenes
           - Spread similar assets across different quadrants
           - Aim to use each available asset multiple times where appropriate
           - Create dense but navigable groupings
        7. For each NPC in the scene:
           - Generate a fitting name based on their appearance and role
           - Ensure names match the character's visual description
           - Consider the scene's tone when naming characters
           
        Available assets and their sizes: {available_assets}`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Create a detailed scene description using:
        Environment Keywords: {environment_keywords}
        NPC Keywords: {npc_keywords}
        Merit Score: {merit_score}
        
        Remember:
        - Objects are placed from their center points
        - Account for object sizes when describing positions
        - Keep all objects within valid boundaries considering their sizes
        - Maintain minimum spacing between object centers
        - Only buildings can be elevated in chaotic scenes
        - Give each NPC a fitting name and consistent role`
    )
]);

const sceneGraphPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a precise Scene Layout AI that converts detailed scene descriptions into exact coordinates and rotations.
        Your task is to:
        1. Maximize Asset Placement:
           - Fill the scene with as many assets as possible while maintaining spacing rules
           - Use each available asset multiple times where appropriate
           - Create dense clusters and themed zones
           - Aim for at least 50-60 total objects per scene if possible
           
        2. NPC Handling:
           - Use the npcName field for each NPC object
           - Ensure names match those provided in the scene description
           - Keep NPC names consistent with their roles and appearance
           - If an NPC doesn't have a name in the description, generate an appropriate one
           
        3. Space Division Strategy:
           - Divide the space into 6x6 zones (reduced from 8x8)
           - Each zone should contain multiple compatible assets
           - Use spiral placement within zones
           - Create themed areas (market zones, residential zones, etc.)
           
        4. Asset Distribution Rules:
           - NPCs: Place in groups of 2-3 near relevant structures
           - Markets: Create clusters of 3-4 stalls
           - Trees: Use as space fillers and boundaries
           - Fences: Create enclosures and pathways
           - Buildings: Anchor points for zones
           
        5. Spacing Optimization:
           - NPCs: Minimum 4 units apart (reduced from 6)
           - Market stalls: 3 units between centers (reduced from 4)
           - Trees: 3 units from other objects (reduced from 4)
           - Buildings: 14 units between centers (reduced from 16)
           
        6. Zone Population Guidelines:
           - Each 6x6 zone should contain:
             * 2-3 NPCs
             * 1-2 larger structures (buildings/markets)
             * 3-4 smaller objects (trees/crates)
             * Appropriate fencing/decoration
           
        7. Boundary Utilization:
           - Use edges for fences and trees
           - Create natural barriers with asset clusters
           - Maintain 1.5 unit clearance from boundaries
           
        8. Chaos Implementation:
           - For merit scores 1-2:
             * Buildings: Extreme tilts (60-85 degrees)
             * Y positions: 8-15 units variation
             * Multiple rotation axes
           - For merit scores 3-4:
             * Buildings: Moderate tilts (30-60 degrees)
             * Y positions: 4-8 units
           - For merit scores 5-10:
             * Normal orientation
        
        Available assets and their sizes: {available_assets}`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Convert this detailed scene description into precise coordinates and rotations:
        {scene_description}
        
        Requirements:
        - For chaotic scenes (merit score 1-3):
          * Make buildings dramatically tilted (up to 85 degrees)
          * Vary Y positions significantly (5-15 units)
          * Combine rotations on multiple axes
        - Keep all other objects grounded and normally oriented
        - Maintain all spacing and boundary rules
        - Include npcName for all NPC objects`
    )
]);



const assetRecommender = model.withStructuredOutput(assetRecommendationSchema);
const sceneGraphGenerator = model.withStructuredOutput(sceneGraphSchema);
const dialogueGenerator = model.withStructuredOutput(dialogueSchema);


async function main() {

    const environmentAssets = resources.filter(r => r.type === "Environment");
    const npcAssets = resources.filter(r => r.type === "NPC");

    await environmentVectorStore.addDocuments(
        environmentAssets.map(asset => ({
            pageContent: asset.description,
            metadata: { prefabPath: asset.prefabPath }
        }))
    );
    
    await npcVectorStore.addDocuments(
        npcAssets.map(asset => ({
            pageContent: asset.description,
            metadata: { prefabPath: asset.prefabPath }
        }))
    );

}

async function generateScene(playerActions: string) {
    const recommendationPrompt = await assetRecommendationPrompt.invoke({ actions: playerActions });
    const recommendations = await assetRecommender.invoke(recommendationPrompt);

    // Create HashSets for storing assets
    const environmentAssetsMap = new Map<string, Set<Document>>();
    const npcAssetsMap = new Map<string, Set<Document>>();

    // Increase the number of assets retrieved per keyword
    for (const keyword of recommendations.environment_keywords) {
        const assets = await environmentVectorStore.similaritySearch(
            keyword,
            8  // Increased from 5 to 8 matches per keyword
        );
        environmentAssetsMap.set(keyword, new Set(assets));
    }

    // Process each NPC keyword with more assets
    for (const keyword of recommendations.npc_keywords) {
        const assets = await npcVectorStore.similaritySearch(
            keyword,
            6  // Increased from 4 to 6 matches per keyword
        );
        npcAssetsMap.set(keyword, new Set(assets));
    }

    const sceneDescriberPromptFilled = await sceneDescriberPrompt.invoke({
        available_assets: [...Array.from(environmentAssetsMap.values()).flatMap(set => Array.from(set)),
            ...Array.from(npcAssetsMap.values()).flatMap(set => Array.from(set))]
            .map(a => a.metadata.prefabPath)
            .join(", "),
        environment_keywords: recommendations.environment_keywords,
        npc_keywords: recommendations.npc_keywords,
        merit_score: recommendations.merit_score
    });

    const sceneDescription = await model.invoke(sceneDescriberPromptFilled);

    const scenePrompt = await sceneGraphPrompt.invoke({
        available_assets: [...Array.from(environmentAssetsMap.values()).flatMap(set => Array.from(set)), 
                          ...Array.from(npcAssetsMap.values()).flatMap(set => Array.from(set))]
            .map(a => a.metadata.prefabPath)
            .join(", "),
        scene_description: sceneDescription.content
    });

    const sceneGraph = await sceneGraphGenerator.invoke(scenePrompt);

    // Extract all NPCs from scene graph
    const npcs = sceneGraph.objects.filter(obj => obj.type === "NPC");

    // Generate dialogue for each NPC
    for (const npc of npcs) {
        const npcDescription = resources.find(r => r.prefabPath === npc.prefabName)?.description || "";
        const npcLocation = `at position (${npc.position.x}, ${npc.position.z})`;

        const dialoguePromptFilled = await dialoguePrompt.invoke({
            meritScore: recommendations.merit_score,
            npcDescription: npcDescription,
            npcName: npc.npcName || "Unknown",
            npcLocation: npcLocation
        });

        const dialogue = await dialogueGenerator.invoke(dialoguePromptFilled);
        
        // Create dialogue file for this NPC
        const dialogueJson = JSON.stringify(dialogue, null, 2);
        const dialogueFileName = `${npc.npcName!.replace(/\s+/g, '_')}_dialogue.json`;
        await fs.promises.mkdir('GenAssets', { recursive: true });
        await fs.promises.writeFile(`GenAssets/${dialogueFileName}`, dialogueJson);

    }
    // Create scene file
    const sceneData = {
        recommendations,
        environmentAssets: Object.fromEntries(
            Array.from(environmentAssetsMap.entries()).map(([keyword, assets]) => [
                keyword,
                Array.from(assets)
            ])
        ),
        npcAssets: Object.fromEntries(
            Array.from(npcAssetsMap.entries()).map(([keyword, assets]) => [
                keyword,
                Array.from(assets)
            ])
        ),
        sceneDescription: sceneDescription.content,
        sceneGraph
    };


    // Write scene file
    await fs.promises.writeFile('GenAssets/Scene.json', JSON.stringify(sceneData, null, 2));
    

    return sceneData;


}




async function run() {

    const result = await generateScene(
        ""
    );

    console.log(JSON.stringify(result, null, 2));

}
run()
