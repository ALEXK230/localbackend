import 'dotenv/config';
import createDB from './config/dbMongo.js';
import { createApp } from "./app.js";
import { MovieModel as MongoMovieModel } from "./models/mongo/movie.js";
import mongoose from 'mongoose';
import { Movie } from './schemas/mongo/movies.js';

process.env.PORT = process.env.PORT || '3000';

// Try to start with Mongo; if connection fails, fallback to local model so API stays available
let using = 'mongo'
try {
	await createDB()
	await MongoMovieModel.seedDatabase()
	createApp({ MovieModel: MongoMovieModel })
	console.log('Server running with MongoDB backend')
} catch (err) {
	console.warn('MongoDB unavailable, falling back to local file model. Error:', err.message || err)
	const { MovieModel: LocalMovieModel } = await import('./models/local/movie.js')
	using = 'local'
	createApp({ MovieModel: LocalMovieModel })
	console.log('Server running with Local backend')
}

// Optional cleanup on shutdown if CLEAN_DB_ON_EXIT=true in .env
const CLEAN_ON_EXIT = String(process.env.CLEAN_DB_ON_EXIT).toLowerCase() === 'true';

async function handleExit(signal) {
	try {
		if (CLEAN_ON_EXIT) {
			if (using === 'mongo') {
				await Movie.deleteMany({})
				console.log('✅ Cleared movies collection on shutdown.')
			} else {
				const { MovieModel: LocalMovieModel } = await import('./models/local/movie.js')
				LocalMovieModel.clearAll()
				console.log('✅ Cleared local in-memory movies on shutdown.')
			}
		}
	} catch (err) {
		console.warn('Error during shutdown cleanup:', err.message || err)
	} finally {
		try { await mongoose.disconnect(); } catch (_) {}
		process.exit(0)
	}
}

process.on('SIGINT', () => handleExit('SIGINT'))
process.on('SIGTERM', () => handleExit('SIGTERM'))
