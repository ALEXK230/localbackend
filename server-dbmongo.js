import 'dotenv/config';
import createDB from './config/dbMongo.js';
import { createApp } from "./app.js";
import { MovieModel } from "./models/mongo/movie.js";

createDB();
createApp({MovieModel: MovieModel});
