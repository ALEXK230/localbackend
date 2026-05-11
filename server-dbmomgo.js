import { createApp } from "./app.js";
import connectBB from './config/dbMongo.js';
import { MovieModel } from "./models/mongo/movie.js";
import 'dotenv/config';

connectDB();
createApp({MovieModel: MovieModel});