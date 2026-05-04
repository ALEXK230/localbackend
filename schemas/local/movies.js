import z from 'zod'; //permite realizar controls quitando responsabilidades en otros ambientes

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string.',
        required_error: 'Movie title is required.',
    }).min(4, 'Movie title must be at least 4 characters long.'),
    year: z.number().int().min(1990).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().int().min(0).max(10).default(5),
    poster: z.string().url({
        message: 'Poster must be a valid URL.',
    }),
    genre:z.array( z.enum(['Action', 'Comedy', 'Crime', 'Horror', 'Fantasy', 'Romance', 'Adventure', 'Sci-Fi', 'Thriller', 'Drama']),{
        required_error: 'Genre is required.',
        invalid_type_error: 'Movie genre must be an array of enum genres.',
    },
    )
});
    export function validateMovie(input){
        return movieSchema.safeParse(input);
    }
    export  function validatePartialMovie(input){
        return movieSchema.partial().safeParse(input);
    }



