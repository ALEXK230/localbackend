import 'dotenv/config';
import createDB from './config/dbMongo.js';
import { createApp } from "./app.js";
import { MovieModel } from "./models/mongo/movie.js";

process.env.PORT = process.env.PORT || '3000';
await createDB();
await MovieModel.seedDatabase();
createApp({MovieModel: MovieModel});
