import { Movie } from '../../schemas/mongo/movies.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class MovieModel {
    static async getAll({genre}) {
    if(genre){
        return await Movie.find({
            genre: {$in:[new RegExp(genre, 'i')]}
        })
    }
    return await Movie.find();
    }

    static async getById(id) {
        return await Movie.findById(id);
    }

    static async create({input}) {
        const newMovie = new Movie(input);
        return await newMovie.save();
    }

    static async delete({id}) {
        const deletedMovie = await Movie.findByIdAndDelete(id);
        return deletedMovie !== null;
    }

    static async update({id, input}) {
        const updatedMovie = await Movie.findByIdAndUpdate(id, input, {new: true, runValidators: true});
        return updatedMovie;
    }

    static async seedDatabase() {
        try {
            const count = await Movie.countDocuments();
            if (count === 0) {
                const moviesPath = path.join(__dirname, '../../movies.json');
                const moviesData = JSON.parse(fs.readFileSync(moviesPath, 'utf-8'));
                await Movie.insertMany(moviesData);
                console.log(`✅ Loaded ${moviesData.length} movies from movies.json`);
            }
        } catch (error) {
            console.warn(`⚠️  Could not seed database: ${error.message}`);
        }
    }

}