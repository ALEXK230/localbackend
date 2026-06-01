import mongoose from "mongoose";
import { maxLength, trim } from "zod";

const movieSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: [true, 'Movie title is required.'],
        trim: true,
    },
    year:{
        type: Number,
        required: true,
        min: [1900, 'Year must be greater than or equal to 1900.'],
        max: [2025, 'Year must be less than or equal to 2025.'],
    },
    director:{
        type: String,
        required: true,
        trim: true,
    },
    duration:{
        type: Number,
        required: true,
        min: [1, 'Duration must be a positive number.'],
    },
    poster:{
        type: String,
        required: true,
        match: [/^https?:\/\/.+\..+/, 'Poster must be a valid URL.'],
    },
    genre:{
        type: [String],
        required: true,
        enum: {
            values: ['Action', 'Comedy', 'Crime', 'Horror', 'Fantasy', 'Romance', 'Adventure', 'Sci-Fi', 'Thriller', 'Drama', 'Animation', 'Biography'],
            message: 'Genre must be one of the following: Action, Comedy, Crime, Horror, Fantasy, Romance, Adventure, Sci-Fi, Thriller, Drama, Animation, Biography.'
        }
    }
}, {
    timestamps: true
});

export const Movie = mongoose.model('Movie', movieSchema);