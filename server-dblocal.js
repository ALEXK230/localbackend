import { createApp } from "./app.js";
import { MovieModel } from "./models/local/movie.js";

process.env.PORT = process.env.PORT || '3001';
createApp({MovieModel: MovieModel});