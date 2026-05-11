import { Movie } from '../../schemas/mongo/movies.js';

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

}