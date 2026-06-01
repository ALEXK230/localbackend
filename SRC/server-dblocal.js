import { createApp } from "./app.js";
import { MovieModel } from "./models/local/movie.js";
process.env.PORT = process.env.PORT || '3001';

createApp({MovieModel: MovieModel});

// Optional cleanup on shutdown if CLEAN_DB_ON_EXIT=true in .env
const CLEAN_ON_EXIT_LOCAL = String(process.env.CLEAN_DB_ON_EXIT).toLowerCase() === 'true';

function handleLocalExit() {
	try {
		if (CLEAN_ON_EXIT_LOCAL) {
			MovieModel.clearAll();
			console.log('✅ Cleared local in-memory movies on shutdown.');
		}
	} catch (err) {
		console.warn('Error during local shutdown cleanup:', err.message || err);
	} finally {
		process.exit(0);
	}
}

process.on('SIGINT', () => handleLocalExit())
process.on('SIGTERM', () => handleLocalExit())