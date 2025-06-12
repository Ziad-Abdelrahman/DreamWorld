import express, { Request, Response } from "express";
import mongoose from 'mongoose';
import StoryGen from "./save";
import {generateScene,loadEmbeddings} from "./langchain";
import morgan from 'morgan';

const app = express();


mongoose.connect('mongodb://mongo:27017/',).then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const PORT = 3000;

app.use(express.json());
app.use(morgan('dev'));

app.get('/startGame' , async (req: Request, res: Response) => {
    const newGame = new StoryGen();
    const game = await newGame.save();
    res.send(game.get('_id'));
});

app.post('/addAction' , async (req: Request, res: Response) => {
    res.send(await StoryGen.findByIdAndUpdate(req.body.id,{ $push: { actions: req.body.action } } , {new: true}));
});

app.post('/generateNextScene' , async (req: Request, res: Response) => {
    const id = req.body.id;
    const actions : IActions | null  = await StoryGen.findById(id)
    let parsedActions = "";
    if(actions === null){
        res.status(404).send("Game not found");
    }else{
        actions.actions.forEach((action) => {
            parsedActions += action + "\n";
        });
        console.log("Start Generating");
        const scene = await generateScene(parsedActions);
        res.send(scene);
    }
})

app.get('/loadEmbeddings' , async (req: Request, res: Response) => {
    res.send(await loadEmbeddings());
})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

interface IActions{
    _id: string;
    actions: [String]
}