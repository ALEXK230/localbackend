import mongoose from "mongoose";

const createDB =async()=>{
    try {
        const conn= await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Error connecting to MongoDB: ${error.message}`);
        console.warn('Continuing without database connection.');
    }
}

export default createDB;