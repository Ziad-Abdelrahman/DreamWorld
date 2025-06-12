import mongoose from 'mongoose';

const genSchema = new mongoose.Schema({
    actions: [String]
})

const StoryGen = mongoose.model("Actions", genSchema);

export default StoryGen;