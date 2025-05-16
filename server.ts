import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import StoryGen from "./save";
import { parse } from "./parse";
import { gpt, deepseek, gemini, mistral, llama, mythomax } from "./testAPI";

const app = express();

mongoose.connect('mongodb://localhost:27017/',).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = 3000;

app.use(express.json());

app.get('/startGame' , async (req: Request, res: Response) => {
    const newGame = new StoryGen();
    const game = await newGame.save();
    res.send(game.get('_id'));
});

app.patch('/addAction' , async (req: Request, res: Response) => {
    console.log(req.body.action);
    res.send(await StoryGen.findByIdAndUpdate(req.body.id,{ $push: { actions: req.body.action } } , {new: true}));
});

app.post('/generateStory' , async (req: Request, res: Response) => {
    console.log("start generating story for:" + req.body.id);
    const game = await StoryGen.findById(req.body.id);
    const varActions = parse(game);
    const parsedStory = "Continue a story about an RPG game, you should output the next step in the storyline. You woke up in a village in your house. You are a knight." + varActions ;
    const promptStoryGen1 = "Generate a story using these actions. the setting is an RPG world you started in your house & you are a knight" + varActions ;
    const parsedGenStory = await gemini(promptStoryGen1);

    const timeBeforeGPTParsed = Date.now();
    const parsedGPT = await gpt(parsedStory);
    const timeAfterGPTParsed = Date.now();

    const timeBeforeGPTGen = Date.now();
    const generatedGPT = await gpt(parsedGenStory);
    const timeAfterGPTGen = Date.now();

    const timeBeforeDeepSeekParsed = Date.now();
    const deepSeekParsed = await deepseek(parsedStory);
    const timeAfterDeepSeekParsed = Date.now();

    const timeBeforeDeepSeekGen = Date.now();
    const deepSeekGen = await deepseek(parsedGenStory);
    const timeAfterDeepSeekGen = Date.now();

    const timeBeforeGeminiParsed = Date.now();
    const geminiParsed = await gemini(parsedStory);
    const timeAfterGeminiParsed = Date.now();

    const timeBeforeGeminiGen = Date.now();
    const geminiGen = await gemini(parsedGenStory);
    const timeAfterGeminiGen = Date.now();

    const timeBeforeMistralParsed = Date.now();
    const mistralParsed = await mistral(parsedStory);
    const timeAfterMistralParsed = Date.now();

    const timeBeforeMistralGen = Date.now();
    const mistralGen = await mistral(parsedGenStory);
    const timeAfterMistralGen = Date.now();

    const timeBeforeLlamaParsed = Date.now();
    const llamaParsed = await llama(parsedStory);
    const timeAfterLlamaParsed = Date.now();

    const timeBeforeLlamaGen = Date.now();
    const llamaGen = await llama(parsedGenStory);
    const timeAfterLlamaGen = Date.now();

    const timeBeforeMythomaxParsed = Date.now();
    const mythomaxParsed = await mythomax(parsedStory);
    const timeAfterMythomaxParsed = Date.now();

    const timeBeforeMythomaxGen = Date.now();
    const mythomaxGen = await mythomax(parsedGenStory);
    const timeAfterMythomaxGen = Date.now();

    const generatedStoryFromParsed = {
        gpt: {
            story: parsedGPT,
            time: (timeAfterGPTParsed - timeBeforeGPTParsed) / 1000 + "s",
        },
        deepSeek: {
            story: deepSeekParsed,
            time: (timeAfterDeepSeekParsed - timeBeforeDeepSeekParsed) / 1000 + "s",
        },
        gemini: {
            story: geminiParsed,
            time: (timeAfterGeminiParsed - timeBeforeGeminiParsed) / 1000 + "s",
        },
        mistraal: {
            story: mistralParsed,
            time: (timeAfterMistralParsed - timeBeforeMistralParsed) / 1000 + "s",
        },
        llama: {
            story: llamaParsed,
            time: (timeAfterLlamaParsed - timeBeforeLlamaParsed) / 1000 + "s",
        },
        mythomax: {
            story: mythomaxParsed,
            time: (timeAfterMythomaxParsed - timeBeforeMythomaxParsed) / 1000 + "s",
        },
    }
    const generatedStoryFromParsedGen = {
        gpt: {
            story: generatedGPT,
            time: (timeAfterGPTGen - timeBeforeGPTGen) / 1000 + "s",
        },
        deepSeek: {
            story: deepSeekGen,
            time: (timeAfterDeepSeekGen - timeBeforeDeepSeekGen) / 1000 + "s",
        },
        gemini: {
            story: geminiGen,
            time: (timeAfterGeminiGen - timeBeforeGeminiGen) / 1000 + "s",
        },
        mistraal: {
            story: mistralGen,
            time: (timeAfterMistralGen - timeBeforeMistralGen) / 1000 + "s",
        },
        llama: {
            story: llamaGen,
            time: (timeAfterLlamaGen - timeBeforeLlamaGen) / 1000 + "s",
        },
        mythomax: {
            story: mythomaxGen,
            time: (timeAfterMythomaxGen - timeBeforeMythomaxGen) / 1000 + "s",
        },
    }
    console.log("finished generating story for:" + req.body.id);
    res.send(await StoryGen.findByIdAndUpdate(req.body.id, {parsedStory, parsedGenStory, generatedStoryFromParsed , generatedStoryFromParsedGen} , {new: true}));
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});