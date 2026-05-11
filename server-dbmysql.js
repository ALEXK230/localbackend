import 'dotenv/config'
import createDB, { getPool } from './config/dbMysql.js'
import { createApp } from './app.js'
import { MovieModel } from './models/mysql/movie.js'

// Ensure this API uses a dedicated port to avoid conflicts with other backends
process.env.PORT = process.env.PORT || '3002'

await createDB()
createApp({ MovieModel: MovieModel })

// Optional cleanup on shutdown if CLEAN_DB_ON_EXIT=true in .env
const CLEAN_ON_EXIT_MYSQL = String(process.env.CLEAN_DB_ON_EXIT).toLowerCase() === 'true'

async function handleMysqlExit(){
	try{
		if(CLEAN_ON_EXIT_MYSQL){
			if(typeof MovieModel.clearAll === 'function'){
				await MovieModel.clearAll()
			} else {
				const pool = getPool()
				await pool.query('DELETE FROM movies')
			}
			console.log('✅ Cleared MySQL movies on shutdown.')
		}
	}catch(err){
		console.warn('Error during MySQL shutdown cleanup:', err.message || err)
	}finally{
		try{ const pool = getPool(); await pool.end(); }catch(e){}
		process.exit(0)
	}
}

process.on('SIGINT', () => void handleMysqlExit())
process.on('SIGTERM', () => void handleMysqlExit())
