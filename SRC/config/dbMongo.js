import mongoose from "mongoose";

function sleep(ms){
    return new Promise(resolve=>setTimeout(resolve, ms))
}

const createDB = async ({retries = 5, delay = 2000} = {}) => {
    const uri = process.env.MONGO_URI
    if(!uri) throw new Error('MONGO_URI not set')

    let lastErr = null
    for(let attempt=1; attempt<=retries; attempt++){
        try{
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 5000
            })
            console.log(`MongoDB connected: ${conn.connection.host} (attempt ${attempt})`)
            return conn
        }catch(err){
            lastErr = err
            console.warn(`MongoDB connect attempt ${attempt} failed: ${err.message}`)
            if(attempt < retries) await sleep(delay)
        }
    }

    console.error(`All MongoDB connection attempts failed (${retries}). Last error: ${lastErr?.message}`)
    throw lastErr
}

export default createDB