import fs from "fs";
import path from "path";

async function fixData() {
    const jsonpath = path.join(__dirname, 'Embeddings', "all_embeddings.json");
    const jsonData = JSON.parse(fs.readFileSync(jsonpath, 'utf8'));
    
    // Process each item in the array
    const fixedData = jsonData.map((item) => {
        // Fix the prefabPath by removing any extension completely
        const prefabPath = path.parse(item.prefabPath).name;
        
        // Clean up the description by removing extra spaces
        const description = item.description
            .replace(/\s+/g, ' ')      // Replace multiple spaces with a single space
            .replace(/\n\s*/g, '\n')   // Remove spaces after newlines
            .trim();                   // Remove leading/trailing whitespace
        
        // Return the fixed item
        return {
            ...item,
            prefabPath,
            description
        };
    });


    
    // // Write the fixed data back to a new file
    const outputPath = path.join(__dirname, 'Embeddings', "fixed_embeddings.json");
    fs.writeFileSync(outputPath, JSON.stringify(fixedData, null, 2));
    
    console.log(`Fixed ${fixedData.length} items`);
    console.log(`Saved to ${outputPath}`);
}

fixData().catch(console.error);