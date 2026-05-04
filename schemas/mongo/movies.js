import mongoose from "mongoose";

const MoviesSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Movie title is required.'],
        trim: true,
    }

});

export default mongoose.model('Movie', MoviesSchema);